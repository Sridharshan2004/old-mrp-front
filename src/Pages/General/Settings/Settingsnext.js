import React from 'react'
import SettingContent from './SettingContent'
import { Link, useLocation } from 'react-router-dom'

const Settingsnext = () => {

  const location = useLocation();

  return (
    <div>
      <div className='row'>
        <div className='col-2'>
        <ul id="myTab" role="tablist" className="nav nav-tabs nav-pills flex-column flex-sm-row text-center bg-light border-0 rounded-nav">
          <li className="nav-item flex-sm-fill">
            <Link to="measure" role="tab" className={`nav-link border-0 text-uppercase font-weight-bold ${location.pathname === "/settings/measure" ? 'active': ''}`}
            data-toggle="tab" aria-controls="home" aria-selected="true" >Units of measure</Link>
          </li>
          <li className="nav-item flex-sm-fill">
            <Link to="categories" className={`nav-link border-0 text-uppercase font-weight-bold ${location.pathname === "/settings/categories" ? 'active': ''}`}
            data-toggle="tab"  role="tab" aria-controls="home" aria-selected="true" >Categories</Link>
          </li>
          <li className="nav-item flex-sm-fill">
            <Link to="operations" className={`nav-link border-0 text-uppercase font-weight-bold ${location.pathname === "/settings/operations" ? 'active': ''} `}
            data-toggle="tab" role="tab" aria-controls="home" aria-selected="true" >Operations</Link>
          </li>
          <li className="nav-item flex-sm-fill">
            <Link to="resources" className={`nav-link border-0 text-uppercase font-weight-bold ${location.pathname === "/settings/resources" ? 'active': ''} `}
            data-toggle="tab" role="tab" aria-controls="home" aria-selected="true" >Resources</Link>
          </li>
          <li className="nav-item flex-sm-fill">
            <Link to="locations" className={`nav-link border-0 text-uppercase font-weight-bold ${location.pathname === "/settings/locations" ? 'active': ''} `}
            data-toggle="tab" aria-controls="home" aria-selected="true" >Locations</Link>
          </li>
        </ul>
        </div>
        <div className='col-9' style={{"background":'#F0F8FF'}}><SettingContent /></div>
      </div>
    </div>
  )
}

export default Settingsnext