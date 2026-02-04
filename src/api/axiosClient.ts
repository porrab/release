import axios from "axios";

const axiosService = axios.create({
  baseURL: "http://localhost:88",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default axiosService;
