//backend / models/CheckIn.js

const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    parkingSpot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parking',
        required: true,
    },
    checkInTime: {
        type: Date,
        default: Date.now,
    },
    checkOutTime: {
        type: Date,
    },
    busyLevel: {
        type: Number,
        min: 1,
        max: 10,
    },
    isBusy: {
        type: Boolean,
    },
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
