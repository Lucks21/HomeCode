"use strict";
import Libro from "../models/libro.model.js";
import Saga from "../models/saga.model.js";
import Genero from "../models/genero.model.js";

async function getLibros() {
  try {
    const libros = await Libro.find()
      .populate("generos", "name") // Traer solo el nombre del género
      .populate("saga", "name") // Traer solo el nombre de la saga
      .exec();

    if (libros.length === 0) return [null, "No hay libros disponibles"];
    return [libros, null];
  } catch (error) {
    return [null, error.message];
  }
}

async function createLibro(libroData) {
  try {
    const { titulo, autor, editorial, paginas, generos, isbn, formato, idioma, tipo, portada } = libroData;

    // Verifica si el ISBN ya existe
    const libroExistente = await Libro.findOne({ isbn });
    if (libroExistente) return [null, "El ISBN ya está registrado"];

    // Verifica si los géneros existen
    const generosEncontrados = await Genero.find({ _id: { $in: generos } });
    if (generosEncontrados.length !== generos.length)
      return [null, "Uno o más géneros no existen"];

    // Crea el libro
    const nuevoLibro = new Libro({
      titulo,
      autor,
      editorial,
      paginas,
      generos: generosEncontrados.map((g) => g._id),
      isbn,
      formato,
      idioma,
      tipo,
      portada: portada || null,
    });

    await nuevoLibro.save();
    return [nuevoLibro, null];
  } catch (error) {
    return [null, error.message];
  }
}

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
