import { Image, TouchableOpacity, StyleSheet, View, Text } from "react-native"
import { useEffect, useState } from "react"
import { useTailwind } from "tailwind-rn/dist"
import { useNavigation } from "@react-navigation/native"
import useAuth from "../hooks/useAuth"
import getMatchedInfo from "../lib/getMatchedInfo"
import { onSnapshot, collection, db, query, orderBy } from "../firebase/firebase"

const ChatRow = ({ matchDetails }) => {
  const tw = useTailwind()
  const navigation = useNavigation()
  const { user } = useAuth()
  const [matchedInfo, setMatchedInfo] = useState()
  const [lastMessage, setLastMessage] = useState("")

  useEffect(() => {
    setMatchedInfo(getMatchedInfo(matchDetails.users, user.uid))
  }, [matchDetails, user])

  useEffect(() => {
    onSnapshot(query(collection(db, "matches", matchDetails.id, "messages"), orderBy("timestamp", "desc")), snapshot => {
      setLastMessage(snapshot.docs[0]?.data()?.message)
    })
  }, [matchDetails, db])

  return (
    <TouchableOpacity
      style={[tw("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"), styles.cardShadow]}
      onPress={() => navigation.navigate("Messages", { matchDetails })}
    >
      <Image style={tw("rounded-full h-16 w-16 mr-4")} source={{ uri: matchedInfo?.photoURL }} />
      <View>
        <Text style={tw("text-lg font-semibold")}>{matchedInfo?.displayName}</Text>
        <Text>{lastMessage || "Say Hi!"}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChatRow

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
})
