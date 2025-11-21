import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './Routes/auth.js';
import usersRoutes from './Routes/user.js';
import doctorsRoutes from './Routes/doctor.js';
import reviewRoutes from './Routes/review.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true
};

app.get('/', (req, res) => {
  res.send('API is running...');
});

// DB Connection
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoutes); // ← seule route, en import ESM
app.use('/api/v1/users', usersRoutes); // ← seule route, en import ESM
app.use('/api/v1/doctors', doctorsRoutes); // ← seule route, en import ESM
app.use('/api/v1/reviews', reviewRoutes); // ← seule route, en import ESM



app.listen(port, () => {
  connectDB();
  console.log('Server started on port ' + port);
});
