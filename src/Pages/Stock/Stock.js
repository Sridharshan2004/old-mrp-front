import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import StockContent from './StockContent';

const Stock = () => {
    const location = useLocation();

    return (
        <div>
            {/* <div className='m-1'>Stock Management</div> */}
            <div className="d-flex flex-row align-items-center justify-content-between py-3 m-1">
                <h5 className="m-0 font-weight-bold text-primary ">Stock Management</h5>
            </div>
            <div className="row m-1">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link to="ProductStockList"
                            className={`nav-link ${location.pathname === "/stock/ProductStockList" ? 'active' : ''}`} aria-current="page" >Products</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="MaterialStockList"
                            className={`nav-link ${location.pathname === "/stock/MaterialStockList" ? 'active' : ''}`} >Materials</Link>
                    </li>
                </ul>
            </div>
            <div className="row">
                <StockContent />
            </div>
        </div>
    )
}

export default Stock