import React from "react"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import HomeScreen from "./screens/HomeScreen"
import ChatScreen from "./screens/ChatScreen"
import LoginScreen from "./screens/LoginScreen"
import useAuth from "./hooks/useAuth"
import ModalScreen from "./screens/ModalScreen"
import MatchedScreen from "./screens/MatchedScreen"
import MessagesScreen from "./screens/MessagesScreen"

const Stack = createStackNavigator()

const StackNavigator = () => {
  const { user, loading } = useAuth()

  return (
    <Stack.Navigator>
      {user && !loading ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal", gestureEnabled: true, ...TransitionPresets.ModalSlideFromBottomIOS }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "transparentModal", gestureEnabled: true, ...TransitionPresets.ModalSlideFromBottomIOS }}>
            <Stack.Screen name="Match" component={MatchedScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}

export default StackNavigator
