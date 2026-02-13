from django.shortcuts import render
from .serializers import BoardsSerializer,ListsSerializer,CardsSerializer
from rest_framework.views import APIView
from .models import Boards, Cards,Lists
from rest_framework import permissions,authentication
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets
from .permissions import IsBoardOwner,IsListInBoard,IsCardInList


class BoardsListCreateAPIView(ListCreateAPIView):
    serializer_class = BoardsSerializer
    permission_classes = [permissions.IsAuthenticated, IsBoardOwner]
    
    def get_queryset(self):
        return Boards.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)


class BoardsRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = BoardsSerializer
    permission_classes = [IsBoardOwner, permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Boards.objects.filter(owner = self.request.user)

# class ListsListCreateAPIView(ListCreateAPIView):
#     queryset = Lists.objects.all()
#     serializer_class = ListsSerializer


class ListsViewSet(viewsets.ModelViewSet):
    queryset = Lists.objects.all()
    serializer_class = ListsSerializer
    permission_classes = [IsListInBoard, permissions.IsAuthenticated]

    def get_queryset(self):
        return Lists.objects.filter(board__owner = self.request.user)
    


class CardsViewSet(viewsets.ModelViewSet):
    queryset = Cards.objects.all()
    serializer_class = CardsSerializer
    permission_classes = [IsCardInList]

    def get_queryset(self):
        return Cards.objects.filter(list__board__owner=self.request.user)












# class BoardsViewSet(ModelViewSet):
#     serializer_class = BoardsSerializer
#     permission_classes = [permissions.AllowAny]

#     def get_queryset(self):
#         return Boards.objects.filter(owner=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(owner=self.request.user)


# class BoardsView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def get(self,request): 
#         board = Boards.objects.all()
#         serializer = BoardsSerializer(board, many = True)
#         return Response(data=serializer.data)
    
    
    
    
    
# class ListsListView(generics.ListAPIView):
#     model = Lists
#     permission_classes = [permissions.AllowAny]
#     serializer_class = ListsSerializer
    
#     def get_queryset(self):
#         lists = Lists.objects.all()
#         return lists
    


