import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Import database connection
import connectDB from "./config/database.mjs";

// Import routes
import personalDetailsRoutes from "./routes/personalDetails.mjs";
import projectsRoutes from "./routes/projects.mjs";
import skillsRoutes from "./routes/skills.mjs";
import educationRoutes from "./routes/education.mjs";
import contactRoutes from "./routes/contact.mjs";
import authRoutes from "./routes/auth.mjs";
import rootRouter from "./routes/index.mjs";

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

//  export const authLimiter = rateLimit({
//    windowMs: 15 * 60 * 1000, // 15 minutes
//    max: 5, // limit each IP to 5 requests per windowMs for auth routes
//    message: {
//       success: false,
//       message: "Too many login attempts, please try again later.",
//    },
// });

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
app.use("/api/v1", rootRouter);

// app.use("/api/v1/auth", authLimiter, authRoutes);
// app.use("/api/v1/personal-details", personalDetailsRoutes);
// app.use("/api/v1/projects", projectsRoutes);
// app.use("/api/v1/skills", skillsRoutes);
// app.use("/api/v1/education", educationRoutes);
// app.use("/api/v1/contact", contactRoutes);

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
