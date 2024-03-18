import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import ProfileSidebar from '../AdminSidebar';
import Pagination from '../../Questions/Pagination';
import PostsAns from './PostAns';


export default function Adminanswer() {

    const params = useParams();
    const [filters, setFilters] = useState({ startDate: "", endDate: "", tags: "", status: "" });
    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }
    const [answers, setAnswers] = useState([]);
    const [postPerPage] = useState(2);
    const [currentPage, setcurrentPage] = useState(1);
    const qid = params.id;
    const [question, setQuestion] = useState({ title: "", description: "", tags: [] });

    const fetchAllFilteredAnswers = async () => {
        const response = await fetch(`http://localhost:8000/api/getAllFilteredAnswers/${qid}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startDate: filters.startDate, endDate: filters.endDate , status:filters.status})
        }).then(response => {
            return response.json();
        }).then(data => setAnswers(data));
    };


    useEffect(() => {
        fetchAllFilteredAnswers();
        fetch(`http://localhost:8000/api/getQuestionById/${qid}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(data => setQuestion(data));
    }, [filters])

    useEffect(() => {
        fetch(`http://localhost:8000/api/getAllAnswers/${qid}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(data => setAnswers(data));
        fetch(`http://localhost:8000/api/getQuestionById/${qid}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(data => setQuestion(data));
    },[]);

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = answers.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNum => setcurrentPage(pageNum);
    console.log(currentPosts);

    return (
        <div Style="margin-top:13vh; z-index:1; background-color:white;margin-left:200px">
            <div className='d-block pl-3'>
            
            <div>
                <div className='filters_menu'>
                    <strong Style="display:inline;font-size:20px">Find answers between:{" "}</strong>
                    <input type="date" name="startDate" style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} onChange={onChange} />
                    <strong Style="display:inline;font-size:20px">{" "}to{" "}</strong>
                    <input type="date" name="endDate" style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} onChange={onChange} />
                    <input type="radio"  name="status" value="Accepted" onChange={onChange} className='ml-2'/>
                    <label for="accepted" style={{fontSize: '20px'}}>Accepted{" "}</label>
                    <input type="radio" name="status" value="Not Accepted" onChange={onChange} className='ml-2'/>
                    <label for="notAccepted" style={{fontSize: '20px'}}>Not Accepted</label>
                </div>
                <div className="questions">
                <div className='mt-5 ml-2'>
                <div style={{fontSize:"20px",fontWeight:"bold"}}>Question: {question.title}</div>
                          <div style={{fontSize:"15px"}}>{question.description}</div>
                          <div className="mt-3">
                          {question.tags.map((tag) => (
                            <small
                              className="mx-2 px-2 py-1"
                              Style="color:hsl(205,47%,42%); background-color: hsl(205,46%,92%); border-radius:5px;"
                            >
                              {tag.name}
                            </small>
                          ))}
                          </div>
                        </div>
                    <div className="question">
                        <PostsAns posts={currentPosts} />
                    </div>
                </div>
                <div className="container">
                    <Pagination postsPerPage={postPerPage} totalPosts={answers.length} paginate={paginate} />
                </div>
            </div>
            </div>
        </div>
    )
}

