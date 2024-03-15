import '../../MyProfile/MyAnswers/postsAns.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { MedicalServices } from "@mui/icons-material";
import { Tooltip } from '@mui/material';

export default function Posts({posts}) {

    console.log(posts)
    const deleteAnswer = async (id) => {
        await fetch(`http://localhost:8000/api/deleteAnswer/${id}`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            console.log(response);
            window.location.reload();
            alert("Answer deleted Successfully");
        });
    };


    return (
        <div>
            {posts.map(answer => (
                <div className="all-questions">
                    <div className="all-questions-container">
                        <div className="all-questions-left">
                            <div className="all-options">
                                <div className="all-option">
                                    <div>{answer.votes}</div>
                                    <span>Votes</span>
                                </div>
                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />}   onClick={() => deleteAnswer(answer.id)}>Delete</Button>
                            </div>
                        </div>
                        <div className="question-answer">
                            <div style={{ width: "90%" }}>
                                <div style={{fontSize:"20px",fontWeight:"bold"}}>Question: {answer.question.title}</div>
                                <div style={{fontSize:"15px"}}>{answer.question.description}</div>
                                <div style={{fontSize:"20px",fontWeight:"bold"}}>Answer {answer.user.is_staff && <><Tooltip title="Doctor's Solution"><MedicalServices style={{color:"red"}}/></Tooltip></>}: </div>
                                <div style={{fontSize:"15px"}}>{answer.solution}</div>
                            </div>                                
                            <div className="author">
                                <div className="author-details d-flex flex-row-reverse" style={{fontSize:"15px"}}>
                                    <small>answered by {answer.user.is_staff && "Dr."} {answer.user.username} on {answer.created_at}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
