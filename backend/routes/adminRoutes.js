import express from "express";
import { adminLogin, meAdmin, getUnverifiedUsers, verifyUser, logoutAdmin } from "../controllers/adminController.js";
import { isAuthAdmin } from "../middlewares/isAdminAuth.js";

const router = express.Router();
router.post("/admin-login", adminLogin);
router.get("/me", isAuthAdmin, meAdmin);
router.get("/unverified-users", isAuthAdmin, getUnverifiedUsers);
router.put("/verify-user/:userId", isAuthAdmin, verifyUser);
router.post("/logout", isAuthAdmin, logoutAdmin);

export default router;
