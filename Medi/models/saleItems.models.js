const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: [true, "Please add medicine name"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please add medicine category"],
    enum: ["Antibiotics", "Painkillers", "Vitamins", "Medical Devices", "Other OTC"],
  },
  quantity: {
    type: Number,
    required: [true, "Please add quantity"],
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: [true, "Please add unit price"],
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("SaleItem", saleItemSchema);
