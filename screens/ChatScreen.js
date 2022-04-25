import React, { useLayoutEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import Header from "../components/Header"
import ChatList from "../components/ChatList"

const ChatScreen = ({ navigation }) => {
  const { setOptions } = navigation

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <SafeAreaView>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  )
}

export default ChatScreen
