import axios from "axios";

const API = axios.create({
  baseURL: "https://tourly-backend-3fa2.onrender.com/api/v1",
  withCredentials: true,
});

export const fetchHomeData = async () => {
  const res = await API.get("/home/homepage");
  return res.data.data;
};


export const fetchAllPosts = async () => {
  const res = await fetch(
    "https://tourly-backend-3fa2.onrender.com/api/v1/posts"
  );

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch posts");

  return json.data;
};
