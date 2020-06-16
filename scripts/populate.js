const faker = require('faker')
const faunadb = require('faunadb')
const { Create, Collection } = faunadb.query
const readline = require('readline-promise').default
const fetch = require('node-fetch')

const keyQuestion = `----- Please provide the FaunaDB admin key) -----
An admin key is powerful, it should only be used for the setup script, not to run your application!
At the end of the script a key with limited privileges will be returned that should be used to run your application
Enter your key:`

const programmingLanguages = [
  'Elixir',
  'Haskell',
  'Erlang',
  'Lisp',
  'Prolog',
  'FQL',
  'Python',
  'JavaScript',
  'Scala',
  'Java',
  'C#',
  'C++',
  'C'
]

const images = [
  'person1',
  'person2',
  'person3',
  'person4',
  'person5',
  'person6',
  'person7',
  'person8',
  'person9',
  'person10'
]

const numberOfProfiles = 20
const main = async () => {
  let serverKey = ''

  const executeQuery = async function(query) {
    return fetch('https://graphql.fauna.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + serverKey,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query: query })
    }).then(el => el.json())
  }
  const interactiveSession = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  await interactiveSession.questionAsync(keyQuestion).then(key => {
    serverKey = key
    interactiveSession.close()
  })
  const client = new faunadb.Client({ secret: serverKey })

  const list = []
  for (var i = 0; i < numberOfProfiles; i++) {
    list.push(i)
  }

  return Promise.all(
    list.map(() => {
      const avatar = getRandom(images, 1)[0]
      const skills = getRandom(programmingLanguages, Math.floor(3 * Math.random()))
      const projects = randomProjects(2)
      const query = `mutation CreateProfile {
        createProfile(data: {
              name: "${faker.name.findName()}"
              icon: "${avatar}"
              projects:{
                create: [${projects
                  .map(el => {
                    return `{ name: "${el}"}`
                  })
                  .join(',')}]
              }
              skills: {
                create:[${skills
                  .map(el => {
                    return `{ name: "${el}"}`
                  })
                  .join(',')}]
              }
        }
        )
        { _id }
    }`
      console.log(query)
      return executeQuery(query).then(result => {
        console.log(result)
        return result
      })
    })
  ).catch(err => {
    console.log(err)
  })
}

const randomProjects = n => {
  const arr = []
  const amount = Math.random(n)
  for (var i = 0; i < amount; i++) {
    arr.push(faker.commerce.productName())
  }
  return arr
}

const getRandom = (arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len)
  if (n > len) throw new RangeError('getRandom: more elements taken than available')
  while (n--) {
    var x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

main()
