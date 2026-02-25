from rest_framework import permissions
from .models import Boards,Lists,Cards,BoardMember


class BoardRolePermission(permissions.BasePermission):

    
    def get_board(self, obj):

        if hasattr(obj,'board'):
            return obj.board
        
        elif hasattr(obj,'list'):
            return obj.list.board
        
        else:
            return obj
        

    def has_object_permission(self, request, view, obj):

        board = self.get_board(obj)

        if not board:
            return False

        try:

            membership = BoardMember.objects.get(
                user = request.user,
                board = board,
            )

        except BoardMember.DoesNotExist:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True
        
        if isinstance(obj,Boards):

            if request.method == "DELETE":
                if membership.role in [BoardMember.ROLE_OWNER]:
                    return True
            
                else:
                    return False
                
            if request.method == "PUT" or request.method == "PATCH":
                if membership.role in [BoardMember.ROLE_ADMIN, BoardMember.ROLE_OWNER]:
                    return True
                
                else:
                    return False

        else:

            if membership.role in [BoardMember.ROLE_ADMIN, BoardMember.ROLE_OWNER]:
                return True



    def has_permission(self, request, view):
        
        return 