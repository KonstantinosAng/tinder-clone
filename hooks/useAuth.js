import React, { useEffect, useState, createContext, useContext, useMemo } from "react"
import * as Google from "expo-auth-session/providers/google"
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, EXPO_CLIENT_ID, WEB_CLIENT_ID } from "@env"
import { GoogleAuthProvider, signInWithCredential, auth, onAuthStateChanged, signOut } from "../firebase/firebase"
import Loading from "../components/Loading"

const config = {
  expoClientId: EXPO_CLIENT_ID,
  androidClientId: ANDROID_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  webClientId: WEB_CLIENT_ID,
}

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [req, res, login] = Google.useAuthRequest(config)
  const [loading, setLoading] = useState(null)

  useEffect(
    () =>
      onAuthStateChanged(auth, user => {
        setLoading(true)
        if (user) {
          setUser(user)
          setLoading(false)
        } else {
          setUser(null)
        }
        setLoading(false)
      }),
    []
  )

  const signInWithGoogle = () => {
    setLoading(true)
    login({ showInRecents: true })
      .then(async response => {
        if (response && response.type === "success") {
          const { accessToken, idToken } = response.authentication
          const credential = GoogleAuthProvider.credential(idToken, accessToken)
          await signInWithCredential(auth, credential)
          setLoading(false)
        }
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false))
  }

  const logout = () => {
    setLoading(true)
    signOut(auth)
      .catch(error => console.error(error))
      .finally(() => setLoading(false))
  }

  const initialState = useMemo(() => ({ user, loading, signInWithGoogle, logout }), [user, loading])

  return <AuthContext.Provider value={initialState}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  return useContext(AuthContext)
}

export default useAuth
