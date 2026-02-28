from rest_framework.serializers import ModelSerializer
from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.response import Response

User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    
    password_2 = serializers.CharField(style={'input_type':'passowrd'}, write_only = True)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password_2']
        extra_kwargs = {
            'password' : {'write_only':True}
        }
        
        
    def validate(self, attrs):
        
        if attrs['password'] != attrs['password_2']:
            raise serializers.ValidationError(
                {'password':'password mismatch'}
            )
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_2')
        
        user = User.objects.create(
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            is_active = True
        )
        
        user.set_password(validated_data['password'])
        user.save()
        
        return user
        


class LoginSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField()
    
    class Meta:
        model = User
        fields = ['email','password']
        