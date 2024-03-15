import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/Sidebar';

export default function UploadProof() {
  const [certificates, setCertificates] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [rejected, setRejected] = useState(false);

  const handleChange = (e) => {
    setCertificates([...e.target.files]);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle form submission, e.g., send certificates to server
    console.log('Certificates:', certificates);
    // You can add your logic to send the certificates to the server here
    const formData = new FormData();
    certificates.forEach((certificate, index) => {
      formData.append(`certificate${index}`, certificate);
    });

    await fetch('http://localhost:8000/api/uploadProof/', {
      method: 'POST',
      headers:{
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body: formData,
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      alert('Proof uploaded successfully');
      setPendingRequest(true);
    });
  };

  const checkPendingRequest = async() => {
    await fetch('http://localhost:8000/api/getRequestStatus/', {
      method: 'GET',
      headers:{
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    }).then((response) => {
      return response.json();
    }
    ).then((data) => {
      console.log(data);
      if(data.status === 'pending') {
        setPendingRequest(true);
      }
      else if(data.status === 'rejected'){
        setPendingRequest(false);
        setRejected(true);
      }
    });
  }

  useEffect(() => {
    checkPendingRequest();
  }
  , []);


  return (
    <div className="main-part" style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white" }}>
      <div className='stack-index'>
        <div className='stack-index-content'>
          <Sidebar />
          <div className="main d-flex align-items-center">
            {
              pendingRequest ? <strong>You still have an pending request!!!</strong>
              :
              <div className="d-flex align-items-center justify-content-center">
              <div style={{ marginTop: "5%", border: "2px solid black", borderRadius: "5px", width: "450px" }} className="card text-center">
                <div className="py-4 p-2">
                  <div className="display-5 text-center pb-2">
                    Doctor Profile Request
                  </div>
                  {rejected && <div className='mt-3 mb-4 p-1 alert alert-danger'>Your previous request has been rejected</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="d-flex flex-column align-items-center mb-3">
                      <label htmlFor="certificate">Upload your proof:</label>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',alignItems: 'center', marginTop: '10px' }}>
                        <input type="file" id="certificate" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" multiple required />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Upload</button>
                  </form>
                </div>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
