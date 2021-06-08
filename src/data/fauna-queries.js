
let secret = process.env.REACT_APP_BOOTSTRAP_FAUNADB_KEY

// Queries

const getProfiles = async function(toLoad, prevBefore, prevAfter) {
  let cursor = ``
  if (toLoad === 'prev' && prevBefore) {
    cursor = `, _cursor: "${prevBefore}"`
  } else if (toLoad === 'next' && prevAfter) {
    cursor = `, _cursor: "${prevAfter}"`
  }
  const query = `
    query GetProfiles {
      allProfiles(_size: 6 ${cursor}) {
        data {
          _id,
          name,
          icon,
          skills {
            data {
              _id
              name
            }
          }
          projects
          {
            data {
              _id
              name
            }
          }
        },
        after,
        before
      }
    }
  `
  return executeQuery(query).then(result => {
    if(result.errors){
      console.error(result.errors)
      return []
    }
    else {
      return result.data.allProfiles
    }
  }).catch((err) => {
    console.error('error executing query', err)
  })
}

const getProfilesBySkill = function(skill, toLoad, prevBefore, prevAfter) {
  let cursor = ``
  if (toLoad === 'prev') {
    cursor = `, _cursor: "${prevBefore}"`
  } else if (toLoad === 'next') {
    cursor = `, _cursor: "${prevAfter}"`
  }

  const query = `
  query GetProfilesBySkill {
    skillsByName(_size: 6, name: "${skill}" ${cursor}){
      data {
        profiles { 
          data { 
            _id,
            name,
            icon,
            skills {
              data {
                _id,
                name
              }
            },
            projects {
              data {
                _id,
                name,
              }
            }
          }
        }
      }
    }
  }
  `

  return executeQuery(query).then(result => {
    if(result.errors){
      console.error(result.errors)
      return []
    }
    else  if (result.data && result.data.skillsByName && result.data.skillsByName.data) {
      if (result.data.skillsByName.data.length === 0) {
        return []
      }
      return {
        data: result.data.skillsByName.data.map(el => el.profiles.data).flat(),
        before: result.before,
        after: result.after
      }
    } else {
      return []
    }
  })
  .catch((err) => {
    console.error('error executing query', err)
  })
}

/* In the FaunaDB console at www.fauna.com
 * we have defined two User Defined Functions (UDF) called login and register.
 * These can only be called by a user that is not registered yet (has the UnregisteredRole)
 * Once Login is called, it will return a secret which will be used further on to query.
 */
const register = function(email, password) {
  const query = `mutation CallRegister {
    register (
      email: "${email}"
      password: "${password}"
    )
    {
      _id
    }
  }`
  return executeQuery(query).then(result => {
    console.log(result)
    return result.data.register
  })
}

const login = async function(email, password) {
  const query = `mutation CallLogin {
    login (
      email: "${email}"
      password: "${password}"
    )
  }`
  return executeQuery(query).then(result => {
    console.log('login result', result)
    secret = result.data.login
    return secret
  })
}

const executeQuery = async function(query) {
  return fetch('https://graphql.fauna.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + secret,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ query: query })
  }).then(el => { 
    const res =  el.json()
    return res
  })
  .catch((err) => {
    console.log(err)
  })
}

export { getProfiles, getProfilesBySkill, register, login }
