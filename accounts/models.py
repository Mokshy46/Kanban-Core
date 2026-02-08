from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser,PermissionsMixin




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

        return self.create_user(email=email, first_name=first_name,last_name=last_name, password=password, **extra_fields)




class CustomUser(AbstractBaseUser,PermissionsMixin):

    email = models.EmailField(unique=True,max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    facebook_link = models.URLField(max_length=255)
    instagram_link = models.URLField(max_length=255)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    