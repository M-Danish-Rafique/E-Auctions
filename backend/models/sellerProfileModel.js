const mongoose = require('mongoose');
const User = require('./userModel'); // Import the User model

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
      trim: true,
      validate: {
        validator: async function(email) {
          // Ensure email matches the user's email
          const user = await User.findById(this.user);
          return user && user.email === email;
        },
        message: 'Email must match the associated user\'s email'
      }
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(phone) {
          // Basic phone number validation
          return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);
        },
        message: 'Invalid phone number format'
      }
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
      trim: true,
      validate: {
        validator: function(taxId) {
          // Basic tax ID validation (adjust regex as needed)
          return /^[0-9]{9}$/.test(taxId);
        },
        message: 'Invalid tax ID format'
      }
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

// Middleware to ensure only sellers can create a seller profile
SellerProfileSchema.pre('save', async function(next) {
  try {
    const user = await User.findById(this.user);
    
    if (!user) {
      return next(new Error('Associated user not found'));
    }
    
    if (user.role !== 'seller') {
      return next(new Error('Only sellers can create a seller profile'));
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware to update 'updatedAt' on save
SellerProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound unique index to prevent duplicate profiles
SellerProfileSchema.index({ user: 1 }, { unique: true });

const SellerProfile = mongoose.model('SellerProfile', SellerProfileSchema);

module.exports = SellerProfile;