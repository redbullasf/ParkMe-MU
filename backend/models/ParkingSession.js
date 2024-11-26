// backend/models/ParkingSession.js

const mongoose = require('mongoose');

const parkingSessionSchema = new mongoose.Schema({
    parkingSpot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    departureTime: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ParkingSession = mongoose.model('ParkingSession', parkingSessionSchema);

module.exports = ParkingSession;