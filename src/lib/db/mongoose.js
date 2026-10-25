import mongoose from 'mongoose';
import { env } from '../config/env.js';


const connectDB = async () => {
    try {
        await mongoose.connect(env.db.url, { serverSelectionTimeoutMS: 10000 });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        throw err;
    }
};

export default connectDB;