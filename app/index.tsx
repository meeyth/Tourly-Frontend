import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const onContinue = () => {
    router.navigate("/SignIn")
  };
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <CustomButton title={"Continue"} onPress={onContinue}/>
    </View>
  );
}
