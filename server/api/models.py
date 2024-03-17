from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Tags(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Question(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tags)
    votes = models.IntegerField(default=0) 
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    solution = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    votes = models.IntegerField(default=0)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return self.solution

class Comment(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment

class Files(models.Model):
    file = models.FileField(upload_to='proofs/')

class Proof(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, choices=[('pending', 'pending'), ('approved', 'approved'), ('rejected', 'rejected')])
    created_at = models.DateTimeField(auto_now_add=True)
    files = models.ManyToManyField(Files)

class BlockedUsers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    def __str__(self):
        return self.user.username

class Report(models.Model):
    report_content = models.CharField(max_length=255, choices=[('question', 'question'), ('answer', 'answer'),('comment', 'comment')])
    reason = models.CharField(max_length=255,choices=(
    ('Spam or Advertising', 'Spam or Advertising'),
    ('Offensive Language or Harassment', 'Offensive Language or Harassment'),
    ('Inappropriate Content', 'Inappropriate Content'),
    ('Misinformation or Fake News', 'Misinformation or Fake News'),
    ('Impersonation', 'Impersonation'),
    ('Copyright Infringement', 'Copyright Infringement'),
    ('Privacy Violation', 'Privacy Violation'),
    ('Bullying or Intimidation', 'Bullying or Intimidation'),
    ('Irrelevant or Off-Topic', 'Irrelevant or Off-Topic')
    ))
    created_at = models.DateTimeField(auto_now_add=True)
    question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True)
    answer = models.ForeignKey(Answer, on_delete=models.SET_NULL, null=True)
    comment = models.ForeignKey(Comment, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)
    
    def __str__(self):
        return self.user.username

class Notifications(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username