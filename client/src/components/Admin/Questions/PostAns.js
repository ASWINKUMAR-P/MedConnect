import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { MedicalServices } from "@mui/icons-material";
import { Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useState, useEffect } from 'react';

export default function Posts({ posts }) {
    const [openChat, setOpenChat] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerComments, setAnswerComments] = useState({});

    const toggleChat = async (answerId) => {
        setSelectedAnswer(answerId);
        setOpenChat(!openChat);
        if (!answerComments[answerId]) {
            await fetchComments(answerId);
        }
    };

    const fetchComments = async (answerId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/getComments/${answerId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setAnswerComments(prevComments => ({
                ...prevComments,
                [answerId]: data,
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const deleteAnswer = async (id) => {
        await fetch(`http://localhost:8000/api/deleteAnswer/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log(response);
                window.location.reload();
                alert("Answer deleted Successfully");
            });
    };

    //Give a code for delete comment
    const deleteComment = async (id) => {
        await fetch(`http://localhost:8000/api/deleteComment/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log(response);
                window.location.reload();
                alert("Comment deleted Successfully");
            });
    };

    return (
        <div>
            {posts.map(answer => (
                <div className="all-questions" key={answer.id}>
                    <div className="all-questions-container">
                        <div className="all-questions-left">
                            <div className="all-options">
                                <div className="all-option">
                                    <div>{answer.votes}</div>
                                    <span>Votes</span>
                                </div>
                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => deleteAnswer(answer.id)}>Delete</Button>
                            </div>
                        </div>
                        <div className="question-answer">
                            <div style={{ width: "90%" }}>
                                <div style={{ fontSize: "20px", fontWeight: "bold" }}>Answer {answer.user.is_staff && <><Tooltip title="Doctor's Solution"><MedicalServices style={{ color: "red" }} /></Tooltip></>}: </div>
                                <div style={{ fontSize: "15px" }}>{answer.solution}</div>
                            </div>
                            <div className="author">
                                <div className="author-details d-flex flex-row-reverse mr-3" style={{ fontSize: "15px" }}>
                                    <small>answered by {answer.user.is_staff && "Dr."} {answer.user.username} on {answer.created_at}</small>
                                </div>
                            </div>
                            <div className="chat-icon" onClick={() => toggleChat(answer.id)}>
                                <Tooltip title="Open Chat">
                                    <ChatIcon />
                                </Tooltip>
                                {openChat && selectedAnswer === answer.id && (
                                <div className="chatbox">
                                    {/* Render comments associated with this answer */}
                                    {answerComments[answer.id] && answerComments[answer.id].map(comment => (
                                        <div key={comment.id} className="comment">
                                            <div className='d-flex'>
                                            <strong>{comment.user.username}</strong>: {comment.comment}
                                            <Tooltip title="Delete Comment" arrow>
                                            <DeleteIcon style={{color:"red"}} onClick={()=>deleteComment(comment.id)}/>
                                            </Tooltip>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
