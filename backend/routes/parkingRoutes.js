// backend/routes/parkingRoutes.js

const express = require('express');
const router = express.Router();
const ParkingSpot = require('../models/ParkingSpot');

// GET /api/parking
// Retrieves all parking spots
router.get('/', async (req, res) => {
    try {
        const parkingSpots = await ParkingSpot.find({});
        res.json(parkingSpots);
    } catch (error) {
        console.error('Error fetching parking spots:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch parking spots.' });
    }
});

// GET /api/parking/recommendation
// Retrieves a recommended available parking spot
router.get('/recommendation', async (req, res) => {
    try {
        // Example recommendation logic: first available spot
        const recommendedSpot = await ParkingSpot.findOne({ isAvailable: true });

        if (!recommendedSpot) {
            return res.status(404).json({ message: 'No available parking spots at the moment.' });
        }

        res.json(recommendedSpot);
    } catch (error) {
        console.error('Error fetching recommended parking spot:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch recommendation.' });
    }
});

// POST /api/parking/:id/feedback
// Submits feedback for a specific parking spot
router.post('/:id/feedback', async (req, res) => {
    const { id } = req.params;
    const { busy } = req.body;

    try {
        const parkingSpot = await ParkingSpot.findById(id);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }

        // Update parking spot status based on feedback
        if (busy === 'yes') {
            parkingSpot.busy = true;
            parkingSpot.busyLevel += 1;
            parkingSpot.isAvailable = false; // Assuming busy implies occupied
        } else if (busy === 'no') {
            parkingSpot.busy = false;
            parkingSpot.isAvailable = true;
        } else {
            return res.status(400).json({ message: 'Invalid feedback value.' });
        }

        await parkingSpot.save();

        res.json({ message: 'Feedback received and parking spot updated.' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server Error: Unable to submit feedback.' });
    }
});

// GET /api/parking/occupancy
// Retrieves data for parking occupancy chart
router.get('/occupancy', async (req, res) => {
    try {
        const totalSpots = await ParkingSpot.countDocuments({});
        const occupiedSpots = await ParkingSpot.countDocuments({ isAvailable: false });
        const availableSpots = totalSpots - occupiedSpots;

        res.json({
            labels: ['Available', 'Occupied'],
            values: [availableSpots, occupiedSpots]
        });
    } catch (error) {
        console.error('Error fetching occupancy data:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch occupancy data.' });
    }
});

module.exports = router;