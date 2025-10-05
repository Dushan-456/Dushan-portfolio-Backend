const mongoose = require("mongoose");

const personalDetailsSchema = new mongoose.Schema(
   {
      fullName: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      businessEmail: {
         type: String,
         lowercase: true,
         trim: true,
      },
      phoneNumbers: [
         {
            type: String,
            required: true,
         },
      ],
      socialLinks: {
         facebook: String,
         instagram: String,
         github: String,
         linkedin: String,
         whatsapp: String,
         twitter: String,
      },
      personalInfo: {
         dateOfBirth: Date,
         age: Number,
         nicNumber: String,
         civilStatus: {
            type: String,
            enum: ["Single", "Married", "Divorced", "Widowed"],
         },
         nationality: String,
      },
      bio: {
         shortDescription: String,
         longDescription: String,
      },
      profileImages: {
         main: String,
         secondary: String,
      },
      cvUrl: String,
      isActive: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

// Ensure only one personal details document exists
personalDetailsSchema.index({}, { unique: true });

module.exports = mongoose.model("PersonalDetails", personalDetailsSchema);
