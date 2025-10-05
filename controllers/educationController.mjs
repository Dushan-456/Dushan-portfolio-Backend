import Education from "../models/Education.mjs";
import { uploadSingle } from "../middleware/upload.mjs";

// @desc    Get all active education records (public)
// @route   GET /api/education
// @access  Public
export const getEducation = async (req, res) => {
   try {
      const { type } = req.query;

      let query = { isActive: true };

      if (type) {
         query.type = type;
      }

      const education = await Education.find(query)
         .sort({ order: 1, endDate: -1 })
         .select("-__v");

      res.json({
         success: true,
         data: education,
      });
   } catch (error) {
      console.error("Error fetching education:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Create new education record
// @route   POST /api/education
// @access  Private (Admin)
export const createEducation = async (req, res) => {
   try {
      const education = new Education(req.body);
      await education.save();

      res.status(201).json({
         success: true,
         message: "Education record created successfully",
         data: education,
      });
   } catch (error) {
      console.error("Error creating education record:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Update education record
// @route   PUT /api/education/:id
// @access  Private (Admin)
export const updateEducation = async (req, res) => {
   try {
      const education = await Education.findByIdAndUpdate(
         req.params.id,
         req.body,
         { new: true, runValidators: true }
      );

      if (!education) {
         return res.status(404).json({
            success: false,
            message: "Education record not found",
         });
      }

      res.json({
         success: true,
         message: "Education record updated successfully",
         data: education,
      });
   } catch (error) {
      console.error("Error updating education record:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Delete education record (soft delete)
// @route   DELETE /api/education/:id
// @access  Private (Admin)
export const deleteEducation = async (req, res) => {
   try {
      const education = await Education.findByIdAndUpdate(
         req.params.id,
         { isActive: false },
         { new: true }
      );

      if (!education) {
         return res.status(404).json({
            success: false,
            message: "Education record not found",
         });
      }

      res.json({
         success: true,
         message: "Education record deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting education record:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Upload institution logo
// @route   POST /api/education/:id/upload-logo
// @access  Private (Admin)
export const uploadLogo = async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({
            success: false,
            message: "No logo file provided",
         });
      }

      const logoUrl = `/uploads/${req.file.filename}`;

      const education = await Education.findByIdAndUpdate(
         req.params.id,
         { logo: logoUrl },
         { new: true }
      );

      if (!education) {
         return res.status(404).json({
            success: false,
            message: "Education record not found",
         });
      }

      res.json({
         success: true,
         message: "Logo uploaded successfully",
         data: {
            logoUrl,
         },
      });
   } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Upload certificate
// @route   POST /api/education/:id/upload-certificate
// @access  Private (Admin)
export const uploadCertificate = async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({
            success: false,
            message: "No certificate file provided",
         });
      }

      const certificateUrl = `/uploads/${req.file.filename}`;

      const education = await Education.findByIdAndUpdate(
         req.params.id,
         { certificateUrl: certificateUrl },
         { new: true }
      );

      if (!education) {
         return res.status(404).json({
            success: false,
            message: "Education record not found",
         });
      }

      res.json({
         success: true,
         message: "Certificate uploaded successfully",
         data: {
            certificateUrl,
         },
      });
   } catch (error) {
      console.error("Error uploading certificate:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Reorder education records
// @route   PUT /api/education/reorder
// @access  Private (Admin)
export const reorderEducation = async (req, res) => {
   try {
      const { education } = req.body;

      if (!Array.isArray(education)) {
         return res.status(400).json({
            success: false,
            message: "Education must be an array",
         });
      }

      const updatePromises = education.map((edu, index) =>
         Education.findByIdAndUpdate(edu.id, { order: index })
      );

      await Promise.all(updatePromises);

      res.json({
         success: true,
         message: "Education records reordered successfully",
      });
   } catch (error) {
      console.error("Error reordering education records:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

// @desc    Get all education records (including inactive) for admin
// @route   GET /api/education/admin/all
// @access  Private (Admin)
export const getAllEducation = async (req, res) => {
   try {
      const { type } = req.query;

      let query = {};

      if (type) {
         query.type = type;
      }

      const education = await Education.find(query).sort({
         order: 1,
         createdAt: -1,
      });

      res.json({
         success: true,
         data: education,
      });
   } catch (error) {
      console.error("Error fetching all education records:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};
