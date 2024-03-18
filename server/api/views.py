from django.shortcuts import render
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
import datetime

def formatdate(date):
    return date.strftime("%d-%m-%Y %H:%M")

def monthYear(date):
    month={
        1:"January",
        2:"February",
        3:"March",
        4:"April",
        5:"May",
        6:"June",
        7:"July",
        8:"August",
        9:"September",
        10:"October",
        11:"November",
        12:"December",
    }
    return month[date.month]+" "+str(date.year)

@api_view(["GET"])
def getUserByUsername(request, username):
    user = User.objects.get(username=username)
    questions = Question.objects.filter(user=user)
    answers = Answer.objects.filter(user=user)
    is_doctor = user.is_staff
    date_joined = monthYear(user.date_joined)
    questionCount = questions.count()
    answerCount = answers.count()
    tagsCount = 0
    #calculate all unique tags
    tags = []
    for question in questions:
        for tag in question.tags.all():
            tags.append(tag)
    tags = list(set(tags))
    tagsCount = len(tags)
    data = {
        "username": user.username,
        "email": user.email,
        "questions": questions.count(),
        "answers": answers.count(),
        "is_doctor": is_doctor,
        "date": date_joined,
        "questionCount": questionCount,
        "answerCount": answerCount,
        "tagsCount": tagsCount,
    }
    return Response(status=200,data=data)

@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    print(email, password)
    user = User.objects.filter(email=email).first()
    if user is None:
        return Response(status=400,data={"error": "User not found"})    
    if not user.check_password(password):
        return Response(status=401,data={"error": "Wrong password"})
    token, _ = Token.objects.get_or_create(user=user)
    data = {
        "token": token.key,
        "username": user.username,
    }
    if user.is_superuser:
        data["userType"] = "admin"
    else:
        data["userType"] = "user"
    return Response(status=200,data=data)

@api_view(["POST"])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    user = User.objects.filter(username=username).first()
    if user:
        return Response(status=400,data={"error": "Username already exists"})
    user = User.objects.filter(email=email).first()
    if user:
        return Response(status=400,data={"error": "Email already exists"})
    
    if len(username) < 4:
        return Response(status=400,data={"error": "Username should have at least 4 characters"})
    if len(password) < 4:
        return Response(status=400,data={"error": "Password too short"})
    
    
    user = User.objects.create_user(username=username, email=email, password=password)
    token = Token.objects.create(user=user)
    data = {
        "token": token.key,
        "username": user.username,
    }
    return Response(status=200,data=data)

#Question Based Views
#======================================================================================
@permission_classes(["IsAuthenticated"])
@api_view(["POST"])
def addQuestion(request):
    title = request.data.get("title")
    description = request.data.get("question")
    tags = request.data.get("tags")
    user = request.user
    print(title, description, tags, user)
    question = Question.objects.create(title=title, description=description, user=user)
    for tag_name in tags:
        tag, created = Tags.objects.get_or_create(name=tag_name)
        question.tags.add(tag)
    question.save()
    return Response(status=201,data={"message": "Question added successfully","status":"success"})

@api_view(["GET"])
def getQuestions(request):
    questions = Question.objects.all().order_by("-created_at")
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getQuestionByHigherVotes(request):
    questions = Question.objects.all().order_by("-votes")
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getQuestionById(request, pk):
    question = Question.objects.get(id=pk)
    serializer = QuestionSerializer(question)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def updateQuestionById(request, pk):
    question = Question.objects.get(id=pk)
    question.title = request.data.get("title")
    question.description = request.data.get("description")
    tags = request.data.get("tags")
    question.tags.clear()
    for tag_name in tags:
        tag, created = Tags.objects.get_or_create(name=tag_name)
        question.tags.add(tag)
    question.save()
    return Response(status=200,data={"message": "Question updated successfully"})

@api_view(["DELETE"])
def deleteQuestionById(request, pk):
    question = Question.objects.get(id=pk)
    message = "Your question titled "+question.title+" is deleted by admin."
    notification = Notifications.objects.create(user=question.user, message = message)
    notification.save()
    question.delete()
    tags = Tags.objects.all()
    questions = Question.objects.all()
    for tag in tags:                                    
        if not questions.filter(tags=tag):
            tag.delete()
    return Response(status=200,data={"message": "Question deleted successfully"})

