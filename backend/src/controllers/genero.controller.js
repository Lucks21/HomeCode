"use strict";
import generoServices from "../services/genero.services.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";

async function getGeneros(req, res) {
  try {
    const [generos, error] = await generoServices.getGeneros();

    if (error) return respondError(req, res, 404, error);
    respondSuccess(req, res, 200, generos);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener los géneros", error.message);
  }
}

async function createGenero(req, res) {
  try {
    const { body } = req;

    const [nuevoGenero, error] = await generoServices.createGenero(body);

    if (error) return respondError(req, res, 400, error);
    respondSuccess(req, res, 201, nuevoGenero);
  } catch (error) {
    respondError(req, res, 500, "Error al crear el género", error.message);
  }
}

async function getGeneroById(req, res) {
  try {
    const { id } = req.params;

    const [genero, error] = await generoServices.getGeneroById(id);

    if (error) return respondError(req, res, 404, error);
    respondSuccess(req, res, 200, genero);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener el género", error.message);
  }
}

async function updateGenero(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const [generoActualizado, error] = await generoServices.updateGenero(id, body);

    if (error) return respondError(req, res, 400, error);
    respondSuccess(req, res, 200, generoActualizado);
  } catch (error) {
    respondError(req, res, 500, "Error al actualizar el género", error.message);
  }
}

async function deleteGenero(req, res) {
  try {
    const { id } = req.params;

    const [generoEliminado, error] = await generoServices.deleteGenero(id);

    if (error) return respondError(req, res, 404, error);
    respondSuccess(req, res, 200, { message: "Género eliminado exitosamente", generoEliminado });
  } catch (error) {
    respondError(req, res, 500, "Error al eliminar el género", error.message);
  }
}

export default {
  getGeneros,
  createGenero,
  getGeneroById,
  updateGenero,
  deleteGenero,
};
