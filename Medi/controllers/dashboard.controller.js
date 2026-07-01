// src/controllers/dashboardController.js
const Sale = require("../models/sale.models");
const moment = require("moment");

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Last month calculation
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth();

    // Current month range
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(
      currentYear,
      currentMonth + 1,
      0,
      23,
      59,
      59,
    );

    // Last month range
    const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
    const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59);

    // Get current month sales
    const currentMonthSales = await Sale.aggregate([
      {
        $match: {
          createdBy: req.user._id,
          saleDate: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalItems: { $sum: "$totalItems" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    // Get last month sales
    const lastMonthSales = await Sale.aggregate([
      {
        $match: {
          createdBy: req.user._id,
          saleDate: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalItems: { $sum: "$totalItems" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    // Get recent sale products with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const recentSales = await Sale.find({ createdBy: req.user._id })
      .populate("items")
      .sort({ saleDate: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalSales = await Sale.countDocuments({ createdBy: req.user._id });

    // Calculate percentage change
    const currentAmount = currentMonthSales[0]?.totalAmount || 0;
    const lastAmount = lastMonthSales[0]?.totalAmount || 0;
    const percentageChange =
      lastAmount === 0
        ? 100
        : ((currentAmount - lastAmount) / lastAmount) * 100;

    // All-time chart data
    const allTimeSales = await Sale.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }
    ]);
    const allTimeTotal = allTimeSales[0]?.totalAmount || 0;

    const categoryBreakdown = await Sale.aggregate([
      { $match: { createdBy: req.user._id } },
      { $lookup: {
          from: "saleitems",
          localField: "items",
          foreignField: "_id",
          as: "populatedItems"
      }},
      { $unwind: "$populatedItems" },
      { $group: {
          _id: "$populatedItems.category",
          totalAmount: { $sum: "$populatedItems.totalAmount" }
      }},
      { $project: {
          category: "$_id",
          totalAmount: 1,
          _id: 0
      }}
    ]);

    res.status(200).json({
      success: true,
      data: {
        currentMonth: {
          month: moment().format("MMMM YYYY"),
          totalAmount: currentAmount,
          totalItems: currentMonthSales[0]?.totalItems || 0,
          totalSales: currentMonthSales[0]?.totalSales || 0,
        },
        lastMonth: {
          month: moment(lastMonthStart).format("MMMM YYYY"),
          totalAmount: lastAmount,
          totalItems: lastMonthSales[0]?.totalItems || 0,
          totalSales: lastMonthSales[0]?.totalSales || 0,
        },
        comparison: {
          percentageChange: percentageChange.toFixed(2),
          trend: percentageChange >= 0 ? "up" : "down",
        },
        recentSales: {
          data: recentSales,
          pagination: {
            page,
            limit,
            total: totalSales,
            totalPages: Math.ceil(totalSales / limit),
          },
        },
        chartData: {
          allTimeTotal,
          categoryBreakdown
        }
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashboardData };
