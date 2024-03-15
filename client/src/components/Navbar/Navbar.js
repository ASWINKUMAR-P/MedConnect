import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBox from './NotificationBox';
import { useState, useEffect } from 'react';
import './Navbar.css';

var iconstyle = {
  marginleft: "10px",
  textDecoration: "none"
};
var title = {
  color: "#0D6EFD",
};

export default function Navbar() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');

  const isLoggedin = () => {
    if (localStorage.getItem('username') !== null ) {
      setLoginStatus(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('usertype');
    localStorage.removeItem('token');
    setLoginStatus(false);
    alert("Logged out");
    navigate("/");
  };

  useEffect(() => {
    isLoggedin();
  }, [loginStatus]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-light" Style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; position:fixed;top:0; z-index:9999; width:100%;">
        <div className="container-fluid">
          <div className="navbar-brand d-flex" style={{ fontWeight: "500", color: 'black', paddingTop: "10px" }}>
              &nbsp;<i style={title}>Med</i><b>Connect</b>
          </div>
          <div className="collapse navbar-collapse" id="navbarScroll" >
            <ul className="navbar-nav" Style={{ bsSscrollHheight: "100px" }}>
              {loginStatus === true ?
                (<><li class="nav-item" id="username">
                    Hello {localStorage.getItem('username')}
                  </li>
                  <li class="nav-item">
                    <button className='btn btn-outline-primary' onClick={(()=>logout())}>Logout</button>
                  </li></>
                ) :
                (<><li class="nav-item">
                  <button className='btn btn-outline-primary' onClick={handleLoginClick}>Login</button>
                  </li>
                  <li class="nav-item">
                    <button className='btn btn-outline-primary' onClick={handleRegisterClick}>Register</button>
                  </li></>
                )
              }
            </ul>
          </div>
        </div>
      </nav>
  );
}
