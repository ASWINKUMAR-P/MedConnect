import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import ProfileSidebar from '../AdminSidebar';
import Pagination from '../../Questions/Pagination';
import PostsAns from './PostAns';


export default function Adminanswer() {

    const [filters, setFilters] = useState({ startDate: "", endDate: "", tags: "", status: "" });
    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }
    const [answers, setAnswers] = useState([]);
    const [postPerPage] = useState(2);
    const [currentPage, setcurrentPage] = useState(1);
    const [usedTags, setUsedTags] = useState([]);

    const fetchAllFilteredAnswers = async () => {
        const response = await fetch(`http://localhost:8000/api/getAllFilteredAnswers/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startDate: filters.startDate, endDate: filters.endDate, tags: filters.tags , status:filters.status})
        }).then(response => {
            return response.json();
        }).then(data => setAnswers(data));
    };

    useEffect(() => {
        fetch(`http://localhost:8000/api/getAllTags`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setUsedTags(data));
    }, []);

    useEffect(() => {
        fetchAllFilteredAnswers();
    }, [filters])

    useEffect(() => {
        fetch(`http://localhost:8000/api/getAllAnswers`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(data => setAnswers(data));
    },[]);

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = answers.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNum => setcurrentPage(pageNum);
    console.log(currentPosts);

    return (
        <div Style="height:100vh;margin-top:13vh; z-index:1; background-color:white">
            <div className="stack-index">
                <div className='stack-index-content'>
                    <ProfileSidebar />
                    <div className='d-block'>
                    <div>
                        <div className='filters_menu'>
                            <strong Style="display:inline;font-size:20px">Find answers between:</strong>
                            <input type="date" name="startDate" style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} onChange={onChange} />
                            <strong Style="display:inline;font-size:20px">to</strong>
                            <input type="date" name="endDate" style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} onChange={onChange} />
                            <strong Style="display:inline;font-size:20px">tag:</strong>
                            <select name="tags" onChange={onChange} style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} >
                                <option value="" selected >All tags</option>
                                {usedTags.map(tag => <option value={tag.name}>{tag.name}</option>)}
                            </select>
                            <input type="radio"  name="status" value="Accepted" onChange={onChange}/>
                            <label for="accepted" style={{fontSize: '20px'}}>Accepted</label>
                            <input type="radio" name="status" value="Not Accepted" onChange={onChange}/>
                            <label for="notAccepted" style={{fontSize: '20px'}}>Not Accepted</label>
                        </div>
                        <div className="questions">
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
            </div>
        </div>
    )
}

