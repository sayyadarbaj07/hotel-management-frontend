import * as userService from "./user.services.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

let options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
};

export const register = asyncHandler(async (req, res) => {
    const user = await userService.registerUser(req.body);
    res.status(201).json(new ApiResponse(201, { user }, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    res.status(200)
        .cookie("token", token, options)
        .json(new ApiResponse(200, { user }, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
    res.status(200)
        .clearCookie("token", options)
        .json(new ApiResponse(200, {}, "Logout successful"));
});

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, { user: req.user }, "User profile fetched successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, oldPassword, newPassword);
    res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

export const getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(new ApiResponse(200, { users }, "Users fetched successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await userService.updateUser(userId, updateData);
    res.status(200).json(new ApiResponse(200, { user: updatedUser }, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const deletedUser = await userService.deleteUser(userId);
    res.status(200).json(new ApiResponse(200, { user: deletedUser }, "User deleted successfully"));
});