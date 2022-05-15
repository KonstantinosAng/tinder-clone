import { View, Text, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native"
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
    <View style={tw("flex-1 justify-center")}>
      <ImageBackground style={tw("flex flex-1 justify-center items-center")} source={{ uri: "https://tinder.com/static/tinder.png" }}>
        <TouchableOpacity style={[tw("absolute bottom-16 w-52 bg-white rounded-2xl p-4")]} onPress={signInWithGoogle}>
          <Text style={tw("font-semibold text-base text-center mx-auto")}>
            {loading ? <ActivityIndicator color="#fe6e53" /> : "Sign in & get swiping"}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

export default LoginScreen
