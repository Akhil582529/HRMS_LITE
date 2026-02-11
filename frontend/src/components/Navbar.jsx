import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NAVBAR.css';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-brand">HRMS Lite</div>
            <div className="nav-links">
                <Link 
                    to="/" 
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                <Link 
                    to="/attendance" 
                    className={`nav-link ${location.pathname === '/attendance' ? 'active' : ''}`}
                >
                    Attendance
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;