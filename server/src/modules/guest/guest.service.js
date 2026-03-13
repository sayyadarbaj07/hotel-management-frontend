import { Guest } from "./guest.model.js";
import { ApiError } from "../../utils/apiError.js";

export const registerGuest = async (guestData) => {
    // Check if guest already exists by ID Number (optional, but good practice)
    const existingGuest = await Guest.findOne({ idNumber: guestData.idNumber });
    if (existingGuest) {
        throw new ApiError(409, `Guest with ID ${guestData.idNumber} already exists`);
    }

    const newGuest = await Guest.create(guestData);
    return newGuest;
};

export const getAllGuests = async () => {
    return await Guest.find();
};

export const getGuestById = async (guestId) => {
    const guest = await Guest.findById(guestId);
    if (!guest) {
        throw new ApiError(404, "Guest not found");
    }
    return guest;
};

export const updateGuest = async (guestId, updateData) => {
    const guest = await Guest.findByIdAndUpdate(
        guestId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!guest) {
        throw new ApiError(404, "Guest not found");
    }
    return guest;
};

export const deleteGuest = async (guestId) => {
    const guest = await Guest.findByIdAndDelete(guestId);
    if (!guest) {
        throw new ApiError(404, "Guest not found");
    }
    return guest;
};

export const searchGuest = async (search)=>
{
    let filter = {}
    if(search)
    {
        filter = {
            $or:[
                {firstName:{$regex: search, $options: "i"}},
                {lastName:{$regex: search, $options: "i"}},
                {phone:{$regex: search, $options: "i"}},
                {idNumber:{$regex: search, $options: "i"}}
            ]
        };
    }
    return await Guest.find(filter).sort({createdAt: -1})
}