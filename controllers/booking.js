const Booking = require('../models/Booking');
const Dentist = require('../models/Dentist');

//@desc Add booking
//@route POST /api/v1/dentists/:dentistId/booking
//@access Private
exports.addBooking = async (req, res, next) => {
    try {
      req.body.dentist = req.params.dentistId;
  
      const dentist = await Dentist.findById(req.params.dentistId);
  
      if (!dentist) {
        return res
          .status(404)
          .json({
            success: false,
            message: `No dentist with the id of ${req.params.dentistId}`,
          });
      }
  
      //add user Id to req.body
      req.body.user = req.user.id;
  
      //Check for existed booking 
      const existedBooking = await Booking.find({ user: req.user.id });
  
      if (existedBooking.length >= 1 && req.user.role !== "admin") {
        return res
          .status(400)
          .json({
            success: false,
            message: `User with id of ${req.user.id} already has 1 booking`,
          });
      }
  
      const booking = await Booking.create(req.body);
      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Cannot create Booking" });
    }
  };
  