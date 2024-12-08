const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const otpSender = require('./controllers/otpSender');
const auth = require('./controllers/auth');

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
// Middleware
app.use(
    cors({
      origin: "http://localhost:3000", // Frontend URL
      credentials: true, // Allow credentials (cookies)
    })
  );
app.use(express.json());

// Mongoose setup
mongoose
    .connect('mongodb+srv://admin:admin@cluster0.m3wdh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

    // Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/register', auth.register);

app.post('/login', auth.login);

// Route to generate and store OTP
app.post('/generate-otp', otpSender.generateOtp);

// Route to verify OTP
app.post('/verify-otp', otpSender.verifyOtp);