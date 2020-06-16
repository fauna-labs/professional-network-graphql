import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Profiles from './pages/profiles'
import Login from './pages/login'
import Register from './pages/register'
import Layout from './components/layout'
import { SessionProvider, sessionReducer } from './context/session'

const App = () => {
  const [state, dispatch] = React.useReducer(sessionReducer, { user: null })

  // Return the header and either show an error or render the loaded profiles.
  return (
    <Router>
      <SessionProvider value={{ state, dispatch }}>
        <Layout>
          <Switch>
            <Route exact path="/accounts/login">
              <Login />
            </Route>
            <Route exact path="/accounts/register">
              <Register />
            </Route>
            <Route path="/">
              <Profiles />
            </Route>
            {/* <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route> */}
          </Switch>
        </Layout>
      </SessionProvider>
    </Router>
  )
}

export default App
