// MongoDB connection disabled: provide a safe no-op connect function.
// This prevents the server from exiting if `MONGO_URI` is not set.
const connectDB = async () => {
  if (process.env.MONGO_URI) {
    console.log('MONGO_URI is set but MongoDB connection has been intentionally disabled.');
  } else {
    console.log('MongoDB connection disabled — skipping connect.');
  }
};

module.exports = connectDB;
