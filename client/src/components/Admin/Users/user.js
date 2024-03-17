import React from 'react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios';
import AdminSidebar from '../AdminSidebar';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

export default function AdminUser() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:8000/api/getAllProfiles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json()
    setUsers(data)
    setFilteredUsers(data)
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredData = users.filter((user) => {
      return user.username.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredUsers(filteredData);
  };


  const deleteUser = async (id) => {
    await fetch(`http://localhost:8000/api/deleteProfile/${id}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        window.location.reload();
        if(response.status==200)
        alert("User Account Deleted Successfully");
        else
        alert("error")
      });
  };

  return (
    <div className="main-part" style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white",marginLeft:"200px" }}>
      <div Style="display:block">
        <div className="mb-3">
          <div>
            <input className="form-control me-2 ml-3" style={{maxWidth:"500px"}} type="search" placeholder="Search users"  onChange={handleSearch}/>
          </div>
        </div>
        <table className="table table-hover ml-3 mr-2" style={{fontWeight:"bold",textAlign:"center"}}>
          <thead>
            <tr className='bg-primary'>
              <th style={{ width: '150px', height: '40px', padding:'15px', verticalAlign:"middle" }}>User Name </th>
              <th style={{ width: '300px', height: '40px', padding:'15px', verticalAlign:"middle" }}>Email id</th>
              <th style={{ width: '200px', height: '40px', padding:'15px', verticalAlign:"middle" }}>User Type</th>
              <th style={{ width: '50px', height: '40px', padding:'15px', verticalAlign:"middle" }}>No of Questions</th>
              <th style={{ width: '50px', height: '40px', padding:'15px', verticalAlign:"middle" }}>No of Answers</th>
              <th style={{ width: '75px', height: '40px', padding:'15px', verticalAlign:"middle" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ width: '100px', height: '40px', padding:'10px', verticalAlign:"middle" }}>
                  <NavLink to={{ pathname: `/UserProfile/${user.username}`}} style={{ textDecoration:"none" }}>{user.is_doctor && "Dr. "}{user.username}</NavLink>
                </td>
                <td style={{ width: '400px', height: '40px', padding:'10px', verticalAlign:"middle" }}>{user.email}</td>
                <td style={{ width: '200px', height: '40px', padding:'10px', verticalAlign:"middle" }}>
                  {!user.is_doctor ? 'Normal User': 'Doctor'}
                </td>
                <td style={{ width: '50px', height: '40px', padding:'10px', verticalAlign:"middle" }}>{user.questionCount}</td>
                <td style={{ width: '50px', height: '40px', padding:'10px', verticalAlign:"middle" }}>{user.answerCount}</td>
                <td style={{ width: '75px', height: '40px', padding:'10px' }}>
                <Button
                      variant="outlined"
                      color="error"
                      Style="margin-top:auto; margin-bottom:auto;"
                      onClick={() => deleteUser(user.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}
