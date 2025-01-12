"use strict";
import { Router } from "express";
import libroController from "../controllers/libro.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

// Rutas para los libros
router.get("/", libroController.getLibros);
router.post("/", upload.single("portada"), libroController.createLibro);
router.get("/:id", libroController.getLibroById);
router.delete("/:id", libroController.deleteLibro);
router.get("/search/:term", libroController.searchLibros);

export default router;
