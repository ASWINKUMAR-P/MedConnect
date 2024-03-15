import React from 'react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import AdminSidebar from '../AdminSidebar';
import { useEffect } from 'react';

export default function ViewRequests() {
  const [requests, setRequests] = useState([])
  const [state, setState] = useState(false)
  const navigate = useNavigate()

  const fetchRequestStatus = async () => {
    const response = await fetch('http://localhost:8000/api/getAllRequests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json()
    setRequests(data)
    setState(true);
  };

  const handleViewDocuments = (requestId) => {
    navigate(`/view-documents/${requestId}`);
  };

  const handleAcceptRequest = (requestId) => {
    fetch(`http://localhost:8000/api/acceptRequest/${requestId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchRequestStatus();
    state ? setState(false) : setState(true)
  }

  const handleRejectRequest = (requestId) => {
    fetch(`http://localhost:8000/api/rejectRequest/${requestId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchRequestStatus();
    state ? setState(false) : setState(true)
  }


  useEffect(() => {
    fetchRequestStatus();
  }, [state]);

  return (
    <div className="main-part" style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white" }}>
      <div className='stack-index'>
        <div className='stack-index-content'>
          <AdminSidebar />
          <div Style="display:block;">
            <div className="mb-3">
            </div>
            <table className="table table-hover " style={{fontWeight:"bold",textAlign:"center"}}>
              <thead>
                <tr className='bg-primary'>
                  <th style={{ width: '200px', height: '40px', padding:'15px', verticalAlign:"middle" }}>Username</th>
                  <th style={{ width: '200px', height: '40px', padding:'15px', verticalAlign:"middle" }}>No of Proof</th>
                  <th style={{ width: '200px', height: '40px', padding:'15px', verticalAlign:"middle" }}>View proof</th>
                  <th style={{ width: '200px', height: '40px', padding:'15px', verticalAlign:"middle" }}>Request Status</th>
                  <th style={{ width: '200px', height: '40px', padding:'15px', verticalAlign:"middle" }}>Accept/Reject</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td style={{ width: '200px', height: '40px', padding:'10px', verticalAlign:"middle" }}>{request.user.username}</td>
                    <td style={{ width: '200px', height: '40px', padding:'10px', verticalAlign:"middle" }} >{request.files.length}</td>
                    <td style={{ width: '200px', height: '40px', padding:'10px', verticalAlign:"middle" }} ><button className="btn btn-outline-primary" onClick={() => handleViewDocuments(request.id)}>Show documents</button></td>
                    <td style={{ width: '200px', height: '40px', padding:'10px', verticalAlign:"middle" }}>{request.status}</td>
                    <td style={{ width: '200px', height: '40px', padding:'10px', verticalAlign:"middle" }}>
                      {request.status === "pending" && (
                      <>
                        <button className="btn btn-outline-success mr-2" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                        <button className="btn btn-outline-danger" onClick={() => handleRejectRequest(request.id)}>Reject</button>
                      </>
                      )}
                      {request.status === "accepted" && (
                          <button className="btn btn-outline-danger" onClick={() => handleRejectRequest(request.id)}>Reject request</button>
                      )}
                      {request.status === "rejected" && (
                          <button className="btn btn-outline-success" onClick={() => handleAcceptRequest(request.id)}>Accept request</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
