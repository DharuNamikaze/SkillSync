import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.warn('MONGODB_URI is not set. Backend will start without DB.');
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || undefined,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
