import { RoomType } from "./roomType.model.js";
import { Room } from "./room.model.js";
import { ApiError } from "../../utils/apiError.js";

// --- RoomType Services ---

export const createRoomType = async (data) => {
    const { name, bedType, pricePerNight, maxOccupancy, amenities, description, images } = data;

    const exists = await RoomType.findOne({ name });
    if (exists) {
        throw new ApiError(409, "Room type with this name already exists");
    }

    const roomType = await RoomType.create({
        name,
        bedType,
        pricePerNight,
        maxOccupancy,
        amenities,
        description,
        images,
    });
    return roomType;
};

export const getAllRoomTypes = async () => {
    return await RoomType.find({ isActive: true });
};

export const updateRoomType = async (id, updateData) => {
    const roomType = await RoomType.findByIdAndUpdate(
        id,
        { $set: updateData },
        { returnDocument: "after", runValidators: true }
    );
    if (!roomType) {
        throw new ApiError(404, "Room type not found");
    }
    return roomType;
};

export const deleteRoomType = async (id) => {
    // Check if any rooms are using this room type
    const roomsUsingType = await Room.countDocuments({ roomType: id });
    if (roomsUsingType > 0) {
        throw new ApiError(
            400,
            `Cannot delete: ${roomsUsingType} room(s) are currently using this room type`
        );
    }

    const roomType = await RoomType.findByIdAndDelete(id);
    if (!roomType) {
        throw new ApiError(404, "Room type not found");
    }
    return roomType;
};
