import { View, Text, Image, TextInput, Alert, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState({
    email: "",
    password: "",
    name: "",
  });

  const onSignup = async () => {
    if (!value.email || !value.password || !value.name) 
      return Alert.alert('Error', "Please enter valid email and password");
    
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
        
        <View className="bg-white rounded-2xl p-6 shadow-lg mx-5 min-h-[350px] justify-between" >

          <Text className="text-2xl font-semibold text-gray-800">
             <Text className="text-[#82c5fb]">Adventure</Text> Awaits.
          </Text>
        <Text className="text-gray-500 text-base mb-5">
            Get Ready For Your Journey!
          </Text>
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
            value={value.password}
            onChangeText={(e) => setValue(prev => ({ ...prev, password: e }))}
            className="border border-[#82c5fb] h-[50px] px-4 mt-3 mb-4 rounded-lg"
          />
          <CustomButton 
            title={"Sign Up"}
            onPress={onSignup}
            isLoading={isSubmitting}
          />
           <Text className="text-sm text-gray-500 text-center my-5" >Already have an account?</Text>

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
