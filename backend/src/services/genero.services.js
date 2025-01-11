"use strict";
import Genero from "../models/genero.model.js";

async function getGeneros() {
  try {
    const generos = await Genero.find().exec();
    if (generos.length === 0) return [null, "No hay géneros disponibles"];
    return [generos, null];
  } catch (error) {
    return [null, error.message];
  }
}

async function createGenero(generoData) {
  try {
    const { name } = generoData;

    // Verifica si el género ya existe
    const generoExistente = await Genero.findOne({ name });
    if (generoExistente) return [null, "El género ya existe"];

    const nuevoGenero = new Genero({ name });
    await nuevoGenero.save();

    return [nuevoGenero, null];
  } catch (error) {
    return [null, error.message];
  }
}

async function getGeneroById(id) {
  try {
    const genero = await Genero.findById(id).exec();
    if (!genero) return [null, "El género no existe"];
    return [genero, null];
  } catch (error) {
    return [null, error.message];
  }
}

async function updateGenero(id, generoData) {
  try {
    const { name } = generoData;

    const generoActualizado = await Genero.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    ).exec();

    if (!generoActualizado) return [null, "El género no existe"];
    return [generoActualizado, null];
  } catch (error) {
    return [null, error.message];
  }
}

async function deleteGenero(id) {
  try {
    const generoEliminado = await Genero.findByIdAndDelete(id).exec();
    if (!generoEliminado) return [null, "El género no existe"];
    return [generoEliminado, null];
  } catch (error) {
    return [null, error.message];
  }
}

export default {
  getGeneros,
  createGenero,
  getGeneroById,
  updateGenero,
  deleteGenero,
};
