import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import API from "../services/api";

const DetalleLibro = ({ route }) => {
  const { libroId } = route.params;
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const response = await API.get(`/libros/${libroId}`);
        setLibro(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el libro:", error.message);
        setLoading(false);
      }
    };

    fetchLibro();
  }, [libroId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Cargando libro...</Text>
      </View>
    );
  }

  if (!libro) {
    return (
      <View style={styles.error}>
        <Text>No se pudo cargar el libro</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: libro.portada || "https://via.placeholder.com/200" }} style={styles.portada} />
      <Text style={styles.title}>{libro.titulo}</Text>
      <Text style={styles.author}>Autor: {libro.autor}</Text>
      <Text style={styles.details}>Editorial: {libro.editorial}</Text>
      <Text style={styles.details}>Páginas: {libro.paginas}</Text>
      <Text style={styles.details}>Idioma: {libro.idioma}</Text>
      <Text style={styles.details}>Tipo: {libro.tipo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  portada: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  autor: {
    marginBottom: 10,
  },
  detalles: {
    marginBottom: 5,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DetalleLibro;