@api_view(["GET"])
def getQuestionByUserName(request, username):
    user = User.objects.get(username=username)
    questions = Question.objects.filter(user=user)
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getQuestionByUserFilter(request):
    user = request.user
    startDate = request.data.get("startDate")
    endDate = request.data.get("endDate")
    tags = request.data.get("tags")
    #convert date to datetime
    if startDate:
        startDate = datetime.datetime.strptime(startDate, "%Y-%m-%d")
    if endDate:
        endDate = datetime.datetime.strptime(endDate, "%Y-%m-%d")
    questions = Question.objects.filter(user=user)
    if startDate:
        questions = questions.filter(created_at__gte=startDate)
    if endDate:
        questions = questions.filter(created_at__lte=endDate)
    if tags:
        questions = questions.filter(tags__name=tags)
    print(questions)
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def getQuestionByFilter(request):
    startDate = request.data.get("startDate")
    endDate = request.data.get("endDate")
    tags = request.data.get("tags")
    #convert date to datetime
    if startDate:
        startDate = datetime.datetime.strptime(startDate, "%Y-%m-%d")
    if endDate:
        endDate = datetime.datetime.strptime(endDate, "%Y-%m-%d")
    questions = Question.objects.all()
    if startDate:
        questions = questions.filter(created_at__gte=startDate)
    if endDate:
        questions = questions.filter(created_at__lte=endDate)
    if tags and tags!="":
        questions = questions.filter(tags__name=tags)
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getAllTags(request):
    tags = Tags.objects.all()
    serializer = TagsSerializer(tags, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getTagByUsername(request, username):
    user = User.objects.get(username=username)
    questions = Question.objects.filter(user=user)
    tags = []
    for question in questions:
        for tag in question.tags.all():
            tags.append(tag)
    serializer = TagsSerializer(tags, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def upVoteQuestion(request, pk):
    question = Question.objects.get(id=pk)
    question.votes += 1
    question.save()
    return Response(status=200,data={"message": "Question upvoted successfully"})

@api_view(["POST"])
def downVoteQuestion(request, pk):
    question = Question.objects.get(id=pk)
    question.votes -= 1
    question.save()
    return Response(status=200,data={"message": "Question downvoted successfully"})

@api_view(["GET"])
def getVotesQuestion(request, pk):
    question = Question.objects.get(id=pk)
    return Response(status=200,data={"votes": question.votes})

@api_view(["GET"])
def getAllQuestionVotes(request):
    questions = Question.objects.all()
    #return a dictionary of question id and votes
    votes = {}
    for question in questions:
        votes[question.id] = question.votes
    return Response(status=200,data=votes)

@api_view(["GET"])
def getQuestionsByTag(request, tag):
    questions = Question.objects.filter(tags__name=tag)
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getUnansweredQuestions(request):
    answer = Answer.objects.all()
    questions = Question.objects.exclude(id__in=[a.question.id for a in answer])
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getAnsweredQuestions(request):
    answer = Answer.objects.all()
    questions = Question.objects.filter(id__in=[a.question.id for a in answer])
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def searchQuestions(request):
    query = request.data.get("query")
    #search questions based in title and tags
    questions = Question.objects.filter(title__icontains=query)
    tags = Tags.objects.filter(name__icontains=query)
    for tag in tags:
        questions = questions | Question.objects.filter(tags=tag)
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def addAnswer(request, pk):
    question = Question.objects.get(id=pk)
    user = request.user
    description = request.data.get("description")
    print(question, user, description)
    answer = Answer.objects.create(question=question, user=user, solution=description)
    return Response(status=201,data={"message": "Answer added successfully","status":"true"})

@api_view(["GET"])
def getAllAnswers(request):
    answers = Answer.objects.all()
    serializer = AnswerSerializer(answers, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getAnswerById(request, pk):
    question = Question.objects.get(id=pk)
    answers = Answer.objects.filter(question=question)
    serializer = AnswerSerializer(answers, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def updateAnswerById(request, pk):
    answer = Answer.objects.get(id=pk)
    answer.description = request.data.get("description")
    answer.save()
    return Response(status=200,data={"message": "Answer updated successfully"})

@api_view(["GET"])
def getUserAnswer(request):
    user = request.user
    answer = Answer.objects.get(user=user)
    serializer = AnswerSerializer(answer)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def upVoteAnswer(request, pk):
    answer = Answer.objects.get(id=pk)
    answer.votes += 1
    answer.save()
    return Response(status=200,data={"message": "Answer upvoted successfully"})

@api_view(["POST"])
def downVoteAnswer(request, pk):
    answer = Answer.objects.get(id=pk)
    answer.votes -= 1
    answer.save()
    return Response(status=200,data={"message": "Answer downvoted successfully"})

@api_view(["GET"])
def getNoOfAnswersForAll(request):
    questions = Question.objects.all()
    answers = {}
    for question in questions:
        answers[question.id] = Answer.objects.filter(question=question).count()
    return Response(status=200,data=answers)

@api_view(["POST"])
def acceptAnswer(request, pk):
    answer = Answer.objects.get(id=pk)
    answer.is_accepted = True
    answer.save()
    return Response(status=200,data={"message": "Answer accepted successfully","status":"true"})

@api_view(["POST"])
def rejectAnswer(request, pk):
    answer = Answer.objects.get(id=pk)
    answer.is_accepted = False
    answer.save()
    return Response(status=200,data={"message": "Answer rejected successfully","status":"true"})

@api_view(["GET"])
def getProfile(request):
    user = request.user
    questions = Question.objects.filter(user=user)
    answers = Answer.objects.filter(user=user)
    is_doctor = user.is_staff
    date_joined = monthYear(user.date_joined)
    questionCount = questions.count()
    answerCount = answers.count()
    tagsCount = 0
    #calculate all unique tags
    tags = []
    for question in questions:
        for tag in question.tags.all():
            tags.append(tag)
    tags = list(set(tags))
    tagsCount = len(tags)
    data = {
        "username": user.username,
        "email": user.email,
        "questions": questions.count(),
        "answers": answers.count(),
        "is_doctor": is_doctor,
        "date": date_joined,
        "questionCount": questionCount,
        "answerCount": answerCount,
        "tagsCount": tagsCount,
    }
    return Response(status=200,data=data)

@api_view(["GET"])
def getAllProfile(request):
    users = User.objects.all()
    #retunr in the form of above function
    profiles = []
    for user in users:
        if user.username in ["admin","AnonymousUser"]:
            continue
        questions = Question.objects.filter(user=user)
        answers = Answer.objects.filter(user=user)
        is_doctor = user.is_staff
        date_joined = monthYear(user.date_joined)
        questionCount = questions.count()
        answerCount = answers.count()
        tagsCount = 0
        #calculate all unique tags
        tags = []
        for question in questions:
            for tag in question.tags.all():
                tags.append(tag)
        tags = list(set(tags))
        tagsCount = len(tags)
        data = {
            "username": user.username,
            "email": user.email,
            "questions": questions.count(),
            "answers": answers.count(),
            "is_doctor": is_doctor,
            "date": date_joined,
            "questionCount": questionCount,
            "answerCount": answerCount,
            "tagsCount": tagsCount,
        }
        profiles.append(data)
    return Response(status=200,data=profiles)

@api_view(["POST"])
def editProfile(request):
    try:
        user = request.user
    except Exception as e: 
        data = {"error":e}
        return Response(status=400,data=data)
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    #check if username already exists
    users = User.objects.filter(username=username).exclude(id=user.id).first()
    if users:
        return Response(status=400,data={"error": "Username already exists"})
    #check if email already exists
    users = User.objects.filter(email=email).exclude(id=user.id).first()
    if users:
        return Response(status=400,data={"error": "Email already exists"})
    user.username = username
    user.email = email
    user.set_password(password)
    user.save()
    user = User.objects.get(id=user.id)
    token = Token.objects.get(user=user)
    data = {
        "token": token.key,
        "username": user.username,
    }
    return Response(status=200,data=data)

@api_view(["DELETE"])
def deleteProfile(request,pk):
    user = User.objects.get(id=pk)
    print(user)
    user.delete()
    #remove tags that are not used
    tags = Tags.objects.all()
    questions = Question.objects.all()
    for tag in tags:
        if not questions.filter(tags=tag):
            tag.delete()
    return Response(status=200,data={"message": "Profile deleted successfully"})

@api_view(["GET"])
def search(request):
    keyword = request.query_params.get("keyword")
    if keyword == "":
        questions = Question.objects.all()
        return Response(status=200,data=QuestionSerializer(questions, many=True).data)
    questions = Question.objects.filter(title__icontains=keyword)
    tags = Tags.objects.filter(name__icontains=keyword)
    for tag in tags:
        questions = questions | Question.objects.filter(tags=tag)
    questions = questions.distinct()
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def searchAnswered(request):
    keyword = request.query_params.get("keyword")
    if keyword == "":
        questions = Question.objects.all()
        answer = Answer.objects.all()
        questions = questions.filter(id__in=[a.question.id for a in answer])
        return Response(status=200,data=QuestionSerializer(questions, many=True).data)
    questions = Question.objects.filter(title__icontains=keyword)
    tags = Tags.objects.filter(name__icontains=keyword)
    for tag in tags:
        questions = questions | Question.objects.filter(tags=tag)
    answer = Answer.objects.all()
    questions = questions.filter(id__in=[a.question.id for a in answer])
    questions = questions.distinct()
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def searchUnanswered(request):
    keyword = request.query_params.get("keyword")
    if keyword == "":
        questions = Question.objects.all()
        answer = Answer.objects.all()
        questions = questions.exclude(id__in=[a.question.id for a in answer])
        return Response(status=200,data=QuestionSerializer(questions, many=True).data)
    questions = Question.objects.filter(title__icontains=keyword)
    tags = Tags.objects.filter(name__icontains=keyword)
    for tag in tags:
        questions = questions | Question.objects.filter(tags=tag)
    answer = Answer.objects.all()
    questions = questions.exclude(id__in=[a.question.id for a in answer])
    questions = questions.distinct()
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def searchMyQuestions(request):
    keyword = request.query_params.get("keyword")
    user = request.user
    questions = Question.objects.filter(user=user)
    if keyword == "":
        return Response(status=200,data=QuestionSerializer(questions, many=True).data)
    questions = Question.objects.filter(title__icontains=keyword, user=user)
    tags = Tags.objects.filter(name__icontains=keyword)
    for tag in tags:
        questions = questions | Question.objects.filter(tags=tag, user=user)
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def uploadProof(request):
    user = request.user
    files = request.FILES.values()
    proof = Proof.objects.create(user=user, status="pending")
    for f in files:
        if f.name:
            file = Files.objects.create(file=f)
            proof.files.add(file)
    proof.save()
    return Response(status=200,data={"message": "Proof uploaded successfully"})

@api_view(["GET"])
def getUsers(request):
    users = User.objects.all()
    #exclude admin users
    users = users.exclude(is_superuser=True)
    serializer = UserSerializer(users, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getUserAcceptedAnswersQuestion(request,pk):
    user = User.objects.get(username=pk)
    questions = Question.objects.filter(answer__user=user, answer__is_accepted=True)
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getUserAnswersQuestion(request,pk):
    user = User.objects.get(username=pk)
    questions = Question.objects.filter(answer__user=user)
    serializer = QuestionSerializer(questions, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def getAllFilteredAnswers(request,pk):
    startDate = request.data.get("startDate")
    endDate = request.data.get("endDate")
    status = request.data.get("status")
    #convert date to datetime
    if startDate:
        startDate = datetime.datetime.strptime(startDate, "%Y-%m-%d")
    if endDate:
        endDate = datetime.datetime.strptime(endDate, "%Y-%m-%d")
    question = Question.objects.get(id=pk)
    answers = Answer.objects.filter(question=question)
    if startDate:
        answers = answers.filter(created_at__gte=startDate)
    if endDate:
        answers = answers.filter(created_at__lte=endDate)
    if status:
        if status == "Accepted":
            answers = answers.filter(is_accepted=True)
        elif status == "Not Accepted":
            answers = answers.filter(is_accepted=False)
    answers = answers.order_by("created_at")
    return Response(status=200,data=AnswerSerializer(answers, many=True).data)

@api_view(["GET"])
def getAllAnswers(request,pk):
    question = Question.objects.get(id=pk)
    answers = Answer.objects.filter(question=question)
    #sort answers based on created_at in ascending order
    answers = answers.order_by("created_at")
    serializer = AnswerSerializer(answers, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["DELETE"])
def deleteAnswer(request,pk):
    answer = Answer.objects.get(id=pk)
    question = answer.question
    message = "Your solution for the question titled "+question.title+" is deleted by admin."
    notification = Notifications.objects.create(user=answer.user, message = message)
    notification.save()
    answer.delete()
    return Response(status=200,data={"message": "Answer deleted successfully"})

@api_view(["GET"])
def getCommentsByAnswerId(request, pk):
    answer = Answer.objects.get(id=pk)
    comments = Comment.objects.filter(answer=answer)
    #return comments by sorting based on created_at in ascending order
    comments = comments.order_by("created_at")
    serializer = CommentSerializer(comments, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["POST"])
def addComment(request, pk):
    answer = Answer.objects.get(id=pk)
    user = request.user
    comment = request.data.get("content")
    comment = Comment.objects.create(answer=answer, user=user, comment=comment)
    return Response(status=201,data={"message": "Comment added successfully","status":"true"})

@api_view(["GET"])
def getRequestStatus(request):
    user = request.user
    #get the latest proof
    proof = Proof.objects.filter(user=user).latest('created_at')
    return Response(status=200,data={"status": proof.status})

@api_view(["GET"])
def getAllRequests(request):
    proofs = Proof.objects.all()
    serializer = ProofSerializer(proofs, many=True)
    return Response(status=200,data=serializer.data)

@api_view(["GET"])
def getProof(request,pk):
    proofs = Proof.objects.filter(id=pk)
    #return only the files as array
    files = []
    for proof in proofs:
        for file in proof.files.all():
            #append the full url of the file including base url
            print(request.build_absolute_uri(file.file.url))
            dict = {"uri":request.build_absolute_uri(file.file.url),"name":file.file.name}
            files.append(dict)
    return Response(status=200,data=files)

@api_view(["POST"])
def acceptRequest(request,pk):
    proof = Proof.objects.get(id=pk)
    proof.status = "accepted"
    user = proof.user
    user.is_staff = True
    user.save()
    proof.save()
    notification = Notifications.objects.create(user=user, message = "Your profile is upgraded to Doctor's profile")
    notification.save()
    return Response(status=200,data={"message": "Proof accepted successfully"})

@api_view(["POST"])
def rejectRequest(request,pk):
    proof = Proof.objects.get(id=pk)
    proof.status = "rejected"
    user = proof.user
    user.is_staff = False
    user.save()
    proof.save()
    notification = Notifications.objects.create(user=user, message = "Your profile upgrade request is rejected due to invalid documents.")
    notification.save()
    return Response(status=200,data={"message": "Proof rejected successfully"})

@api_view(["POST"])
def report(request):
    report_content = request.data.get("reason")
    question = None
    answer = None
    comment = None
    user = request.user
    if request.data.get("type") == "question":
        qid = request.data.get("id")
        question = Question.objects.get(id=qid)
    if request.data.get("type") == "answer":
        aid = request.data.get("id")
        answer = Answer.objects.get(id=aid)
    if request.data.get("type") == "comment":
        cid = request.data.get("id")
        comment = Comment.objects.get(id=cid)
    
    report = Report.objects.create(user=user,report_content=request.data.get("type"), question=question, answer=answer, comment=comment,reason=report_content)
    report.save()
    return Response(status=200,data={"message": "Reported successfully"})

@api_view(["DELETE"])
def deleteComment(request,pk):
    comment = Comment.objects.get(id=pk)
    answer = comment.answer
    question = answer.question
    #give a message with question title for deleting comment
    message = "Your comment on a solution for the question titled "+question.title+" is deleted by admin."
    notification = Notifications.objects.create(user=comment.user, message = message)
    notification.save()
    comment.delete()
    return Response(status=200,data={"message": "Comment deleted successfully"})

