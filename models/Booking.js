const mongoose = require("mongoose");

const serviceEnums = ["tartar", "filling", "check"];

const BookingSchema = new mongoose.Schema({
    bookDate: {
        type: Date,
        required: true,
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dentist:{
        type: mongoose.Schema.ObjectId,
        ref: 'Dentist',
        required: true
    },
    services: {
        type: [String],
        enum: serviceEnums,
    },
    price : {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", BookingSchema);