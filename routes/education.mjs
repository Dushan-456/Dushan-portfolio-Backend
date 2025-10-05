import express from "express";
import auth from "../middleware/auth.mjs";
import { validateEducation } from "../middleware/validation.mjs";
import { uploadSingle } from "../middleware/upload.mjs";
import {
   getEducation,
   createEducation,
   updateEducation,
   deleteEducation,
   uploadLogo,
   uploadCertificate,
   reorderEducation,
   getAllEducation,
} from "../controllers/educationController.mjs";

const router = express.Router();

// @route   GET /api/education
// @desc    Get all active education records (public)
// @access  Public
router.get("/", getEducation);

// @route   POST /api/education
// @desc    Create new education record
// @access  Private (Admin)
router.post("/", auth, validateEducation, createEducation);

// @route   PUT /api/education/:id
// @desc    Update education record
// @access  Private (Admin)
router.put("/:id", auth, validateEducation, updateEducation);

// @route   DELETE /api/education/:id
// @desc    Delete education record (soft delete)
// @access  Private (Admin)
router.delete("/:id", auth, deleteEducation);

// @route   POST /api/education/:id/upload-logo
// @desc    Upload institution logo
// @access  Private (Admin)
router.post("/:id/upload-logo", auth, uploadSingle("logo"), uploadLogo);

// @route   POST /api/education/:id/upload-certificate
// @desc    Upload certificate
// @access  Private (Admin)
router.post(
   "/:id/upload-certificate",
   auth,
   uploadSingle("certificate"),
   uploadCertificate
);

// @route   PUT /api/education/reorder
// @desc    Reorder education records
// @access  Private (Admin)
router.put("/reorder", auth, reorderEducation);

// @route   GET /api/education/admin/all
// @desc    Get all education records (including inactive) for admin
// @access  Private (Admin)
router.get("/admin/all", auth, getAllEducation);

export default router;
