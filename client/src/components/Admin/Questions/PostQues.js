import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PostQues({questions}){

    const [noOfAns, setnoOfAns] = useState({});
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
    useEffect(() => {
      FindFrequencyOfAns();
    }, []);

    return (
      <div>
      {questions.map(question => (
          <div className="all-questions">
              <div className="all-questions-container mb-5">
                  <div className="all-questions-left">
                      <div className="all-options">
                          <div className="all-option">{(() => {
                          if (question.id in noOfAns && noOfAns[question.id] > 1) {
                            return <><div>{noOfAns[question.id]}</div>
                                    <span> Answers</span></>
                          } else if(noOfAns[question.id] == 1){
                            return <><div>1</div>
                                    <span> Answer</span></>
                          
                          }else {
                            return <><div>0</div>
                            <span>Answer</span></>
                          }
                        })()}
                          </div>
                          <Button variant="outlined" color="error" startIcon={<DeleteIcon />}   onClick={() => deleteQuestion(question.id)}>Delete</Button>
                      </div>
                  </div>
                  <div className="question-answer">
                      <div style={{ width: "90%" }}>
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
                      <div className="author">
                          <div className="author-details d-flex flex-row-reverse" style={{fontSize:"15px"}}>
                              <small>asked by {question.user.username} on {question.created_at}</small>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      ))}
  </div>
)
}