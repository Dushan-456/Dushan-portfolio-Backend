const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         required: true,
      },
      shortDescription: {
         type: String,
         maxlength: 200,
      },
      category: {
         type: String,
         required: true,
         enum: [
            "Web Development",
            "Mobile App",
            "Desktop App",
            "E-Commerce",
            "LMS",
            "Business Website",
            "Travel Website",
            "Restaurant Website",
            "Other",
         ],
      },
      technologies: [
         {
            type: String,
            required: true,
         },
      ],
      images: [
         {
            url: String,
            alt: String,
            isMain: {
               type: Boolean,
               default: false,
            },
         },
      ],
      liveUrl: String,
      githubUrl: String,
      features: [String],
      status: {
         type: String,
         enum: ["Completed", "In Progress", "Planning", "On Hold"],
         default: "Completed",
      },
      startDate: Date,
      endDate: Date,
      priority: {
         type: Number,
         default: 0,
         min: 0,
         max: 10,
      },
      isFeatured: {
         type: Boolean,
         default: false,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      tags: [String],
      client: {
         name: String,
         website: String,
      },
   },
   {
      timestamps: true,
   }
);

// Index for better query performance
projectSchema.index({ category: 1, isActive: 1 });
projectSchema.index({ isFeatured: 1, priority: -1 });

module.exports = mongoose.model("Project", projectSchema);
