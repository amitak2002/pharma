// src/routes/dashboardRoutes.js
const express = require("express");
const { getDashboardData } = require("../controllers/dashboard.controller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getDashboardData);

module.exports = router;
