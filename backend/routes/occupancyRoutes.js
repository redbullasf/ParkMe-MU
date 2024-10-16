// routes/occupancyRoutes.js

const express = require('express');
const router = express.Router();
const ParkingSpot = require('../models/ParkingSpot');

// GET occupancy data (example implementation)
router.get('/', async (req, res) => {
    try {
        // Placeholder: Generate random data or implement logic to calculate occupancy per hour
        const occupancyData = [];
        for (let hour = 6; hour <= 18; hour++) {
            occupancyData.push(Math.floor(Math.random() * 101)); // Random percentage
        }
        res.json(occupancyData);
    } catch (error) {
        console.error('Error fetching occupancy data:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch occupancy data.' });
    }
});

module.exports = router;
