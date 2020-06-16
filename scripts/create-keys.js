const faunadb = require('faunadb')
const { CreateKey, Role } = faunadb.query

// Create the key for tbe bootstrap role
// This key will only be able to call the 'login' and 'register' UDF functions, nothing more.
const createBootstrapKey = CreateKey({
  role: Role('keyrole_calludfs')
})

module.exports = { createBootstrapKey }
