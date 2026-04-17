from .serializers import BoardsSerializer,CardsSerializer,BoardDetailsSerializer,ListDetailsSerializer,BoardMemberSerializer,AddBoardMemberSerializer, ActivitySerializer
from .models import Boards, Cards,Lists, BoardMember, Activity
from rest_framework import permissions,authentication
from rest_framework import generics
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework import viewsets, status
from .permissions import BoardRolePermission
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied,ValidationError

User = get_user_model()

def create_activity(user, board, action):
    return Activity.objects.create(
        user = user,
        board = board,
        action = action,
    )

class BoardsListAPIView(generics.ListAPIView):
    serializer_class = BoardsSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]
    def get_queryset(self):
        return Boards.objects.filter(
            boardmember__user = self.request.user
        ).distinct()


class BoardsCreateAPIView(generics.CreateAPIView):
    serializer_class = BoardsSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]

    def perform_create(self, serializer):
        board = serializer.save(owner = self.request.user)

        BoardMember.objects.create(
            board = board,
            user = self.request.user,
            role = BoardMember.ROLE_OWNER
        )
        
        create_activity(
            user = self.request.user,
            board=board,
            action= f" created {board}"
        )

class BoardsRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = BoardDetailsSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]

    def get_queryset(self):
        return Boards.objects.filter(
            boardmember__user = self.request.user
        )

    def perform_update(self, serializer):
        board= serializer.save()      
        create_activity(
            user=self.request.user,
            board=board,
            action= f"updated {board.title}"
        )
        
    def perform_destroy(self, instance):
        create_activity(
            user=self.request.user,
            board=instance,
            action=f"deleted {instance.title}"
        )
        instance.delete()
        
        
class ListsViewSet(viewsets.ModelViewSet):
    queryset = Lists.objects.all()
    serializer_class = ListDetailsSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]

    def get_queryset(self):
        board_id = self.kwargs.get('board_id')
        
        if board_id:
            return Lists.objects.filter(
                board_id=board_id,
                board__boardmember__user = self.request.user
                
            )
        return Lists.objects.filter(board__boardmember__user = self.request.user)
    
    def perform_create(self, serializer):
        board_id = self.kwargs.get('board_id')
        
        if board_id:
            list_instance = serializer.save(board_id=board_id)        
            
        else:
           list_instance= serializer.save()
            
        create_activity(
            user = self.request.user,
            board= list_instance.board,
            action= f" created {list_instance.title}"
        )
        
    def perform_update(self, serializer):
        list_instance= serializer.save()      
        create_activity(
            user=self.request.user,
            board=list_instance.board,
            action= f"updated {list_instance.title}"
        )
        
    def perform_destroy(self, instance):
        create_activity(
            user=self.request.user,
            board=instance.board,
            action=f"deleted {instance.title}"
        )
        instance.delete()
                

class CardsViewSet(viewsets.ModelViewSet):
    queryset = Cards.objects.all()
    serializer_class = CardsSerializer
    permission_classes = [ permissions.IsAuthenticated, BoardRolePermission]

    def get_queryset(self):
        list_id = self.kwargs.get('list_id')
        
        if list_id:
            return Cards.objects.filter(
                list_id = list_id,
                list__board__boardmember__user=self.request.user
            )
        return Cards.objects.filter(
            list__board__boardmember__user=self.request.user
        )

    def perform_create(self, serializer):
        list_id = self.kwargs.get('list_id')
        if list_id:
           cards= serializer.save(list_id=list_id)
        else:
           cards= serializer.save()
            
        create_activity(
            user=self.request.user,
            board=cards.list.board,
            action= f" created {cards.title}"
        )
        
    def perform_update(self, serializer):
        cards= serializer.save()      
        create_activity(
            user=self.request.user,
            board=cards.list.board,
            action= f"updated {cards.title}"
        )
        
    def perform_destroy(self, instance):
        create_activity(
            user=self.request.user,
            board=instance.list.board,
            action=f"deleted {instance.title}"
        )
        instance.delete()
        

class BoardMemberListAPIView(generics.ListAPIView):
    serializer_class = BoardMemberSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]
    
    def get_queryset(self):
        board_id = self.kwargs.get("board_id")
        return BoardMember.objects.filter(board_id = board_id)
    

class AddBoardMembersAPIView(generics.CreateAPIView):
    serializer_class = AddBoardMemberSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]
    
    def perform_create(self, serializer):
        board_id = self.kwargs.get("board_id")
        email = serializer.validated_data.get("email")
        board = Boards.objects.get(id = board_id)
        role = serializer.validated_data.get(
        "role",
          BoardMember.ROLE_MEMBER
        )             
        current_user = BoardMember.objects.get(
            board = board,
            user = self.request.user,
        )
        
        if current_user.role == BoardMember.ROLE_MEMBER:
            raise PermissionDenied("members cannot add people")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found") 
        
        if BoardMember.objects.filter(board = board, user= user).exists():
            raise ValidationError("User already exists")
            
        serializer.validated_data.pop("email")         
        serializer.save(
            board_id = board_id,
            user = user,
            role = role,
        )
        
        create_activity(
            user=self.request.user,
            board=board,
            action=f"{user.first_name} added to the board"
        )

    
class BoardMemberRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = BoardMember.objects.all()
    serializer_class = BoardMemberSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]
    
    def get_object(self):
        board_id = self.kwargs.get("board_id")
        user_id = self.kwargs.get("user_id")
        user = User.objects.get(id = user_id)
        
        return BoardMember.objects.get(
            board_id = board_id,
            user = user,
        )

    def perform_update(self, serializer):
        board_member = self.get_object()
        
        if self.request.user != board_member.board.owner :
            raise PermissionError("You r not the owner")

        return super().perform_update(serializer)


class BoardMemberDestroyAPIView(generics.DestroyAPIView):  
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]
    
    def get_object(self):
        board_id = self.kwargs.get("board_id")
        user_id = self.kwargs.get("user_id")

        return BoardMember.objects.get(
            board_id=board_id,
            user_id=user_id
        )
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        current_user = BoardMember.objects.get(
            user = request.user,
            board = instance.board,
        )

        if instance.role == BoardMember.ROLE_OWNER:
            return Response(
                {"error":"owner cant be deleted"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if current_user.role == BoardMember.ROLE_ADMIN:
            if instance.role != BoardMember.ROLE_MEMBER:
                return Response(
                    {"error":"Admins can only delete members"},
                    status=status.HTTP_400_BAD_REQUEST
                )          
        
        if current_user.role == BoardMember.ROLE_MEMBER:
            return Response(
                {"error":"Member cannot delete others"},
                status=status.HTTP_400_BAD_REQUEST
            )  
        
        create_activity(
            user=self.request.user,
            board = instance.board,
            action=f"{instance.user.first_name} deleted from the board"
        )              
        self.perform_destroy(instance=instance)     
        return Response(status=status.HTTP_204_NO_CONTENT)



class ActivityListAPIView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]
    
    def get_queryset(self):
        board_id = self.kwargs.get("board_id")
        return Activity.objects.filter(board_id = board_id).order_by("-created_at")
