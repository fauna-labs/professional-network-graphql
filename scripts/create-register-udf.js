const faunadb = require('faunadb')
const { CreateFunction, Create, Query, Lambda, Var, Role, Collection } = faunadb.query

// Create an FQL Lambda (a fancy name for function) with two parameters
// This function creates a new account document in the database that is
// secured by credentials. For more info: https://docs.fauna.com/fauna/current/tutorials/authentication/user.html#create
const registerLambda = Lambda(
  ['email', 'password'],
  Create(Collection('Account'), {
    credentials: { password: Var('password') },
    data: {
      email: Var('email')
    }
  })
)

// UDF stands for User Defined Function.
// This is a function that we will enter in FaunaDB, it can later
// be called using: Call(Function('login'), '<email>', '<password>')
const createRegisterUDF = CreateFunction({
  name: 'register',
  // The lambda itself is in a separate JavaScript variable so that we can unit test it separately.
  // Since FQL is constructed using plain JavaScript functions, this kind of composition is possible
  body: Query(registerLambda),
  // Note that a function receives a role.
  // Roles define what the function is allowed to do,
  // in this case, the function should be able to create an account!
  role: Role('functionrole_register')
})

module.exports = { createRegisterUDF, registerLambda }
