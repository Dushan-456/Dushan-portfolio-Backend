import { body, validationResult } from "express-validator";

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({
         success: false,
         message: "Validation failed",
         errors: errors.array(),
      });
   }
   next();
};

// Personal Details validation
export const validatePersonalDetails = [
   body("fullName").notEmpty().withMessage("Full name is required"),
   body("email").isEmail().withMessage("Valid email is required"),
   body("phoneNumbers")
      .isArray({ min: 1 })
      .withMessage("At least one phone number is required"),
   body("personalInfo.nationality")
      .notEmpty()
      .withMessage("Nationality is required"),
   handleValidationErrors,
];

// Project validation
export const validateProject = [
   body("title").notEmpty().withMessage("Project title is required"),
   body("description")
      .notEmpty()
      .withMessage("Project description is required"),
   body("category")
      .isIn([
         "Web Development",
         "Mobile App",
         "Desktop App",
         "E-Commerce",
         "LMS",
         "Business Website",
         "Travel Website",
         "Restaurant Website",
         "Other",
      ])
      .withMessage("Valid category is required"),
   body("technologies")
      .isArray({ min: 1 })
      .withMessage("At least one technology is required"),
   body("proficiency")
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("Proficiency must be between 0 and 100"),
   handleValidationErrors,
];

// Skill validation
export const validateSkill = [
   body("name").notEmpty().withMessage("Skill name is required"),
   body("category")
      .isIn([
         "Frontend",
         "Backend",
         "Database",
         "Mobile",
         "Desktop",
         "Design",
         "Tools",
         "Other",
      ])
      .withMessage("Valid category is required"),
   body("proficiency")
      .isInt({ min: 0, max: 100 })
      .withMessage("Proficiency must be between 0 and 100"),
   handleValidationErrors,
];

// Education validation
export const validateEducation = [
   body("institution").notEmpty().withMessage("Institution name is required"),
   body("degree").notEmpty().withMessage("Degree is required"),
   body("field").notEmpty().withMessage("Field of study is required"),
   body("type")
      .isIn(["Degree", "Certificate", "Course", "Training"])
      .withMessage("Valid type is required"),
   handleValidationErrors,
];

// Contact validation
export const validateContact = [
   body("name").notEmpty().withMessage("Name is required"),
   body("email").isEmail().withMessage("Valid email is required"),
   body("subject").notEmpty().withMessage("Subject is required"),
   body("message").notEmpty().withMessage("Message is required"),
   handleValidationErrors,
];

// Admin validation
export const validateAdmin = [
   body("email").isEmail().withMessage("Valid email is required"),
   body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
   body("name").notEmpty().withMessage("Name is required"),
   handleValidationErrors,
];
