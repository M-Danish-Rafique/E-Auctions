const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For secure password hashing

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 }, // Enforce minimum password length
    role: { type: String, enum: ["admin", "seller", "bidder"], required: true },
    contactNumber: { type: String }, // Consider validation for phone number format
    address: {
      houseNumber: { type: String },
      streetNumber: { type: String },
      streetName: { type: String },
      city: { type: String },
    },
    profile_image: {
      type: String,
      default: null,
    },
    otp: { 
      value: { type: String, default: null }, // Store OTP value
      time: { type: Date, default: null },   // Store the timestamp when OTP was generated
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  const user = this; // Use 'this' to access the user schema
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10); // Salt factor: 10
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
