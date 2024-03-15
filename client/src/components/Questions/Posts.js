import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Report } from '@mui/icons-material';
import './questions.css';

export default function Posts({ posts }) {
    const [noOfAns, setnoOfAns] = useState({});
    const [vote, setVotes] = useState({});
    const [openDialog, setOpenDialog] = useState(false); // State to manage dialog open/close
    const [selectedReason, setSelectedReason] = useState(""); // State to store selected report reason
    const [selectedQuestionId, setSelectedQuestionId] = useState(""); // State to store the ID of the selected question

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
        setnoOfAns(json);
        console.log(json);
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
        if(reason === "") {
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
                                    <div className="all-option">
                                    </div>
                                </div>
                            </div>
                            <div className="question-answer">
                                <NavLink to={{ pathname: `/question/${question.id}` }} className="card-title" Style="text-decoration:none;color:#0074CC"><h4>{question.title}</h4></NavLink>
                                <div style={{ width: "90%" }}>
                                    <div>{question.description}</div>
                                </div>
                                <div className='mt-3'>{question.tags.map((tag, index) => <NavLink key={index} to={{ pathname: `/questionOntags/${tag.name}` }} className='question-tags' Style="text-decoration:none; color:hsl(205,47%,42%); background-color: hsl(205,46%,92%); border-radius:5px;">{tag.name}</NavLink>)}</div>
                                <Tooltip title="Report question" className='mt-2' style={{ width: "fit-content" }} arrow>
                                    <div className='d-flex'>
                                        <button className="mr-2 mt-2 d-flex" style={{ background: "none", border: "none", padding: "unset", width: "fit-content" }} onClick={() => handleOpenDialog(question.id)}>
                                            <Report style={{ color: "black" }} />
                                        </button>
                                        <div className='d-flex mt-2'>Report question</div>
                                    </div>
                                </Tooltip>
                                <div className="author">
                                    <small className='d-flex flex-row-reverse'>{question.user.username} asked this at {question.created_at} </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ul>

            {/* Dialog component */}
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
                    <Button onClick={() => handleCloseDialog(selectedReason)}>Report</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
