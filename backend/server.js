// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'], // Frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    });

// Basic Route to Verify Backend is Running
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Import Parking Routes
const parkingRoutes = require('./routes/parkingRoutes');

// Use Parking Routes under /api/parking
app.use('/api/parking', parkingRoutes);

// Handle Undefined Routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found.' });
});

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));