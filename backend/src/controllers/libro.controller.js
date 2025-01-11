"use strict";
import libroServices from "../services/libro.services.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";

/**
 * Controlador para obtener todos los libros.
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 */
async function getLibros(req, res) {
  try {
    const [libros, error] = await libroServices.getLibros();

    if (error) return respondError(req, res, 404, error);
    respondSuccess(req, res, 200, libros);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener los libros", error.message);
  }
}

/**
 * Controlador para crear un nuevo libro.
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 */
async function createLibro(req, res) {
  try {
    const { body } = req;
    const portada = req.file ? req.file.path : null; // Ruta de la portada si se subió una imagen

    const [nuevoLibro, error] = await libroServices.createLibro({
      ...body,
      portada,
    });

    if (error) return respondError(req, res, 400, error);
    respondSuccess(req, res, 201, nuevoLibro);
  } catch (error) {
    respondError(req, res, 500, "Error al crear el libro", error.message);
  }
}

/**
 * Controlador para obtener un libro por ID.
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 */
async function getLibroById(req, res) {
  try {
    const { id } = req.params;

    const [libro, error] = await libroServices.getLibroById(id);

    if (error) return respondError(req, res, 404, error);
    respondSuccess(req, res, 200, libro);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener el libro", error.message);
  }
}

/**
 * Controlador para eliminar un libro por ID.
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 */
async function deleteLibro(req, res) {
  try {
    const { id } = req.params;

    const [libro, error] = await libroServices.deleteLibro(id);

    if (error) return respondError(req, res, 404, error);
    respondSuccess(req, res, 200, { message: "Libro eliminado exitosamente", libro });
  } catch (error) {
    respondError(req, res, 500, "Error al eliminar el libro", error.message);
  }
}

export default {
  getLibros,
  createLibro,
  getLibroById,
  deleteLibro,
};
