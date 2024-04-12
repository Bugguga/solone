const express = require("express");

const { topup } = require("../controllers/payment");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.route("/:userid").post(protect, authorize("admin"), topup);

module.exports = router;
