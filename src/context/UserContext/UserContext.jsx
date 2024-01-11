import { createContext, useContext, useState } from 'react'
import { CURRENT_USER, USER_LOGIN_FACEBOOK } from '../../constants'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER))
    return user || null
  })

  const [currentUserFacebook, setCurrentUserFacebook] = useState(() => {
    const userFacebook = JSON.parse(localStorage.getItem(USER_LOGIN_FACEBOOK))
    return userFacebook || null
  })
  
  const handleSigninFacebook = (userFacebook) => {
    setCurrentUserFacebook(userFacebook)
    localStorage.setItem(USER_LOGIN_FACEBOOK, JSON.stringify(userFacebook))
  }

  const handleSignin = (user) => {
    setCurrentUser(user)
    localStorage.setItem(CURRENT_USER, JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.clear(CURRENT_USER)
    localStorage.clear(USER_LOGIN_FACEBOOK)
  }

  const [infoUser, setInfoUser] = useState(null)

  const setValuesData = (data) => {
    setInfoUser(data)
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        handleSignin,
        handleLogout,
        infoUser,
        setValuesData,
        handleSigninFacebook,
        currentUserFacebook,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

const useAuth = () => {
  const value = useContext(UserContext)

  if (!value) {
    throw new Error('useAuth must be used within a UserProvider')
  }
  return value
}

export { UserProvider, useAuth }
