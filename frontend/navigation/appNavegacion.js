import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ListaLibro from "../screens/listaLibro";
import DetalleLibro from "../screens/detalleLibro";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Libros" component={ListaLibro} />
        <Stack.Screen name="Detalle del Libro" component={DetalleLibro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
