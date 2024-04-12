const Dentist = require("../models/Dentist");

//@desc Create new dentist
//@route POST /api/v1/dentists
//@access Private
exports.createDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.create(req.body);
    res.status(201).json({ success: true, data: dentist });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Get all dentist
//@route GET /api/v1/dentist
//@access Public
exports.getDentists = async (req, res, next) => {
  try {
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ["select", "sort"];

    removeFields.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    query = Dentist.find(JSON.parse(queryStr)).populate('bookings');

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("name");
    }
    const dentist = await query;
    res
      .status(200)
      .json({ success: true, count: dentist.length, data: dentist });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
