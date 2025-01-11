"use strict";
import libroServices from "../services/libro.services.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";

async function getLibros(req, res) {
  try {
    const [libros, error] = await libroServices.getLibros();

    if (error) return respondError(req, res, 404, error);
    respondSuccess(req, res, 200, libros);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener los libros", error.message);
  }
}

async function createLibro(req, res) {
  try {
    const { body } = req;
    const portada = req.file ? req.file.path : null; // Ruta de la portada si se subió una imagen

    // Llamada al servicio para crear el libro
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

async function getLibroById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return respondError(req, res, 400, "ID inválido");
    }

    const [libro, error] = await libroServices.getLibroById(id);

    if (error) {
      return respondError(req, res, 404, error);
    }
    return respondSuccess(req, res, 200, libro);
  } catch (error) {
    return respondError(req, res, 500, "Error al obtener el libro", error.message);
  }
}

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
