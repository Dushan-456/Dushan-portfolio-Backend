import express from "express";
import auth from "../middleware/auth.mjs";
import { validatePersonalDetails } from "../middleware/validation.mjs";
import { uploadSingle } from "../middleware/upload.mjs";
import {
   getPersonalDetails,
   updatePersonalDetails,
   uploadProfileImage,
   uploadCV,
} from "../controllers/personalDetailsController.mjs";

const router = express.Router();

// @route   GET /api/personal-details
// @desc    Get personal details (public)
// @access  Public
router.get("/", getPersonalDetails);

// @route   PUT /api/personal-details
// @desc    Update personal details
// @access  Private (Admin)
router.put("/", auth, validatePersonalDetails, updatePersonalDetails);

// @route   POST /api/personal-details/upload-image
// @desc    Upload profile image
// @access  Private (Admin)
router.post("/upload-image", auth, uploadSingle("image"), uploadProfileImage);

// @route   POST /api/personal-details/upload-cv
// @desc    Upload CV
// @access  Private (Admin)
router.post("/upload-cv", auth, uploadSingle("cv"), uploadCV);

export default router;
