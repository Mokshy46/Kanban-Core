from django.db import models
from django.contrib.auth import get_user_model
from rest_framework import filters

User = get_user_model()

class Boards(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_boards")
    title = models.CharField(max_length=200, blank= False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Board'
        
class BoardMember(models.Model):

    ROLE_OWNER = "owner"
    ROLE_ADMIN = "admin"
    ROLE_MEMBER = "member"


    ROLE_CHOICES = [
        (ROLE_OWNER, "Owner"),
        (ROLE_MEMBER, "Member"),
        (ROLE_ADMIN, "Admin"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    board = models.ForeignKey(Boards, on_delete=models.CASCADE)
    role = models.CharField(max_length=22, choices=ROLE_CHOICES)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} as {self.role}"
    
    class Meta:
        verbose_name = 'Board Member'
    

class Lists(models.Model):
    board = models.ForeignKey(Boards, on_delete=models.CASCADE, related_name="lists")
    title = models.CharField(max_length=200, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'List'
    

class Cards(models.Model):

    list = models.ForeignKey(Lists, on_delete=models.CASCADE, related_name='cards')
    title = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    task_status = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Card'
        ordering = ['-task_status']
    