import { View, Text, Image, TextInput, Alert, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [value, setValue] = useState({
    email: "",
    password: "",
    name: "",
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return Alert.alert("Permission Required", "Permission to access gallery is required!");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onSignup = async () => {
    if (!value.email || !value.password || !value.name) 
      return Alert.alert('Error', "Please enter valid details");
    
    if (!profileImage) 
      return Alert.alert('Error', "Please upload a profile picture");
    
    setIsSubmitting(true)
    try {
      Alert.alert('Success', "User Signed Up Successfully");
      router.replace('/')
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ImageBackground
      source={require("@/assets/images/background.png")} 
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/20 justify-center">
        <View className="bg-white rounded-2xl p-6 shadow-lg mx-5 min-h-[450px] justify-between" >
          <Text className="text-2xl font-semibold text-gray-800">
            <Text className="text-[#82c5fb]">Adventure</Text> Awaits.
          </Text>
          <Text className="text-gray-500 text-base mb-5">
            Get Ready For Your Journey!
          </Text>
          <TouchableOpacity 
            onPress={pickImage}
            className="self-center mb-5"
          >
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                className="w-24 h-24 rounded-full border-2 border-[#82c5fb]" 
              />
            ) : (
              <View className="w-24 h-24 rounded-full border-2 border-dashed border-[#82c5fb] items-center justify-center">
                <Text className="text-gray-400 text-sm">Upload</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            placeholder="Username" 
            placeholderTextColor="#9CA3AF" 
            value={value.name}
            onChangeText={(e) => setValue(prev => ({ ...prev, name: e }))}
            className="border border-[#82c5fb] h-[50px] px-4 my-3 rounded-lg mb-3 "
          />
          <TextInput 
            placeholder="Email" 
            placeholderTextColor="#9CA3AF" 
            keyboardType='email-address'
            value={value.email}
            onChangeText={(e) => setValue(prev => ({ ...prev, email: e }))}
            className="border border-[#82c5fb] h-[50px] px-4 my-3 rounded-lg mb-3 "
          />
          <TextInput 
            placeholder="Password" 
            placeholderTextColor="#9CA3AF" 
            secureTextEntry
            value={value.password}
            onChangeText={(e) => setValue(prev => ({ ...prev, password: e }))}
            className="border border-[#82c5fb] h-[50px] px-4 my-3 rounded-lg"
          />
          <TextInput 
            placeholder="Re-enter Password" 
            placeholderTextColor="#9CA3AF" 
            secureTextEntry
            className="border border-[#82c5fb] h-[50px] px-4 mt-3 mb-4 rounded-lg"
          />

          <CustomButton 
            title={"Sign Up"}
            onPress={onSignup}
            isLoading={isSubmitting}
          />

          <Text className="text-sm text-gray-500 text-center my-5">
            Already have an account?
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/SignIn')} 
          className="bg-white rounded-2xl py-[15px] px-6 mt-6 mx-5 border border-[#82c5fb]"
        >
          <Text className="text-[#82c5fb] text-center font-bold text-[15px]">
            Sign In
          </Text>
        </TouchableOpacity>        
      </View>
    </ImageBackground>
  )
}

export default SignUp
