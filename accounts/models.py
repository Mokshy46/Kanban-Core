from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser,PermissionsMixin


"""
        Creating User inside Admin won't hash password while using Custom User Model,

        Therefore its better to modify admin in order to hash password or else create a user in terminal using py. shell

"""

class CustomUserManager(BaseUserManager):

    def create_user(self, email, first_name, last_name, password = None, **extra_fields):

        if not email:
            raise ValueError("Invalid email")
        
        email = self.normalize_email(email=email)
        user = self.model(email = email, first_name = first_name, last_name = last_name, **extra_fields)
        user.set_password(password)
        user.save(using = self._db)
        return user
    

    def create_superuser(self, email, first_name, last_name, password = None, **extra_fields ):

        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('is_staff', True)   

        """
            IF conditions are used to make debugging easy
        """
           
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')

        return self.create_user(email=email, first_name=first_name,last_name=last_name, password=password, **extra_fields)




class CustomUser(AbstractBaseUser,PermissionsMixin):

    email = models.EmailField(unique=True,max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    facebook_link = models.URLField(max_length=255, blank=True)
    instagram_link = models.URLField(max_length=255, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    