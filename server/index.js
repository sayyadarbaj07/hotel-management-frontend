import express from "express";


import dotenv from "dotenv";
import { server } from "./server.js";
import { connectDB } from "./src/db/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server regardless of DB connection
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Try to connect to DB, but don't block server startup
connectDB()
    .catch((err) => console.log("⚠️ Database connection failed (server running without DB):", err.message));

