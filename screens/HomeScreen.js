import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native"
import React, { useLayoutEffect, useRef, useState, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import useAuth from "../hooks/useAuth"
import { useTailwind } from "tailwind-rn/dist"
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons"
import Swiper from "react-native-deck-swiper"
import { onSnapshot, doc, db, collection, getDocs, query, where, setDoc, getDoc, serverTimestamp } from "../firebase/firebase"
import generateId from "../lib/generateId"

const HomeScreen = ({ navigation }) => {
  const { navigate, setOptions } = navigation
  const { user, logout } = useAuth()
  const swipeRef = useRef(null)
  const [profiles, setProfiles] = useState([])
  const tw = useTailwind()

  const swipeLeft = async cardIndex => {
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]
    await setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped)
  }
  const swipeRight = async cardIndex => {
    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]
    const loggedInProfile = await (await getDoc(doc(db, "users", user.uid))).data()

    // Check if the user you swiped right also swiped right on you
    await getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(async docSnapshot => {
      if (docSnapshot.exists()) {
        // He has swiped right on you before you swiped right on him
        await setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped).catch(error => console.error(error))

        await setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
          users: {
            [user.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped,
          },
          usersMatched: [user.uid, userSwiped.id],
          timestamp: serverTimestamp(),
        })
          .catch(error => console.error(error))
          .finally(() =>
            navigate("Match", {
              loggedInProfile,
              userSwiped,
            })
          )
      } else {
        await setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped).catch(error => console.error(error))
      }
    })
  }

  useEffect(() => {
    let cleanUp

    const fetchCards = async () => {
      const passes = await getDocs(collection(db, "users", user?.uid, "passes")).then(snapshot => snapshot.docs.map(doc => doc.id))
      const swipes = await getDocs(collection(db, "users", user?.uid, "swipes")).then(snapshot => snapshot.docs.map(doc => doc.id))
      const passedUserIds = passes.length > 0 ? passes : ["No One Passed"]
      const swipedUserIds = swipes.length > 0 ? swipes : ["No One Swiped"]
      cleanUp = await onSnapshot(query(collection(db, "users"), where("id", "not-in", [...passedUserIds, ...swipedUserIds])), snapshots =>
        setProfiles(
          snapshots.docs
            .filter(doc => doc.id !== user.uid)
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
        )
      )
    }
    if (user) fetchCards()
    return () => cleanUp && cleanUp()
  }, [user, db])

  useLayoutEffect(() => {
    const cleanUp = onSnapshot(doc(db, "users", user.uid), snapshot => {
      if (!snapshot.exists()) navigate("Modal")
    })
    setOptions({
      headerShown: false,
    })
    return () => cleanUp()
  }, [])
  return (
    <SafeAreaView style={tw("flex-1")}>
      <View style={tw("flex-row items-center justify-between relative px-5 py-4")}>
        <TouchableOpacity onPress={logout}>
          <Image style={tw("h-10 w-10 rounded-full")} source={{ uri: user?.photoURL }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate("Modal")}>
          <Image style={tw("h-16 w-14")} source={require("../assets/logo.png")} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          containerStyle={{ backgroundColor: "transparent" }}
          backgroundColor="#4FD0E9"
          onSwipedLeft={swipeLeft}
          onSwipedRight={swipeRight}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          cards={profiles}
          renderCard={card =>
            card ? (
              <View key={card?.id} style={tw("relative bg-white h-3/4 rounded-xl")}>
                <Image source={{ uri: card?.photoURL }} style={tw("absolute top-0 h-full w-full rounded-xl")} />
                <View
                  style={[
                    tw("absolute bottom-0 bg-white w-full h-20 justify-between items-center flex-row px-6 py-2 rounded-b-xl"),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>{card?.displayName}</Text>
                    <Text>{card?.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card?.age}</Text>
                </View>
              </View>
            ) : (
              <View style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"), styles.cardShadow]}>
                <Text style={tw("font-bold pb-5 text-2xl")}>No more profiles</Text>
                <Image style={tw("h-20 w-20")} source={require("../assets/sad.png")} />
              </View>
            )
          }
        />
      </View>
      {swipeRef.current && (
        <View style={tw("flex flex-row justify-evenly items-center py-4")}>
          <TouchableOpacity onPress={() => swipeRef.current.swipeLeft()} style={tw("items-center justify-center rounded-full w-16 h-16 bg-red-200")}>
            <Entypo name="cross" size={40} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => swipeRef.current.swipeRight()}
            style={tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}
          >
            <AntDesign name="heart" size={30} color="green" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

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

export default HomeScreen
