"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import libroRoutes from "./libro.routes.js";
import generoRoutes from "./genero.routes.js";

const router = Router();

router.use("/users", authenticationMiddleware, userRoutes);
router.use("/auth", authRoutes);
router.use("/libros", libroRoutes);
router.use("/generos", generoRoutes);

export default router;