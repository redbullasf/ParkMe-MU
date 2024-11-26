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
        // Recommendation logic: Find the available spot with the lowest current occupancy
        const recommendedSpot = await ParkingSpot.findOne({ isAvailable: true }).sort({ currentOccupancy: 1 });

        if (!recommendedSpot) {
            return res.status(404).json({ message: 'No available parking spots at the moment.' });
        }

        res.json(recommendedSpot);
    } catch (error) {
        console.error('Error fetching recommended parking spot:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch recommendation.' });
    }
});

// POST /api/parking/:id/checkin
// Increases the occupancy count when a user checks in
router.post('/:id/checkin', async (req, res) => {
    try {
        const { id } = req.params;
        const parkingSpot = await ParkingSpot.findById(id);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }

        if (parkingSpot.currentOccupancy >= parkingSpot.capacity) {
            return res.status(400).json({ message: 'Parking spot is full.' });
        }

        // Increase current occupancy
        parkingSpot.currentOccupancy += 1;
        parkingSpot.isAvailable = parkingSpot.currentOccupancy < parkingSpot.capacity;

        // Update hourly occupancy
        const currentHour = new Date().getHours();
        const occupancyRecord = parkingSpot.hourlyOccupancy.find(record => record.hour === currentHour);
        if (occupancyRecord) {
            occupancyRecord.occupiedSpaces = parkingSpot.currentOccupancy;
        } else {
            parkingSpot.hourlyOccupancy.push({
                hour: currentHour,
                occupiedSpaces: parkingSpot.currentOccupancy
            });
        }

        await parkingSpot.save();
        res.json({ message: 'Check-in successful.', parkingSpot });
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).json({ message: 'Server Error: Unable to check in.' });
    }
});
// GET /api/parking/:id/busy-level
// Returns the estimated busy level at a given arrival time
router.get('/:id/busy-level', async (req, res) => {
    try {
        const { id } = req.params;
        const { arrivalTime } = req.query;

        const parkingSpot = await ParkingSpot.findById(id);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }

        // Since arrivalTime is in 'HH:mm' format, extract the hour
        const [hourString, minuteString] = arrivalTime.split(':');
        const arrivalHour = parseInt(hourString, 10);

        // Find occupancy record for the arrival hour
        const occupancyRecord = parkingSpot.hourlyOccupancy.find(record => record.hour === arrivalHour);
        let busyLevel;
        if (occupancyRecord) {
            busyLevel = (occupancyRecord.occupiedSpaces / parkingSpot.capacity) * 100;
        } else {
            // If no record, assume current occupancy
            busyLevel = (parkingSpot.currentOccupancy / parkingSpot.capacity) * 100;
        }

        res.json({ busyLevel: busyLevel.toFixed(2) });
    } catch (error) {
        console.error('Error fetching busy level:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch busy level.' });
    }
});

// GET /api/parking/:id
// Returns the details of a specific parking spot
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const parkingSpot = await ParkingSpot.findById(id);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }
        res.json(parkingSpot);
    } catch (error) {
        console.error('Error fetching parking spot:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch parking spot.' });
    }
});


// POST /api/parking/:id/checkout
// Decreases the occupancy count when a user checks out
router.post('/:id/checkout', async (req, res) => {
    try {
        const { id } = req.params;
        const parkingSpot = await ParkingSpot.findById(id);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }

        if (parkingSpot.currentOccupancy > 0) {
            parkingSpot.currentOccupancy -= 1;
            parkingSpot.isAvailable = true;
        }

        // Update hourly occupancy
        const currentHour = new Date().getHours();
        const occupancyRecord = parkingSpot.hourlyOccupancy.find(record => record.hour === currentHour);
        if (occupancyRecord) {
            occupancyRecord.occupiedSpaces = parkingSpot.currentOccupancy;
        } else {
            parkingSpot.hourlyOccupancy.push({
                hour: currentHour,
                occupiedSpaces: parkingSpot.currentOccupancy
            });
        }

        await parkingSpot.save();
        res.json({ message: 'Check-out successful.', parkingSpot });
    } catch (error) {
        console.error('Error during check-out:', error);
        res.status(500).json({ message: 'Server Error: Unable to check out.' });
    }
});

// POST /api/parking/:id/feedback
// Submits feedback for a specific parking spot
router.post('/:id/feedback', async (req, res) => {
    const { id } = req.params;
    const { busy, spacesLeft } = req.body;

    try {
        const parkingSpot = await ParkingSpot.findById(id);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }

        // Update occupancy based on feedback
        if (typeof spacesLeft === 'number' && !isNaN(spacesLeft)) {
            parkingSpot.currentOccupancy = parkingSpot.capacity - spacesLeft;
            parkingSpot.isAvailable = parkingSpot.currentOccupancy < parkingSpot.capacity;
        }

        // Update busy status
        if (busy === 'yes') {
            parkingSpot.busy = true;
            parkingSpot.busyLevel += 1;
        } else if (busy === 'no') {
            parkingSpot.busy = false;
        } else {
            return res.status(400).json({ message: 'Invalid feedback value for busy.' });
        }

        await parkingSpot.save();

        res.json({ message: 'Feedback received and parking spot updated.', parkingSpot });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server Error: Unable to submit feedback.' });
    }
});

module.exports = router;