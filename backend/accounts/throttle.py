from rest_framework.throttling import UserRateThrottle

class LoginThrottle(UserRateThrottle):
    scope = 'login'
    
class UserProfileThrottle(UserRateThrottle):
    scope = 'profile'
    
class RegisterThrottle(UserRateThrottle):
    scope = 'register'