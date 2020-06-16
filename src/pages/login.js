import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import SessionContext from './../context/session'
import { login } from '../data/fauna-queries'

// Components
import Form from '../components/form'

const handleLogin = (event, username, password, history, sessionContext) => {
  login(username, password)
    .then(() => {
      toast.success('Login successful')
      sessionContext.dispatch({ type: 'login', data: { user: username } })
      history.push('/')
    })
    .catch(err => {
      console.error('error on login', err)
      toast.error('Login failed')
    })
  event.preventDefault()
}

const Login = props => {
  const history = useHistory()
  const sessionContext = useContext(SessionContext)

  return (
    <Form
      isLogin={true}
      handleSubmit={(event, username, password) => handleLogin(event, username, password, history, sessionContext)}
    ></Form>
  )
}

export default Login
