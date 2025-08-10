import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'


const CustomButton = ({ title, onPress,isLoading = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#82c5fb] py-[15px] rounded-lg items-center">
      <View className='flex-center flex-row'>
        {isLoading? (
          <ActivityIndicator size="small"  color="white" />
        ) :(  
      <Text className="text-[15px] text-white font-bold">
        {title}
      </Text>
      )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;