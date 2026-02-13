from django.contrib import admin
from .models import Boards,Lists,Cards,BoardMember



@admin.register(Boards)
class BoardsAdmin(admin.ModelAdmin):
    list_display = ('title','owner','created_at',)
    search_fields = ('owner__email','title',)
    ordering = ['created_at']


@admin.register(Lists)
class ListsAdmin(admin.ModelAdmin):
    list_display = ('title','board','board__owner', 'created_at',)
    search_fields = ('title','board__title')
    ordering = ['created_at']

@admin.register(Cards)
class CardsAdmin(admin.ModelAdmin):
    list_display = ('title','list', 'list__board','list__board__owner', 'task_status',)
    search_fields = ('title','list__title',)
    ordering = ['-task_status']


@admin.register(BoardMember)
class BoardMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'board',)
    search_fields = ('user', 'role', 'board',)
    ordering = ['-joined_at']