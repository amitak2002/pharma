const express = require("express");
const {
  createSale,
  getSalesHistory,
  getMonthlySummary,
  getDailySales,
  getDaySales,
  updateSale,
  deleteSale,
} = require("../controllers/sale.controller");
const { protect } = require("../middlewares/authMiddleware");

const route = express.Router();

route.use(protect);

route.post("/", createSale);
route.get("/history", getSalesHistory);
route.get("/monthly-summary", getMonthlySummary);
route.get("/daily/:year/:month", getDailySales);
route.get("/daily/:year/:month/:day", getDaySales);
route.put("/:id", updateSale);
route.delete("/:id", deleteSale);


module.exports = route
