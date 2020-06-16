import React from "react"
import { Link } from "react-router-dom"

const links = [{ href: "/", label: "Profiles" }]

const Nav = () => (
  <nav>
    <ul>
      {links.map(({ key, href, label }) => (
        <li key={`nav-link-${href}-${label}`}>
          <Link to={href}>{label}</Link>
        </li>
      ))}
    </ul>
  </nav>
)

export default Nav
