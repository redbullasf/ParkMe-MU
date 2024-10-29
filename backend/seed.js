// backend/seed.js

const mongoose = require('mongoose');
const ParkingSpot = require('./models/ParkingSpot');
require('dotenv').config();

// Debugging: Check what ParkingSpot is
console.log('ParkingSpot Model:', ParkingSpot);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected for seeding.'))
    .catch(err => console.log('MongoDB connection error:', err));

// Updated parking spot data
const parkingSpots = [
    {
        name: 'Overflow Parking',
        coordinates: { lat: 53.385323, lng: -6.606064 },
        isAvailable: true,
    },
    {
        name: 'Eolas General Parking',
        coordinates: { lat: 53.385483, lng: -6.603352 },
        isAvailable: true,
    },
    {
        name: 'Phoenix Paid Parking',
        coordinates: { lat: 53.383842, lng: -6.603087 },
        isAvailable: true,
    },
    {
        name: 'Eolas Staff Parking',
        coordinates: { lat: 53.385500, lng: -6.601992 },
        isAvailable: true,
    },
    {
        name: 'Iontas Parking',
        coordinates: { lat: 53.385294, lng: -6.601021 },
        isAvailable: true,
    },
    {
        name: 'Student Accommodation Overflow',
        coordinates: { lat: 53.387008, lng: -6.601286 },
        isAvailable: true,
    },
    {
        name: 'Student Accommodation General',
        coordinates: { lat: 53.386528, lng: -6.598951 },
        isAvailable: true,
    },
    {
        name: 'North Campus East Carpark',
        coordinates: { lat: 53.384081, lng: -6.597026 },
        isAvailable: true,
    },
    {
        name: 'Education Building Car Park',
        coordinates: { lat: 53.382649, lng: -6.597948 },
        isAvailable: true,
    },
    {
        name: 'Kilcock Road Parking',
        coordinates: { lat: 53.381344, lng: -6.602445 },
        isAvailable: true,
    },
    {
        name: 'Library Parking',
        coordinates: { lat: 53.381481, lng: -6.600781 },
        isAvailable: true,
    },
    {
        name: 'South Campus Logic House Green Parking',
        coordinates: { lat: 53.378528, lng: -6.594985 },
        isAvailable: true,
    },
    {
        name: 'South Campus Pearsons Staff Parking',
        coordinates: { lat: 53.379839, lng: -6.594029 },
        isAvailable: true,
    },
    {
        name: 'Loftus Hall Parking',
        coordinates: { lat: 53.378496, lng: -6.597645 },
        isAvailable: true,
    },
    {
        name: 'Aldi Max 2 Hour Parking',
        coordinates: { lat: 53.381994, lng: -6.597195 },
        isAvailable: true,
    },
    {
        name: 'Shopping Centre Paid Parking',
        coordinates: { lat: 53.382265, lng: -6.595879 },
        isAvailable: true,
    },
    {
        name: 'Maynooth GAA Pitch Parking',
        coordinates: { lat: 53.392462, lng: -6.599201 },
        isAvailable: true,
    },
    // Add any additional parking spots here
];

// Seed function
async function seedDB() {
    try {
        await ParkingSpot.deleteMany({});
        console.log('Existing parking spots removed.');

        await ParkingSpot.insertMany(parkingSpots);
        console.log('Seed parking spots inserted.');

        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    } catch (error) {
        console.error('Error seeding the database:', error);
        mongoose.connection.close();
    }
}

seedDB();