import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    // console.log('Already connected to MongoDB');
    return;
  }

  try {
    // Check if MONGODB_URI exists
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // console.log('Connecting to MongoDB with URI:', uri.substring(0, 20) + '...'); // Show partial URI for debugging
    
    await mongoose.connect(uri);
    isConnected = true;
    // console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    // console.error('❌ Error connecting to MongoDB:', error.message);
    throw error;
  }
}
