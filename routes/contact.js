const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");
const { validateContact } = require("../middleware/validation");

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post("/", validateContact, async (req, res) => {
   try {
      const contactData = {
         ...req.body,
         ipAddress: req.ip || req.connection.remoteAddress,
         userAgent: req.get("User-Agent"),
      };

      const contact = new Contact(contactData);
      await contact.save();

      res.status(201).json({
         success: true,
         message: "Message sent successfully. I will get back to you soon!",
         data: {
            id: contact._id,
         },
      });
   } catch (error) {
      console.error("Error sending contact message:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   GET /api/contact/admin/messages
// @desc    Get all contact messages (admin)
// @access  Private (Admin)
router.get("/admin/messages", auth, async (req, res) => {
   try {
      const { read, page = 1, limit = 20 } = req.query;

      let query = {};

      if (read !== undefined) {
         query.isRead = read === "true";
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const messages = await Contact.find(query)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit))
         .select("-__v");

      const total = await Contact.countDocuments(query);
      const unreadCount = await Contact.countDocuments({ isRead: false });

      res.json({
         success: true,
         data: messages,
         pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total,
         },
         unreadCount,
      });
   } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   GET /api/contact/admin/messages/:id
// @desc    Get single contact message (admin)
// @access  Private (Admin)
router.get("/admin/messages/:id", auth, async (req, res) => {
   try {
      const message = await Contact.findById(req.params.id);

      if (!message) {
         return res.status(404).json({
            success: false,
            message: "Message not found",
         });
      }

      // Mark as read if not already read
      if (!message.isRead) {
         message.isRead = true;
         await message.save();
      }

      res.json({
         success: true,
         data: message,
      });
   } catch (error) {
      console.error("Error fetching contact message:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   PUT /api/contact/admin/messages/:id/reply
// @desc    Reply to contact message
// @access  Private (Admin)
router.put("/admin/messages/:id/reply", auth, async (req, res) => {
   try {
      const { replyMessage } = req.body;

      if (!replyMessage) {
         return res.status(400).json({
            success: false,
            message: "Reply message is required",
         });
      }

      const message = await Contact.findByIdAndUpdate(
         req.params.id,
         {
            replyMessage,
            isReplied: true,
            repliedAt: new Date(),
         },
         { new: true }
      );

      if (!message) {
         return res.status(404).json({
            success: false,
            message: "Message not found",
         });
      }

      res.json({
         success: true,
         message: "Reply sent successfully",
         data: message,
      });
   } catch (error) {
      console.error("Error replying to message:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   PUT /api/contact/admin/messages/:id/read
// @desc    Mark message as read/unread
// @access  Private (Admin)
router.put("/admin/messages/:id/read", auth, async (req, res) => {
   try {
      const { isRead } = req.body;

      const message = await Contact.findByIdAndUpdate(
         req.params.id,
         { isRead },
         { new: true }
      );

      if (!message) {
         return res.status(404).json({
            success: false,
            message: "Message not found",
         });
      }

      res.json({
         success: true,
         message: `Message marked as ${isRead ? "read" : "unread"}`,
         data: message,
      });
   } catch (error) {
      console.error("Error updating message status:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   DELETE /api/contact/admin/messages/:id
// @desc    Delete contact message
// @access  Private (Admin)
router.delete("/admin/messages/:id", auth, async (req, res) => {
   try {
      const message = await Contact.findByIdAndDelete(req.params.id);

      if (!message) {
         return res.status(404).json({
            success: false,
            message: "Message not found",
         });
      }

      res.json({
         success: true,
         message: "Message deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

// @route   GET /api/contact/admin/stats
// @desc    Get contact statistics (admin)
// @access  Private (Admin)
router.get("/admin/stats", auth, async (req, res) => {
   try {
      const totalMessages = await Contact.countDocuments();
      const unreadMessages = await Contact.countDocuments({ isRead: false });
      const repliedMessages = await Contact.countDocuments({ isReplied: true });

      // Messages by month (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const messagesByMonth = await Contact.aggregate([
         {
            $match: {
               createdAt: { $gte: sixMonthsAgo },
            },
         },
         {
            $group: {
               _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
               },
               count: { $sum: 1 },
            },
         },
         {
            $sort: { "_id.year": 1, "_id.month": 1 },
         },
      ]);

      res.json({
         success: true,
         data: {
            totalMessages,
            unreadMessages,
            repliedMessages,
            messagesByMonth,
         },
      });
   } catch (error) {
      console.error("Error fetching contact stats:", error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
});

module.exports = router;
