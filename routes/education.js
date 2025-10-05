const express = require("express");
const router = express.Router();
const Education = require("../models/Education");
const auth = require("../middleware/auth");
const { validateEducation } = require("../middleware/validation");
const { uploadSingle } = require("../middleware/upload");

// @route   GET /api/education
// @desc    Get all active education records (public)
// @access  Public
router.get("/", async (req, res) => {
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
});

// @route   POST /api/education
// @desc    Create new education record
// @access  Private (Admin)
router.post("/", auth, validateEducation, async (req, res) => {
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
});

// @route   PUT /api/education/:id
// @desc    Update education record
// @access  Private (Admin)
router.put("/:id", auth, validateEducation, async (req, res) => {
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
});

// @route   DELETE /api/education/:id
// @desc    Delete education record (soft delete)
// @access  Private (Admin)
router.delete("/:id", auth, async (req, res) => {
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
});

// @route   POST /api/education/:id/upload-logo
// @desc    Upload institution logo
// @access  Private (Admin)
router.post(
   "/:id/upload-logo",
   auth,
   uploadSingle("logo"),
   async (req, res) => {
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
   }
);

// @route   POST /api/education/:id/upload-certificate
// @desc    Upload certificate
// @access  Private (Admin)
router.post(
   "/:id/upload-certificate",
   auth,
   uploadSingle("certificate"),
   async (req, res) => {
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
   }
);

// @route   PUT /api/education/reorder
// @desc    Reorder education records
// @access  Private (Admin)
router.put("/reorder", auth, async (req, res) => {
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
});

// @route   GET /api/education/admin/all
// @desc    Get all education records (including inactive) for admin
// @access  Private (Admin)
router.get("/admin/all", auth, async (req, res) => {
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
});

module.exports = router;
