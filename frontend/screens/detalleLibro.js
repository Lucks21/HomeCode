import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const DetalleLibro = ({ route }) => {
  const { libro } = route.params; // Recibir los datos del libro

  return (
    <View style={styles.container}>
      <Image source={{ uri: libro.portada || "https://via.placeholder.com/150" }} style={styles.portada} />
      <Text style={styles.titulo}>{libro.titulo}</Text>
      <Text style={styles.autor}>Autor: {libro.autor}</Text>
      <Text style={styles.editorial}>Editorial: {libro.editorial}</Text>
      <Text style={styles.paginas}>Páginas: {libro.paginas}</Text>
      <Text style={styles.idioma}>Idioma: {libro.idioma}</Text>
      <Text style={styles.tipo}>Tipo: {libro.tipo}</Text>
      <Text style={styles.isbn}>ISBN: {libro.isbn}</Text>
      <Text style={styles.formato}>Formato: {libro.formato}</Text>
      <Text style={styles.generos}>
        Géneros: {libro.generos.map((genero) => genero.name).join(", ")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  portada: {
    width: 150,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  autor: {
    fontSize: 16,
    marginBottom: 5,
  },
  editorial: {
    fontSize: 16,
    marginBottom: 5,
  },
  paginas: {
    fontSize: 16,
    marginBottom: 5,
  },
  idioma: {
    fontSize: 16,
    marginBottom: 5,
  },
  tipo: {
    fontSize: 16,
    marginBottom: 5,
  },
  isbn: {
    fontSize: 16,
    marginBottom: 5,
  },
  generos: {
    fontSize: 16,
    marginBottom: 5,
  },
  formato: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DetalleLibro;
