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

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post("/login", login);

// @route   GET /api/auth/me
// @desc    Get current admin info
// @access  Private
router.get("/me", getMe);

// @route   PUT /api/auth/profile
// @desc    Update admin profile
// @access  Private
router.put("/profile", updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.put("/change-password", changePassword);

// @route   POST /api/auth/logout
// @desc    Admin logout (client-side token removal)
// @access  Private
router.post("/logout", logout);

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Public
router.post("/verify-token", verifyToken);

export default router;
