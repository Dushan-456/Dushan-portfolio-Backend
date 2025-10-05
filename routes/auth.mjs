import express from "express";
import { validateAdmin } from "../middleware/validation.mjs";
import {
   login,
   getMe,
   updateProfile,
   changePassword,
   logout,
   verifyToken,
} from "../controllers/authController.mjs";

const authRoutes = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
authRoutes.post("/login", login);

// @route   GET /api/auth/me
// @desc    Get current admin info
// @access  Private
authRoutes.get("/me", getMe);

// @route   PUT /api/auth/profile
// @desc    Update admin profile
// @access  Private
authRoutes.put("/profile", updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change admin password
// @access  Private
authRoutes.put("/change-password", changePassword);

// @route   POST /api/auth/logout
// @desc    Admin logout (client-side token removal)
// @access  Private
authRoutes.post("/logout", logout);

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Public
authRoutes.post("/verify-token", verifyToken);

export default authRoutes;
