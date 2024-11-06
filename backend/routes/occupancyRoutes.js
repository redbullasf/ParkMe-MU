// routes/occupancyRoutes.js

const express = require('express');
const router = express.Router();
const ParkingSpot = require('../models/ParkingSpot');

// GET /api/occupancy
// Retrieves occupancy data for all parking spots
router.get('/', async (req, res) => {
    try {
        const parkingSpots = await ParkingSpot.find({});
        const occupancyData = parkingSpots.map(spot => ({
            name: spot.name,
            capacity: spot.capacity,
            currentOccupancy: spot.currentOccupancy,
            hourlyOccupancy: spot.hourlyOccupancy
        }));
        res.json(occupancyData);
    } catch (error) {
        console.error('Error fetching occupancy data:', error);
        res.status(500).json({ message: 'Server Error: Unable to fetch occupancy data.' });
    }
});

// POST /api/occupancy/:id
// Manually updates occupancy data for a parking spot
router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hour, occupiedSpaces } = req.body;

        const parkingSpot = await ParkingSpot.findById(id);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }

        // Validate hour and occupiedSpaces
        if (hour < 0 || hour > 23 || occupiedSpaces < 0 || occupiedSpaces > parkingSpot.capacity) {
            return res.status(400).json({ message: 'Invalid hour or occupied spaces.' });
        }

        // Update the hourly occupancy
        const existingRecord = parkingSpot.hourlyOccupancy.find(record => record.hour === hour);
        if (existingRecord) {
            existingRecord.occupiedSpaces = occupiedSpaces;
        } else {
            parkingSpot.hourlyOccupancy.push({ hour, occupiedSpaces });
        }

        // Update current occupancy if it's the current hour
        const currentHour = new Date().getHours();
        if (hour === currentHour) {
            parkingSpot.currentOccupancy = occupiedSpaces;
            parkingSpot.isAvailable = parkingSpot.currentOccupancy < parkingSpot.capacity;
        }

        await parkingSpot.save();
        res.json({ message: 'Occupancy data updated successfully.', parkingSpot });
    } catch (error) {
        console.error('Error updating occupancy data:', error);
        res.status(500).json({ message: 'Server Error: Unable to update occupancy data.' });
    }
});

module.exports = router;