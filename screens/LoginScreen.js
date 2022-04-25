import { View, Text, TouchableOpacity, ImageBackground } from "react-native"
import React, { useLayoutEffect } from "react"
import useAuth from "../hooks/useAuth"
import { useTailwind } from "tailwind-rn"

const LoginScreen = ({ navigation }) => {
  const { signInWithGoogle, loading } = useAuth()
  const { setOptions } = navigation
  const tw = useTailwind()

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <View style={tw("flex-1")}>
      <ImageBackground style={tw("flex-1")} source={{ uri: "https://tinder.com/static/tinder.png" }}>
        <TouchableOpacity style={[tw("absolute bottom-40 w-52 bg-white rounded-2xl p-4"), { marginHorizontal: "25%" }]} onPress={signInWithGoogle}>
          <Text style={tw("font-semibold text-base text-center")}>Sign in & get swiping </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

export default LoginScreen
