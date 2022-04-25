import { Button, Text } from "react-native"
import React, { useLayoutEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"

const ChatScreen = ({ navigation }) => {
  const { setOptions, navigate } = navigation

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <SafeAreaView>
      <Text>ChatScreen</Text>
      <Button title="Go Back" onPress={() => navigate("Home")} />
    </SafeAreaView>
  )
}

export default ChatScreen
