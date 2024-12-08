const mongoose = require('mongoose');

// Auction Schema
const auctionSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    min_bid: { type: Number, required: true },
    current_bid: { type: Number, default: 0 },
    bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    location: { type: String, required: true },
    approval_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    time_span: { type: Number, required: true }, // Time in hours or days
    posting_time: { type: Date, required: true },
}, { timestamps: true });

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;