import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Check for placeholder values
const isPlaceholder = MONGODB_URI.includes('<username>') || MONGODB_URI.includes('<password>');

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Already connected — return immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Connection is fully disconnected (readyState 3) — reset so we try again cleanly.
  // We do NOT reset for readyState 0 (initial) or 2 (connecting), as a promise
  // may already be in-flight; resetting it would cause duplicate connection attempts.
  if (cached.conn && mongoose.connection.readyState === 3) {
    console.log('MongoDB connection was disconnected. Resetting cache to reconnect.');
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 1, // Standard for serverless to prevent connection saturation
      minPoolSize: 0,
    };

    console.log('Creating new MongoDB connection promise...');
    const start = performance.now();
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      const end = performance.now();
      console.log(`MongoDB connection established in ${(end - start).toFixed(2)}ms`);
      return mongoose;
    });
  }

  try {
    const start = performance.now();
    console.log('Awaiting MongoDB connection...');
    cached.conn = await cached.promise;
    const end = performance.now();
    console.log(`Connection ready in ${(end - start).toFixed(2)}ms`);
  } catch (e: any) {
    console.error('MongoDB connection error details:', {
      message: e?.message,
      code: e?.code,
      name: e?.name
    });
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
