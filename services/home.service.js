import axios from "axios";

const API = axios.create({
  baseURL: "https://tourly-backend-3fa2.onrender.com/api/v1",
  withCredentials: true,
});

export const fetchHomeData = async () => {
  const res = await API.get("/home/homepage");
  return res.data.data;
};
