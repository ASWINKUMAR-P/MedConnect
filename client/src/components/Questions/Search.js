import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
// import parse from 'html-react-parser';
import Sidebar from '../Sidebar/Sidebar';
import './questions.css';
import { FilterList, QuizRounded } from '@mui/icons-material';
import Posts from './Posts';
import Pagination from './Pagination';

export default function Search() {

    const location = useLocation();
    // const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);

    // for pagination
    const [postPerPage] = useState(2);
    const [currentPage, setcurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('all'); // State to keep track of the active tab

    const fetchAllQuestions = async () => {
        const que = document.getElementById('searchQue').value;
        await fetch(`http://localhost:8000/api/search?keyword=${que}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))
    }
    const answeredQuestions = async () => {
        const que = document.getElementById('searchQue').value;
        await fetch(`http://localhost:8000/api/searchAnswered?keyword=${que}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))
    }

    const unansweredQuestions = async () => {
        const que = document.getElementById('searchQue').value;
        await fetch(`http://localhost:8000/api/searchUnanswered?keyword=${que}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data))
    }



    useEffect(() => {
        fetchAllQuestions();
    }, [activeTab]);

    const handleTabClick = (tabName) => {
        console.log(tabName);
        setActiveTab(tabName);
        switch (tabName) {
            case 'answered':
                answeredQuestions();
                break;
            case 'all':
                fetchAllQuestions();
                break;
            case 'unanswered':
                unansweredQuestions();
                break;
            default:
                fetchAllQuestions();
        }
    }

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = questions.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNum => setcurrentPage(pageNum);

    return (
        <div className="main-part" style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white" }}>
            <div className="stack-index">
                <div className="stack-index-content" >
                    <Sidebar/>
                    <div className="main">
                        <div className="main-container">
                            <div className="main-top">
                                <h2>All Questions</h2>
                            </div>
                            <div className='main-desc'>
                                <p>{questions.length} Questions</p>
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
                                </div>
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