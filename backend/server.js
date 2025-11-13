require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/utils/db');
const userRoutes = require('./src/routes/user');

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());

// CORS: cho phép frontend (FRONTEND_URL trong .env)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/user', userRoutes);

// Health
app.get('/', (req, res) => res.send('API is running'));

// Start
const PORT = process.env.PORT || 5000;

// Prefer MONGO_URI from env, fallback to local MongoDB for development
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ia03';

if (!process.env.MONGO_URI) {
  console.warn('Warning: MONGO_URI not set in environment, falling back to local MongoDB at', MONGO_URI);
}

connectDB(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
