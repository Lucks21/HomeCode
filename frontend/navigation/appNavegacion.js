import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ListaLibro from "../screens/ListaLibro";
import DetalleLibro from "../screens/DetalleLibro";
import CrearLibro from "../screens/CrearLibro";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Libros" component={ListaLibro} />
        <Stack.Screen name="Detalle del Libro" component={DetalleLibro} />
        <Stack.Screen name="Crear Libro" component={CrearLibro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
