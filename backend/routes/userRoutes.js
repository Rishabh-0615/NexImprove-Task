import express from "express";
import { registerWithOtp,verifyOtpAndRegister,loginUser,forgetPassword,resetPassword,myProfile,logoutUser} from "../controllers/userController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register", registerWithOtp);
router.post("/verifyOtp/:token", verifyOtpAndRegister);
router.post("/login", loginUser);
router.post("/forget", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", isAuth, myProfile);
router.get("/logout", isAuth, logoutUser);

export default router;
