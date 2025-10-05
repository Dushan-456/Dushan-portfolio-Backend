import jwt from "jsonwebtoken";
import Admin from "../models/Admin.mjs";

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email and password are required",
         });
      }

      // Find admin
      const admin = await Admin.findOne({ email: email.toLowerCase() });

      if (!admin || !admin.isActive) {
         return res.status(401).json({
            success: false,
            message: "Invalid credentials",
         });
      }

      // Check if account is locked
      if (admin.isLocked) {
         return res.status(423).json({
            success: false,
            message:
               "Account is temporarily locked due to too many failed login attempts",
         });
      }

      // Check password
      const isMatch = await admin.comparePassword(password);

      if (!isMatch) {
         // Increment login attempts
         admin.loginAttempts += 1;

         // Lock account after 5 failed attempts for 30 minutes
         if (admin.loginAttempts >= 5) {
            admin.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
         }

         await admin.save();

         return res.status(401).json({
            success: false,
            message: "Invalid credentials",
         });
      }

      // Reset login attempts on successful login
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
      admin.lastLogin = new Date();
      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
         { id: admin._id, email: admin.email, role: admin.role },
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRE || "7d" }
      );

      res.json({
         success: true,
         message: "Login successful",
         data: {
            token,
            admin: {
               id: admin._id,
               name: admin.name,
               email: admin.email,
               role: admin.role,
               lastLogin: admin.lastLogin,
            },
         },
      });
   } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Get current admin info
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
   try {
      res.json({
         success: true,
         data: {
            id: req.admin._id,
            name: req.admin.name,
            email: req.admin.email,
            role: req.admin.role,
            lastLogin: req.admin.lastLogin,
         },
      });
   } catch (error) {
      console.error("Error fetching admin info:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
   try {
      const { name, email } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email.toLowerCase();

      const admin = await Admin.findByIdAndUpdate(req.admin._id, updateData, {
         new: true,
         runValidators: true,
      }).select("-password");

      res.json({
         success: true,
         message: "Profile updated successfully",
         data: admin,
      });
   } catch (error) {
      if (error.code === 11000) {
         return res.status(400).json({
            success: false,
            message: "Email already exists",
         });
      }

      console.error("Error updating profile:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
   try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
         return res.status(400).json({
            success: false,
            message: "Current password and new password are required",
         });
      }

      if (newPassword.length < 6) {
         return res.status(400).json({
            success: false,
            message: "New password must be at least 6 characters long",
         });
      }

      const admin = await Admin.findById(req.admin._id);

      // Verify current password
      const isMatch = await admin.comparePassword(currentPassword);

      if (!isMatch) {
         return res.status(400).json({
            success: false,
            message: "Current password is incorrect",
         });
      }

      // Update password
      admin.password = newPassword;
      await admin.save();

      res.json({
         success: true,
         message: "Password changed successfully",
      });
   } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Admin logout (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
   res.json({
      success: true,
      message: "Logout successful",
   });
};

// @desc    Verify JWT token
// @route   POST /api/auth/verify-token
// @access  Public
export const verifyToken = async (req, res) => {
   try {
      const { token } = req.body;

      if (!token) {
         return res.status(400).json({
            success: false,
            message: "Token is required",
         });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin || !admin.isActive) {
         return res.status(401).json({
            success: false,
            message: "Invalid token",
         });
      }

      res.json({
         success: true,
         message: "Token is valid",
         data: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
         },
      });
   } catch (error) {
      if (error.name === "JsonWebTokenError") {
         return res.status(401).json({
            success: false,
            message: "Invalid token",
         });
      }
      if (error.name === "TokenExpiredError") {
         return res.status(401).json({
            success: false,
            message: "Token expired",
         });
      }

      console.error("Error verifying token:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};
