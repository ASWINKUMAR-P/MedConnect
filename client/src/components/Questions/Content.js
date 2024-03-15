import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { ArrowDropUp, ArrowDropDown, CheckCircle, Check, Report } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./content.css";
import Sidebar from "../Sidebar/Sidebar";
import { MedicalServices } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import Checkbox from "@mui/material/Checkbox";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function Content(props) {
  const navigate = useNavigate();
  const params = useParams();
  const [value, setValue] = useState("");
  const [question, setQuestion] = useState([]);
  const [state, setState] = useState(false);
  const [answers, setAnswer] = useState([]);
  const [voteStatus, setVoteStatus] = useState({});
  const [loginstatus, setloginstatus] = useState(false);
  const [queVote, setQueVote] = useState([]);
  const [author, setAuthor] = useState("");
  const [comments, setComments] = useState({});
  const [acceptStatus, setAcceptStatus] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog open/close
  const [openCommentDialog, setOpenCommentDialog] = useState(false); // State to manage dialog open/close for comment reporting
  const [selectedReason, setSelectedReason] = useState(""); // State to store selected report reason
  const [selectedAnswerId, setSelectedAnswerId] = useState(""); // State to store the ID of the selected answer
  const [selectedCommentId, setSelectedCommentId] = useState(""); // State to store the ID of the selected comment for reporting

  const reportReasons = [
    'Spam or Advertising',
    'Offensive Language or Harassment',
    'Inappropriate Content',
    'Misinformation or Fake News',
    'Impersonation',
    'Copyright Infringement',
    'Privacy Violation',
    'Bullying or Intimidation',
    'Irrelevant or Off-Topic'
  ];

  const handleOpenDialog = (answerId) => {
    setOpenDialog(true);
    setSelectedAnswerId(answerId);
  };

  const handleOpenCommentDialog = (commentId) => {
    setOpenCommentDialog(true);
    setSelectedCommentId(commentId);
  };

  const handleCloseDialog = (reason) => {
    setOpenDialog(false);
    if (reason === "") {
      alert('Please select a reason for reporting the question.');
      return;
    }
    fetch('http://localhost:8000/api/report/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        id: selectedAnswerId,
        reason: reason,
        type: "answer"
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Display alert with the message from the response
        alert(data.message);
        setSelectedReason(""); // Clear the selected reason
      })
      .catch(error => {
        // Handle errors
        console.error('Error reporting question:', error);
        alert('An error occurred while reporting the question.');
      });
  };

  const handleCloseCommentDialog = (reason) => {
    setOpenCommentDialog(false);
    if (reason === "") {
      alert('Please select a reason for reporting the comment.');
      return;
    }
    fetch('http://localhost:8000/api/report/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        id: selectedCommentId,
        reason: reason,
        type: "comment"
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Display alert with the message from the response
        alert(data.message);
        setSelectedReason(""); // Clear the selected reason
      })
      .catch(error => {
        // Handle errors
        console.error('Error reporting comment:', error);
        alert('An error occurred while reporting the comment.');
      });
  };

  const isLoggedIn = () => {
    if (localStorage.getItem("username") !== null) {
      setloginstatus(true);
    }
  };

  const fetchQuestion = async (id) => {
    await fetch(`http://localhost:8000/api/getQuestionById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setQuestion(data);
        setAuthor(data.user.username);
      });
  };

  const fetchAnswers = async (id) => {
    await fetch(`http://localhost:8000/api/getAnswerByQuestionId/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAnswer(data);
      });
  };

  const getValue = (e) => {
    setValue(e.target.value);
  };

  const handleAccept = async (e, id) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/api/acceptAnswer/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token " + localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json["status"] === "true") {
      setAcceptStatus(!acceptStatus);
      alert("The given solution is accepted");
      window.location.reload(true);
    }
  }

  const handleReject = async (e, id) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/api/rejectAnswer/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token " + localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json["status"] === "true") {
      setAcceptStatus(!acceptStatus);
      alert("The given solution is rejected");
      window.location.reload(true);
    }
  }

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/addAnswer/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ description: value }),
      });
      const json = await response.json();
      if (json["status"] === "true") {
        setState(!state);
        setValue("");
        alert("Your answer is added successfully");
        navigate(`/question/${id}`);
      } else {
        alert("Failed to add answer");
      }
    } catch (error) {
      console.error("Error while adding answer:", error);
      alert("Failed to add answer");
    }
  };

  const upvote = async (e, id) => {
    if (localStorage.getItem("username") !== null) {
      e.preventDefault();
      if (document.getElementById("ansdownvotebtn" + id).disabled == true) {
        document.getElementById("ansdownvotebtn" + id).disabled = false;
      } else {
        document.getElementById("ansdownvotebtn" + id).disabled = false;
        document.getElementById("ansupvotebtn" + id).disabled = true;
      }
      const response = await fetch(
        `http://localhost:8000/api/upvoteAnswer/${id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let json = await response.json();
      setVoteStatus(json);
    } else {
      navigate("/login");
    }
  };

  const downvote = async (e, id) => {
    if (localStorage.getItem("username") !== null) {
      e.preventDefault();
      if (document.getElementById("ansupvotebtn" + id).disabled == true) {
        document.getElementById("ansupvotebtn" + id).disabled = false;
      } else {
        document.getElementById("ansupvotebtn" + id).disabled = false;
        document.getElementById("ansdownvotebtn" + id).disabled = true;
      }

      const response = await fetch(
        `http://localhost:8000/api/downvoteAnswer/${id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let json = await response.json();

      setVoteStatus(json);
    } else {
      navigate("/login");
    }
  };

  const fetchQueVotes = async (id) => {
    console.log("Token " + localStorage.getItem("token"));
    const response = await fetch(
      `http://localhost:8000/api/getVotesQuestion/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }
    );

    let json = await response.json();
    console.log(json);
    setQueVote(json);
    console.log(queVote);
  };

  useEffect(() => {
    isLoggedIn();
    fetchQuestion(params.type);
    fetchAnswers(params.type);
    fetchQueVotes(params.type);

    // Fetch comments for each answer when the component mounts
    answers.forEach((ans) => {
      fetchComments(ans.id);
    });
  }, [voteStatus, state, acceptStatus]);

  const fetchComments = async (answerId) => {
    const response = await fetch(`http://localhost:8000/api/getComments/${answerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setComments((prevComments) => ({
      ...prevComments,
      [answerId]: data,
    }));
  };

  const addComment = async (e, answerId) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/addComment/${answerId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ content: value }),
      });
      const json = await response.json();
      if (json["status"] === "true") {
        // Update comments state with the new comment
        setComments((prevComments) => ({
          ...prevComments,
          [answerId]: [...(prevComments[answerId] || []), json.comment],
        }));
        setValue(""); // Clear input field
        alert("Your comment is added successfully");
        window.location.reload(true);
      } else {
        alert("Failed to add comment");
      }
    } catch (error) {
      console.error("Error while adding comment:", error);
      alert("Failed to add comment");
    }
  };

  const toggleComments = async (answerId) => {
    // Toggle the comment box and form
    setComments((prevComments) => ({
      ...prevComments,
      [answerId]: prevComments[answerId] ? undefined : [],
    }));
    setValue(""); // Clear the comment input value

    // Fetch comments when the comment icon is clicked
    if (!comments[answerId]) {
      await fetchComments(answerId);
    }
  };

  const renderComment = (comment, answerId) => {
    return (
      <div key={comment.id} className="comment">
        <strong>{comment.user.username}:</strong> {comment.comment}
        <Tooltip title="Report comment" arrow>
          <button
            className="ml-2"
            style={{ background: "none", border: "none", padding: "unset" }}
            onClick={() => handleOpenCommentDialog(comment.id)}
          >
            <Report style={{ color: "black" }} />
          </button>
        </Tooltip>
      </div>
    );
  };

  const renderComments = (answerId) => {
    const answerComments = comments[answerId] || [];
    return (
      <div>
        {answerComments.map((comment) => renderComment(comment, answerId))}
      </div>
    );
  };

  const renderCommentForm = (answerId) => {
    return (
      <form onSubmit={(e) => addComment(e, answerId)} style={{ display: "flex", alignItems: "flex-start" }}>
        <input
          type="text"
          className="comment-input mr-2"
          placeholder="Add your comment.."
          value={value}
          onChange={getValue}
          style={{
            fontSize: "15px",
            border: "2px solid black",
            borderRadius: "5px",
            height: "30px",
            padding: "5px"
          }}
        ></input>
        <button type="submit" className="btn btn-primary" style={{ height: "30px" }}>
          Add Comment
        </button>
      </form>
    );
  };

  const renderCommentIcon = (ansid) => {
    return (
      <div className="comment-section mt-2">
        <Tooltip title="Comment box" arrow>
          <button onClick={() => toggleComments(ansid)} className="mr-2" style={{ background: "none", border: "1px solid white", padding: "unset" }}>
            <CommentIcon style={{ color: "black" }} />
          </button>
        </Tooltip>
        {comments[ansid] && (
          <div>
            {comments[ansid].length > 0 && (
              <div className="comments">{renderComments(ansid)}</div>
            )}
            <div className="comment-form">{comments[ansid] && renderCommentForm(ansid)}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div Style="height:100vh; margin-top:13vh; z-index:1; background-color:white">
      <div className="stack-index">
        <div className="stack-index-content">
          <Sidebar />
          <div Style="height:100vh;width:70%;display:block;">
            <div className="d-flex flex-row">
              <div className="d-flex flex-column">
                <strong style={{ fontSize: "25px" ,color:"#00008B"}}>Title: {question.title}</strong>
                <div style={{ fontSize: "20px" }}>
                  <strong style={{ fontSize: "25px" ,color:"#00008B"}}>Posted by:</strong>{author}
                </div>
                <strong style={{ fontSize: "25px" ,color:"#00008B"}} className="mt-3">Description:</strong>
                <div style={{ fontSize: "20px" }}>{question.description}</div>
              </div>
            </div>
            <div className="mt-5">
              {answers.length == 0 ? <strong style={{ fontSize: "25px",color:"#00008B" }}>No Answers</strong> : <></>}
              {answers.length == 1 ? <strong style={{ fontSize: "25px",color:"#00008B" }}>1 Answer</strong> : <></>}
              {answers.length > 1 ? <strong style={{ fontSize: "25px",color:"#00008B" }}>{answers.length} Answers</strong> : <></>}
            </div>
            {answers.length > 0 && (
              <div className="mt-3">
                {answers.map((ans) => (
                  <div className="mb-2 mt-2">
                    <div className="d-flex flex-row">
                      <div className="d-flex flex-column" style={{ marginRight: "30px" }}>
                        <IconButton className="btn " id={"ansupvotebtn" + ans.id} onClick={(e) => upvote(e, ans.id)}>
                          <ArrowDropUp style={{ color: "black", fontWeight: "bold" }} fontSize="30px" />
                        </IconButton>
                        <div className="mx-3"><strong>{ans.votes}</strong></div>
                        <IconButton className="btn" id={"ansdownvotebtn" + ans.id} onClick={(e) => downvote(e, ans.id)}>
                          <ArrowDropDown style={{ color: "black", fontWeight: "bold" }} fontSize="30px" />
                        </IconButton>
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <div className="d-flex flex-row">
                          <div>
                            <div style={{ fontSize: "20px" }} className="mb-4"><strong Style="font-size:25px;color:#00008B">Answered by: </strong>{ans.user.is_staff && <>  Dr. </>} {ans.user.username} {ans.user.is_staff && <><Tooltip title="Doctor's solution"><MedicalServices style={{color:"red"}} /></Tooltip></>}</div>
                            <div>{ans.is_accepted && <strong style={{ fontSize: "25px",color:"#00008B" }}><CheckCircle style={{ color: "green" }} size="large" />Accepted</strong>}</div>
                            <strong style={{ fontSize: "25px",color:"#00008B" }}>Solution</strong><div style={{ fontSize: "20px" }} className="mb-4">{ans.solution}</div>
                            <div className="d-flex flex-row">
                              {localStorage.getItem("username") === author && (
                                <>
                                  {ans.is_accepted ? (
                                    <Checkbox checked onClick={(e) => handleReject(e, ans.id)} />
                                  ) : (
                                    <Checkbox onClick={(e) => handleAccept(e, ans.id)} />
                                  )}
                                </>
                              )}
                              {renderCommentIcon(ans.id)}
                              <Tooltip title="Report answer" arrow>
                                <button className="mr-2" style={{ background: "none", border: "none", padding: "unset" }} onClick={() => handleOpenDialog(ans.id)}>
                                  <Report style={{ color: "black" }} />
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr style={{ height: "2px", backgroundColor: "black" }}></hr>
                  </div>
                ))}
              </div>
            )}
            {console.log(question)}
            {localStorage.getItem("username") !== author && (
              <div className="mt-4">
                <strong style={{ fontSize: "25px",color:"#00008B" }}>Your Answer</strong>
                <form
                  onSubmit={(e) => handleSubmit(e, question.id)}
                  method="POST"
                >
                  <textarea
                    type="text"
                    className="mt-2"
                    placeholder="Add your solution.."
                    rows={3}
                    cols={100}
                    name="answer"
                    onChange={getValue}
                    style={{ fontSize: "20px", border: "2px solid black", borderRadius: "5px" }}
                  ></textarea>
                  <br></br>
                  {loginstatus === true ? (
                    <button type="submit" className="btn btn-primary mt-5 mb-3">
                      Post Your Answer
                    </button>
                  ) : (
                    <></>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Report Question</DialogTitle>
        <DialogContent>
          <p>Select a reason for reporting:</p>
          <select onChange={(e) => setSelectedReason(e.target.value)}>
            <option value="">Select reason...</option>
            {reportReasons.map((reason, index) => (
              <option key={index} value={reason}>{reason}</option>
            ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleCloseDialog(selectedReason)} variant="contained" autoFocus>
            Report
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCommentDialog} onClose={() => setOpenCommentDialog(false)}>
        <DialogTitle>Report Comment</DialogTitle>
        <DialogContent>
          <p>Select a reason for reporting:</p>
          <select onChange={(e) => setSelectedReason(e.target.value)}>
            <option value="">Select reason...</option>
            {reportReasons.map((reason, index) => (
              <option key={index} value={reason}>{reason}</option>
            ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommentDialog(false)}>Cancel</Button>
          <Button onClick={() => handleCloseCommentDialog(selectedReason)} variant="contained" autoFocus>
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
