import React, { useState } from "react";
import Sidebar from '../Sidebar/Sidebar'; // Import the Sidebar component
import { useNavigate } from "react-router-dom";
export default function Editor() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ title: "", tags: "", question: "" });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = credentials.tags.split(" ").filter((tag) => tag.trim() !== "");

    const response = await fetch("http://localhost:8000/api/addquestion/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: credentials.title,
        question: credentials.question,
        tags: tagsArray,
      }),
    });

    const json = await response.json();

    if (json.status === "success") {
      alert(`Your question has been posted successfully!`);
      navigate("/questions");
      window.location.reload(true);
    }
  };

  return (
    <div style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white" }}>
      <div className="stack-index">
        <div className="stack-index-content">
          <Sidebar /> {/* Include the Sidebar component */}
          <div className="main">
            <div className="main-container">
              <div className="main-top">
                <h2>Ask a Public Question</h2>
              </div>
              <form onSubmit={handleSubmit} method="post">
                <div className="questions">
                  <div className="question">
                    <div className="card mt-3">
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            name="title"
                            onChange={onChange}
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Enter Title"
                          />
                          <small id="emailHelp" className="form-text text-muted">
                            Enter your title in few words
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="card mt-3">
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="questionTextarea">Question</label>
                          <textarea
                            name="question"
                            onChange={onChange}
                            className="form-control"
                            id="questionTextarea"
                            rows="3"
                            placeholder="Enter your problem"
                            style={{ borderRadius: "5px", padding: "10px" }}
                          ></textarea>
                          <small id="emailHelp" className="form-text text-muted">
                            Enter your problem in detail
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="card mt-3">
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Tags</label>
                          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                            {credentials.tags.split(" ").map((tag, index) => (
                              <span key={index} className="badge bg-secondary me-1" style={{ margin: "3px", padding: "5px" }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            name="tags"
                            onChange={onChange}
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Enter Tags"
                          />
                          <small id="emailHelp" className="form-text text-muted">
                            Enter the Tags and separate them by space
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-5 mb-5">
                  Ask Question
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
