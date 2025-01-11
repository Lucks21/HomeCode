"use strict";
import Libro from "../models/libro.model.js";
import Saga from "../models/saga.model.js";
import Genero from "../models/genero.model.js";

/**
 * Obtiene todos los libros.
 * @returns {Promise<[Array, String]>} Lista de libros o un mensaje de error.
 */
async function getLibros() {
  try {
    const libros = await Libro.find()
      .populate("genero", "name") // Traer solo el nombre del género
      .populate("saga", "name") // Traer solo el nombre de la saga
      .exec();

    if (libros.length === 0) return [null, "No hay libros disponibles"];
    return [libros, null];
  } catch (error) {
    return [null, error.message];
  }
}

/**
 * Crea un nuevo libro.
 * @param {Object} libroData - Datos del libro.
 * @returns {Promise<[Object, String]>} Libro creado o un mensaje de error.
 */
async function createLibro(libroData) {
  try {
    const { titulo, autor, editorial, paginas, genero, isbn, saga, formato, idioma, tipo, tags, portada } = libroData;

    // Verifica si el ISBN ya existe
    const libroExistente = await Libro.findOne({ isbn });
    if (libroExistente) return [null, "El ISBN ya está registrado"];

    // Verifica si el género existe
    const generoEncontrado = await Genero.findById(genero);
    if (!generoEncontrado) return [null, "El género no existe"];

    // Verifica si la saga existe (opcional)
    let sagaEncontrada = null;
    if (saga) {
      sagaEncontrada = await Saga.findById(saga);
      if (!sagaEncontrada) return [null, "La saga no existe"];
    }

    const nuevoLibro = new Libro({
      titulo,
      autor,
      editorial,
      paginas,
      genero: generoEncontrado._id,
      isbn,
      saga: sagaEncontrada ? sagaEncontrada._id : null,
      formato,
      idioma,
      tipo,
      tags: tags || [],
      portada: portada || null,
    });

    await nuevoLibro.save();

    // Si pertenece a una saga, agrega el libro a la saga
    if (sagaEncontrada) {
      sagaEncontrada.libros.push(nuevoLibro._id);
      await sagaEncontrada.save();
    }

    return [nuevoLibro, null];
  } catch (error) {
    return [null, error.message];
  }
}

/**
 * Obtiene un libro por su ID.
 * @param {String} id - ID del libro.
 * @returns {Promise<[Object, String]>} Libro encontrado o un mensaje de error.
 */
async function getLibroById(id) {
  try {
    const libro = await Libro.findById(id)
      .populate("genero", "name")
      .populate("saga", "name")
      .exec();

    if (!libro) return [null, "El libro no existe"];
    return [libro, null];
  } catch (error) {
    return [null, error.message];
  }
}

/**
 * Elimina un libro por su ID.
 * @param {String} id - ID del libro.
 * @returns {Promise<[Object, String]>} Libro eliminado o un mensaje de error.
 */
async function deleteLibro(id) {
  try {
    const libro = await Libro.findByIdAndDelete(id);

    if (!libro) return [null, "El libro no existe"];

    // Si pertenece a una saga, elimínalo de la lista de libros de la saga
    if (libro.saga) {
      const saga = await Saga.findById(libro.saga);
      if (saga) {
        saga.libros = saga.libros.filter((libroId) => libroId.toString() !== id);
        await saga.save();
      }
    }

    return [libro, null];
  } catch (error) {
    return [null, error.message];
  }
}

export default {
  getLibros,
  createLibro,
  getLibroById,
  deleteLibro,
};
