import { View, Text, Image, TextInput, Alert, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {
    if (!value.email || !value.password) 
      return Alert.alert('Error', "Please enter valid email and password");
    
    setIsSubmitting(true)
    try {
      Alert.alert('Success', "User Signed in Successfully");
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
            Let’s <Text className="text-[#82c5fb]">Travel</Text> you in.
          </Text>
        <Text className="text-gray-500 text-base mb-5">
            Discover the World with Every Sign In
          </Text>
          <TextInput 
            placeholder="Username" 
            placeholderTextColor="#82c5fb" 
            keyboardType='email-address'
            value={value.email}
            onChangeText={(e) => setValue(prev => ({ ...prev, email: e }))}
            className="border border-[#82c5fb] h-[50px] px-4 rounded-lg mb-3 "
          />
          <TextInput 
            placeholder="Password" 
            placeholderTextColor="#82c5fb" 
            secureTextEntry
            value={value.password}
            onChangeText={(e) => setValue(prev => ({ ...prev, password: e }))}
            className="border border-[#82c5fb] h-[50px] px-4 rounded-lg"
          />
          <TouchableOpacity className="mt-2 mb-4">
            <Text className="text-right text-sm text-gray-500">Forgot password?</Text>
          </TouchableOpacity>
          <CustomButton 
            title={"Sign In"}
            onPress={onLogin}
            isLoading={isSubmitting}
          />
           <Text className="text-sm text-gray-500 text-center mb-4 mt-5" >Don’t have an account?</Text>

        </View>
        <TouchableOpacity 
          onPress={() => router.push('/SignUp')} 
          className="bg-white rounded-2xl py-[15px] px-6 mt-6 mx-5 border border-[#82c5fb]"
        >
          <Text className="text-[#82c5fb] text-center font-bold text-[15px]">
            Sign Up
          </Text>
        </TouchableOpacity>        
      </View>
    </ImageBackground>
  )
}

export default SignIn
