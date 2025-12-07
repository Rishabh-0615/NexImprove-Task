import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const isAuthAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.user = admin; 
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    return res
      .status(500)
      .json({ message: "Authorization error. Please log in." });
  }
};
