import { View, Text, TouchableOpacity, Image } from "react-native"
import { useLayoutEffect } from "react"
import { useTailwind } from "tailwind-rn/dist"

const MatchedScreen = ({ navigation, route }) => {
  const { setOptions, navigate, goBack } = navigation
  const { params } = route
  const { loggedInProfile, userSwiped } = params
  const tw = useTailwind()

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <View style={[tw("h-full bg-red-500 pt-20"), { opacity: 0.89 }]}>
      <View style={tw("justify-center px-10 pt-20")}>
        <Image style={tw("h-20 w-full")} source={require("../assets/match.png")} />
      </View>
      <Text style={tw("text-white text-center mt-5")}>You and {userSwiped?.displayName} have liked each other.</Text>
      <View style={tw("flex-row justify-evenly mt-5")}>
        <Image style={tw("h-32 w-32 rounded-full")} source={{ uri: loggedInProfile?.photoURL }} />
        <Image style={tw("h-32 w-32 rounded-full")} source={{ uri: userSwiped?.photoURL }} />
      </View>
      <TouchableOpacity
        style={tw("bg-white m-5 px-8 py-6 rounded-full mt-20")}
        onPress={() => {
          goBack()
          navigate("Chat")
        }}
      >
        <Text style={tw("text-center text-xl font-semibold")}> Send a message </Text>
      </TouchableOpacity>
    </View>
  )
}

export default MatchedScreen
