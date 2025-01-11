import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.100.15:5000/api", // Asegúrate de usar la IP local de tu servidor
  timeout: 5000,
});

export default API;
