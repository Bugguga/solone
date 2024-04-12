const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// const cors = require("cors");

const auth = require("./routes/auth");
const dentist = require("./routes/dentist");
const booking = require("./routes/booking");
const payment = require("./routes/payment");
//Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

// app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", auth);
app.use("/api/v1/dentists", dentist);
app.use("/api/v1/bookings", booking);
app.use("/api/v1/payments", payment);


const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, "mode on port ", PORT)
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
