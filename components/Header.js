import { View, Text, TouchableOpacity } from "react-native"
import React from "react"
import { useTailwind } from "tailwind-rn/dist"
import { Foundation, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const Header = ({ title, callEnabled }) => {
  const tw = useTailwind()
  const navigation = useNavigation()
  const { goBack } = navigation

  return (
    <View style={tw("py-5 flex-row items-center justify-between")}>
      <View style={tw("flex flex-row items-center")}>
        <TouchableOpacity onPress={() => goBack()} style={tw("p-2")}>
          <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw("text-xl font-bold p-2")}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity style={tw("rounded-full mr-4 p-2 bg-red-200")}>
          <Foundation style={tw("")} name="telephone" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Header
