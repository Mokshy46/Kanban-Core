from .serializers import BoardsSerializer,CardsSerializer,BoardDetailsSerializer,ListDetailsSerializer,BoardMemberSerializer,AddBoardMemberSerializer, ActivitySerializer, InviteUserSerializer
from .models import Boards, Cards,Lists, BoardMember, Activity, InviteUser
from rest_framework import permissions,authentication
from rest_framework import generics
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework import viewsets, status
from .permissions import BoardRolePermission
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied,ValidationError
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404

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


class MemberAssignmentAPIView(APIView):
    
    
    def get(self, request, *args, **kwargs): 
        card_id = self.kwargs.get("card_id")      
        try:
            card = Cards.objects.get(id = card_id)
        except Cards.DoesNotExist:
            return Response({
                "error":"card does not found"
            })
            
        users = card.assigned_to.all()
      
        data = [
            {"id":user.id,
            "username":user.first_name}         
            for user in users
        ]
        return Response(data, status=status.HTTP_200_OK)


    def post(self, request, *args, **kwargs):
        
        email = request.data.get("email")
        card_id = self.kwargs.get("card_id")

        try:
            card = Cards.objects.get(id = card_id)
            
        except Cards.DoesNotExist:
            return Response({
                "error":"Card Does NoT exists"
            })
            
        try:
            user = User.objects.get(email = email)
        except User.DoesNotExist:
            return Response({
                "error":"User Does Not Found"
            })
        
        card.assigned_to.add(user)
        return Response({
            "Assigned to card Successfully"
        })

class ActivityListAPIView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]
    
    def get_queryset(self):
        board_id = self.kwargs.get("board_id")
        return Activity.objects.filter(board_id = board_id).order_by("-created_at")


class InviteMemberCreateAPIView(generics.CreateAPIView):
    
    serializer_class = InviteUserSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]
    
    def perform_create(self,serializer):
        email = serializer.validated_data.get("email")
        role = serializer.validated_data.get("role")
        board_id =self.kwargs.get("board_id")
        
        board = get_object_or_404(Boards, id=board_id)   
            
        invite = serializer.save(
            
            board=board,
            invited_by = self.request.user,
        )
        
        link = f"http://localhost:5173/invite/{invite.token}"


        message = f"""
        You've been invited to join a board.

        Board: {board.title}
        Role: {invite.role}

        Click here to join:
        {link}
        """

        send_mail(
            "Board Invitation",
            message,
            settings.EMAIL_HOST_USER,
            [invite.email],
)
        
  
class ValidateInviteAPIView(APIView):
    
    def get(self, request, token):
        
        try:
            invite = InviteUser.objects.get(token=token)
            if invite.accepted:
                return Response({"error":"user already exists"})
            
            return Response({
                "email": invite.email,
                "board": invite.board.title,
                "role": invite.role
            })
            
        except InviteUser.DoesNotExist:
            return Response({
                "error": "Invalid token"
            })
        

class InviteUserAcceptAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, token):
        try:
            invite = InviteUser.objects.get(token=token)

            if invite.accepted:
                return Response({"error": "Invite already used"}, status=400)

            if invite.is_expired():
                return Response({"error": "Invite expired"}, status=400)

            if request.user.email != invite.email:
                return Response({"error": "This invite is not for you"}, status=403)

            if BoardMember.objects.filter(user=request.user, board=invite.board).exists():
                return Response({"error": "Already a member"}, status=400)

            BoardMember.objects.create(
                user=request.user,
                board=invite.board,
                role=invite.role,
            )

            invite.accepted = True
            invite.save()

            return Response({"message": "Successfully joined board"}, status=200)

        except InviteUser.DoesNotExist:
            return Response({"error": "Invalid token"}, status=404)