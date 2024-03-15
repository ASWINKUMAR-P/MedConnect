import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Posts from './Posts';
import Pagination from './Pagination';
import './questions.css';

export default function Questions() {

    const [questions, setQuestions] = useState([]);
    const [postPerPage] = useState(2);
    const [currentPage, setcurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('all'); // State to keep track of the active tab
    const [searchQuery, setSearchQuery] = useState('');

    const fetchQuestions = async () => {
        let apiUrl;
        if (activeTab === 'all') {
            apiUrl = `http://localhost:8000/api/search?keyword=${searchQuery}`;
        } else if (activeTab === 'answered') {
            apiUrl = `http://localhost:8000/api/searchAnswered?keyword=${searchQuery}`;
        } else if (activeTab === 'unanswered') {
            apiUrl = `http://localhost:8000/api/searchUnanswered?keyword=${searchQuery}`;
        }

        await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))
    }

    useEffect(() => {
        fetchQuestions();
    }, [activeTab]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    }

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        setActiveTab(null);
    }

    const paginate = pageNum => setcurrentPage(pageNum);

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = questions.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="main-part" style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white" }}>
            <div className="stack-index">
                <div className="stack-index-content" >
                    <Sidebar/>
                    <div className="main">
                        <div className="main-container">
                            <div className='md-5'>
                                <div className="d-flex" style={{ width: 500 }}>
                                <input className="form-control me-2" id="searchQue" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={handleSearchInputChange}/>
                                <div className="main-filter">
                                    <div className="main-tabs">
                                    <button
                                    className={`main-tab ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('all')}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`main-tab ${activeTab === 'answered' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('answered')}
                                    >
                                        Answered
                                    </button>
                                    <button
                                        className={`main-tab ${activeTab === 'unanswered' ? 'active' : ''}`}
                                        onClick={() => handleTabClick('unanswered')}
                                    >
                                        Unanswered
                                    </button>
                                    </div>
                                </div></div>
                            </div>
                            <div className='main-desc'>
                                <p>{questions.length} Questions</p>
                            </div>
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
