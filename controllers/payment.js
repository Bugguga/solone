const User = require("../models/User");

//@desc Topup credit balance
//@route PUT /api/v1/payments/:userid
//@access Private
exports.topup = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${req.params.userid}`,
      });
    }
    user.creditBalance += req.body.credit;
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot topup credit" });
  }
};
