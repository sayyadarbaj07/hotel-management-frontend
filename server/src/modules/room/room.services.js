import { Room } from "./room.model.js";
import { ApiError } from "../../utils/apiError.js";

// --- Room Services ---

export const createRoom = async (data) => {
    const { roomNumber, floor, roomType } = data;

    const exists = await Room.findOne({ roomNumber });
    if (exists) {
        throw new ApiError(409, "Room with this number already exists");
    }

    const room = await Room.create({ roomNumber, floor, roomType });
    return room;
};

export const getAllRooms = async () => {
    return await Room.find({ isActive: true }).populate("roomType");
};

export const getRoomById = async (id) => {
    const room = await Room.findById(id).populate("roomType");
    if (!room) {
        throw new ApiError(404, "Room not found");
    }
    return room;
};

export const updateRoom = async (id, updateData) => {
    const room = await Room.findByIdAndUpdate(
        id,
        { $set: updateData },
        { returnDocument: "after", runValidators: true }
    ).populate("roomType");

    if (!room) {
        throw new ApiError(404, "Room not found");
    }
    return room;
};

export const updateRoomStatus = async (id, status) => {
    const validStatuses = ["available", "occupied", "maintenance", "reserved", "cleaning"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const room = await Room.findByIdAndUpdate(
        id,
        { $set: { status } },
        { returnDocument: "after", runValidators: true }
    ).populate("roomType");

    if (!room) {
        throw new ApiError(404, "Room not found");
    }
    return room;
};

export const deleteRoom = async (id) => {
    const room = await Room.findByIdAndUpdate(
        id,
        { $set: { isActive: false } },
        { returnDocument: "after" }
    );

    if (!room) {
        throw new ApiError(404, "Room not found");
    }
    return room;
};

export const getAvailableRooms = async (checkIn, checkOut) => {
    const rooms = await Room.find({
        status: "available",
        isActive: true,
    }).populate("roomType");

    return rooms;
};
