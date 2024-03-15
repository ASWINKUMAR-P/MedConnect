import React, { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import "../../Sidebar/Sidebar.css";
import userimg from "./profile.png";
import doctorimg from "./doctor.png";

export default function ShowProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const fetchUser = async () => {
    await fetch(`http://localhost:8000/api/getProfile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => setUser(data));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div
      className="main-part"
      style={{
        height: "100%",
        marginTop: "13vh",
        zIndex: 1,
        backgroundColor: "white",
      }}
    >
      <div className="stack-index">
        <div className="stack-index-content">
          <Sidebar />
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
                  <div>
                    <img
                      src={user.is_doctor  ? doctorimg : userimg}
                      className="rounded"
                      width="100"
                      alt="Profile Image"
                    />
                  </div>
                  <div className="mt-3 d-flex flex-column justify-content-center">
                  <h4><strong>{user.is_doctor  && <>Dr. </>}{user.username}</strong></h4>
                  <div className="lead">{user.email}</div>
                  </div>
                  <span>Member since {user.date}</span>
                </div>
                <div>
                  <ul className="list-unstyled list">
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "13px",
                        borderTop: "1px solid #eee",
                        cursor: "pointer",
                      }}
                    >
                      <span className="font-weight-bold">Questions asked</span>
                      <div>
                        <span className="mr-1">{user.questionCount}</span>
                        <i className="fa fa-angle-right"></i>
                      </div>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "13px",
                        borderTop: "1px solid #eee",
                        cursor: "pointer",
                      }}
                    >
                      <span className="font-weight-bold">Answers given</span>
                      <div>
                        <span className="mr-1">{user.answerCount}</span>
                        <i className="fa fa-angle-right"></i>
                      </div>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "13px",
                        borderTop: "1px solid #eee",
                        cursor: "pointer",
                      }}
                    >
                      <span className="font-weight-bold">Tags used</span>
                      <div>
                        <span className="mr-1">{user.tagsCount}</span>
                        <i className="fa fa-angle-right"></i>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="mt-3 mb-3 d-flex flex-row justify-content-center">
                  <button onClick={() => navigate("/edit")} className="btn btn-outline-primary">
                    Edit your profile
                  </button>
                  {!user.is_doctor && 
                    <button onClick={() => navigate("/upload")} className="btn btn-outline-primary ml-5">
                      Request doctor identity
                    </button>
                  }
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
