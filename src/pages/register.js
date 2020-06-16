import React from "react"
import { toast } from "react-toastify"
import { register } from "./../data/fauna-queries"
import {
  safelyExtractErrorCode,
  errorCodeToRegisterErrorMessage
} from "./../util/error-handling"

// Components
import Form from "./../components/form"

const handleRegister = (event, username, password) => {
  register(username, password)
    .then(e => {
      toast.success("User registered")
    })
    .catch(err => {
      console.error("error on register", err)
      const errorCode = safelyExtractErrorCode(err)
      toast.error(errorCodeToRegisterErrorMessage(errorCode))
    })
  event.preventDefault()
}

const Login = () => {
  return <Form isLogin={false} handleSubmit={handleRegister}></Form>
}

export default Login
