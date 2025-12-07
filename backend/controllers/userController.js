import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import prisma from "../config/prisma.js";
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../middlewares/generateToken.js";

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const TEMP_USERS = {}; 
const TEMP_PASSWORD_RESETS = {}; 

export const registerWithOtp = TryCatch(async (req, res) => {
  const { name, email, gstin, password } = req.body;

  if (!name || !email || !gstin || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  console.log(otp);
  TEMP_USERS[email] = {
    name,
    email,
    gstin,
    password,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MY_GMAIL,
      pass: process.env.MY_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MY_GMAIL,
    to: email,
    subject: "Registration OTP",
    text: `Your OTP: ${otp}`,
  });

  const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });

  res.json({
    message: "OTP sent successfully. Verify to complete registration.",
    token,
  });
});


export const verifyOtpAndRegister = TryCatch(async (req, res) => {
  const { otp } = req.body;
  const { token } = req.params;

  if (!otp || !token) return res.status(400).json({ message: "OTP and token required" });

  let email;

  try {
    ({ email } = jwt.verify(token, process.env.JWT_SEC));
  } catch (e) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const tempUser = TEMP_USERS[email];
  if (!tempUser) return res.status(400).json({ message: "OTP session expired, register again" });

  if (tempUser.expiresAt < Date.now()) {
    delete TEMP_USERS[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (tempUser.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const hashed = await bcrypt.hash(tempUser.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: tempUser.name,
      email: tempUser.email,
      gstin: tempUser.gstin,
      password: hashed,
      isVerified: true,        
      isApproved: false,      
    },
  });

  delete TEMP_USERS[email];

  res.json({
    message: "Email verified. Waiting for admin approval.",
    user: newUser,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

  if (!user.isVerified) {
    return res.status(403).json({ message: "Email not verified" });
  }

  if (!user.isApproved) {
    return res.status(403).json({ message: "Account awaiting admin approval" });
  }

  generateToken(user, res);

  res.json({
    message: "Login successful",
    user,
  });
});


export const forgetPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "No user found" });

  const otp = crypto.randomInt(100000, 999999).toString();
  console.log(otp);

  TEMP_PASSWORD_RESETS[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: { user: process.env.MY_GMAIL, pass: process.env.MY_PASS },
  });

  await transporter.sendMail({
    from: process.env.MY_GMAIL,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP: ${otp}`,
  });

  const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });

  res.json({ message: "OTP sent for password reset", token });
});

export const resetPassword = TryCatch(async (req, res) => {
  const { token } = req.params;
  const { otp, password } = req.body;

  if (!otp || !password) {
    return res.status(400).json({ message: "OTP and password required" });
  }

  let email;
  try {
    ({ email } = jwt.verify(token, process.env.JWT_SEC));
  } catch {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const temp = TEMP_PASSWORD_RESETS[email];
  if (!temp) return res.status(400).json({ message: "OTP expired, try again" });

  if (temp.expiresAt < Date.now()) {
    delete TEMP_PASSWORD_RESETS[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (temp.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });

  delete TEMP_PASSWORD_RESETS[email];

  res.json({ message: "Password reset successful" });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json(user);
});


export const logoutUser = TryCatch(async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});
