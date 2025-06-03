import axios from "axios";

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_API || "";
  } else {
    return process.env.NEXT_PUBLIC_API || "http://localhost:3006/api";
  }
};

const axiosInstace = axios.create({
  baseURL: getBaseUrl(),
});

export default axiosInstace;
