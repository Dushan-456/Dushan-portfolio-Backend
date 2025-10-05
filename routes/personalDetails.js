const express = require("express");
const router = express.Router();
const PersonalDetails = require("../models/PersonalDetails");
const auth = require("../middleware/auth");
const { validatePersonalDetails } = require("../middleware/validation");
const { uploadSingle } = require("../middleware/upload");

// @route   GET /api/personal-details
// @desc    Get personal details (public)
// @access  Public
router.get("/", async (req, res) => {
   try {
      const personalDetails = await PersonalDetails.findOne({ isActive: true });

      if (!personalDetails) {
         return res.status(404).json({
            success: false,
            message: "Personal details not found",
         });
      }

      res.json({
         success: true,
         data: personalDetails,
      });
   } catch (error) {
      console.error("Error fetching personal details:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   PUT /api/personal-details
// @desc    Update personal details
// @access  Private (Admin)
router.put("/", auth, validatePersonalDetails, async (req, res) => {
   try {
      let personalDetails = await PersonalDetails.findOne();

      if (!personalDetails) {
         // Create new if doesn't exist
         personalDetails = new PersonalDetails(req.body);
      } else {
         // Update existing
         Object.assign(personalDetails, req.body);
      }

      await personalDetails.save();

      res.json({
         success: true,
         message: "Personal details updated successfully",
         data: personalDetails,
      });
   } catch (error) {
      console.error("Error updating personal details:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   POST /api/personal-details/upload-image
// @desc    Upload profile image
// @access  Private (Admin)
router.post("/upload-image", auth, uploadSingle("image"), async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({
            success: false,
            message: "No image file provided",
         });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const imageType = req.body.type || "main"; // 'main' or 'secondary'

      let personalDetails = await PersonalDetails.findOne();

      if (!personalDetails) {
         personalDetails = new PersonalDetails({
            profileImages: {},
         });
      }

      if (!personalDetails.profileImages) {
         personalDetails.profileImages = {};
      }

      personalDetails.profileImages[imageType] = imageUrl;
      await personalDetails.save();

      res.json({
         success: true,
         message: "Image uploaded successfully",
         data: {
            imageUrl,
            type: imageType,
         },
      });
   } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   POST /api/personal-details/upload-cv
// @desc    Upload CV
// @access  Private (Admin)
router.post("/upload-cv", auth, uploadSingle("cv"), async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({
            success: false,
            message: "No CV file provided",
         });
      }

      const cvUrl = `/uploads/${req.file.filename}`;

      let personalDetails = await PersonalDetails.findOne();

      if (!personalDetails) {
         personalDetails = new PersonalDetails({});
      }

      personalDetails.cvUrl = cvUrl;
      await personalDetails.save();

      res.json({
         success: true,
         message: "CV uploaded successfully",
         data: {
            cvUrl,
         },
      });
   } catch (error) {
      console.error("Error uploading CV:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

module.exports = router;
