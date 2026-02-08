import axios from "axios";

const axiosService = axios.create({
  baseURL: "/dps",
  headers: { "Content-Type": "application/json" },
});

export default axiosService;
