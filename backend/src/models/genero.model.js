"use strict";
import mongoose from "mongoose";

const generoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del género es obligatorio"],
      unique: true,
    },
  },
  {
    timestamps: false, 
    versionKey: false,
  }
);

const Genero = mongoose.model("Genero", generoSchema);

export default Genero;
