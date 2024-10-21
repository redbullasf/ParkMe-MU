// backend/seed.js

const mongoose = require('mongoose');
const ParkingSpot = require('./models/ParkingSpot');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected for seeding.'))
    .catch(err => console.log('MongoDB connection error:', err));

// Parking spot data
const parkingSpots = [
    {
        name: 'North Campus Lot',
        coordinates: { lat: 53.3825, lng: -6.5940 },
        isAvailable: true,
    },
    {
        name: 'Student Union Car Park',
        coordinates: { lat: 53.382194, lng: -6.603497 },
        isAvailable: false,
    },
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


    //overflow: 53.385323, -6.606064   eolas general: 53.385483, -6.603352  pheonix paid: 53.383842, -6.603087 eolas staff: 53.385500, -6.601992  iontas parking: 53.385294, -6.601021 Student Accomidation overflow : 53.387008, -6.601286  student accomidation genral : 53.386528, -6.598951 north campus east carpark: 53.384081, -6.597026 education building car park: 53.382649, -6.597948 kilkock road parking: 53.381344, -6.602445 library parking : 53.381481, -6.600781 south campus logic house green parking: 53.378528, -6.594985 south campus pearsons staff parking : 53.379839, -6.594029 loftus hall parking :53.378496, -6.597645 aldi Max 2 hour parking : 53.381994, -6.597195 shopping centre paid parking : 53.382265, -6.595879 maynooth gaa pitch: 53.392462, -6.599201
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
