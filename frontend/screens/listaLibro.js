import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
import API from "../services/API";

const ListaLibro = ({ navigation }) => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await API.get("/libros"); // Llama al endpoint de tu backend
        console.log("Datos recibidos:", response.data); // Agrega esto para verificar la respuesta
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
    <TouchableOpacity
      onPress={() => navigation.navigate("Detalle del Libro", { libro: item })}
      style={styles.libroContainer}
    >
      <Image
        source={{ uri: item.portada || "https://via.placeholder.com/100" }}
        style={styles.portada}
      />
      <View>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.autor}>{item.autor}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Cargando libros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón para crear un nuevo libro */}
      <Button
        title="Crear Nuevo Libro"
        onPress={() => navigation.navigate("Crear Libro")} // Navega a la pantalla de crear libro
      />
      <FlatList
        data={libros}
        keyExtractor={(item) => item._id}
        renderItem={renderLibro}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    marginTop: 10,
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

export default ListaLibro;
