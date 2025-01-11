import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import API from "../services/api";

const listaLibro = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await API.get("/libros"); // Llama al endpoint de tu backend
        setLibros(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar libros:", error.message);
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  const renderLibro = ({ item }) => (
    <View style={styles.bookContainer}>
      <Image source={{ uri: item.portada || "https://via.placeholder.com/100" }} style={styles.portada} />
      <View>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.author}>{item.autor}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Cargando libros...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={libros}
      keyExtractor={(item) => item._id}
      renderItem={renderLibro}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  libroContainer: {
    flexDirection: "row",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  portada: {
    width: 50,
    height: 70,
    marginRight: 10,
  },
  titulo: {
    fontWeight: "bold",
  },
  autor: {
    color: "#555",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default listaLibro;
