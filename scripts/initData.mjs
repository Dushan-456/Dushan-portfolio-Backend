import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Import models
import Admin from "../models/Admin.mjs";
import PersonalDetails from "../models/PersonalDetails.mjs";
import Project from "../models/Project.mjs";
import Skill from "../models/Skill.mjs";
import Education from "../models/Education.mjs";

// Load environment variables
dotenv.config();

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");
   } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1);
   }
};

const initAdmin = async () => {
   try {
      const existingAdmin = await Admin.findOne();

      if (existingAdmin) {
         console.log("Admin user already exists");
         return existingAdmin;
      }

      const admin = new Admin({
         email: process.env.ADMIN_EMAIL || "admin@dushanportfolio.com",
         password: process.env.ADMIN_PASSWORD || "admin123",
         name: "Admin User",
         role: "admin",
      });

      await admin.save();
      console.log("Admin user created successfully");
      return admin;
   } catch (error) {
      console.error("Error creating admin:", error);
   }
};

const initPersonalDetails = async () => {
   try {
      const existingDetails = await PersonalDetails.findOne();

      if (existingDetails) {
         console.log("Personal details already exist");
         return existingDetails;
      }

      const personalDetails = new PersonalDetails({
         fullName: "Navodya Dushan Kodikara",
         email: "navodyadushan123@gmail.com",
         businessEmail: "info@techlabsoftwaresolution.com",
         phoneNumbers: ["+94 719675669", "+94 763148583"],
         socialLinks: {
            facebook: "https://facebook.com/navodyadushan",
            instagram: "https://instagram.com/_d_u_s_h_a_n_",
            github: "https://github.com/dushan456",
            linkedin: "https://linkedin.com/in/navodya-dushan",
            whatsapp: "https://wa.me/94719675669",
         },
         personalInfo: {
            dateOfBirth: new Date("2001-08-24"),
            age: 24,
            nicNumber: "200123703533",
            civilStatus: "Single",
            nationality: "Sri Lankan",
         },
         bio: {
            shortDescription:
               "Passionate web developer and Software Engineering Student",
            longDescription:
               "Hello! I'm Navodya Dushan, a passionate web developer and Software Engineering Student with a penchant for crafting engaging online experiences with a curiosity for technology and a desire to create. Over the years, I've honed my skills in HTML, CSS, JavaScript, Python, WordPress and various frameworks to build dynamic websites that not only look great but also function flawlessly.",
         },
      });

      await personalDetails.save();
      console.log("Personal details created successfully");
      return personalDetails;
   } catch (error) {
      console.error("Error creating personal details:", error);
   }
};

const initSkills = async () => {
   try {
      const existingSkills = await Skill.countDocuments();

      if (existingSkills > 0) {
         console.log("Skills already exist");
         return;
      }

      const skills = [
         { name: "HTML", category: "Frontend", proficiency: 98, order: 1 },
         { name: "CSS", category: "Frontend", proficiency: 94, order: 2 },
         {
            name: "JavaScript",
            category: "Frontend",
            proficiency: 74,
            order: 3,
         },
         { name: "Python", category: "Backend", proficiency: 75, order: 4 },
         { name: "React", category: "Frontend", proficiency: 70, order: 5 },
         { name: "Vue.js", category: "Frontend", proficiency: 70, order: 6 },
         { name: "WordPress", category: "Tools", proficiency: 50, order: 7 },
         { name: "PHP", category: "Backend", proficiency: 98, order: 8 },
         { name: "MySQL", category: "Database", proficiency: 75, order: 9 },
         { name: "MongoDB", category: "Database", proficiency: 70, order: 10 },
      ];

      await Skill.insertMany(skills);
      console.log("Skills created successfully");
   } catch (error) {
      console.error("Error creating skills:", error);
   }
};

