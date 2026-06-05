const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.log(
      `❌ Database Error: ${error.message}`
    );
    console.log(process.env.GEMINI_API_KEY);

    process.exit(1);
  }
};

module.exports = connectDB;