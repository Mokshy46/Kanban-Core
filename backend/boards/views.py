from django.shortcuts import render
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
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['board'] 
    def get_queryset(self):
        return Lists.objects.filter(board__boardmember__user = self.request.user)
    


class CardsViewSet(viewsets.ModelViewSet):
    queryset = Cards.objects.all()
    serializer_class = CardsSerializer
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['list'] 
    permission_classes = [ permissions.IsAuthenticated, BoardRolePermission]

    def get_queryset(self):
        return Cards.objects.filter(list__board__boardmember__user=self.request.user)

    def perform_create(self, serializer):
        list_id = self.request.data.get('list')
        serializer.save(list_id=list_id)
        
        
        
@api_view(['POST'])
def add_lists_to_boards(request, pk):
    
    try:
        board = Boards.objects.get(pk=pk)
        
    except Boards.DoesNotExist:
        return Response({'error':'Board not found!!'})
    
    serializer = ListDetailsSerializer(data = request.data)
    
    if serializer.is_valid():
        serializer.save(board = board)
        return Response(serializer.data)
    return Response(serializer.errors, status=400)



# @api_view(['POST'])
# def add_cards_to_lists(request, pk):
    
#     try:
#         list = Lists.objects.get(pk=pk)
        
#     except Lists.DoesNotExist:
#         return Response({'error':'Board not found!!'})
    
#     serializer =CardsSerializer(data = request.data)
    
#     if serializer.is_valid():
#         serializer.save(list = list)
#         return Response(serializer.data)
#     return Response(serializer.errors, status=400)


