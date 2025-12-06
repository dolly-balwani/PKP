require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const counsellorRoutes = require('./routes/counsellorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/counsellors', counsellorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ message: 'API is running successfully' });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
