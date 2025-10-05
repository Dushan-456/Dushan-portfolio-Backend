import PersonalDetails from "../models/PersonalDetails.mjs";
import { uploadSingle } from "../middleware/upload.mjs";

// @desc    Get personal details (public)
// @route   GET /api/personal-details
// @access  Public
export const getPersonalDetails = async (req, res) => {
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
};

// @desc    Update personal details
// @route   PUT /api/personal-details
// @access  Private (Admin)
export const updatePersonalDetails = async (req, res) => {
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
};

// @desc    Upload profile image
// @route   POST /api/personal-details/upload-image
// @access  Private (Admin)
export const uploadProfileImage = async (req, res) => {
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
};

// @desc    Upload CV
// @route   POST /api/personal-details/upload-cv
// @access  Private (Admin)
export const uploadCV = async (req, res) => {
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
};
