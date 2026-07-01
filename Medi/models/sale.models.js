// src/models/Sale.js
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  saleDate: {
    type: Date,
    required: [true, "Please add sale date"],
    default: Date.now,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SaleItem",
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  totalItems: {
    type: Number,
    required: true,
    min: 1,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "credit"],
    default: "cash",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better query performance
saleSchema.index({ saleDate: -1 });
saleSchema.index({ createdBy: 1, saleDate: -1 });

module.exports = mongoose.model("Sale", saleSchema);
