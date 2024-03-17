import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Editor from './components/Editor/Editor';
import Homepage from './components/Homepage/Homepage';
import Navbar from './components/Navbar/Navbar';
import Questions from './components/Questions/Questions';
import Content from './components/Questions/Content';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import UserQuestionContent from './components/MyProfile/Profile/Content';
import AdminUser from './components/Admin/Users/user';
import AdminUserProfile from './components/Admin/Users/UserProfile';
import Chart from './components/charts/Chart';
import MyQuestions from './components/MyProfile/MyQuestions/MyQuestions';
import UpdateQuestion from './components/MyProfile/MyQuestions/UpdateQuestion';
import UpdateAnswer from './components/MyProfile/MyAnswers/UpdateAnswer';
import MyAnswers from './components/MyProfile/MyAnswers/MyAnswers';
import Analysis from './components/MyProfile/Analysis/Analysis';
import Tags from './components/Tags/Tags';
import QuestionOnTags from './components/Tags/QuestionOnTags';
import Search from './components/Questions/Search';
import AdminQuestions from './components/Admin/Questions/Adminquestion';
import Adminanswer from './components/Admin/Questions/AdminAnswer';
import UserProfileAnalysis from './components/Admin/Users/UserProfileAnalysis';
import ShowProfile from './components/MyProfile/Profile/ShowProfile';
import EditProfile from './components/MyProfile/Profile/EditProfile';
import UploadProof from './components/MyProfile/Profile/UploadProof';
import ViewRequests from './components/Admin/DoctorVerification/ViewRequests';
import ViewDocs from './components/Admin/DoctorVerification/ViewDocs';
import Sidebar from './components/Sidebar/Sidebar';
import AdminSidebar from './components/Admin/AdminSidebar';
import { Home } from '@mui/icons-material';



function App() {
  const usertype = localStorage.getItem('usertype');
  const [loginStatus, setLoginStatus] = useState(false);

  const isLoggedin = () => {
    if (localStorage.getItem('username') !== null ) {
      setLoginStatus(true);
    }
  };

  useEffect(() => {
    isLoggedin();
  }, []);

  return (
      <BrowserRouter>
        <Navbar />
        {usertype == 'admin' ? <AdminSidebar /> : (usertype == 'user' ? <Sidebar /> : <></>)}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/ask" element={<Editor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/question/:type" element={<Content />} />
          <Route path="/answer/:type" element={<UserQuestionContent />} />
          {/* profile routes */}
          <Route path="/chart" element={<Chart />} />
          <Route path="/profile" element={<ShowProfile />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/upload" element={<UploadProof />}/>
          <Route path="/myquestions" element={<MyQuestions />} />
          <Route path="/updateque/:type" element={<UpdateQuestion />} />
          <Route path="/myanswers" element={<MyAnswers />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/tags" element={<Tags />} />
          {/* admin routes */}
          <Route path="/adminquestions" element={<AdminQuestions />} />
          <Route path="/adminanswer/:id" element={<Adminanswer />} />
          <Route path="/adminuser" element={<AdminUser />} />
          <Route path="/UserProfileAnalysis/:username" element={<UserProfileAnalysis />} />
          <Route path="/UserProfile/:username" element={<AdminUserProfile />} />
          <Route path="/updateans/:type" element={<UpdateAnswer />} />
          <Route path="/viewRequests" element={<ViewRequests />} />
          <Route path="/view-documents/:requestId" element={<ViewDocs />} />
          {/* tags routers */}
          <Route path="/questionOntags/:type" element={<QuestionOnTags />} />
          {/* Search Question */}
          <Route path="/search" element={<Search />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
  );
}

export default App;
