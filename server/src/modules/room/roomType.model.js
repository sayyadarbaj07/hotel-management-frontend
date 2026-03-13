import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        bedType: {
            type: String,
            enum: ["Single", "Double", "Twin", "Triple", "King", "Queen"],
            required: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
        },
        maxOccupancy: {
            type: Number,
            required: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const RoomType = mongoose.model("RoomType", roomTypeSchema);
