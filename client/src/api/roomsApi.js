/**
 * roomsApi.js
 * ──────────────────────────────────────────────────────────────
 * Currently uses mock data. When backend is ready, replace
 * the mock functions with the Axios calls shown in comments.
 * The function signatures stay exactly the same — no UI changes needed.
 * ──────────────────────────────────────────────────────────────
 */

import axiosInstance from "../components/auth/axios";

// ============================================================================
// ROOM TYPES API
// ============================================================================

// GET /api/rooms/get-room-types
export const getRoomTypes = () => axiosInstance.get("/rooms/get-room-types");

// POST /api/rooms/create-room-types
export const createRoomType = (data) => axiosInstance.post("/rooms/create-room-types", data);

// PUT /api/rooms/update-room-types/:id
export const updateRoomType = (id, data) => axiosInstance.put(`/rooms/update-room-types/${id}`, data);

// DELETE /api/rooms/delete-room-types/:id
export const deleteRoomType = (id) => axiosInstance.delete(`/rooms/delete-room-types/${id}`);

// ============================================================================
// ROOMS API
// ============================================================================

// GET /api/rooms/get-rooms
export const getRooms = () => axiosInstance.get("/rooms/get-rooms");

// GET /api/rooms/rooms/:id
export const getRoomById = (id) => axiosInstance.get(`/rooms/rooms/${id}`);

// POST /api/rooms/create-room
export const createRoom = (data) => axiosInstance.post("/rooms/create-room", data);

// PUT /api/rooms/updateroom/:id
export const updateRoom = (id, data) => axiosInstance.put(`/rooms/updateroom/${id}`, data);

// PATCH /api/rooms/update-room-status/:id
export const updateRoomStatus = (id, status) => axiosInstance.patch(`/rooms/update-room-status/${id}`, { status });

// DELETE /api/rooms/delete-room/:id
export const deleteRoom = (id) => axiosInstance.delete(`/rooms/delete-room/${id}`);

// GET /api/rooms/get-available-rooms
export const getAvailableRooms = () => axiosInstance.get("/rooms/get-available-rooms");
