import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField } from '@mui/material';
import { Report, Delete, Edit, Warning } from '@mui/icons-material';
import './questions.css';

export default function Posts({ posts }) {
    const [noOfAns, setNoOfAns] = useState({});
    const [vote, setVotes] = useState({});
    const [openDialog, setOpenDialog] = useState(false); // State to manage dialog open/close
    const [selectedReason, setSelectedReason] = useState(""); // State to store selected report reason
    const [selectedQuestionId, setSelectedQuestionId] = useState(""); // State to store the ID of the selected question
    const [editQuestion, setEditQuestion] = useState(null); // State to hold edited question data

    // Array of report reasons
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

    const FindFrequencyOfAns = async () => {
        const response = await fetch("http://localhost:8000/api/getNoOfAnswersForAll", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        setNoOfAns(json);
    }

    const fetchVotes = async () => {
        const response = await fetch(`http://localhost:8000/api/getAllQuestionVotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let json = await response.json();
        setVotes(json);
    }

    useEffect(() => {
        FindFrequencyOfAns();
        fetchVotes();
    }, [])

    const handleOpenDialog = (questionId) => {
        setOpenDialog(true);
        setSelectedQuestionId(questionId);
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
                id: selectedQuestionId,
                reason: reason,
                type: "question"
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Display alert with the message from the response
            alert(data.message);
        })
        .catch(error => {
            // Handle errors
            console.error('Error reporting question:', error);
            alert('An error occurred while reporting the question.');
        });
    };

    const handleEditDialogOpen = (questionId) => {
        const questionToEdit = posts.find(question => question.id === questionId);
        setEditQuestion(questionToEdit);
        setOpenDialog(true);
    };

    const handleEditDialogClose = () => {
        setEditQuestion(null);
        setOpenDialog(false);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/editQuestion/${editQuestion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editQuestion),
            });

            const data = await response.json();
            alert(data.message); // Display response message
            handleEditDialogClose(); // Close the dialog
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error editing question:', error);
            alert('An error occurred while editing the question.');
        }
    };

    const deleteMyQuestion = async (id) => {
        await fetch(`http://localhost:8000/api/deleteQuestionById/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
            alert("Question Deleted Successfully");
        });
    }

    return (
        <>
            <ul>
                {posts.map(question => (
                    <div className="all-questions" key={question.id}>
                        <div className="all-questions-container">
                            <div className="all-questions-left">
                                <div className="all-options">
                                    <div className="all-option">
                                        {question.id in noOfAns ? (
                                            <p>{noOfAns[question.id]}</p>
                                        ) : (
                                            <>0</>
                                        )}
                                        <span>Answers</span>
                                    </div>
                                    <div className="all-option d-flex flex-row justify-content-center">
                                        {question.user.username === localStorage.getItem('username') ? (
                                            <>
                                                {/* Edit button */}
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton onClick={() => handleEditDialogOpen(question.id)}>
                                                        <Edit style={{ color: "green" }} />
                                                    </IconButton>
                                                </Tooltip>
                                                {/* Delete button */}
                                                <Tooltip title="Delete" arrow>
                                                    <IconButton onClick={() => deleteMyQuestion(question.id)}>
                                                        <Delete style={{ color: "red" }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <Tooltip title="Report" arrow>
                                                <IconButton onClick={() => handleOpenDialog(question.id)}>
                                                    <Warning style={{ color: "black" }}/>
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="question-answer">
                                <NavLink to={{ pathname: `/question/${question.id}` }} className="card-title" Style="text-decoration:none;color:#0074CC"><h4>{question.title}</h4></NavLink>
                                <div style={{ width: "90%" }}>
                                    <div>{question.description}</div>
                                </div>
                                <div className='mt-3'>{question.tags.map((tag, index) => <NavLink key={index} to={{ pathname: `/questionOntags/${tag.name}` }} className='question-tags' Style="text-decoration:none; color:hsl(205,47%,42%); background-color: hsl(205,46%,92%); border-radius:5px;">{tag.name}</NavLink>)}</div>
                                <div className="author">
                                    <small className='d-flex flex-row-reverse mr-5'>{question.user.username===localStorage.getItem("username")?"You" : question.user.username} asked this at {question.created_at} </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ul>

            {/* Dialog component */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>{editQuestion ? 'Edit Question' : 'Report Question'}</DialogTitle>
                <DialogContent>
    {editQuestion ? (
        <div>
            <TextField
                label="Title"
                fullWidth
                value={editQuestion.title}
                onChange={(e) => setEditQuestion({ ...editQuestion, title: e.target.value })}
                variant="outlined"
                margin="normal"
            />
            <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={editQuestion.description}
                onChange={(e) => setEditQuestion({ ...editQuestion, description: e.target.value })}
                variant="outlined"
                margin="normal"
            />
            <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    {editQuestion.tags.map((tag, index) => (
                        <span key={index} className="badge bg-secondary me-1" style={{ margin: "3px", padding: "5px" }}>
                            {tag.name}
                        </span>
                    ))}
                </div>
                <input
                    type="text"
                    name="tags"
                    value={editQuestion.tags.map(tag => tag.name).join(' ')}
                    onChange={(e) => setEditQuestion({ ...editQuestion, tags: e.target.value.split(' ').map(name => ({ name })) })}
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
    ) : (
        <div>
            <p>Select a reason for reporting:</p>
            <select onChange={(e) => setSelectedReason(e.target.value)}>
                <option value="">Select reason...</option>
                {reportReasons.map((reason, index) => (
                    <option key={index} value={reason}>{reason}</option>
                ))}
            </select>
        </div>
    )}
</DialogContent>
 

                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    {editQuestion ? (
                        <Button onClick={handleEditSubmit}>Save</Button>
                    ) : (
                        <Button onClick={() => handleCloseDialog(selectedReason)}>Report</Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}
