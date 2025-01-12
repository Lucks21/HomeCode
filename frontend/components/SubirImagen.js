import React, { useState } from "react";
import { View, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const SubirImagen = ({ onImageSelected }) => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    // Pide permisos para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se necesitan permisos para acceder a las imágenes.");
      return;
    }

    // Abre la galería para seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Guarda la URI de la imagen seleccionada
      if (onImageSelected) {
        onImageSelected(result.assets[0].uri); // Enviar imagen al padre
      }
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Seleccionar Imagen" onPress={pickImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default SubirImagen;
