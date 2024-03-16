import React, { useEffect } from 'react'
import './homepage.css'
import img from './img-1.png';
import { NavLink, useNavigate } from 'react-router-dom';
// import Card from '../Card/card'
var margin = {
    marginTop: "80px",
}
var color1 = {
    backgroundColor: 'white',
    height: '100vh',

}

function Homepage() {
    const navigate = useNavigate();
    const checkAdmin = () => {
        if (localStorage.getItem('usertype') === 'admin') {
            navigate('/adminuser')
        }
        else if(localStorage.getItem('usertype') === 'user'){
            navigate('/questions')
        }
    }
    
    useEffect(() => {
        checkAdmin();
    }, [])

    return (
        <>
            <header Style="height:100%; margin-top:20vh; z-index:1; background-color:white">
                <div className="container mt-5 text-center">
                    <div className="row">

                        <div className="col-lg-6 col-md-12 col-xs-12 mx-4">
                            <div className="contents">
                                <h2 className="head-title">MedConnect <br /><small>Connect Care Thrive</small></h2>
                                <p>Find the best answer to your medical related queries, help others answer theirs. MedConnect is a community-based space to find answers to people's personal medical queries.</p>
                            </div>
                            <div className="text-left">
                                <NavLink to="/questions" className="btn btn-primary started-btn">Go to Dashboard</NavLink>

                            </div>
                        </div>
                        <div className="col-lg-5 col-md-12 col-xs-12 mx-3">
                            <div className="intro-img">
                                <img src={img} alt="Not Loaded" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <footer className="text-center text-lg-start" Style="background-color: #4e63d7; position:absolute; bottom:0vh;width:100%;">
                <div className="text-center text-white p-3" Style="background-color: rgba(0, 0, 0, 0.2);">
                    © 2024 Made With ❤ MedConnect
                </div>
            </footer>
        </>
    )
}

export default Homepage