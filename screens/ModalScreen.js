import { Image, Text, TextInput, View, TouchableOpacity } from "react-native"
import React, { useLayoutEffect, useState } from "react"
import { useTailwind } from "tailwind-rn/dist"
import useAuth from "../hooks/useAuth"
import { SafeAreaView } from "react-native-safe-area-context"
import { setDoc, doc, db, serverTimestamp } from "../firebase/firebase"

const ModalScreen = ({ navigation }) => {
  const tw = useTailwind()
  const { user } = useAuth()
  const { navigate, setOptions } = navigation
  const [image, setImage] = useState()
  const [job, setJob] = useState()
  const [age, setAge] = useState()

  const incompleteForm = !image || !job || !age

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user?.uid), {
      id: user?.uid,
      displayName: user?.displayName,
      photoURL: image,
      job,
      age,
      timestamp: serverTimestamp(),
    })
      .then(() => navigate("Home"))
      .catch(error => alert(error.message))
  }

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <View style={tw("flex-1 items-center py-5 w-full")}>
      <Image style={tw("h-8 w-36")} source={require("../assets/modalLogo.png")} />
      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}> Welcome {user?.displayName} </Text>
      <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 1: The Profile Pic</Text>
      <TextInput value={image} onChangeText={setImage} placeholder="Enter a Profile Pic URL" />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 2: The Job</Text>
      <TextInput value={job} onChangeText={setJob} placeholder="Enter your occupation" />
      <Text style={tw("text-center p-4 font-bold text-red-400")}>Step 3: The Age</Text>
      <TextInput keyboardType="numeric" maxLength={2} value={age} onChangeText={setAge} placeholder="Enter your age" />
      <TouchableOpacity
        disabled={incompleteForm}
        style={[tw("w-64 p-3 rounded-xl absolute bottom-4 bg-red-400"), incompleteForm ? tw("bg-gray-400") : tw("bg-red-400")]}
        onPress={updateUserProfile}
      >
        <Text style={tw("text-center text-white text-xl font-bold")}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalScreen
