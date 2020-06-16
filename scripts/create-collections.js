const faunadb = require('faunadb')
const { CreateCollection } = faunadb.query

// A FaunaDB collection is like an SQL table.
// Creating a collection in FaunaDB is easy.
const createAccounts = CreateCollection({ name: 'accounts' })
const createProfiles = CreateCollection({ name: 'profiles' })

module.exports = { createAccounts, createProfiles }
