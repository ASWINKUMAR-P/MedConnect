
import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

import Pagination from './Pagination';
import Posts from './../Questions/Posts';

export default function QuestionOnTags() {

    const params = useParams();

    // for pagination
    const [postPerPage] = useState(2);
    const [currentPage, setcurrentPage] = useState(1);

    // for questions
    const [questions, setQuestions] = useState([])

    const fetchQue = async (tagname) => {
        await fetch(`http://localhost:8000/api/getQuestionByTag/${tagname}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))

    }

    // logic to find index of posts to display questions
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = questions.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNum => setcurrentPage(pageNum);

    useEffect(() => {
        fetchQue(params.type);
    }, [])

    return (
        <div Style="height:100%; margin-top:13vh; z-index:1; background-color:white">
            <div className="stack-index">
                <div className="stack-index-content">
                    <Sidebar />
                    <div className="main">
                        <div className="main-container">
                            <div className="main-top">
                                <h2>Questions on {params.type}</h2>
                            </div>
                            <p>Total {questions.length} Questions</p>
                            <div className="questions">
                                <div className="question">
                                    <Posts posts={currentPosts} />
                                </div>
                            </div>
                            <div className="container">
                                <Pagination postsPerPage={postPerPage} totalPosts={questions.length} paginate={paginate} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
