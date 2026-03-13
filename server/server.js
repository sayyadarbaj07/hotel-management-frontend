import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./src/modules/user/user.routes.js";
import guestRoutes from "./src/modules/guest/guest.routes.js";
import roomRoutes from "./src/modules/room/room.routes.js";

export const server = express();

// Middleware
server.use(express.json());
server.use(cookieParser());

// Routes
server.use("/api/users", userRoutes);
server.use("/api/rooms", roomRoutes);
server.use("/api/guests", guestRoutes);

// Global Error Handler
server.use((err, req, res, next) => {
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }

    // Fallback for unexpected errors
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

server.get("/", (req, res) => {
    res.send("Server running 🚀");
});

