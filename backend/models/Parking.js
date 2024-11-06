// backend/models/Parking.js

const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    currentUser: {
        type: String, // Could be a user ID or username
        default: null,
    },
});

module.exports = mongoose.model('Parking', ParkingSchema);
