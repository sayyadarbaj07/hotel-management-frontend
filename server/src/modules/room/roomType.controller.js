import * as roomTypeService from "./roomType.services.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const createRoomType = asyncHandler(async (req, res) => {
    const roomType = await roomTypeService.createRoomType(req.body);
    res.status(201).json(new ApiResponse(201, { roomType }, "Room type created successfully"));
});

export const getRoomTypes = asyncHandler(async (req, res) => {
    const roomTypes = await roomTypeService.getAllRoomTypes();
    res.status(200).json(new ApiResponse(200, { roomTypes }, "Room types fetched successfully"));
});

export const updateRoomType = asyncHandler(async (req, res) => {
    const roomType = await roomTypeService.updateRoomType(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, { roomType }, "Room type updated successfully"));
});

export const deleteRoomType = asyncHandler(async (req, res) => {
    await roomTypeService.deleteRoomType(req.params.id);
    res.status(200).json(new ApiResponse(200, {}, "Room type deleted successfully"));
});
