import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css'
import NavbarMenu from '../Navbar/NavbarMenu';
import Content from '../Content/Content';
import { ToastContainer } from 'react-toastify';
import dataService from '../../Service/dataService'

const DefaultLayout = () => {

    const [shows, setShows] = useState(false);
    const location = useLocation();

    const handlelogout = () => {
        dataService.logout();
        window.location.href='/'
    }

    return (
        <main className={shows ? 'space-toggle' : null}>
            <div className="card border-0 shadow-lg rounded-3 pt-3" style={{marginTop:"100px"}}><Content/></div>
            <div><ToastContainer autoClose={1000}/></div>
            <header className={`header ${shows ? 'space-toggle' : null}`}>
                <div className='header-toggle' onClick={() => setShows(!shows)}>
                    <i className={`fas fa-bars ${shows ? 'fa-solid fa-xmark' : null}`}></i>
                </div>
                <div>
                    {/* User Information */}
                    <div className="dropdown">
                        <Link className="text-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                            Nandha Kumar 
                        </Link>
                        {/* User Information Dropdown */}
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                            <li><Link className="dropdown-item" to="/listuser">Teams</Link></li>
                            <li><Link className="dropdown-item" href="#">Subscription</Link></li>
                            <li><Link className="dropdown-item" href="#" onClick={()=>handlelogout()}>Logout</Link></li>
                        </ul>
                    </div>
                </div>
            </header>

            <aside className={`sidebar ${shows ? 'shows' : null}`}>
                <nav className='navs nav-content'>
                    <div>
                        <Link to='/' className='nav-logo'>
                            <i className={`fas fa-home-alt nav-logo-icon`}></i>
                            <span className='nav-logo-name'>MindMRP</span>
                        </Link>

                        <div className='nav-list'>
                            {NavbarMenu.menu().map((item,index) => (
                                <Link key={index} to={item.to} className={`nav-links ${location.pathname.startsWith(item.to) ? 'actives': ''}`} title={item.name}>
                                    <i className={`${item.icon} nav-link-icon`}></i>
                                    <span className='nav-link-name'>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link to='/login' className='nav-links' onClick={()=>handlelogout()}>
                        <i className='fas fa-sign-out nav-link-icon'></i>
                        <span className='nav-link-name'>Logout</span>
                    </Link>
                </nav>
            </aside>
            
            {/* <h1>Content</h1> */}
            {/* <div className="card border-0 shadow-lg rounded-3 pt-4" style={{marginTop:"100px"}}><Content/></div> */}
        </main>
    )
}

export default DefaultLayout