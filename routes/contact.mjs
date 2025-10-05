import express from "express";
import auth from "../middleware/auth.mjs";
import { validateContact } from "../middleware/validation.mjs";
import {
   sendContactMessage,
   getContactMessages,
   getContactMessage,
   replyToMessage,
   markMessageRead,
   deleteContactMessage,
   getContactStats,
} from "../controllers/contactController.mjs";

const contactRoutes = express.Router();

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
contactRoutes.post("/", validateContact, sendContactMessage);

// @route   GET /api/contact/admin/messages
// @desc    Get all contact messages (admin)
// @access  Private (Admin)
contactRoutes.get("/admin/messages", auth, getContactMessages);

// @route   GET /api/contact/admin/messages/:id
// @desc    Get single contact message (admin)
// @access  Private (Admin)
contactRoutes.get("/admin/messages/:id", auth, getContactMessage);

// @route   PUT /api/contact/admin/messages/:id/reply
// @desc    Reply to contact message
// @access  Private (Admin)
contactRoutes.put("/admin/messages/:id/reply", auth, replyToMessage);

// @route   PUT /api/contact/admin/messages/:id/read
// @desc    Mark message as read/unread
// @access  Private (Admin)
contactRoutes.put("/admin/messages/:id/read", auth, markMessageRead);

// @route   DELETE /api/contact/admin/messages/:id
// @desc    Delete contact message
// @access  Private (Admin)
contactRoutes.delete("/admin/messages/:id", auth, deleteContactMessage);

// @route   GET /api/contact/admin/stats
// @desc    Get contact statistics (admin)
// @access  Private (Admin)
contactRoutes.get("/admin/stats", auth, getContactStats);

export default contactRoutes;
