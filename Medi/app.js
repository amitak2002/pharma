const express = require("express")
const dotenv = require("dotenv")
const { connectDB } = require("./db");
const cors = require("cors")

const authRoute = require("./routes/user")
const saleRoute = require("./routes/sales")
const dashBoardRoute = require("./routes/dashboard")

dotenv.config()
const app = express()
const portNumber = process.env.PORT_NUMBER;

//connect db
connectDB();


//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//routes
app.use("/api/auth", authRoute)
app.use("/api/sales", saleRoute)
app.use("/api/dashboard", dashBoardRoute)


app.listen(portNumber, () => {
  console.log("server is start at port number : ", portNumber);
});