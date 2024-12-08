const express = require("express");
const router = express.Router();
const SellerProfile = require("../models/SellerProfile");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("./cloudinary");

// CREATE seller profile
const setSellerProfile = async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json({ message: "Only sellers can create a profile" });
    }

    // Check if profile already exists
    const existingProfile = await SellerProfile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: "Seller profile already exists" });
    }

    // Create new seller profile
    const profileData = {
      user: req.user._id,
      personalInfo: {
        firstName: req.body.personalInfo.firstName,
        lastName: req.body.personalInfo.lastName,
        email: req.user.email, // Use user's email
        phone: req.body.personalInfo.phone,
      },
      businessInfo: req.body.businessInfo,
    };

    const newProfile = new SellerProfile(profileData);
    await newProfile.save();

    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({
      message: "Error creating seller profile",
      error: error.message,
    });
  }
};

// GET seller profile (existing route, slightly modified)
const getSellerProfile = async (req, res) => {
  try {
    // Find profile by user ID
    const profile = await SellerProfile.findOne({
      user: req.user._id,
    }).populate("user", "name lastName email role");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// UPDATE seller profile (existing route remains mostly the same)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { personalInfo, businessInfo, verificationStatus } = req.body;

    // Find and update profile
    const profile = await SellerProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        personalInfo: {
          ...personalInfo,
          email: req.user.email, // Ensure email cannot be changed
        },
        businessInfo,
        // Only allow updates to verification status by admin
        ...(req.user.role === "admin" && { verificationStatus }),
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run model validations
      }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
});

module.exports = router;

/*

//------------------------------------------------

















// models/SellerProfile.js
const mongoose = require('mongoose');

const SellerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  businessInfo: {
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    taxId: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      maxlength: 500
    }
  },
  profileImage: {
    type: String,
    default: null
  },
  verificationStatus: {
    documentVerified: {
      type: Boolean,
      default: false
    },
    addressVerified: {
      type: Boolean,
      default: false
    },
    paymentVerified: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to update 'updatedAt' on save
SellerProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const SellerProfile = mongoose.model('SellerProfile', SellerProfileSchema);

module.exports = SellerProfile;

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = authMiddleware;

// routes/sellerProfileRoutes.js
const express = require('express');
const router = express.Router();
const SellerProfile = require('../models/SellerProfile');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure multer for file upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Configure Cloudinary (ensure you have these environment variables set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// GET seller profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Find profile by user ID
    const profile = await SellerProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
});

// UPDATE seller profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { 
      personalInfo, 
      businessInfo, 
      verificationStatus 
    } = req.body;

    // Find and update profile
    const profile = await SellerProfile.findOneAndUpdate(
      { user: req.user._id },
      { 
        personalInfo, 
        businessInfo,
        // Only allow updates to verification status by admin
        ...(req.user.role === 'admin' && { verificationStatus }) 
      },
      { 
        new: true,  // Return updated document
        runValidators: true  // Run model validations
      }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
});

// UPLOAD profile image
router.post('/profile/image', 
  authMiddleware, 
  upload.single('profileImage'), 
  async (req, res) => {
    try {
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'seller-profiles',
            transformation: [
              { width: 500, height: 500, crop: 'fill' }
            ]
          }, 
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(req.file.buffer);
      });

      // Update profile with new image URL
      const profile = await SellerProfile.findOneAndUpdate(
        { user: req.user._id },
        { profileImage: uploadResult.secure_url },
        { new: true }
      );

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.status(200).json({ 
        message: 'Profile image uploaded successfully',
        imageUrl: uploadResult.secure_url 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error uploading profile image', 
        error: error.message 
      });
    }
  }
);

module.exports = router;

// In your main app.js or server.js
const express = require('express');
const mongoose = require('mongoose');
const sellerProfileRoutes = require('./routes/sellerProfileRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use('/api/seller', sellerProfileRoutes);
*/
// -------------------------------------------
