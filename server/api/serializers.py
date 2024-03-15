from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

month = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

def convertDateToString(date):
    #conver date into local time zone
    #return the date in the format dd-mm-yyyy hh:mm in string format with am/pm
    date = date.astimezone()
    return f"{date.day} {month[date.month]}, {date.year} at {date.hour}:{date.minute} {date.strftime('%p')}"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_superuser","is_staff"]

class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = "__all__"

class QuestionSerializer(serializers.ModelSerializer):
    tags = TagsSerializer(many=True)
    user = UserSerializer()
    jsdate = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = "__all__"
    
    def get_jsdate(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        created_at = instance.created_at
        representation['created_at'] = convertDateToString(created_at)
        return representation
        

class AnswerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    question = QuestionSerializer()
    jsdate = serializers.SerializerMethodField()
    
    class Meta:
        model = Answer
        fields = "__all__"
    
    def get_jsdate(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        created_at = instance.created_at
        representation['created_at'] = convertDateToString(created_at)
        return representation
    
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    answer = AnswerSerializer()
    jsdate = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = "__all__"
    
    def get_jsdate(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        created_at = instance.created_at
        representation['created_at'] = convertDateToString(created_at)
        return representation

class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = "__all__"

class ProofSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    files = FilesSerializer(many=True)
    jsdate = serializers.SerializerMethodField()    
    class Meta:
        model = Proof
        fields = "__all__"
    
    def get_jsdate(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        created_at = instance.created_at
        representation['created_at'] = convertDateToString(created_at)
        return representation