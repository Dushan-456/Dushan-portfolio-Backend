const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const { validateProject } = require("../middleware/validation");
const { uploadMultiple } = require("../middleware/upload");

// @route   GET /api/projects
// @desc    Get all active projects (public)
// @access  Public
router.get("/", async (req, res) => {
   try {
      const { category, featured, limit = 20, page = 1 } = req.query;

      let query = { isActive: true };

      if (category) {
         query.category = category;
      }

      if (featured === "true") {
         query.isFeatured = true;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const projects = await Project.find(query)
         .sort({ priority: -1, createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit))
         .select("-__v");

      const total = await Project.countDocuments(query);

      res.json({
         success: true,
         data: projects,
         pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total,
         },
      });
   } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   GET /api/projects/:id
// @desc    Get single project (public)
// @access  Public
router.get("/:id", async (req, res) => {
   try {
      const project = await Project.findById(req.params.id);

      if (!project || !project.isActive) {
         return res.status(404).json({
            success: false,
            message: "Project not found",
         });
      }

      res.json({
         success: true,
         data: project,
      });
   } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin)
router.post("/", auth, validateProject, async (req, res) => {
   try {
      const project = new Project(req.body);
      await project.save();

      res.status(201).json({
         success: true,
         message: "Project created successfully",
         data: project,
      });
   } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin)
router.put("/:id", auth, validateProject, async (req, res) => {
   try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });

      if (!project) {
         return res.status(404).json({
            success: false,
            message: "Project not found",
         });
      }

      res.json({
         success: true,
         message: "Project updated successfully",
         data: project,
      });
   } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project (soft delete)
// @access  Private (Admin)
router.delete("/:id", auth, async (req, res) => {
   try {
      const project = await Project.findByIdAndUpdate(
         req.params.id,
         { isActive: false },
         { new: true }
      );

      if (!project) {
         return res.status(404).json({
            success: false,
            message: "Project not found",
         });
      }

      res.json({
         success: true,
         message: "Project deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   POST /api/projects/:id/upload-images
// @desc    Upload project images
// @access  Private (Admin)
router.post(
   "/:id/upload-images",
   auth,
   uploadMultiple("images", 10),
   async (req, res) => {
      try {
         if (!req.files || req.files.length === 0) {
            return res.status(400).json({
               success: false,
               message: "No image files provided",
            });
         }

         const project = await Project.findById(req.params.id);

         if (!project) {
            return res.status(404).json({
               success: false,
               message: "Project not found",
            });
         }

         const newImages = req.files.map((file, index) => ({
            url: `/uploads/${file.filename}`,
            alt: `${project.title} - Image ${index + 1}`,
            isMain: index === 0 && project.images.length === 0,
         }));

         project.images.push(...newImages);
         await project.save();

         res.json({
            success: true,
            message: "Images uploaded successfully",
            data: newImages,
         });
      } catch (error) {
         console.error("Error uploading images:", error);
         res.status(500).json({
            success: false,
            message: "Server error",
         });
      }
   }
);

// @route   GET /api/projects/admin/all
// @desc    Get all projects (including inactive) for admin
// @access  Private (Admin)
router.get("/admin/all", auth, async (req, res) => {
   try {
      const { category, status, page = 1, limit = 20 } = req.query;

      let query = {};

      if (category) {
         query.category = category;
      }

      if (status) {
         query.status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const projects = await Project.find(query)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit));

      const total = await Project.countDocuments(query);

      res.json({
         success: true,
         data: projects,
         pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total,
         },
      });
   } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

module.exports = router;
