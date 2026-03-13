import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        floor: {
            type: Number,
            required: true,
        },
        roomType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RoomType",
            required: true,
        },
        status: {
            type: String,
            enum: ["available", "occupied", "maintenance", "reserved", "cleaning"],
            default: "available",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

export const Room = mongoose.model("Room", roomSchema);
