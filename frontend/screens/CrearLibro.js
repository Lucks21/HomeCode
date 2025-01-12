import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SubirImagen from "../components/SubirImagen";
import API from "../services/API";

const CrearLibro = () => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [editorial, setEditorial] = useState("");
  const [paginas, setPaginas] = useState("");
  const [isbn, setIsbn] = useState("");
  const [formato, setFormato] = useState("Digital");
  const [idioma, setIdioma] = useState("");
  const [tipo, setTipo] = useState("Libro");
  const [tags, setTags] = useState("");
  const [portada, setPortada] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [generoSeleccionado, setGeneroSeleccionado] = useState("");

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const response = await API.get("/generos");
        setGeneros(response.data.data);
      } catch (error) {
        console.error("Error al cargar los géneros:", error.message);
      }
    };

    fetchGeneros();
  }, []);

  const handleImageSelected = (imageUri) => {
    setPortada(imageUri);
  };

  const handleSubmit = async () => {
    if (
      !titulo ||
      !autor ||
      !editorial ||
      !paginas ||
      !isbn ||
      !idioma ||
      !generoSeleccionado
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    const nuevoLibro = {
      titulo,
      autor,
      editorial,
      paginas: parseInt(paginas, 10),
      generos: [generoSeleccionado],
      isbn,
      formato,
      idioma,
      tipo,
      tags: tags.split(",").map((tag) => tag.trim()),
      portada,
    };

    try {
      const response = await API.post("/libros", nuevoLibro);
      if (response.status === 201) {
        alert("Libro creado exitosamente.");
        setTitulo("");
        setAutor("");
        setEditorial("");
        setPaginas("");
        setIsbn("");
        setIdioma("");
        setTags("");
        setPortada(null);
        setGeneroSeleccionado("");
      }
    } catch (error) {
      console.error("Error al crear el libro:", error.message);
      alert("Hubo un error al crear el libro.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ingrese el título"
      />

      <Text style={styles.label}>Autor</Text>
      <TextInput
        style={styles.input}
        value={autor}
        onChangeText={setAutor}
        placeholder="Ingrese el autor"
      />

      <Text style={styles.label}>Editorial</Text>
      <TextInput
        style={styles.input}
        value={editorial}
        onChangeText={setEditorial}
        placeholder="Ingrese la editorial"
      />

      <Text style={styles.label}>Número de Páginas</Text>
      <TextInput
        style={styles.input}
        value={paginas}
        onChangeText={setPaginas}
        placeholder="Ingrese el número de páginas"
        keyboardType="numeric"
      />

      <Text style={styles.label}>ISBN</Text>
      <TextInput
        style={styles.input}
        value={isbn}
        onChangeText={setIsbn}
        placeholder="Ingrese el ISBN"
      />

      <Text style={styles.label}>Idioma</Text>
      <TextInput
        style={styles.input}
        value={idioma}
        onChangeText={setIdioma}
        placeholder="Ingrese el idioma"
      />

      <Text style={styles.label}>Formato</Text>
      <Picker
        selectedValue={formato}
        style={styles.picker}
        onValueChange={(itemValue) => setFormato(itemValue)}
      >
        <Picker.Item label="Digital" value="Digital" />
        <Picker.Item label="Físico" value="Físico" />
      </Picker>

      <Text style={styles.label}>Tipo</Text>
      <Picker
        selectedValue={tipo}
        style={styles.picker}
        onValueChange={(itemValue) => setTipo(itemValue)}
      >
        <Picker.Item label="Libro" value="Libro" />
        <Picker.Item label="Cómic" value="Cómic" />
        <Picker.Item label="Novela gráfica" value="Novela gráfica" />
      </Picker>

      <Text style={styles.label}>Género</Text>
      <Picker
        selectedValue={generoSeleccionado}
        style={styles.picker}
        onValueChange={(itemValue) => setGeneroSeleccionado(itemValue)}
      >
        <Picker.Item label="Seleccione un género" value="" />
        {generos.map((genero) => (
          <Picker.Item key={genero._id} label={genero.name} value={genero._id} />
        ))}
      </Picker>

      <Text style={styles.label}>Tags</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="Ingrese tags separados por comas"
      />

      <Text style={styles.label}>Portada</Text>
      <SubirImagen onImageSelected={handleImageSelected} />

      <Button title="Crear Libro" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
});

export default CrearLibro;
