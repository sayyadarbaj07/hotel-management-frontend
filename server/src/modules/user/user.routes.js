import express from "express";
import * as userController from "./user.controller.js";
import { verifyJWT, authorizeRoles } from "../../middleware/auth.middleware.js";

const router = express.Router();

// --- Auth Routes ---
// Public routes
router.post("/auth/login", userController.login);

// Admin-only auth routes
router.post("/auth/register", verifyJWT, authorizeRoles("admin"), userController.register);

// Authenticated auth routes
router.post("/auth/logout", verifyJWT, userController.logout);
router.get("/auth/me", verifyJWT, userController.getMe);
router.put("/auth/change-password", verifyJWT, userController.changePassword);

// --- User Routes ---
// Admin only routes for managing users
router.get("/users", verifyJWT, authorizeRoles("admin"), userController.getUsers);
router.put("/update/:id", verifyJWT, authorizeRoles("admin"), userController.updateUser);
router.delete("/delete/:id", verifyJWT, authorizeRoles("admin"), userController.deleteUser);

export default router;