from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegistrationApiView,LoginApiView,UserProfileRetrieveUpdateAPIView,LogoutAPIView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegistrationApiView.as_view(), name= 'register'),
    path('login/', LoginApiView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
        
    path('profile/', UserProfileRetrieveUpdateAPIView.as_view(), name='user_profile'),
]
