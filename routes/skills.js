const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");
const auth = require("../middleware/auth");
const { validateSkill } = require("../middleware/validation");

// @route   GET /api/skills
// @desc    Get all active skills (public)
// @access  Public
router.get("/", async (req, res) => {
   try {
      const { category } = req.query;

      let query = { isActive: true };

      if (category) {
         query.category = category;
      }

      const skills = await Skill.find(query)
         .sort({ order: 1, proficiency: -1 })
         .select("-__v");

      res.json({
         success: true,
         data: skills,
      });
   } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   GET /api/skills/categories
// @desc    Get skill categories (public)
// @access  Public
router.get("/categories", async (req, res) => {
   try {
      const categories = await Skill.distinct("category", { isActive: true });

      res.json({
         success: true,
         data: categories,
      });
   } catch (error) {
      console.error("Error fetching skill categories:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private (Admin)
router.post("/", auth, validateSkill, async (req, res) => {
   try {
      const skill = new Skill(req.body);
      await skill.save();

      res.status(201).json({
         success: true,
         message: "Skill created successfully",
         data: skill,
      });
   } catch (error) {
      if (error.code === 11000) {
         return res.status(400).json({
            success: false,
            message: "Skill with this name already exists",
         });
      }

      console.error("Error creating skill:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private (Admin)
router.put("/:id", auth, validateSkill, async (req, res) => {
   try {
      const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });

      if (!skill) {
         return res.status(404).json({
            success: false,
            message: "Skill not found",
         });
      }

      res.json({
         success: true,
         message: "Skill updated successfully",
         data: skill,
      });
   } catch (error) {
      if (error.code === 11000) {
         return res.status(400).json({
            success: false,
            message: "Skill with this name already exists",
         });
      }

      console.error("Error updating skill:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill (soft delete)
// @access  Private (Admin)
router.delete("/:id", auth, async (req, res) => {
   try {
      const skill = await Skill.findByIdAndUpdate(
         req.params.id,
         { isActive: false },
         { new: true }
      );

      if (!skill) {
         return res.status(404).json({
            success: false,
            message: "Skill not found",
         });
      }

      res.json({
         success: true,
         message: "Skill deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   PUT /api/skills/reorder
// @desc    Reorder skills
// @access  Private (Admin)
router.put("/reorder", auth, async (req, res) => {
   try {
      const { skills } = req.body;

      if (!Array.isArray(skills)) {
         return res.status(400).json({
            success: false,
            message: "Skills must be an array",
         });
      }

      const updatePromises = skills.map((skill, index) =>
         Skill.findByIdAndUpdate(skill.id, { order: index })
      );

      await Promise.all(updatePromises);

      res.json({
         success: true,
         message: "Skills reordered successfully",
      });
   } catch (error) {
      console.error("Error reordering skills:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   GET /api/skills/admin/all
// @desc    Get all skills (including inactive) for admin
// @access  Private (Admin)
router.get("/admin/all", auth, async (req, res) => {
   try {
      const { category } = req.query;

      let query = {};

      if (category) {
         query.category = category;
      }

      const skills = await Skill.find(query).sort({ order: 1, createdAt: -1 });

      res.json({
         success: true,
         data: skills,
      });
   } catch (error) {
      console.error("Error fetching all skills:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

module.exports = router;
