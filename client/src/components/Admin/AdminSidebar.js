import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Public, Stars, Work, AccountCircle, Help, Tag } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import './AdminSideBar.css';

export default function AdminSidebar() {
    const [activeOption, setActiveOption] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const { pathname } = location;
        const routes = [
            ['/adminuser','/UserProfile','/UserProfileAnalysis'],
            ['/adminquestions'],
            ['/adminanswer'],
            ['/viewRequests'],
        ];
    
        let activeIndex = -1;
        routes.some((indexRoutes, index) => {
            if (indexRoutes.some(route => pathname.startsWith(route))) {
                activeIndex = index;
                return true;
            }
            return false;
        });
    
        setActiveOption(activeIndex);
    }, [location]);

    return (
        <div className='sidebar'>
            <div className="sidebar-container">
                <div className={`sidebar-option ${activeOption === 0 ? 'side-active' : ''}`}>
                <NavLink to="/adminuser"><AccountCircle/>Show Users</NavLink>
                </div>
                <div className={`sidebar-option ${activeOption === 1 ? 'side-active' : ''}`}>
                <NavLink to="/adminquestions"><Public/>View all question</NavLink>
                </div>
                <div className={`sidebar-option ${activeOption === 2 ? 'side-active' : ''}`}>
                <NavLink to="/adminanswer"><Public/>View all answer</NavLink>
                </div>
                <div className={`sidebar-option ${activeOption === 3 ? 'side-active' : ''}`}>
                <NavLink to="/viewRequests"><Tag/>View Requests</NavLink>
                </div>
            </div>
        </div>
    )
}
