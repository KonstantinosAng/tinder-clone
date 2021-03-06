import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { TailwindProvider } from "tailwind-rn"
import { LogBox } from "react-native"
import utilities from "./tailwind.json"
import StackNavigator from "./StackNavigator"
import { AuthProvider } from "./hooks/useAuth"

LogBox.ignoreAllLogs()

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <TailwindProvider utilities={utilities} colorScheme="dark">
          <StackNavigator />
        </TailwindProvider>
      </AuthProvider>
    </NavigationContainer>
  )
}
