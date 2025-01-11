"use strict";
import { Router } from "express";
import generoController from "../controllers/genero.controller.js";

const router = Router();

// Rutas para los géneros
router.get("/", generoController.getGeneros);
router.post("/", generoController.createGenero);
router.get("/:id", generoController.getGeneroById);
router.put("/:id", generoController.updateGenero);
router.delete("/:id", generoController.deleteGenero);

export default router;
