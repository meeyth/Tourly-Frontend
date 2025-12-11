import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function Profile() {
  const initialData = {
    username: 'John Doe',
    email: 'johndoe@gmail.com',
    avatar: null,
  };

  const original = useRef({ ...initialData });
  const [avatar, setAvatar] = useState(original.current.avatar);
  const [username, setUsername] = useState(original.current.username);
  const [email] = useState(original.current.email);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow photo library access.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Image picker error', err);
      Alert.alert('Error', 'Could not pick image.');
    }
  };

  const handleSave = async () => {
    const updates = {};
    if (username.trim() !== original.current.username) updates.username = username.trim();
    if (avatar !== original.current.avatar) updates.avatar = avatar;

    const wantsPasswordChange = oldPassword !== '' || newPassword !== '';
    if (wantsPasswordChange) {
      if (!oldPassword || !newPassword) {
        Alert.alert('Password fields', 'Please enter both old and new password.');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Weak password', 'New password must be at least 6 characters.');
        return;
      }
      updates.password = { oldPassword, newPassword };
    }

    if (Object.keys(updates).length === 0) {
      Alert.alert('No changes', 'Nothing to save.');
      return;
    }

    try {
      setSaving(true);
      await new Promise((r) => setTimeout(r, 900)); // simulate network
      if (updates.username) original.current.username = updates.username;
      if (updates.avatar) original.current.avatar = updates.avatar;

      setOldPassword('');
      setNewPassword('');

      Alert.alert('Success', 'Profile updated.');
    } catch (err) {
      console.error('Save error', err);
      Alert.alert('Error', 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // TODO: Replace with your real logout logic (clear token, navigate to login)
            console.log("User logged out");
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#acd9f6', '#ffffff']}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 0.35 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">

        <View className="px-4 pt-6">
          <Text className="text-2xl font-extrabold text-slate-900">Edit Profile</Text>
        </View>

        <View className="items-center mt-5">
          <View className="relative w-[140px] items-center">
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.85}
              className="rounded-full overflow-hidden border-[4px] border-white bg-slate-100 w-[140px] h-[140px]"
            >
              <Image
                source={avatar ? { uri: avatar } : { uri: 'https://i.pravatar.cc/300?img=12' }}
                className="w-[140px] h-[140px] rounded-full"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.85}
              className="absolute bottom-[10px] right-[-14px] w-[40px] h-[40px] rounded-full bg-white items-center justify-center border border-slate-200"
            >
              <MaterialIcons name="edit" size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className="mt-6 px-5">

          <Text className="text-sm font-medium text-slate-800 mb-2">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="bg-white rounded-xl px-4 py-3 border border-slate-200 mb-4"
            placeholder="Enter username"
            autoCapitalize="words"
          />

          <Text className="text-sm font-medium text-slate-800 mb-2">Email (Not Editable)</Text>
          <View className="bg-slate-100 rounded-xl px-4 py-3 border border-slate-200 mb-4">
            <Text className="text-slate-600">{email}</Text>
          </View>

          <Text className="text-sm font-medium text-slate-800 mb-2">Old Password</Text>
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            className="bg-white rounded-xl px-4 py-3 border border-slate-200 mb-4"
            placeholder="Enter old password"
          />

          <Text className="text-sm font-medium text-slate-800 mb-2">New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            className="bg-white rounded-xl px-4 py-3 border border-slate-200 mb-4"
            placeholder="Enter new password"
          />

          {/* Save Changes Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="rounded-2xl mt-2 bg-[#82c5fb] py-3 items-center"
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold">Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="rounded-2xl mt-4 bg-red-500 py-3 items-center"
          >
            <Text className="text-white font-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}