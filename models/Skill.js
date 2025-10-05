const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      category: {
         type: String,
         required: true,
         enum: [
            "Frontend",
            "Backend",
            "Database",
            "Mobile",
            "Desktop",
            "Design",
            "Tools",
            "Other",
         ],
      },
      proficiency: {
         type: Number,
         required: true,
         min: 0,
         max: 100,
      },
      icon: String,
      description: String,
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
skillSchema.index({ category: 1, isActive: 1 });
skillSchema.index({ order: 1 });

module.exports = mongoose.model("Skill", skillSchema);
