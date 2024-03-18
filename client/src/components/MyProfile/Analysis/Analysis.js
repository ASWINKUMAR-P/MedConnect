import React, { useState, useEffect } from "react";
import Chart from "../../charts/Chart";
import '../Analysis/analysis.css';


export default function Analysis() {
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });

    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    //for fetching tags of asked questions.
    const [questions, setQuestions] = useState([]);
    const [Tags, setTags] = useState([]);
    const [count, setCount] = useState([]);
    const [queLen, setQueLen] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8000/api/getQuestionByUserName/${localStorage.getItem("username")}`, {
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
        fetch(`http://localhost:8000/api/getUserAcceptedAnswersQuestion/${localStorage.getItem("username")}`, {
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
        fetch(`http://localhost:8000/api/getUserAnswersQuestion/${localStorage.getItem("username")}`, {
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
        <div Style="margin-top:13vh; z-index:1; background-color:white; margin-left:200px">
            <div className='filters_menu'>
                <strong Style="display:inline;font-size:20px">From</strong>
                <input type="date" name="startDate" style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} onChange={onChange} />
                <strong Style="display:inline;font-size:20px">To</strong>
                <input type="date" name="endDate" style={{padding: '8px 12px',border: '1px solid #ccc',borderRadius: '4px'}} onChange={onChange} />
            </div>
            <div className="mt-3">
                <div className="ml-3" style={{fontSize:"20px"}}><strong>Total questions asked :</strong> {queLen}</div>
                <div className="ml-3" style={{fontSize:"20px"}}><strong>Total answers given   :</strong> {ansLen}</div>
                <div className="ml-3" style={{fontSize:"20px"}}><strong>Total answers accepted :</strong> {actAnsLen}</div>
            </div>
            <div className="charts">
                <div className="d-flex flex-row">
                    <Chart title={"Your questions and percentage on used tags"} count={count} Tags={Tags} />
                    <Chart title={"Your answers and percentage on used tags"} count={Anscount} Tags={AnsTags} />
                    <Chart title={"Your accepted answers and used tags"} count={AcAnscount} Tags={AcAnsTags} />
                </div>
            </div>
        </div>
    );
}
