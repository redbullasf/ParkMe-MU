// server.js

require('dotenv').config(); // Load environment variables at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const parkingRoutes = require('./routes/parkingRoutes');
const occupancyRoutes = require('./routes/occupancyRoutes');

// Use Routes
app.use('/api/parking', parkingRoutes);
app.use('/api/occupancy', occupancyRoutes);

// Start the server
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected.');
        // Only start the server after successful database connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process with an error code
    });

// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'API endpoint not found.' });
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
});