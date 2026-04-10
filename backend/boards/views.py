from .serializers import BoardsSerializer,CardsSerializer,BoardDetailsSerializer,ListDetailsSerializer
from .models import Boards, Cards,Lists, BoardMember
from rest_framework import permissions,authentication
from rest_framework import generics
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework import viewsets
from .permissions import BoardRolePermission
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import api_view


class BoardsListAPIView(generics.ListAPIView):
    serializer_class = BoardsSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Boards.objects.filter(
            boardmember__user = self.request.user
        ).distinct()


class BoardsCreateAPIView(generics.CreateAPIView):
    serializer_class = BoardsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        board = serializer.save(owner = self.request.user)

        BoardMember.objects.create(
            board = board,
            user = self.request.user,
            role = BoardMember.ROLE_OWNER
        )


class BoardsRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = BoardDetailsSerializer
    permission_classes = [permissions.IsAuthenticated, BoardRolePermission]

    def get_queryset(self):
        return Boards.objects.filter(
            boardmember__user = self.request.user
        )
    

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
            serializer.save(board_id=board_id)        
            
        else:
            serializer.save()


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
            serializer.save(list_id=list_id)
        else:
            serializer.save()
        

