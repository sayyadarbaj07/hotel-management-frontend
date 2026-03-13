import { User } from "../modules/user/user.model.js";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
    try {
        const existing = await User.findOne({ role: "admin" });
        if (existing) {
            console.log("✅ Admin already exists:", existing.email);
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

        await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            phone: process.env.ADMIN_PHONE,
            role: "admin",
            isActive: true,
        });

        console.log("✅ Admin seeded successfully:", process.env.ADMIN_EMAIL);
    } catch (err) {
        console.error("❌ Admin seed failed:", err.message);
    }
};
