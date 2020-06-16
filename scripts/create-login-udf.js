const faunadb = require('faunadb')
const { CreateFunction, Query, Lambda, Login, Match, Index, Var, Get, Select, Role, Let } = faunadb.query

// Create an FQL Lambda (a fancy name for function) with two parameters
// This function retrieves the id of the account document by e-mail and since that
// document is secured with credentials we can use the 'Login' to get a token that assumes that documents
// identity. Afterwards we get the account and return both the account and the token.
// secured by credentials. For more info: https://docs.fauna.com/fauna/current/tutorials/authentication/user.html#create
const loginLambda = Lambda(
  ['email', 'password'],
  Select(
    ['secret'],
    Login(Match(Index('accountsByEmail'), Var('email')), {
      password: Var('password')
    })
  )
)

// UDF stands for User Defined Function.
// This is a function that we will enter in FaunaDB, it can later
// be called using: Call(Function('login'), '<email>', '<password>')
const createLoginUDF = CreateFunction({
  name: 'login',
  // The lambda itself is in a separate JavaScript variable so that we can unit test it separately.
  // Since FQL is constructed using plain JavaScript functions, this kind of composition is possible
  body: Query(loginLambda),
  // Note that a function receives a role.
  // Roles define what the function is allowed to do,
  // in this case it will need to use the accounts_by_email index so the role provides access to it.
  role: Role('functionrole_login')
})

module.exports = { createLoginUDF, loginLambda }
