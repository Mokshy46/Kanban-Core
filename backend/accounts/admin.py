from django.contrib import admin
from accounts.models import CustomUser
# Register your models here.


"""
    Modify Admin.py in order to create a User using Django Admin,
    
    this makes sure that passwords are hashed which helps during login 
    
"""
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name','email','is_active',)
    list_filter = ('is_active',)
    search_fields = ('first_name','last_name','email',)