from django.shortcuts import render
from .serializers import RegistrationSerializer,LoginSerializer
from rest_framework import generics,status
from rest_framework import authentication,permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate


class RegistrationApiView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serialzer = RegistrationSerializer(data = request.data)
        if serialzer.is_valid():
            serialzer.save()
            return Response(serialzer.data, status=status.HTTP_201_CREATED )
        
        return Response (status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    
class LoginApiView(generics.GenericAPIView):
    
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        
        serializer = LoginSerializer(data = request.data)
        
        
        if serializer.is_valid():
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            
            user = authenticate(email=email, password=password)
            
            if user is not None:
                return Response({'message':'Login Success'}, status= status.HTTP_200_OK)
            
            return Response({'message':'Login Failed'}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)