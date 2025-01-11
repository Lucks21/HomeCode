import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import listaLibro from "../screens/listaLibro";
import detalleLibro from "../screens/detalleLibro";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Libros" component={listaLibro} />
        <Stack.Screen name="Detalle del Libro" component={detalleLibro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
