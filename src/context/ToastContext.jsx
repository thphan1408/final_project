import { createContext, useContext, useState } from 'react'
import SignIn from '../modules/Auth/SignIn/SignIn'

// Tạo context để chia sẻ thông báo lỗi giữa các component
const ErrorContext = createContext()

// Component cha chứa SignIn
const ToastProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState(null)
  console.log('🚀  errorMessage:', errorMessage)

  const showError = (message) => {
    setErrorMessage(message)
  }

  return (
    <ErrorContext.Provider value={{ showError, errorMessage }}>
      {children}
    </ErrorContext.Provider>
  )
}

const useError = () => {
  return useContext(ErrorContext)
}

export { ToastProvider, useError }
