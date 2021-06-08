# About this repository
This project is an example application that was built specifically to do GraphQL demos and is definitely not a complete application yet. We aim to finish it and write complete example applications with GraphQL in the near future just like we did with the Fauna Query Language [here](https://css-tricks.com/rethinking-twitter-as-a-serverless-app/)
In the meantime we'll release this simple demo since many users asked about it. 

This repository was part of a workshop which you can watch here: https://www.youtube.com/watch?v=_kEDBitNbnY and which can be followed by running through this document: https://docs.google.com/document/d/10HrtNsaQH0MBTsRKJIQldEr9XMiTLWkEsJ0HYEIrmSU/edit where the answers are provided in white text. 

# Disclaimer
Since the repository is used as a workshop repository, the default branch **does not contain** all the code. To set up the project with all code included you will need to go to the final branch:

```
git checkout final
```

## What it shows
This app shows how to set up a GraphQL endpoint in minutes and further goes into authentication with FaunaDB without a backend and implements some simple queries with pagination. FaunaDB's security roles are extremely flexible and can be applied on GraphQL, we can also combine GraphQL with FQL via User Defined Functions (UDFs) by using the @resolver tag in our GraphQL schema. 
This example demonistrates this by using two custom User Defined Functions to bootstrap the security for our GraphQL endpoint. We start off with a token that can only call two User Defined Functions (like stored procedures) functions (register, login). Once the user logs in, the token is swapped with a 'login token' which has access to view profiles. The queries to get the data are pure GraphQL queries that were automatically generated by Fauna when we imported the schema.

## Setup the project

### Create a database
Log in to the FaunaDB [dashboard](https://dashboard.fauna.com/) and create a new database by clicking on *New Database*
Give it a name and click *Save*

### Import the schema
Setting up a GraphQL endpoint in FaunaDB is all about importing the schema which you can find in this repository under src/
The schema looks a follows: 

```
type Account {
  email: String! @unique
}

type Profile {
  name: String!
  icon: String!
  account: Account! @relation
  skills: [ Skill ! ] @relation
  projects: [ Project! ] @relation
}

type Project {
  name: String!
  profile: [ Profile! ] @relation
}

type Skill {
  profiles: [ Profile! ] @relation
  name: String!
}

type Query {
  allProfiles: [Profile!]
  accountsByEmail(email: String!): [Account!]!
  skillsByName(name: String!): [Skill!]!
}

type Mutation {
  register(email: String!, password: String!): Account! @resolver
  login(email: String!, password: String!): String! @resolver
}
```

Go to the GraphQL tab in the FaunaDB [dashboard](https://dashboard.fauna.com/) and click import schema and select the schema.gql file. 
You now have a GraphQL endpoint and should get a playground to play around with it. 

### Run the setup scripts

We have added scripts to set up all the security roles, collections, indexes to make this work. 
The scripts are meant to get you started easily and to document the process. Take a peek in the scripts/setup.js script to see how this is setup. To run the script, create an Admin key on https://dashboard.fauna.com/ via the Security tab, copy the key's secret and run: 

`npm run setup`

Paste the admin key's secret when prompted by the script. Do not use the admin key for anything other than the setup script. Admin keys are powerful and meant to manipulate all aspects of the database (create/drop collections/indexes/roles).

The script creates a login key and outputs that key's secret. Copy the secret and place it in a .env.local file:
`
REACT_APP_BOOTSTRAP_FAUNADB_KEY=<YOUR FAUNA LOGIN KEY>
`

### Update the UDFs
When you use a @resolver, it will create a UDF stub for you but since a resolver is custom FQL code, that FQL can't be generated for you.

Go to the Fauna dashboard again, click on Functions and then change the body of the *login* function to the following:

```
Query(Lambda(['email', 'password'],
    Select(
      ['secret'],
      Login(Match(Index('accountsByEmail'), Var('email')), {
        password: Var('password')
      })
    )
))
```

Select the *register* function and update the body to the following:

```
Query(Lambda(['email', 'password'],
    Create(Collection('Account'), {
      credentials: { password: Var('password') },
      data: {
        email: Var('email')
      }
  })
))
```

Note: make sure not to create the UDF before you upload the GraphQL schema, it has to be created with the GraphQL schema since this will include metadata for the UDF to set it up that it can be called from GraphQL.

## Run the project
To run the project, enter `npm start` on the command line.
