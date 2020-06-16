const faunadb = require('faunadb')
const { CreateRole, Collection, Index } = faunadb.query

// The register function only needs to be able to create accounts.
const createFnRoleRegister = CreateRole({
  name: 'functionrole_register',
  privileges: [
    {
      resource: Collection('Account'),
      actions: { create: true } // write is to update, create to create new instances
    }
  ]
})

// The login function only needs to be able to Login into accounts with the 'Login' FQL function.
// That FQL function requires a reference and we will get the account reference with an index.
// Therefore it needs read access to the 'accounts_by_email' index. Afterwards it will return the
// account so the frontend has the email of the user so we also need read access to the 'accounts' collection
const createFnRoleLogin = CreateRole({
  name: 'functionrole_login',
  privileges: [
    {
      resource: Index('accountsByEmail'),
      actions: { read: true }
    },
    {
      resource: Collection('Account'),
      actions: { read: true }
    }
  ]
})

// When a user first arrives to the application, he should only be able to create a new account (register UDF) and login with a given account (login UDF)
// This role will be used to generate a key to bootstrap this process.
const createBootstrapRole = CreateRole({
  name: 'keyrole_calludfs',
  privileges: [
    {
      resource: faunadb.query.Function('login'),
      actions: {
        call: true
      }
    },
    {
      resource: faunadb.query.Function('register'),
      actions: {
        call: true
      }
    }
  ]
})

// Finally, the last role will not be assumed by a function or used to create a key.
// It will be assumed by a database Entity!
// We can assign a role to a collection or a subset of a collection using the 'membership' field.
// This will make sure that the database entity has the privileges from this role.
// We can then use these privileges by using the 'Login' token on such a database entity.
// (which we do in src/data/fauna-queries > login)
// The result will be a token for that database entity that has the privileges below.
const createLoggedInRole = CreateRole({
  name: 'membershiprole_loggedin',
  privileges: [
    {
      resource: Collection('Profile'),
      actions: {
        read: true
      }
    },
    {
      resource: Collection('Project'),
      actions: {
        read: true
      }
    },
    {
      resource: Collection('Skill'),
      actions: {
        read: true
      }
    },
    {
      resource: Collection('profile_projects'),
      actions: {
        read: true
      }
    },
    {
      resource: Collection('profile_skills'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('allProfiles'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('profile_projects_by_profile'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('profile_projects_by_profile_and_project'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('profile_projects_by_project'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('profile_skills_by_profile'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('profile_skills_by_profile_and_skill'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('profile_skills_by_skill'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('skillsByName'),
      actions: {
        read: true
      }
    },
    {
      resource: Index('unique_Account_email'),
      actions: {
        read: true
      }
    }
  ],
  membership: [
    {
      resource: Collection('Account')
    }
  ]
})

module.exports = { createFnRoleRegister, createFnRoleLogin, createBootstrapRole, createLoggedInRole }
