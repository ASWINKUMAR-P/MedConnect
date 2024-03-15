import React, { useState, useEffect } from "react";
import Chart from '../../charts/Chart'
import {useParams} from 'react-router-dom'
import AdminSidebar from "../AdminSidebar";

export default function UserProfileAnalysis() {
    const params = useParams();
    let username = params.username;
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });
    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }
    const [questions, setQuestions] = useState([]);
    const [Tags, setTags] = useState([]);
    const [count, setCount] = useState([]);
    const [queLen, setQueLen] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8000/api/getQuestionByUserName/${username}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setQuestions(data));
    }, [])


    useEffect(() => {
        const freqOfTags = [];
        const tag = [];
        const cnt = [];

        if (filters.startDate && filters.endDate) {
            let cnt = 0;
            questions.map(question => {
                // console.log(question.date.substring(0, 10));
                if (question.jsdate.substring(0, 10) >= filters.startDate && question.jsdate.substring(0, 10) <= filters.endDate) {
                    cnt++;
                    question.tags.map(tag => {
                        freqOfTags[tag.name] = 0;
                    })
                }
            })

            questions.map(question => {
                if (question.jsdate.substring(0, 10) >= filters.startDate && question.jsdate.substring(0, 10) <= filters.endDate)
                    question.tags.map(tag => {
                        freqOfTags[tag.name] = freqOfTags[tag.name] + 1;
                    })
            })

            setQueLen(cnt);
        }
        else {
            questions.map(question =>
                question.tags.map(tag => {
                    freqOfTags[tag.name] = 0;
                })
            )

            questions.map(question =>
                question.tags.map(tag => {
                    freqOfTags[tag.name] = freqOfTags[tag.name] + 1;
                })
            )
            setQueLen(questions.length);
        }

        // console.log(freqOfTags);

        for (const i in freqOfTags) {
            tag.push(i);
            cnt.push(parseInt(freqOfTags[i]));
        }

        setTags(tag);
        setCount(cnt);

    }, [questions, filters]);

    //for fetching tags of accepted answered question.
    const [acceptedansweredQues, setAcceptedAnsweredQues] = useState([]);
    const [AcAnsTags, setAcAnsTags] = useState([]);
    const [AcAnscount, setAcAnsCount] = useState([]);
    const [actAnsLen, setactAnsLen] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8000/api/getUserAcceptedAnswersQuestion/${username}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setAcceptedAnsweredQues(data));
    }, []);

    useEffect(() => {
        // console.log(answers);
        const ac_ans_freqOfTags = [];
        const ac_ans_tag = [];
        const ac_ans_cnt = [];

         if (filters.startDate && filters.endDate) {
            let cnt = 0;
            acceptedansweredQues.map(ques => {
                const tags = ques.tags;
                if (ques.jsdate.substring(0, 10) >= filters.startDate && ques.jsdate.substring(0, 10) <= filters.endDate) {
                    cnt++;
                    tags.map(tag =>
                        ac_ans_freqOfTags[tag.name] = 0
                    )
                }
            })

            acceptedansweredQues.map(ques => {
                const tags = ques.tags;
                if (ques.jsdate.substring(0, 10) >= filters.startDate && ques.jsdate.substring(0, 10) <= filters.endDate)
                    tags.map(tag =>
                        ac_ans_freqOfTags[tag.name] = ac_ans_freqOfTags[tag.name] + 1
                    )
            })

            setactAnsLen(cnt);
        }
        else {
            acceptedansweredQues.map(ques => {
                const tags = ques.tags;
                tags.map(tag =>
                    ac_ans_freqOfTags[tag.name] = 0
                )
            })

            acceptedansweredQues.map(ques => {
                const tags = ques.tags;
                tags.map(tag =>
                    ac_ans_freqOfTags[tag.name] = ac_ans_freqOfTags[tag.name] + 1
                )
            })
            setactAnsLen(acceptedansweredQues.length);
        }

        for (const i in ac_ans_freqOfTags) {
            ac_ans_tag.push(i);
            ac_ans_cnt.push(parseInt(ac_ans_freqOfTags[i]));
        }

        setAcAnsTags(ac_ans_tag);
        setAcAnsCount(ac_ans_cnt);

    }, [acceptedansweredQues, filters]);

    //for fetching tags of answered questions
    const [answeredQues, setAnsweredQues] = useState([]);
    const [AnsTags, setAnsTags] = useState([]);
    const [Anscount, setAnsCount] = useState([]);
    const [ansLen, setansLen] = useState(0);
    useEffect(() => {
        fetch(`http://localhost:8000/api/getUserAnswersQuestion/${username}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => setAnsweredQues(data));
    }, []);

    useEffect(() => {
        // console.log(answeredQues);
        const ans_freqOfTags = [];
        const ans_tag = [];
        const ans_cnt = [];

        if (filters.startDate && filters.endDate) {
            let cnt = 0;
            answeredQues.map(ques => {
                const tags = ques.tags;
                if (ques.jsdate.substring(0, 10) >= filters.startDate && ques.jsdate.substring(0, 10) <= filters.endDate) {
                    cnt++;
                    tags.map(tag =>
                        ans_freqOfTags[tag.name] = 0
                    )
                }
            })

            answeredQues.map(ques => {
                const tags = ques.tags;
                if (ques.jsdate.substring(0, 10) >= filters.startDate && ques.jsdate.substring(0, 10) <= filters.endDate)
                    tags.map(tag =>
                        ans_freqOfTags[tag.name] = ans_freqOfTags[tag.name] + 1
                    )
            })

            setansLen(cnt);
        }
        else {
            answeredQues.map(ques => {
                const tags = ques.tags;
                tags.map(tag =>
                    ans_freqOfTags[tag.name] = 0
                )
            })

            answeredQues.map(ques => {
                const tags = ques.tags;
                tags.map(tag =>
                    ans_freqOfTags[tag.name] = ans_freqOfTags[tag.name] + 1
                )
            })
            setansLen(answeredQues.length);
        }

        for (const i in ans_freqOfTags) {
            ans_tag.push(i);
            ans_cnt.push(parseInt(ans_freqOfTags[i]));
        }

        setAnsTags(ans_tag);
        setAnsCount(ans_cnt);

    }, [answeredQues, filters]);

    return (
        <div className="main-part" style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white" }}>
            <div className="stack-index">
                <div className="stack-index-content">
                    <AdminSidebar />
                    <div style={{maxWidth:"1100px"}} >
                        <div className="date-input d-flex justify-content-center">
                            <input type="date" name="startDate" onChange={onChange} />
                            <strong Style="display:inline" className="ml-2 mr-2">To</strong>
                            <input type="date" name="endDate" onChange={onChange} />
                        </div>
                        <hr Style="border: 0.7px solid" />
                        <div className="chart-container d-flex flex-row justify-content-center flex-wrap">
                            <Chart title={`Total ${queLen} questions asked by ${params.username} & used tags as follows`} count={count} Tags={Tags} />
                            <Chart title={`Total ${ansLen} answers given by ${params.username} & used tags as follows`} count={Anscount} Tags={AnsTags} />
                            <Chart title={`Total ${actAnsLen} answers accepted & used tags as follows`} count={AcAnscount} Tags={AcAnsTags} />
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    );
}
