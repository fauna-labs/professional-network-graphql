import React, { useContext } from 'react'
import Nav from './nav'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import SessionContext from './../context/session'
// import { logout } from '../data/fauna-queries'

const Layout = props => {
  const sessionContext = useContext(SessionContext)

  return (
    <div className="page">
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700&display=swap"
        rel="stylesheet"
      ></link>
      {renderHeader(sessionContext)}
      <div className="body-container">
        <Nav />
        <main className="body-content">{props.children}</main>
      </div>
    </div>
  )
}

const renderHeader = sessionContext => {
  return (
    <header className="header">
      <div className="header-profile-container">{renderLoginLink(sessionContext)}</div>

      <div className="header-image" alt="header" />
      <div className="header-bg-container">
        <div className="header-bg"></div>
      </div>
    </header>
  )
}

const renderLoginLink = sessionContext => {
  const { user } = sessionContext.state

  if (user) {
    return (
      <div className="profile-pic-and-text">
        {/* <span>Logout</span> onClick={event => handleLogout(event, sessionContext)} */}
        <div className="profile-pic-container">
          <img className="no-results-image" src="/images/dino-profile.png" alt="login" />
          {/* <div className="profile-pic-container-email"> {user.email} </div> */}
        </div>
      </div>
    )
  } else {
    return (
      <Link to="/accounts/login">
        <span>Login/Register</span>
      </Link>
    )
  }
}

// const handleLogout = (event, sessionContext) => {
//   return logout().then(() => {
//     toast.success('logged out')
//     sessionContext.dispatch({ type: 'logout', data: null })
//     event.preventDefault()
//   })
// }
Layout.propTypes = {
  children: PropTypes.node
}

export default Layout
