import React from 'react'
import PropTypes from 'prop-types'
// import { Link } from "react-router-dom"

const Card = props => {
  const icon = props.icon ? props.icon.toLowerCase() : 'person1'

  return (
    // <Link
    //   key={"profile_card_link" + props.profileKey}
    //   href="/profiles/[id]"
    //   as={`/profiles/${props.name.toLowerCase()}`}
    // >
    <div className="profile-card">
      <div className="profile-picture">
        <img className="profile-image" src={`/images/${icon}.png`} alt="profile" />
      </div>
      <div className="profile-card-text-container">
        <div className="profile-card-text">
          <p className="profile-name"> {props.name} </p>
          <p className="profile-description"> Skills </p>
          <ul className="profile-language-list">{listSkills(props.skills.data, props.profileKey)}</ul>
          <p className="profile-description"> Projects </p>
          <ul className="profile-projects-list">{listProjects(props.projects.data, props.profileKey)}</ul>
        </div>
      </div>
    </div>
    // </Link>
  )
}

const listSkills = (skills, profileKey) => {
  return skills ? (
    skills.map((skill, index) => (
      <li key={`profile-${profileKey}-language-${index}`} className="profile-language">
        {' '}
        {skill.name}{' '}
      </li>
    ))
  ) : (
    <br></br>
  )
}

const listProjects = (projects, profileKey) => {
  return projects ? (
    projects.map((skill, index) => (
      <li key={`profile-${profileKey}-project-${index}`} className="profile-project">
        {' '}
        {skill.name}{' '}
      </li>
    ))
  ) : (
    <br></br>
  )
}

Card.propTypes = {
  profileKey: PropTypes.number,
  name: PropTypes.string,
  icon: PropTypes.string,
  description: PropTypes.string,
  skills: PropTypes.object,
  projects: PropTypes.object
}

export default Card
