// routes/parkingRoutes.js

const express = require('express');
const router = express.Router();
const ParkingSpot = require('../models/ParkingSpot');

// GET all parking spots
router.get('/', async (req, res) => {
    try {
        const parkingSpots = await ParkingSpot.find();
        res.json(parkingSpots);
    } catch (error) {
        console.error('Error fetching parking spots:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch parking spots.' });
    }
});

// POST check-in
router.post('/checkin', async (req, res) => {
    const { userId, parkingId, isBusy, busyLevel } = req.body;
    try {
        const parkingSpot = await ParkingSpot.findById(parkingId);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }
        if (!parkingSpot.isAvailable) {
            return res.status(400).json({ message: 'Parking spot is already occupied.' });
        }

        // Update parking spot
        parkingSpot.isAvailable = false;
        parkingSpot.currentUser = userId;
        parkingSpot.busy = isBusy;
        parkingSpot.busyLevel = busyLevel;

        await parkingSpot.save();

        res.json({ message: 'Check-in successful', parkingSpot });
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).json({ message: 'Server Error: Unable to perform check-in.' });
    }
});

// POST check-out
router.post('/checkout', async (req, res) => {
    const { userId, parkingId } = req.body;
    try {
        const parkingSpot = await ParkingSpot.findById(parkingId);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }
        if (parkingSpot.isAvailable || parkingSpot.currentUser !== userId) {
            return res.status(400).json({ message: 'No active parking session found for this user.' });
        }

        // Update parking spot
        parkingSpot.isAvailable = true;
        parkingSpot.currentUser = null;
        parkingSpot.busy = false;
        parkingSpot.busyLevel = 0;

        await parkingSpot.save();

        res.json({ message: 'Check-out successful', parkingSpot });
    } catch (error) {
        console.error('Error during check-out:', error);
        res.status(500).json({ message: 'Server Error: Unable to perform check-out.' });
    }
});

// GET parking status (for real-time updates or chart data)
router.get('/status', async (req, res) => {
    try {
        const parkingSpots = await ParkingSpot.find();
        res.json(parkingSpots);
    } catch (error) {
        console.error('Error fetching parking status:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch parking status.' });
    }
});

module.exports = router;
