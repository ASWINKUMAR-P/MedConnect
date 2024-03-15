import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
// import Sidebar from '../Sidebar/Sidebar';
import './questions.css';
// import { FilterList } from '@mui/icons-material';
import { Report } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export default function Posts({ posts }) {

    const [noOfAns, setnoOfAns] = useState({});
    const [vote, setVotes] = useState({});
    // This function will find the count of No. of answer for a perticular Question
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
    return (
        <>
            <ul>
                {posts.map(question => (
                    <div className="all-questions">
                        <div className="all-questions-container">
                            <div className="all-questions-left">
                                <div className="all-options">
                                    <div className="all-option">
                                        {(
                                            () => {
                                                if (question.id in noOfAns) {
                                                    return (<p>{noOfAns[question.id]}</p>);
                                                }
                                                else {
                                                    return (<>0</>);
                                                }
                                            }
                                        )()}
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
                                <div className='mt-3'>{question.tags.map(tag => <NavLink to={{ pathname: `/questionOntags/${tag.name}` }} className='question-tags' Style="text-decoration:none; color:hsl(205,47%,42%); background-color: hsl(205,46%,92%); border-radius:5px;">{tag.name}</NavLink>)}</div>
                                <Tooltip title="Report question" className='mt-2' style={{width:"fit-content"}} arrow>
                                    <div className='d-flex'> 
                                    <button className="mr-2 mt-2 d-flex" style={{ background: "none", border:"none", padding: "unset",width:"fit-content" }}>
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
        </>
    )
}
