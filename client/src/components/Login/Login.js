import { useState } from 'react'
import './Login.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
function Login() {

  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [state, setState] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    const json = await response.json()
    if (json.token != null) {
      setState(true);
      localStorage.setItem("username", json.username);
      localStorage.setItem("token", json.token);
      localStorage.setItem("usertype",json.userType);
      if (json.userType === "admin") {
        navigate("/adminuser");
          window.location.reload(true);
      }
      else if(json.userType === "user") {
        alert(`Hello ${json.username}`)
        navigate("/questions");
        window.location.reload(true);
      }
    }
    else {
      alert('Invalid Credentials');
    }
  }
  
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })

  }

  useEffect(() => {
  }, [state])

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
          Login
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="email" className="form-control" placeholder="Email-id" name="email" onChange={onChange}/>
            </div>
            <div className="form-group">
              <input type="password" className="form-control" placeholder="Password" name="password" onChange={onChange}/>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
      </div>
    </div>
    </div>
  )
}

export default Login