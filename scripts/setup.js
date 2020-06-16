// This script sets up the database to be used for this example application.
// Look at the code to see what is behind the magic
const faunadb = require('faunadb')
const readline = require('readline-promise').default

// We separated all the different things in separate files to keep an overview.
// const { createAccounts, createProfiles } = require('./create-collections')
// const { createIndexAccountsByEmail } = require('./create-indexes')
const { createFnRoleRegister, createFnRoleLogin, createBootstrapRole, createLoggedInRole } = require('./create-roles')
const { createBootstrapKey } = require('./create-keys')

const keyQuestion = `----- 1. Please provide the FaunaDB admin key) -----
An admin key is powerful, it should only be used for the setup script, not to run your application!
At the end of the script a key with limited privileges will be returned that should be used to run your application
Enter your key:`

const explanation = `
Thanks!
This script will (Do not worry! It will all do this for you): 
 - Setup the user defined functions 'login and register'
 - Create roles that the user defined functions will assume
 - Create a role for the initial key which can only call login/register
 - Create a role for an account to assume (database entities can assume roles, using Login a key can be retrieved for such an entity)
(take a look at scripts/setup.js if it interests you what it does)
`

const main = async () => {
  // In order to set up a database, we need a admin key, so let's ask the user for a key.
  let serverKey = ''
  const interactiveSession = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  await interactiveSession.questionAsync(keyQuestion).then(key => {
    serverKey = key
    interactiveSession.close()
  })
  console.log(explanation)
  const client = new faunadb.Client({ secret: serverKey })

  try {
    // console.log('1. Creating collections')
    // await handleError(client.query(createAccounts), 'accounts collection')
    // await handleError(client.query(createProfiles), 'profiles collection')

    // console.log('2. Creating indexes')
    // await handleError(client.query(createIndexAccountsByEmail), 'accounts by email index')
    // await handleError(client.query(createDefaultProfilesIndex), 'all profiles index')

    console.log('1. Creating security roles to be assumed by the functions')
    await handleError(client.query(createFnRoleLogin), 'function role - login')
    await handleError(client.query(createFnRoleRegister), 'function role - register')

    console.log('2. Creating security role that can call the functions')
    await handleError(client.query(createBootstrapRole), 'function role - bootstrap')

    console.log('3. Give all accounts access to read profiles')
    await handleError(client.query(createLoggedInRole), 'membership role - logged in role')

    const clientKey = await handleError(client.query(createBootstrapKey), 'token - bootstrap')
    if (clientKey) {
      console.log(
        '\x1b[32m',
        'The client token, place it in your .env with the key REACT_APP_BOOTSTRAP_FAUNADB_KEY, react will load the .env vars'
      )
      console.log('\x1b[33m%s\x1b[0m', clientKey.secret)
    }
  } catch (err) {
    console.error('Unexpected error', err)
  }
}

const handleError = (promise, entity) => {
  return promise
    .then(data => {
      console.log(`   [ Created ] '${entity}'`)
      return data
    })
    .catch(error => {
      if (error && error.message === 'instance already exists') {
        console.warn(`   [ Skipped ] '${entity}', it already exists`)
      } else {
        console.error(`   [ Failed  ] '${entity}', with error:`, error)
      }
    })
}

main()
