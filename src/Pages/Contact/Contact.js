import React from 'react'
import ContactContent from './ContactContent'
import { Link, useLocation } from 'react-router-dom'

const Contact = () => {

  const location = useLocation();

  return (
    <div>
      <div className="row m-1">
        <ul className="nav nav-tabs border-3 ">
          <li className="nav-item">
            <Link to="customers"  className={`nav-link border-3 ${location.pathname === "/contact/customers" ? 'active': ''}`} aria-current="page" >Customers</Link>
          </li>
          <li className="nav-item">
            <Link to="suppliers" className={`nav-link border-3  ${location.pathname === "/contact/suppliers" ? 'active': ''}`} >Suppliers</Link>
          </li>
        </ul>
      </div>
      <div className="row">
        <ContactContent />
      </div>
    </div>
  )
}

export default Contact