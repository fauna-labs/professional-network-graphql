import React, { useState } from "react"
import { Link } from "react-router-dom"

const Form = props => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleChangeUserName = (setPassword, event) => {
    setUsername(event.target.value)
  }

  const handleChangePassword = (setPassword, event) => {
    setPassword(event.target.value)
  }

  const linkInfo = props.isLogin
    ? { linkText: "No account yet? Register here!", link: "register" }
    : { linkText: "Already an account? Login here!", link: "login" }

  return (
    <React.Fragment>
      <div className="account-form-container">
        <form
          className="account-form"
          onSubmit={e => props.handleSubmit(e, username, password)}
        >
          {renderInputField("Email", username, "text", e =>
            handleChangeUserName(setUsername, e)
          )}
          {renderInputField("Password", password, "password", e =>
            handleChangePassword(setPassword, e)
          )}
          <div className="input-row align-right">
            <Link to={linkInfo.link}> {linkInfo.linkText}</Link>
            <button className={props.isLogin ? "login" : "register"}>
              {" "}
              {props.isLogin ? "Login" : "Register"}{" "}
            </button>
          </div>
        </form>
      </div>
    </React.Fragment>
  )
}

const renderInputField = (name, value, type, fun) => {
  const lowerCaseName = name.toLowerCase()
  return (
    <div className="input-row">
      <span className="input-row-column">{name}</span>
      <input
        className="input-row-column"
        autoComplete={lowerCaseName}
        value={value}
        onChange={fun}
        type={type}
        id={lowerCaseName}
        name={lowerCaseName}
      />
    </div>
  )
}

export default Form
