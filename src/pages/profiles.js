import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'

import ProfileCard from './../components/card'
import SessionContext from './../context/session'
import { getProfiles, getProfilesBySkill } from '../data/fauna-queries'

const Profiles = () => {
  const sessionContext = useContext(SessionContext)
  // const { user } = sessionContext.state
  const user = true


  const [state, setState] = useState({
    profiles: [],
    loaded: false,
    toLoad: 'initial', // initial, next, previous
    error: false,
    after: null,
    before: null,
    skill: ''
  })
  // Fetch the profiles after load time.
  useEffect(() => {
    if (!state.loaded && user) {
      if (state.skill && state.skill.length > 0) {
        getProfilesBySkill(state.skill, state.toLoad, state.before, state.after)
          .then(result => {
            console.log('search skills', state.skill, result)
            setState({
              before: result.before,
              after: result.after,
              profiles: result.data ? result.data : [],
              loaded: true,
              skill: state.skill
            })
          })
          .catch(err => {
            console.log(err)
            setState({ error: err, profiles: [], loaded: true })
            toast.error('No data permissions')
          })
      } else {
        getProfiles(state.toLoad, state.before, state.after)
          .then(result => {
            setState({
              before: result.before,
              after: result.after,
              profiles: result.data,
              loaded: true,
              skill: state.skill
            })
          })
          .catch(err => {
            console.log(err)
            setState({ error: err, profiles: [], loaded: true })
            toast.error('No data permissions')
          })
      }
    }
  }, [state, user])

  // Return the header and either show an error or render the loaded profiles.
  return (
    <React.Fragment>
      <div className="spacer"> </div>{' '}
      <div className="search">
        <input
          type="text"
          className="searchTerm"
          placeholder="What are you looking for?"
          onChange={e => {
            setState({
              toLoad: '',
              loaded: false,
              profiles: state.profiles,
              after: state.after,
              before: state.before,
              skill: e.target.value
            })
          }}
        />
      </div>
      <div className="spacer"> </div>{' '}
      <div className="profiles">{generateProfilesOrMessage(state.profiles, state.error, state.loaded, user)}</div>
      <div
        className="previous-button"
        onClick={event =>
          setState({
            toLoad: 'prev',
            loaded: false,
            profiles: state.profiles,
            after: state.after,
            before: state.before,
            skill: state.skill
          })
        }
      >
        {' '}
        previous{' '}
      </div>{' '}
      <div className="spacer"> </div>{' '}
      <div
        className="next-button"
        onClick={event =>
          setState({
            toLoad: 'next',
            loaded: false,
            profiles: state.profiles,
            after: state.after,
            before: state.before,
            skill: state.skill
          })
        }
      >
        {' '}
        Next{' '}
      </div>
    </React.Fragment>
  )
}

const generateProfilesOrMessage = (profiles, error, loaded, user) => {
  // Unexpected error
  if (error) {
    return generateUserError(error)
  }
  // We are not logged in yet
  else if (!user) {
    return generateNotLoggedIn(profiles)
  } else if (!loaded) {
    return generateLoading()
  }
  // We received an empty list of profiles (e.g. they are all private or our filtering is too aggressive)
  else if (profiles && profiles.length === 0) {
    return generateNotFound()
  }
  // Or we just received profiles
  else {
    return generateProfiles(profiles)
  }
}

const generateLoading = error => {
  return (
    <div className="no-results-container">
      <p className="no-results-text"></p>
      <p className="no-results-subtext">Loading</p>
      <img className="no-results-image" src="/images/dino-loading.gif" alt="no results" />
    </div>
  )
}

const generateUserError = error => {
  return (
    <div className="no-results-container">
      <p className="no-results-text">400</p>
      <p className="no-results-subtext">{error.message}</p>
      <img className="no-results-image" src="/images/dino-error.png" alt="no results" />
    </div>
  )
}

const generateNotLoggedIn = () => {
  return (
    <div className="no-results-container">
      <p className="no-results-text">Hi anonymous</p>
      <p className="no-results-subtext">You should log in first</p>
      <img className="no-results-image" src="/images/dino-notloggedin.png" alt="no results" />
    </div>
  )
}

const generateNotFound = () => {
  return (
    <div className="no-results-container">
      <p className="no-results-text">No Results Found</p>
      <p className="no-results-subtext">Looking for a white raven?</p>
      <img className="no-results-image" src="/images/dino-noresults.png" alt="no results" />
    </div>
  )
}

const generateProfiles = profiles => {
  if(profiles){
    return profiles.map((profile, index) => {
      return (
        <ProfileCard
          key={'profile_' + index}
          name={profile.name ? profile.name : ''}
          icon={profile.icon ? profile.icon : 'noicon'}
          skills={profile.skills ? profile.skills : []}
          projects={profile.projects ? profile.projects : []}
          profileKey={index}
        ></ProfileCard>
      )
    })
  }
  else {
    return null
  }
 
}

export default Profiles