const initEducation = async () => {
   try {
      const existingEducation = await Education.countDocuments();

      if (existingEducation > 0) {
         console.log("Education records already exist");
         return;
      }

      const education = [
         {
            institution: "Open University of Sri Lanka (OUSL)",
            degree: "Bachelor of Software Engineering Honours",
            field: "Software Engineering",
            type: "Degree",
            isCompleted: false,
            startDate: new Date("2020-01-01"),
            order: 1,
         },
         {
            institution: "Open University of Sri Lanka (OUSL)",
            degree: "Computer Literacy Certificate Course",
            field: "Computer Science",
            type: "Certificate",
            isCompleted: true,
            endDate: new Date("2019-12-31"),
            order: 2,
         },
         {
            institution: "University of Moratuwa (UOM)",
            degree: "Web Designing Certificate Course",
            field: "Web Design",
            type: "Certificate",
            isCompleted: true,
            endDate: new Date("2020-06-30"),
            order: 3,
         },
         {
            institution: "University of Moratuwa (UOM)",
            degree: "Front-End Web Development Certificate Course",
            field: "Web Development",
            type: "Certificate",
            isCompleted: true,
            endDate: new Date("2020-12-31"),
            order: 4,
         },
         {
            institution: "University of Moratuwa (UOM)",
            degree: "Python Certificate Course",
            field: "Programming",
            type: "Certificate",
            isCompleted: true,
            endDate: new Date("2021-06-30"),
            order: 5,
         },
      ];

      await Education.insertMany(education);
      console.log("Education records created successfully");
   } catch (error) {
      console.error("Error creating education records:", error);
   }
};

const initProjects = async () => {
   try {
      const existingProjects = await Project.countDocuments();

      if (existingProjects > 0) {
         console.log("Projects already exist");
         return;
      }

      const projects = [
         {
            title: "React E-Commerce Website",
            description:
               "A full-stack e-commerce website built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.",
            shortDescription:
               "Full-stack e-commerce platform with modern UI/UX",
            category: "E-Commerce",
            technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
            status: "Completed",
            isFeatured: true,
            priority: 10,
            liveUrl: "https://example-ecommerce.com",
            githubUrl: "https://github.com/dushan456/ecommerce-react",
            features: [
               "User Authentication",
               "Product Catalog",
               "Shopping Cart",
               "Payment Integration",
               "Admin Dashboard",
            ],
            tags: ["React", "E-Commerce", "Full-Stack", "MongoDB"],
         },
         {
            title: "MERN User Management Web Application",
            description:
               "A comprehensive user management system built with the MERN stack. Includes user registration, authentication, profile management, and admin controls.",
            shortDescription: "Complete user management system with MERN stack",
            category: "Web Development",
            technologies: ["MongoDB", "Express", "React", "Node.js", "JWT"],
            status: "Completed",
            isFeatured: true,
            priority: 9,
            liveUrl: "https://example-userapp.com",
            githubUrl: "https://github.com/dushan456/mern-userapp",
            features: [
               "User Registration",
               "Authentication",
               "Profile Management",
               "Admin Panel",
               "Role-based Access",
            ],
            tags: ["MERN", "Authentication", "User Management"],
         },
         {
            title: "SE LAW ACADEMY – Learning Management System",
            description:
               "A comprehensive Learning Management System for SE LAW ACADEMY. Features include course management, student enrollment, progress tracking, and online assessments.",
            shortDescription:
               "Complete LMS for law academy with course management",
            category: "LMS",
            technologies: ["PHP", "MySQL", "Bootstrap", "JavaScript", "jQuery"],
            status: "Completed",
            isFeatured: true,
            priority: 8,
            liveUrl: "https://selawacademy.com",
            features: [
               "Course Management",
               "Student Enrollment",
               "Progress Tracking",
               "Online Assessments",
               "Certificate Generation",
            ],
            tags: ["LMS", "PHP", "Education", "Management System"],
         },
      ];

      await Project.insertMany(projects);
      console.log("Sample projects created successfully");
   } catch (error) {
      console.error("Error creating projects:", error);
   }
};

const initData = async () => {
   try {
      await connectDB();

      console.log("Initializing data...");

      await initAdmin();
      await initPersonalDetails();
      await initSkills();
      await initEducation();
      await initProjects();

      console.log("Data initialization completed successfully!");
      console.log("\nAdmin credentials:");
      console.log(
         `Email: ${process.env.ADMIN_EMAIL || "admin@dushanportfolio.com"}`
      );
      console.log(`Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
      console.log("\nYou can now start the server with: npm run dev");
   } catch (error) {
      console.error("Error during initialization:", error);
   } finally {
      await mongoose.connection.close();
      process.exit(0);
   }
};

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
   initData();
}

export { initData };
