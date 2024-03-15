import React, { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import parse from "html-react-parser";
import { useParams } from 'react-router-dom';

const config = {
    buttons: ["bold", "italic", "link", "unlink", "ul", "ol", "underline", "image", "font", "fontsize", "brush", "redo", "undo", "eraser", "table"],
};
export default function UpdateQuestion(props) {
       
    const params = useParams();
    const editor = useRef(null);
    const [value, setValue] = useState("");
    const [html, setHtml] = useState("");
    const [state, setState] = useState(false);
    const [credentials, setCredentials] = useState({ title: "", tags: "" })
    const [question, setQuestion] = useState([]);
    

    const fetchQuestion= async(id)=>{
        const response = await fetch(`http://localhost:5000/api/question/fetchQueById/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            return response.json();
        }).then((data) => {
            setQuestion(data);
            setCredentials(data);
         
        })

    }

    const updateQue = async(e, id)=>{
        e.preventDefault();

        const response = await fetch(`http://localhost:5000/api/question/updateque/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ title: credentials.title, question: value, tags: credentials.tags }),
        })

        let json = await response.json();
        // console.log(json.status);
        if (json.status === "updated") {
            setState(true);
            window.scrollTo(0, 0)
        }
        
    }

    const getValue = (value) => {
        setValue(value);
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

  
    useEffect(()=>{
        fetchQuestion(params.type);
    }, [])

    return (
        <div>
            <div Style="background-color:#f8f9f9; height:100%; margin-top:10vh; z-index:1;">
                {(
                    () => {
                        if (state === true) {

                            return (<>
                                <div class="alert alert-success alert-dismissible" role="alert">
                                    Your Query is Updated <strong>Successfully</strong>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </>)

                        }
                    }
                )()}

                <div className="container mb-5" Style="width:70%; display:block; margin:auto;">
                    <div class="card mt-5" Style="background-color:hsl(206,100%,97%);">
                        <div class="card-header">
                            <h3><b>Update a Public Question</b></h3>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Writing a Good Question</h5>
                            <p class="card-text">You’re ready to ask a programming-related question and this form will help guide you through the process.</p>
                            <h5>Steps</h5>
                            <ul>
                                <li>Summarize your problem in a one-line title.</li>
                                <li>Describe your problem in more detail.</li>
                                <li>Describe what you tried and what you expected to happen.</li>
                                <li>Add “tags” which help surface your question to members of the community.</li>
                            </ul>
                        </div>
                    </div>

                    <form onSubmit={(e)=>updateQue(e, question._id)} method='post'>

                        <div class="card mb-3 mt-5">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Title</label>
                                    <input type="text" class="form-control" name="title" onChange={onChange} value={credentials.title} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Title" />
                                    <small id="emailHelp" class="form-text text-muted">Enter Your title in few Words</small>
                                </div>

                            </div>
                        </div>

                        <JoditEditor
                            ref={editor}
                            value={question.question}
                            config={config}
                            tabIndex={1}
                            //   onBlur={(newContent) => getValue(newContent)}
                            onChange={(newContent) => getValue(newContent)}

                        />

                        <div class="card mt-3">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Question Tags</label>
                                    <input type="text" name="tags" onChange={onChange} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Tags" value={credentials.tags} />
                                    <small id="emailHelp" class="form-text text-muted">Enter Question Tags</small>
                                </div>
                            </div>
                        </div>

                        <button type='submit' className="btn btn-primary mt-5 mb-5">Update Question</button>
                    </form>
                </div>

                {/* <div>{html}</div> */}
            </div>
        </div>
    )
}
