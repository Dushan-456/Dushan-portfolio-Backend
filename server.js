const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/database");

// Import routes
const personalDetailsRoutes = require("./routes/personalDetails");
const projectsRoutes = require("./routes/projects");
const skillsRoutes = require("./routes/skills");
const educationRoutes = require("./routes/education");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/auth");

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(
   helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
   })
);

// Rate limiting
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 requests per windowMs
   message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
   },
});

const authLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 5, // limit each IP to 5 requests per windowMs for auth routes
   message: {
      success: false,
      message: "Too many login attempts, please try again later.",
   },
});

app.use(limiter);

// CORS configuration
const corsOptions = {
   origin: function (origin, callback) {
      const allowedOrigins = [
         process.env.FRONTEND_URL,
         "http://localhost:3000",
         "https://dushanportfolio.textaworld.com",
         "https://dushanportfolio.netlify.app",
         "https://dushanportfolio.vercel.app",
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
         callback(null, true);
      } else {
         callback(new Error("Not allowed by CORS"));
      }
   },
   credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Trust proxy for rate limiting and IP detection
app.set("trust proxy", 1);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
   res.json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
   });
});

// API routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/personal-details", personalDetailsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/contact", contactRoutes);

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
      documentation: "https://github.com/yourusername/dushan-portfolio-backend",
   });
});

// 404 handler
app.use("*", (req, res) => {
   res.status(404).json({
      success: false,
      message: "Route not found",
   });
});

// Global error handler
app.use((err, req, res, next) => {
   console.error("Error:", err);

   // CORS error
   if (err.message === "Not allowed by CORS") {
      return res.status(403).json({
         success: false,
         message: "CORS policy violation",
      });
   }

   // Default error
   res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
   });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
   console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
   console.log(`Health check: http://localhost:${PORT}/health`);
});
