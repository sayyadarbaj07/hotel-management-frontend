import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        idType: {
            type: String,
            required: true,
            enum: ["passport", "aadhaar", "driving_license", "voter_id"],
        },
        idNumber: {
            type: String,
            required: true,
            trim: true,
        },
        nationality: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            country: { type: String, trim: true },
            pincode: { type: String, trim: true },
        },
        totalStays: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

export const Guest = mongoose.model("Guest", guestSchema);
