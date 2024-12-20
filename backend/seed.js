//backend/ seed.js

require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const ParkingSpot = require('./models/ParkingSpot');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected for seeding.');
        seedDB();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

async function seedDB() {
    try {
        await ParkingSpot.deleteMany({});
        console.log('Existing parking spots removed.');

        const parkingSpots = [
            {
                name: 'Overflow Parking',
                coordinates: { lat: 53.385323, lng: -6.606064 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 100, // You can adjust the capacity as needed
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Eolas General Parking',
                coordinates: { lat: 53.385483, lng: -6.603352 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 80,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },

            {
                name: 'Iontas Parking',
                coordinates: { lat: 53.385294, lng: -6.601021 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 70,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Student Accommodation Overflow',
                coordinates: { lat: 53.387008, lng: -6.601286 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 120,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Student Accommodation General',
                coordinates: { lat: 53.386528, lng: -6.598951 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 100,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'North Campus East Carpark',
                coordinates: { lat: 53.384081, lng: -6.597026 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 150,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Education Building Car Park',
                coordinates: { lat: 53.382649, lng: -6.597948 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 80,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'staff'
            },
            {
                name: 'Kilcock Road Parking',
                coordinates: { lat: 53.381344, lng: -6.602445 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 90,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Library Parking',
                coordinates: { lat: 53.381481, lng: -6.600781 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 60,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'South Campus Logic House Green Parking',
                coordinates: { lat: 53.378528, lng: -6.594985 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 70,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'South Campus Staff Parking',
                coordinates: { lat: 53.379839, lng: -6.594029 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 50,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'staff'
            },
            {
                name: 'Loftus Hall Parking',
                coordinates: { lat: 53.378496, lng: -6.597645 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 40,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Aldi Max 2 Hour Parking',
                coordinates: { lat: 53.381994, lng: -6.597195 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 30,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Shopping Centre Parking',
                coordinates: { lat: 53.382265, lng: -6.595879 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 100,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Maynooth GAA Pitch Parking',
                coordinates: { lat: 53.392462, lng: -6.599201 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 80,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Eolas Staff Parking',
                coordinates: { lat: 53.385500, lng: -6.601992 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 50,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'staff' // Updated to 'staff'
            },
            {
                name: 'Education Building Car Park',
                coordinates: { lat: 53.382649, lng: -6.597948 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 80,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'staff' // Updated to 'staff'
            },
            // New staff parking spots
            {
                name: 'Rye Hall Staff Parking',
                coordinates: { lat: 53.385028, lng: -6.598246 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 40,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'staff'
            },
            {
                name: 'Auxilla House Staff Parking',
                coordinates: { lat: 53.383886, lng: -6.598039 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 30,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'staff'
            },
            {
                name: 'Library Staff Parking',
                coordinates: { lat: 53.381584, lng: -6.599895 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 25,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'staff'
            },
            // New visitor parking spots
            {
                name: 'Visitor Parking 1',
                coordinates: { lat: 53.384677, lng: -6.597538 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 50,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'visitor'
            },
            {
                name: 'Student Union Parking',
                coordinates: { lat: 53.382368, lng: -6.603550 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 50,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'general'
            },
            {
                name: 'Visitor Parking 2',
                coordinates: { lat: 53.383902, lng: -6.603124 },
                isAvailable: true,
                busy: false,
                busyLevel: 0,
                capacity: 50,
                currentOccupancy: 0,
                hourlyOccupancy: [],
                type: 'visitor'
            }
            // Add more parking spots as needed ,
        ];

        await ParkingSpot.insertMany(parkingSpots);
        console.log('Database seeded with parking spots.');
        mongoose.connection.close();
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error('Validation Error:', error.message);
        } else {
            console.error('Error seeding the database:', error);
        }
        mongoose.connection.close();
    }
}