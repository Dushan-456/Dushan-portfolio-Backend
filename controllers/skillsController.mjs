import Skill from "../models/Skill.mjs";

// @desc    Get all active skills (public)
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
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
};

// @desc    Get skill categories (public)
// @route   GET /api/skills/categories
// @access  Public
export const getSkillCategories = async (req, res) => {
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
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Admin)
export const createSkill = async (req, res) => {
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
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
export const updateSkill = async (req, res) => {
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
};

// @desc    Delete skill (soft delete)
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
export const deleteSkill = async (req, res) => {
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
};

// @desc    Reorder skills
// @route   PUT /api/skills/reorder
// @access  Private (Admin)
export const reorderSkills = async (req, res) => {
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
};

// @desc    Get all skills (including inactive) for admin
// @route   GET /api/skills/admin/all
// @access  Private (Admin)
export const getAllSkills = async (req, res) => {
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
};
