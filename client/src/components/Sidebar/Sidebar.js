import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Public, PieChart, Tag, AccountCircle, Help } from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const [activeOption, setActiveOption] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const { pathname } = location;
        const routes = [
            ['/profile','/edit','/upload'],
            ['/ask'],
            ['/questions','/question'],
            ['/tags','/questionOnTags/:type'],
            ['/analysis'],
        ];
    
        let activeIndex = -1;
        routes.some((indexRoutes, index) => {
            if (indexRoutes.some(route => pathname.startsWith(route))) {
                activeIndex = index;
                return true; // Break out of the loop
            }
            return false;
        });
    
        setActiveOption(activeIndex);
    }, [location]);

    return (
        <>
        { localStorage.getItem('usertype')=='user' ? (<div className='sidebar'>
        <div className="sidebar-container">
            <div className={`sidebar-option ${activeOption === 0 ? 'side-active' : ''}`}>
            <NavLink to="/profile"><AccountCircle/>Show Profile</NavLink>
            </div>
            <div className={`sidebar-option ${activeOption === 1 ? 'side-active' : ''}`}>
            <NavLink to="/ask"><Help/>Post a question</NavLink>
            </div>
            <div className={`sidebar-option ${activeOption === 2 ? 'side-active' : ''}`}>
            <NavLink to="/questions"><Public/>All Questions</NavLink>
            </div>
            <div className={`sidebar-option ${activeOption === 3 ? 'side-active' : ''}`}>
            <NavLink to="/tags"><Tag/>All Tags</NavLink>
            </div>
            <div className={`sidebar-option ${activeOption === 4 ? 'side-active' : ''}`}>
            <NavLink to="/analysis"><PieChart/>View Analytics</NavLink>
            </div>
        </div>
    </div>) : null}
    </>
    )
}
