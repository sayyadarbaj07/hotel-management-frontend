import express from "express";
import * as guestController from "./guest.controller.js";
import { verifyJWT, authorizeRoles } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Require user to be logged in for all guest routes
router.use(verifyJWT);

router.post("/add-guests", authorizeRoles("admin", "receptionist"), guestController.createGuest);
router.get("/getallguests", authorizeRoles("admin", "receptionist", "housekeeping"), guestController.getGuests);
router.get("/getguests/:id", authorizeRoles("admin", "receptionist"), guestController.getGuestById);
router.put("/updateguests/:id", authorizeRoles("admin", "receptionist"), guestController.updateGuest);
router.delete("/deleteguests/:id", authorizeRoles("admin"), guestController.deleteGuest);
router.get("/searchguests", authorizeRoles("admin", "receptionist", "housekeeping"), guestController.searchGuest);
export default router;
