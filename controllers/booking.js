const Booking = require("../models/Booking");
const Dentist = require("../models/Dentist");
const User = require("../models/User");

//@desc Add booking
//@route POST /api/v1/dentists/:dentistId/booking
//@access Private
exports.addBooking = async (req, res, next) => {
  try {
    //check future date
    if (new Date(req.body.bookDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: `Cannot book in the past`,
      });
    }
    
    req.body.dentist = req.params.dentistId;

    const dentist = await Dentist.findById(req.params.dentistId);

    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `No dentist with the id of ${req.params.dentistId}`,
      });
    }

    //add user Id to req.body
    req.body.user = req.user.id;

    //Check for existed booking
    const existedBooking = await Booking.find({ user: req.user.id });

    if (existedBooking.length >= 1 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `User with id of ${req.user.id} already has 1 booking`,
      });
    }
    req.body.price = 0;
    if (req.body.services) {
      for (let i = 0; i < req.body.services.length; i++) {
        if (req.body.services[i] === "tartar") {
          req.body.price += 1000;
        } else if (req.body.services[i] === "filling") {
          req.body.price += 2000;
        } else {
          req.body.price += 500;
        }
      }
    }

    //decrease user's balance
    const user = await User.findById(req.user.id);
    if (user.creditBalance < req.body.price) {
      return res.status(400).json({
        success: false,
        message: `User with id of ${req.user.id} does not have enough balance`,
      });
    }
    user.creditBalance -= req.body.price;
    await user.save();

    const booking = await Booking.create(req.body);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Booking" });
  }
};

//@desc Get all bookings
//@route GET /api/v1/bookings
//@access Public
exports.getBookings = async (req, res, next) => {
  let query;

  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "dentist",
      select: "name",
    });
  } else {
    if (req.params.dentistId) {
      console.log(req.params.dentistId);
      query = Booking.find({ dentist: req.params.dentistId }).populate({
        path: "dentist",
        select: "name",
      });
    } else {
      query = Booking.find().populate({
        path: "dentist",
        select: "name",
      });
    }
  }
  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "dentist",
      select: "name",
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc Update booking
//@route PUT /api/v1/bookings/:id
//@access Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //make sure user is booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    if (new Date(req.body.bookDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: `Cannot book in the past`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc Delete booking
//@route DELETE /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //make sure user is booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    //increase user's balance
    const user = await User.findById(req.user.id);
    user.creditBalance += booking.price;
    await user.save();

    await booking.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};
