import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── Edit these if you want different credentials ──
const ADMIN = {
    name: "Admin",
    email: "admin@hotel.com",
    password: "Admin@123",
    phone: "9999999999",
    role: "admin",
    isActive: true,
};
// ─────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    phone: String,
    isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        const exists = await User.findOne({ email: ADMIN.email });
        if (exists) {
            console.log("⚠️  Admin already exists:", exists.email);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN.password, salt);

        await User.create({ ...ADMIN, password: hashedPassword });

        console.log("✅ Admin created successfully!");
        console.log("   Email:   ", ADMIN.email);
        console.log("   Password:", ADMIN.password);
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

createAdmin();
