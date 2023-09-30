import React from 'react'
import ItemContent from './ItemContent';
import { Link, useLocation } from 'react-router-dom'

const Item = () => {

  const location = useLocation();

  return (
    <div>
    <div className="row m-0">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link to="products"  
            className={`nav-link ${location.pathname === "/items/products" ? 'active': ''}`} aria-current="page" >Products</Link>
        </li>
        <li className="nav-item">
          <Link to="materials" 
            className={`nav-link ${location.pathname === "/items/materials" ? 'active': ''}`} >Materials</Link>
        </li>
      </ul>
    </div>
    <div className="row">
      <ItemContent />
    </div>
  </div>
  )
}

export default Item