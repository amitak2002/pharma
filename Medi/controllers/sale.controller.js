// src/controllers/saleController.js
const Sale = require("../models/sale.models");
const SaleItem = require("../models/saleItems.models");

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
  console.log("request Body is : ", req?.body)
  try {
    const { saleDate, items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one item",
      });
    }

    // Calculate totals and create sale items
    let totalAmount = 0;
    let totalItems = 0;
    const savedItems = [];

    for (const item of items) {
      const itemTotal = item.quantity * item.unitPrice;
      totalAmount += itemTotal;
      totalItems += item.quantity;

      const saleItem = await SaleItem.create({
        medicineName: item.medicineName,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalAmount: itemTotal,
      });

      savedItems.push(saleItem._id);
    }

    // Create sale
    const sale = await Sale.create({
      saleDate: saleDate || new Date(),
      items: savedItems,
      totalAmount,
      totalItems,
      paymentMethod,
      createdBy: req.user._id,
    });

    // Populate items for response
    const populatedSale = await Sale.findById(sale._id).populate("items");

    res.status(201).json({
      success: true,
      data: populatedSale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get sales history with filters
// @route   GET /api/sales/history
// @access  Private
const getSalesHistory = async (req, res) => {
  try {
    const { year, month, page = 1, limit = 10, search, category } = req.query;

    let query = { createdBy: req.user._id };

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.saleDate = { $gte: startDate, $lte: endDate };
    }

    if (search || (category && category !== 'All')) {
      const itemQuery = {};
      if (search) {
        itemQuery.medicineName = { $regex: search, $options: 'i' };
      }
      if (category && category !== 'All') {
        itemQuery.category = category;
      }

      const SaleItem = require("../models/saleItems.models");
      const matchedItems = await SaleItem.find(itemQuery).select('_id');
      const itemIds = matchedItems.map(item => item._id);

      const orConditions = [];
      if (itemIds.length > 0) {
        orConditions.push({ items: { $in: itemIds } });
      }

      if (search) {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(search)) {
          orConditions.push({ _id: search });
        }
      }

      if (orConditions.length > 0) {
        query.$or = orConditions;
      } else {
        // If filters are applied but no items match and search is not an ID, force empty result
        query._id = null;
      }
    }

    const sales = await Sale.find(query)
      .populate("items")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Sale.countDocuments(query);

    res.status(200).json({
      success: true,
      data: sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get monthly summary
// @route   GET /api/sales/monthly-summary
// @access  Private
const getMonthlySummary = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year || new Date().getFullYear();

    const monthlyData = await Sale.aggregate([
      {
        $match: {
          createdBy: req.user._id,
          saleDate: {
            $gte: new Date(`${targetYear}-01-01`),
            $lte: new Date(`${targetYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$saleDate" } },
          totalAmount: { $sum: "$totalAmount" },
          totalItems: { $sum: "$totalItems" },
          totalSales: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id.month",
          totalAmount: 1,
          totalItems: 1,
          totalSales: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: monthlyData,
      year: targetYear,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get daily sales for specific month
// @route   GET /api/sales/daily/:year/:month
// @access  Private
const getDailySales = async (req, res) => {
  try {
    const { year, month } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const dailyData = await Sale.aggregate([
      {
        $match: {
          createdBy: req.user._id,
          saleDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$saleDate" } },
          totalAmount: { $sum: "$totalAmount" },
          totalItems: { $sum: "$totalItems" },
          totalSales: { $sum: 1 },
        },
      },
      {
        $project: {
          day: "$_id.day",
          totalAmount: 1,
          totalItems: 1,
          totalSales: 1,
          _id: 0,
        },
      },
      { $sort: { day: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: dailyData,
      month: `${year}-${month}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get sales for specific day
// @route   GET /api/sales/daily/:year/:month/:day
// @access  Private
const getDaySales = async (req, res) => {
  try {
    const { year, month, day } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startDate = new Date(year, month - 1, day);
    const endDate = new Date(year, month - 1, day, 23, 59, 59);

    const query = {
      createdBy: req.user._id,
      saleDate: { $gte: startDate, $lte: endDate },
    };

    const sales = await Sale.find(query)
      .populate("items")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Sale.countDocuments(query);

    const summary = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalItems: { $sum: "$totalItems" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: summary[0] || { totalAmount: 0, totalItems: 0 },
        sales,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private
const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { saleDate, items, paymentMethod } = req.body;

    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    if (sale.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this sale",
      });
    }

    // Delete existing items
    if (sale.items && sale.items.length > 0) {
      await SaleItem.deleteMany({ _id: { $in: sale.items } });
    }

    // Create new items
    let totalAmount = 0;
    let totalItems = 0;
    const savedItems = [];

    if (items && items.length > 0) {
      for (const item of items) {
        const itemTotal = item.quantity * item.unitPrice;
        totalAmount += itemTotal;
        totalItems += item.quantity;

        const saleItem = await SaleItem.create({
          medicineName: item.medicineName,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalAmount: itemTotal,
        });

        savedItems.push(saleItem._id);
      }
      sale.items = savedItems;
      sale.totalAmount = totalAmount;
      sale.totalItems = totalItems;
    }

    if (saleDate) sale.saleDate = saleDate;
    if (paymentMethod) sale.paymentMethod = paymentMethod;

    await sale.save();

    const populatedSale = await Sale.findById(sale._id).populate("items");

    res.status(200).json({
      success: true,
      data: populatedSale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private
const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    if (sale.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this sale",
      });
    }

    // Delete associated items
    if (sale.items && sale.items.length > 0) {
      await SaleItem.deleteMany({ _id: { $in: sale.items } });
    }

    await Sale.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSale,
  getSalesHistory,
  getMonthlySummary,
  getDailySales,
  getDaySales,
  updateSale,
  deleteSale,
};
