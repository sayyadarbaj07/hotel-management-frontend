import * as guestService from "./guest.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const createGuest = asyncHandler(async (req, res) => {
    const guest = await guestService.registerGuest(req.body);
    res.status(201).json(new ApiResponse(201, { guest }, "Guest registered successfully"));
});

export const getGuests = asyncHandler(async (req, res) => {
    const guests = await guestService.getAllGuests();
    res.status(200).json(new ApiResponse(200, { guests }, "Guests fetched successfully"));
});

export const getGuestById = asyncHandler(async (req, res) => {
    const guest = await guestService.getGuestById(req.params.id);
    res.status(200).json(new ApiResponse(200, { guest }, "Guest fetched successfully"));
});

export const updateGuest = asyncHandler(async (req, res) => {
    const guest = await guestService.updateGuest(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, { guest }, "Guest updated successfully"));
});

export const deleteGuest = asyncHandler(async (req, res) => {
    const guest = await guestService.deleteGuest(req.params.id);
    res.status(200).json(new ApiResponse(200, { guest }, "Guest deleted successfully"));
});
export const searchGuest = asyncHandler(async (req,res)=>
{
    const search = await guestService.searchGuest(req.query.search)
    res.status(200).json(new ApiResponse(200, { search }, "Guest fetched successfully"));
})