import express from "express";
import * as roomTypeController from "./roomType.controller.js";
import * as roomController from "./room.controller.js";
import { verifyJWT, authorizeRoles } from "../../middleware/auth.middleware.js";

const router = express.Router();

// --- RoomType Routes ---
router.post("/create-room-types", verifyJWT, authorizeRoles("admin"), roomTypeController.createRoomType);
router.get("/get-room-types", verifyJWT, roomTypeController.getRoomTypes);
router.put("/update-room-types/:id", verifyJWT, authorizeRoles("admin"), roomTypeController.updateRoomType);
router.delete("/delete-room-types/:id", verifyJWT, authorizeRoles("admin"), roomTypeController.deleteRoomType);

// --- Room Routes ---
router.post("/create-room", verifyJWT, authorizeRoles("admin"), roomController.createRoom);
router.get("/get-rooms", verifyJWT, roomController.getRooms);
router.get("/get-available-rooms", verifyJWT, roomController.getAvailableRooms);
router.get("/rooms/:id", verifyJWT, roomController.getRoom);
router.put("/updateroom/:id", verifyJWT, authorizeRoles("admin"), roomController.updateRoom);
router.patch("/update-room-status/:id", verifyJWT, authorizeRoles("admin", "receptionist"), roomController.updateRoomStatus);
router.delete("/delete-room/:id", verifyJWT, authorizeRoles("admin"), roomController.deleteRoom);

export default router;
