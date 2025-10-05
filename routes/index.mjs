import { Router } from "express";
import dotenv from "dotenv";
import authRoutes from "./auth.mjs";
import personalDetailsRoutes from "./personalDetails.mjs";
import projectsRoutes from "./projects.mjs";
import skillsRoutes from "./skills.mjs";
import educationRoutes from "./education.mjs";
import contactRoutes from "./contact.mjs";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();


// Create the main root router
const rootRouter = Router();

// Root endpoint
rootRouter.get("/", (req, res) => {
    res.json({
       success: true,
       message: "Dushan Portfolio Backend API",
       version: "1.0.0",
       endpoints: {
          personalDetails: "/api/personal-details",
          projects: "/api/projects",
          skills: "/api/skills",
          education: "/api/education",
          contact: "/api/contact",
          auth: "/api/auth",
       },
       documentation: "https://github.com/Dushan-456/dushan-portfolio-backend",
    });
 });
// Health check endpoint (to test if API is running)
rootRouter.get("/health", (req, res) => {
    res.json({
       success: true,
       message: "Server is running",
       timestamp: new Date().toISOString(),
       environment: process.env.NODE_ENV,
    });
 });
 
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth routes
    message: {
       success: false,
       message: "Too many login attempts, please try again later.",
    },
 });
// API routes
rootRouter.use("/auth", authLimiter, authRoutes);
rootRouter.use("/personal-details", personalDetailsRoutes);
rootRouter.use("/projects", projectsRoutes);
rootRouter.use("/skills", skillsRoutes);
rootRouter.use("/education", educationRoutes);
rootRouter.use("/contact", contactRoutes);

// Handle undefined routes (404 Not Found)
rootRouter.use("*", (req, res) => {
    res.status(404).json({
       success: false,
       message: "Route not found",
    });
 });

export default rootRouter;
