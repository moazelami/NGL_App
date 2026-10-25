import mongoose from 'mongoose';
import { env } from '../config/env.js';


const connectDB = async () => {
    try {
        await mongoose.connect(env.db.url);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;