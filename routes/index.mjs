import { Router } from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();


// Create the main root router
const rootRouter = Router();

// Root endpoint
app.get("/", (req, res) => {
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
app.get("/health", (req, res) => {
    res.json({
       success: true,
       message: "Server is running",
       timestamp: new Date().toISOString(),
       environment: process.env.NODE_ENV,
    });
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
