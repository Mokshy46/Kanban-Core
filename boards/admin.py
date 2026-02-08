from django.contrib import admin
from .models import Boards,Lists,Cards



@admin.register(Boards)
class BoardsAdmin(admin.ModelAdmin):
    list_display = ('title','owner','created_at',)
    search_fields = ('owner','title',)
    ordering = ['created_at']


@admin.register(Lists)
class ListsAdmin(admin.ModelAdmin):
    list_display = ('title','board','board__owner', 'created_at',)
    search_fields = ('title','board',)
    ordering = ['created_at']

@admin.register(Cards)
class CardsAdmin(admin.ModelAdmin):
    list_display = ('title','list', 'list__board','list__board__owner', 'task_status',)
    search_fields = ('title','list',)
    ordering = ['-task_status']
