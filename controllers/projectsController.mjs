import Project from "../models/Project.mjs";
import { uploadMultiple } from "../middleware/upload.mjs";

// @desc    Get all active projects (public)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
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
};

// @desc    Get single project (public)
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res) => {
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
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res) => {
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
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res) => {
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
};

// @desc    Delete project (soft delete)
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res) => {
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
};

// @desc    Upload project images
// @route   POST /api/projects/:id/upload-images
// @access  Private (Admin)
export const uploadProjectImages = async (req, res) => {
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
};

// @desc    Get all projects (including inactive) for admin
// @route   GET /api/projects/admin/all
// @access  Private (Admin)
export const getAllProjects = async (req, res) => {
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
};
