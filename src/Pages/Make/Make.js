import React from 'react'
import MakeContent from './MakeContent';
import { Link, useLocation } from 'react-router-dom'

const Make = () => {

  const location = useLocation();

  return (
    <div>
      <div className="row m-0">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link to="measure"  className={`nav-link ${location.pathname === "/make/measure" ? 'active': ''}`} aria-current="page" >Schedule</Link>
          </li>
          <li className="nav-item">
            <Link to="categories" className={`nav-link ${location.pathname === "/make/categories" ? 'active': ''}`} >Tasks</Link>
          </li>
        </ul>
      </div>
      <div className="row">
        <MakeContent />
      </div>
    </div>
  )
}

export default Make