from django.contrib import admin
from django.urls import path, include
from .views import *
urlpatterns = [
    path('login/', login, name="login"),
    path('register/', register, name="register"),
    path('addquestion/', addQuestion, name="addquestion"),

    path('getQuestions/', getQuestions, name="getQuestions"),
    path('getQuestionByHigherVotes/', getQuestionByHigherVotes, name="getQuestionByHigherVotes"),
    path('getQuestionById/<int:pk>/', getQuestionById, name="getQuestionById"),
    path('updateQuestionById/<int:pk>/', updateQuestionById, name="updateQuestionById"),
    path('deleteQuestionById/<int:pk>/', deleteQuestionById, name="deleteQuestionById"),
    path('getQuestionByUserName/<str:username>/', getQuestionByUserName, name="getQuestionByUserName"),
    path('getQuestionByUserFilter/', getQuestionByUserFilter, name="getQuestionByUserFilter"),
    path('getQuestionByFilter/', getQuestionByFilter, name="getQuestionByFilter"),
    path('getAllTags/', getAllTags, name="getAllTags"),
    path('getTagByUsername/<str:username>/', getTagByUsername, name="getTagByUsername"),
    path('upVoteQuestion/<int:pk>/', upVoteQuestion, name="upvoteQuestion"),
    path('downVoteQuestion/<int:pk>/', downVoteQuestion, name="downvoteQuestion"),
    path('getVotesQuestion/<int:pk>/', getVotesQuestion, name="getVotesQuestion"),
    path('getAllQuestionVotes/', getAllQuestionVotes, name="getAllQuestionVotes"),
    path('getQuestionByTag/<str:tag>/', getQuestionsByTag, name="getQuestionByTag"),
    path('getUnansweredQuestions/', getUnansweredQuestions, name="getUnansweredQuestions"),
    path('getAnsweredQuestions/', getAnsweredQuestions, name="getAnsweredQuestions"),
    path('searchQuestions/', searchQuestions, name="searchQuestion"),

    path('addAnswer/<int:pk>/', addAnswer, name="addAnswer"),
    path('getAnswerByQuestionId/<int:pk>/', getAnswerById, name="getAnswerByQuestionId"),
    path('upvoteAnswer/<int:pk>/', upVoteAnswer, name="upvoteAnswer"),
    path('downvoteAnswer/<int:pk>/', downVoteAnswer, name="downvoteAnswer"),
    path('getNoOfAnswersForAll/', getNoOfAnswersForAll, name="getNoOfAnswersForAll"),
    path('acceptAnswer/<int:pk>/', acceptAnswer, name="acceptAnswer"),
    path('rejectAnswer/<int:pk>/', rejectAnswer, name="rejectAnswer"),
    path('getAllFilteredAnswers/<int:pk>/', getAllFilteredAnswers, name="getAllFilteredAnswers"),

    path('getProfile/', getProfile, name="getProfile"),
    path('getAllProfiles/', getAllProfile, name="getAllProfiles"),
    path('editProfile/', editProfile, name="editProfile"),
    path('deleteProfile/<int:pk>/', deleteProfile, name="deleteProfile"),
    path('getUserByUsername/<str:username>/', getUserByUsername, name="getUserByUsername"),

    path('search/', search, name="search"),
    path('searchUnanswered/', searchUnanswered, name="searchUnanswered"),
    path('searchAnswered/', searchAnswered, name="searchAnswered"),
    path('deleteAnswer/<int:pk>/', deleteAnswer, name="deleteAnswer"),
    
    path('uploadProof/', uploadProof, name="uploadProof"),
    path('getRequestStatus/', getRequestStatus, name="checkPendingRequest"),
    path('getAllRequests/', getAllRequests, name="getProof"),
    path('getAllDocs/<int:pk>/', getProof, name="getAllDocs"),
    path('acceptRequest/<int:pk>/', acceptRequest, name="acceptRequest"),
    path('rejectRequest/<int:pk>/', rejectRequest, name="rejectRequest"),

    path('getAllUsers/',getUsers, name="getAllUsers"),
    path('getUserAcceptedAnswersQuestion/<str:pk>/',getUserAcceptedAnswersQuestion, name="getUserAcceptedAnswersQuestion"),
    path('getUserAnswersQuestion/<str:pk>/',getUserAnswersQuestion, name="getUserAnswersQuestion"),
    path('getAllAnswers/<int:pk>/',getAllAnswers, name="getAllAnswers"),

    path('getComments/<int:pk>/',getCommentsByAnswerId, name="getComments"),
    path('addComment/<int:pk>/',addComment, name="addComment"),
    path('deleteComment/<int:pk>/',deleteComment, name="deleteComment"),
    path('report/',report, name="report"),
]