export const safelyExtractErrorCode = err => {
  try {
    console.log(err.requestResult.responseContent.errors[0].cause[0])
    return err.requestResult.responseContent.errors[0].cause[0].code
  } catch (err) {
    return "Woops, unknown error"
  }
}

export const errorCodeToRegisterErrorMessage = errCode => {
  switch (errCode) {
    case "instance not unique":
      return "An account with this email already exists"
    default:
      return "Registration failed"
  }
}
