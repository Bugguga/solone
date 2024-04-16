const express = require("express");

const {
  getDentists,
  createDentist,
  getDentist,
  updateDentist,
    deleteDentist,
} = require("../controllers/dentists");

const bookingRouter = require("./booking");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use("/:dentistId/bookings", bookingRouter);
router.route("/").get(getDentists);
router.route("/").post(protect, authorize("admin"), createDentist);
router
  .route("/:id")
  .get(getDentist)
  .put(protect, authorize("admin"), updateDentist)
  .delete(protect, authorize("admin"), deleteDentist);

module.exports = router;
