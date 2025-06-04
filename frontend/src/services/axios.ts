import axios from "axios";
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_API || "";
  } else {
    return process.env.NEXT_DEVELOPMENT_API || "http://localhost:8880/api";
  }
};

const axiosInstace = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

export default axiosInstace;
