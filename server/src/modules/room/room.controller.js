import * as roomService from "./room.services.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const createRoom = asyncHandler(async (req, res) => {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(new ApiResponse(201, { room }, "Room created successfully"));
});

export const getRooms = asyncHandler(async (req, res) => {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(new ApiResponse(200, { rooms }, "Rooms fetched successfully"));
});

export const getRoom = asyncHandler(async (req, res) => {
    const room = await roomService.getRoomById(req.params.id);
    res.status(200).json(new ApiResponse(200, { room }, "Room fetched successfully"));
});

export const updateRoom = asyncHandler(async (req, res) => {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, { room }, "Room updated successfully"));
});

export const updateRoomStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const room = await roomService.updateRoomStatus(req.params.id, status);
    res.status(200).json(new ApiResponse(200, { room }, "Room status updated successfully"));
});

export const deleteRoom = asyncHandler(async (req, res) => {
    await roomService.deleteRoom(req.params.id);
    res.status(200).json(new ApiResponse(200, {}, "Room removed from inventory"));
});

export const getAvailableRooms = asyncHandler(async (req, res) => {
    const { checkIn, checkOut } = req.query;
    const rooms = await roomService.getAvailableRooms(checkIn, checkOut);
    res.status(200).json(new ApiResponse(200, { rooms }, "Available rooms fetched successfully"));
});
