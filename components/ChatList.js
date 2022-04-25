import { View, Text, FlatList } from "react-native"
import { useState, useEffect } from "react"
import { useTailwind } from "tailwind-rn/dist"
import { db, onSnapshot, collection, query, where } from "../firebase/firebase"
import useAuth from "../hooks/useAuth"
import ChatRow from "./ChatRow"

const ChatList = () => {
  const tw = useTailwind()
  const { user } = useAuth()
  const [matches, setMatches] = useState([])

  useEffect(
    () =>
      onSnapshot(query(collection(db, "matches"), where("usersMatched", "array-contains", user.uid)), snapshot =>
        setMatches(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      ),
    [user]
  )

  return matches.length > 0 ? (
    <FlatList style={tw("h-full")} data={matches} keyExtractor={item => item.id} renderItem={({ item }) => <ChatRow matchDetails={item} />} />
  ) : (
    <View style={tw("p-5")}>
      <Text style={tw("text-center text-lg")}> No matches at the moment. 😥</Text>
    </View>
  )
}

export default ChatList
