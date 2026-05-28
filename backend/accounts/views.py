from django.shortcuts import render
from .serializers import RegistrationSerializer,LoginSerializer,UserProfileSerializer
from rest_framework import generics,status
from rest_framework import authentication,permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser
from .throttle import LoginThrottle,UserProfileThrottle,RegisterThrottle

User = get_user_model()

class RegistrationApiView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegistrationSerializer
    throttle_classes = [RegisterThrottle]

    def post(self, request, *args, **kwargs):
        serialzer = RegistrationSerializer(data = request.data)
        if serialzer.is_valid():
            serialzer.save()
            return Response(serialzer.data, status=status.HTTP_201_CREATED )
        
        return Response (status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class LoginApiView(generics.GenericAPIView):
    
    serializer_class = LoginSerializer
    throttle_classes = [LoginThrottle]
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):

        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)

        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )
        
class UserProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [UserProfileThrottle]

    def get_object(self):
        return self.request.user