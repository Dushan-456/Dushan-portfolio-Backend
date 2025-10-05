import express from "express";
import auth from "../middleware/auth.mjs";
import { validateProject } from "../middleware/validation.mjs";
import { uploadMultiple } from "../middleware/upload.mjs";
import {
   getProjects,
   getProject,
   createProject,
   updateProject,
   deleteProject,
   uploadProjectImages,
   getAllProjects,
} from "../controllers/projectsController.mjs";

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all active projects (public)
// @access  Public
router.get("/", getProjects);

// @route   GET /api/projects/:id
// @desc    Get single project (public)
// @access  Public
router.get("/:id", getProject);

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin)
router.post("/", auth, validateProject, createProject);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin)
router.put("/:id", auth, validateProject, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project (soft delete)
// @access  Private (Admin)
router.delete("/:id", auth, deleteProject);

// @route   POST /api/projects/:id/upload-images
// @desc    Upload project images
// @access  Private (Admin)
router.post(
   "/:id/upload-images",
   auth,
   uploadMultiple("images", 10),
   uploadProjectImages
);

// @route   GET /api/projects/admin/all
// @desc    Get all projects (including inactive) for admin
// @access  Private (Admin)
router.get("/admin/all", auth, getAllProjects);

export default router;
