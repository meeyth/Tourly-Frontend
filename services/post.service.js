import AsyncStorage from "@react-native-async-storage/async-storage";

export const toggleLikePost = async (postId) => {
  // ✅ ADD HERE
  const token = await AsyncStorage.getItem("accessToken");
  console.log("TOKEN:", token);

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
    console.log("LIKE ERROR RESPONSE:", data);
    throw new Error(data.message || "Like failed");
  }

  return data.data;
};
