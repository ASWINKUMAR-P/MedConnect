// Profile.jsx

import React, { useState } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import "../../Sidebar/Sidebar.css";

export default function EditProfile() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })
  const navigate = useNavigate();

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials.name);
    console.log(credentials.email);
    console.log(credentials.password);

    const response = await fetch('http://localhost:8000/api/editProfile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },

      body: JSON.stringify({ username: credentials.name, email: credentials.email, password: credentials.password })

    });
    const json = await response.json();
    if (json.token) {
      localStorage.setItem('username', json.username);
      localStorage.setItem('token', json.token);
      alert("Your profile is edited successfully");
      window.location.reload();
      navigate("/questions");
    }
    else {
      alert(json.error);
    }
  }

  return (
    <div className="main-part" style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white" }}>
        <div className="main d-flex align-items-center">
      <div
        className="d-flex align-items-center justify-content-center "
        style={{
          marginTop: "5%",
          border: "2px solid black",
          borderRadius: "5px",
        }}
      >
      <div style={{ width: "380px" }} className="card text-center">
        <div className="py-4 p-2">
          <div className="display-5 text-center pb-5">
          Edit your details
          </div>
          <form onSubmit={handleSubmit}>
          <div className="form-group">
              <input type="text" className="form-control" placeholder="Enter username" name="name" onChange={onChange}/>
            </div>
            <div className="form-group">
              <input type="email" className="form-control" placeholder="Enter email-id" name="email" onChange={onChange}/>
            </div>
            <div className="form-group">
              <input type="password" className="form-control" placeholder="Enter password" name="password" onChange={onChange}/>
            </div>
            <button type="submit" className="btn btn-primary">Edit details</button>
          </form>
        </div>
      </div>
      </div>
    </div>
        </div>
  )
}
