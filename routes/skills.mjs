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

const skillsRoutes = express.Router();

// @route   GET /api/skills
// @desc    Get all active skills (public)
// @access  Public
skillsRoutes.get("/", getSkills);

// @route   GET /api/skills/categories
// @desc    Get skill categories (public)
// @access  Public
skillsRoutes.get("/categories", getSkillCategories);

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private (Admin)
skillsRoutes.post("/", auth, validateSkill, createSkill);

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private (Admin)
skillsRoutes.put("/:id", auth, validateSkill, updateSkill);

// @route   DELETE /api/skills/:id
// @desc    Delete skill (soft delete)
// @access  Private (Admin)
skillsRoutes.delete("/:id", auth, deleteSkill);

// @route   PUT /api/skills/reorder
// @desc    Reorder skills
// @access  Private (Admin)
skillsRoutes.put("/reorder", auth, reorderSkills);

// @route   GET /api/skills/admin/all
// @desc    Get all skills (including inactive) for admin
// @access  Private (Admin)
skillsRoutes.get("/admin/all", auth, getAllSkills);

export default skillsRoutes;
