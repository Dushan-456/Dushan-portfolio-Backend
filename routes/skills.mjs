import express from "express";
import auth from "../middleware/auth.mjs";
import { validateSkill } from "../middleware/validation.mjs";
import {
   getSkills,
   getSkillCategories,
   createSkill,
   updateSkill,
   deleteSkill,
   reorderSkills,
   getAllSkills,
} from "../controllers/skillsController.mjs";

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all active skills (public)
// @access  Public
router.get("/", getSkills);

// @route   GET /api/skills/categories
// @desc    Get skill categories (public)
// @access  Public
router.get("/categories", getSkillCategories);

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private (Admin)
router.post("/", auth, validateSkill, createSkill);

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private (Admin)
router.put("/:id", auth, validateSkill, updateSkill);

// @route   DELETE /api/skills/:id
// @desc    Delete skill (soft delete)
// @access  Private (Admin)
router.delete("/:id", auth, deleteSkill);

// @route   PUT /api/skills/reorder
// @desc    Reorder skills
// @access  Private (Admin)
router.put("/reorder", auth, reorderSkills);

// @route   GET /api/skills/admin/all
// @desc    Get all skills (including inactive) for admin
// @access  Private (Admin)
router.get("/admin/all", auth, getAllSkills);

export default router;
