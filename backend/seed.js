// seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ParkingSpot = require('./models/ParkingSpot');

// Load environment variables
dotenv.config();

const seedParkingSpots = [
    {
        name: 'Main Parking Lot',
        coordinates: { lat: 53.3811, lng: -6.5918 }
    },
    {
        name: 'East Wing Parking',
        coordinates: { lat: 53.3805, lng: -6.5932 }
    },
    {
        name: 'West Gate Parking',
        coordinates: { lat: 53.3799, lng: -6.5905 }
    },
    // Add more parking spots as needed
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected for seeding.');

        // Clear existing parking spots
        await ParkingSpot.deleteMany({});
        console.log('Existing parking spots removed.');

        // Insert seed data
        await ParkingSpot.insertMany(seedParkingSpots);
        console.log('Seed parking spots inserted.');

        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    } catch (err) {
        console.error('Error seeding the database:', err);
    }
};

seedDB();
