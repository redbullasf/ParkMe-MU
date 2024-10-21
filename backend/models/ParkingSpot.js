// backend/models/ParkingSpot.js

const mongoose = require('mongoose');

const ParkingSpotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    coordinates: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    currentUser: {
        type: String,
        default: null,
    },
    busy: {
        type: Boolean,
        default: false,
    },
    busyLevel: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('ParkingSpot', ParkingSpotSchema);
