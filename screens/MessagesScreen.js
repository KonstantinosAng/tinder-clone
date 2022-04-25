import { SafeAreaView, View, FlatList, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native"
import { useLayoutEffect, useState, useEffect } from "react"
import Header from "../components/Header"
import getMatchedInfo from "../lib/getMatchedInfo"
import useAuth from "../hooks/useAuth"
import { useTailwind } from "tailwind-rn/dist"
import SenderMessage from "../components/SenderMessage"
import ReceiverMessage from "../components/ReceiverMessage"
import { addDoc, collection, db, serverTimestamp, onSnapshot, query, orderBy } from "../firebase/firebase"

const MessagesScreen = ({ navigation, route }) => {
  const { setOptions } = navigation
  const { user } = useAuth()
  const { params } = route
  const { matchDetails } = params
  const tw = useTailwind()
  const [input, setInput] = useState()
  const [messages, setMessages] = useState([])

  useEffect(
    () =>
      onSnapshot(query(collection(db, "matches", matchDetails.id, "messages"), orderBy("timestamp", "desc")), snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      ),
    [matchDetails, db]
  )

  const sendMessage = async () => {
    if (input.trim() !== "") {
      await addDoc(collection(db, "matches", matchDetails.id, "messages"), {
        timestamp: serverTimestamp(),
        userId: user.uid,
        displayName: user.displayName,
        photoURL: matchDetails.users[user.uid].photoURL,
        message: input,
      })
        .catch(error => console.error(error))
        .finally(() => setInput(""))
    }
  }

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <SafeAreaView style={tw("flex-1")}>
      <Header callEnabled title={getMatchedInfo(matchDetails.users, user.uid).displayName} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw("flex-1")} keyboardVerticalOffset={10}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            inverted={-1}
            data={messages}
            style={tw("pl-4")}
            keyExtractor={item => item?.id}
            renderItem={({ item }) =>
              item?.userId === user.uid ? <SenderMessage key={item?.id} message={item} /> : <ReceiverMessage key={item?.id} message={item} />
            }
          />
        </TouchableWithoutFeedback>
        <View style={tw("flex-row justify-between items-center border-t border-gray-200 px-5 py-2 bg-white")}>
          <TextInput
            style={tw("h-10 text-lg flex-1")}
            placeholder="Send message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Text style={[tw(""), { color: "#FF5864" }]} onPress={sendMessage}>
            Send
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MessagesScreen
