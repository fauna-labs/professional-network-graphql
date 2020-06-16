const faunadb = require('faunadb')
const { CreateIndex, Collection } = faunadb.query

// FaunaDB protects you from inefficient access, in FaunaDB you can't query without an index.
// In order to login with the e-mail we need to be able to retrieve users by e-mail.

const createIndexAccountsByEmail = CreateIndex({
  name: 'accounts_by_email',
  source: Collection('Account'),
  // We will search on email
  terms: [
    {
      field: ['data', 'email']
    }
  ],
  // if no values are added, the index will just return the reference.
  values: [],
  // Prevent that accounts with duplicate e-mails are made.
  // uniqueness works on the combination of terms/values
  unique: true
})

const createDefaultProfilesIndex = CreateIndex({
  name: 'all_profiles',
  source: Collection('profiles'),
  // this is a default index to paginate over in 'ref' order.
  terms: [],
  values: []
})

module.exports = { createIndexAccountsByEmail, createDefaultProfilesIndex }
