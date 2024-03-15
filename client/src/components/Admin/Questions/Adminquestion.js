import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import parse from "html-react-parser";
import axios from "axios";
import "../../Questions/questions.css";
import AdminSidebar from "../AdminSidebar";
import Pagination from "../../MyProfile/MyQuestions/Pagination";
import ProfileSidebar from "../AdminSidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import PostQues from "./PostQues";

export default function Adminquestion() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    tags: "",
  });

  const onChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const [questions, setQuestions] = useState([]);
  const [noOfAns, setnoOfAns] = useState({});
  const [vote, setVotes] = useState({});
  const [usedTags, setUsedTags] = useState([]);
  const [postPerPage] = useState(2);
  const [currentPage, setcurrentPage] = useState(1);
  const [filteredQue, setFilteredQue] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = questions.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNum) => setcurrentPage(pageNum);

  const fetchAllFilteredQuestions = async () => {
    const response = await fetch(
      `http://localhost:8000/api/getQuestionByFilter/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: filters.startDate,
          endDate: filters.endDate,
          tags: filters.tags,
        }),
      }
    );
    const data = await response.json();
    setQuestions(data);
    setFilteredQue(data);
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/getAllTags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => setUsedTags(data));
  }, []);

  useEffect(() => {
    fetchAllFilteredQuestions();
  }, [filters]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/getQuestions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => setQuestions(data));
  }, []);

  const FindFrequencyOfAns = async () => {
    const response = await fetch(
      "http://localhost:8000/api/getNoOfAnswersForAll",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    setnoOfAns(json);
  };

  const fetchAllQuestions = async () => {
    await fetch("http://localhost:8000/api/getQuestions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => setQuestions(data));
  };

  const deleteQuestion = async (id) => {
    await fetch(`http://localhost:8000/api/deleteQuestionById/${id}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        window.location.reload();
        alert("Question Deleted Successfully");
      });
      
  };

  useEffect(() => {
    FindFrequencyOfAns();
    fetchAllQuestions();
  }, []);


  const searchHandler = (searchQuery) => {
    setSearchQuery(searchQuery.target.value);
    const filteredData = questions.filter((question) => {
      return question.title
        .toLowerCase()
        .includes(searchQuery.target.value.toLowerCase());
    });
    setFilteredQue(filteredData);
  };

  return (
    <div
      Style="height:100vh;margin-top:13vh; z-index:1; background-color:white"
    >
      <div className="stack-index">
        <div className="stack-index-content">
          <AdminSidebar />
          <div style={{display:"block"}}> 
            <br></br>
            {/* <div style={{ marginTop: '10px', marginLeft: '50px' }}> */}
            <div className="filters_menu">
              <strong Style="display:inline;font-size:20px">
                Find All questions between :{" "}
              </strong>
              <input type="date" name="startDate" style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} onChange={onChange} />
              <strong Style="display:inline;font-size:20px">To</strong>
              <input type="date" name="endDate" style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} onChange={onChange} />
              <strong Style="display:inline;font-size:20px">and in tag:</strong>
              <select name="tags" onChange={onChange} style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}}>
                <option value="" selected>
                  All tags
                </option>
                {usedTags.map((tag) => (
                  <option value={tag.name}>{tag.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <div>
                <input
                  type="search"
                  className="form-control me-2"
                  placeholder="Search questions by title"
                  name="search"
                  onChange={searchHandler}
                />
              </div>
            </div>
            <div className="questions">
              <PostQues questions={currentPosts} />
            </div>
            <div className="container">
                    <Pagination postsPerPage={postPerPage} totalPosts={questions.length} paginate={paginate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
