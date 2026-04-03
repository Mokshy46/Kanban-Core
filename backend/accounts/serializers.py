from rest_framework.serializers import ModelSerializer
from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
        


# class LoginSerializer(serializers.ModelSerializer):
    
#     email = serializers.EmailField()
    
#     class Meta:
#         model = User
#         fields = ['email','password']


class MyTokenObtainSerializer(TokenObtainPairSerializer):
    
    user_name_field = "email"
    
    def validate(self, attrs):
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password'),
        }
        
        user = authenticate(**credentials)
        
        
        if user is None:
            
            raise serializers.ValidationError("Invalid credentials")
        
        refresh = self.get_token(user)
        
        return {
            'refresh': str(refresh),
            'access':str(refresh.access_token),
        }
        