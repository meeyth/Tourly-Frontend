import AsyncStorage from "@react-native-async-storage/async-storage";

export const toggleLikePost = async (postId) => {
  const token = await AsyncStorage.getItem("accessToken");

  const response = await fetch(
    `https://tourly-backend-3fa2.onrender.com/api/v1/posts/${postId}/like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Like failed");
  }

  return data.data; // updated post
};
