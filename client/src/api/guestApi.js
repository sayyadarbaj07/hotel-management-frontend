import axiosInstance from "../components/auth/axios";

// GET /api/guests/getallguests
export const getGuests = () => axiosInstance.get("/guests/getallguests");

// GET /api/guests/getguests/:id
export const getGuestById = (id) => axiosInstance.get(`/guests/getguests/${id}`);

// GET /api/guests/searchguests?search=
export const searchGuests = (query) => axiosInstance.get(`/guests/searchguests?search=${encodeURIComponent(query)}`);

// POST /api/guests/add-guests
export const createGuest = (data) => axiosInstance.post("/guests/add-guests", data);

// PUT /api/guests/updateguests/:id
export const updateGuest = (id, data) => axiosInstance.put(`/guests/updateguests/${id}`, data);

// DELETE /api/guests/deleteguests/:id
export const deleteGuest = (id) => axiosInstance.delete(`/guests/deleteguests/${id}`);
