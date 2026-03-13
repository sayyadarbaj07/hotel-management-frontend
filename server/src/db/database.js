import mongoose from "mongoose";
import dns from "dns";

export const connectDB = async () => {
    try {
        // Force Node to use Google's public DNS to bypass local Windows DNS/ISP issues with SRV records
        dns.setServers(['8.8.8.8', '8.8.4.4']);

        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

        console.log(
            `✅ Database Connected | Host: ${connectionInstance.connection.host} | DB: ${connectionInstance.connection.name}`
        );

    } catch (err) {
        console.error("Database Connection Failed:", err.message);
        process.exit(1);
    }
};
