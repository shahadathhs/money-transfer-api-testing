import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongodbURL = 'mongodb://localhost:27017/moneyTransferDB';
    await mongoose.connect(mongodbURL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
