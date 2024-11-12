//backend/ models/ParkingSpot.js

const mongoose = require('mongoose');

const occupancySchema = new mongoose.Schema({
    hour: Number,
    occupiedSpaces: Number
}, { _id: false });

const parkingSpotSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    isAvailable: { type: Boolean, required: true },
    busy: { type: Boolean, default: false },
    busyLevel: { type: Number, default: 0 },
    capacity: { type: Number, required: true }, // Ensured capacity is required
    currentOccupancy: { type: Number, default: 0 },
    hourlyOccupancy: [occupancySchema]
});

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);