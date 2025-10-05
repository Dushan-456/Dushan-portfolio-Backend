import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      password: {
         type: String,
         required: true,
         minlength: 6,
      },
      name: {
         type: String,
         required: true,
         trim: true,
      },
      role: {
         type: String,
         enum: ["admin", "super-admin"],
         default: "admin",
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      lastLogin: Date,
      loginAttempts: {
         type: Number,
         default: 0,
      },
      lockUntil: Date,
   },
   {
      timestamps: true,
   }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
   } catch (error) {
      next(error);
   }
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
   return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
adminSchema.virtual("isLocked").get(function () {
   return !!(this.lockUntil && this.lockUntil > Date.now());
});

export default mongoose.model("Admin", adminSchema);
