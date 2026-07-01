const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("error is coming when connect with database :", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
