import mongoose from 'mongoose';

function connectDB() {
    mongoose.connect('mongodb://127.0.0.1:27017/ngl');
}

module.exports = {connectDB};