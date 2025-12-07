import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../middlewares/generateToken.js";

dotenv.config();


export const createDefaultAdmin = async () => {
  const existing = await prisma.admin.findUnique({
    where: { email: "admin@gmail.com" }
  });

  if (!existing) {
    const hash = await bcrypt.hash("admin", 10);
    await prisma.admin.create({
      data: {
        email: "admin@gmail.com",
        password: hash,
      },
    });
    console.log("Default admin created");
  }
};


export const adminLogin = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  generateToken(admin, res); 

  res.json({
    message: "Admin login successful",
    admin,
  });
});

export const meAdmin = TryCatch(async (req, res) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.user.id }
  });

  if (!admin) return res.status(404).json({ message: "Admin not found" });

  res.json(admin);
});

export const getUnverifiedUsers = TryCatch(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { 
      isVerified: true,
      isApproved: false 
    },
    orderBy: { createdAt: "asc" }
  });

  res.json({ users });
});


export const verifyUser = TryCatch(async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

  if (!user) return res.status(404).json({ message: "User not found" });

  await prisma.user.update({
    where: { id: Number(userId) },
    data: { isApproved: true },
  });

  res.json({ message: "User approved successfully" });
});


export const logoutAdmin = TryCatch(async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Admin logged out" });
});
