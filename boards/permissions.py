from rest_framework import permissions
from .models import Boards,Lists,Cards


class IsBoardOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        
        if request.method == "OPTIONS":
            return True
        
        return obj.owner == request.user 
    

class IsListInBoard(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method == "OPTIONS":
            return True
        
        return obj.board.owner == request.user
    


 

class IsCardInList(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method == "OPTIONS":
            return True
        

        return obj.list.board.owner == request.user
    

class IsBoardMember(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        
        if request.method in permissions.SAFE_METHODS:
            return True
        

        return 