import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
   {
      institution: {
         type: String,
         required: true,
         trim: true,
      },
      degree: {
         type: String,
         required: true,
         trim: true,
      },
      field: {
         type: String,
         required: true,
         trim: true,
      },
      startDate: Date,
      endDate: Date,
      isCompleted: {
         type: Boolean,
         default: true,
      },
      grade: String,
      description: String,
      logo: String,
      certificateUrl: String,
      type: {
         type: String,
         enum: ["Degree", "Certificate", "Course", "Training"],
         default: "Certificate",
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      order: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
   }
);

// Index for better query performance
educationSchema.index({ isActive: 1, order: 1 });

export default mongoose.model("Education", educationSchema);
