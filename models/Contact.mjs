import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         lowercase: true,
         trim: true,
      },
      subject: {
         type: String,
         required: true,
         trim: true,
      },
      message: {
         type: String,
         required: true,
      },
      phone: String,
      isRead: {
         type: Boolean,
         default: false,
      },
      isReplied: {
         type: Boolean,
         default: false,
      },
      replyMessage: String,
      repliedAt: Date,
      ipAddress: String,
      userAgent: String,
   },
   {
      timestamps: true,
   }
);

// Index for better query performance
contactSchema.index({ isRead: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

export default mongoose.model("Contact", contactSchema);
