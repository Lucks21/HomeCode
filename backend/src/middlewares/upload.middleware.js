"use strict";

import multer from "multer";
import path from "path";

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta donde se guardarán los archivos cargados
    cb(null, "uploads/"); // Puedes cambiar la carpeta según tu preferencia
  },
  filename: (req, file, cb) => {
    // Renombra el archivo para evitar conflictos
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configuración del middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Límite de 2 MB para el tamaño de archivo
  },
  fileFilter: (req, file, cb) => {
    // Validación del tipo de archivo
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen (jpeg, jpg, png, gif)"));
    }
  },
});

export default upload;
