const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Import Routes
const parkingRoutes = require('./routes/parkingRoutes');
const occupancyRoutes = require('./routes/occupancyRoutes'); // Optional

// Use Routes
app.use('/api/parking', parkingRoutes);
app.use('/api/parking/occupancy', occupancyRoutes); // Optional

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));