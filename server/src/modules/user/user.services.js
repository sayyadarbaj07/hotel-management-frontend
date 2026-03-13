import { User } from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/apiError.js";

// Helper to generate JWT
const generateAccessJWT = (userId) => {
    return jwt.sign(
        { _id: userId },
        process.env.JWT_SECRET || "fallback_secret_key",
        { expiresIn: "1d" } // Token expires in 1 day
    );
};

export const registerUser = async (userData) => {
    const { name, email, password, phone, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || "receptionist", // default if not provided
    });

    const createdUser = await User.findById(user._id).select("-password");
    return createdUser;
};

export const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid user credentials");
    }

    if (!user.isActive) {
        throw new ApiError(403, "User account is deactivated");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const accessToken = generateAccessJWT(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    return { user: loggedInUser, token: accessToken };
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save({ validateBeforeSave: false });

    return true;
};

export const getAllUsers = async () => {
    return await User.find().select("-password");
};

export const updateUser = async (userId, updateData) => {
    // Prevent password update through this route
    if (updateData.password) {
        delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { returnDocument: 'after', runValidators: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

export const deleteUser = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { isActive: false } },
        { returnDocument: 'after' }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};