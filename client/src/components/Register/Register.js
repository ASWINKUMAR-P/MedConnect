import React from 'react'
import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import './Register.css'

function Register() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })
  const [state, setState] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials.name);
    console.log(credentials.email);
    console.log(credentials.password);

    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ username: credentials.name, email: credentials.email, password: credentials.password })

    });
    const json = await response.json();
    if (json.token) {
      setState(true);
      localStorage.setItem('username', json.username);
      localStorage.setItem('token', json.token);
      localStorage.setItem('userType', "user");
      alert("User Created Successfully")
      navigate("/");
      window.location.reload(true);
    }
    else {
      alert(json.error);
    }
  }
  return (
    <div>
      <div style={{ marginTop: '80px' }}>
      </div>
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
          Sign Up
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
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      </div>
      </div>
    </div>
    </div>
  )
}

export default Register;