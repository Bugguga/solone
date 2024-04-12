const express = require("express");

const { getDentists, createDentist } = require("../controllers/dentists");

const bookingRouter = require("./booking");

const router = express.Router();

router.use("/:dentistId/bookings", bookingRouter);
router.route("/").get(getDentists);
router.route("/").post(createDentist);

module.exports = router;