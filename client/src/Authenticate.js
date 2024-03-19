import react from 'react';
import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const Authenticate = ( ) => {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const verifyToken = async () => {
        const response = await fetch('http://localhost:8000/api/verify', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': 'Token '+token,
            },
        });
        const data = await response.json();
        //Check for status code
        if (response.status === 200) {
            setUserData(data);
        } else {
            localStorage.removeItem('token');
            alert('You are not authorized to view this page');
            navigate('/login');
        }
    }
    verifyToken();
    return userData;
}

export default Authenticate;