from django.urls import path,include
from .views import BoardsListAPIView,BoardsCreateAPIView, BoardsRetrieveUpdateDestroyAPIView,ListsViewSet,CardsViewSet
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'lists', ListsViewSet)
router.register(r'cards',CardsViewSet)

urlpatterns = [
    path(
        'lists/<int:list_id>/cards/',
        CardsViewSet.as_view({'get':'list','post':'create'}),
        name='list-cards'
         ),
    
    path(
        'cards/<int:pk>/',
        CardsViewSet.as_view({
            'get':'retrieve',
            'put':'update',
            'patch':'partial_update',
            'delete':'destroy'
        }),
        name='card-detail'
    ),
    
    path(
        'boards/<int:board_id>/lists/',
        ListsViewSet.as_view({'get':'list','post':'create'}),
        name='board-lists'
         ),
    
    path(
        'lists/<int:pk>/',
        ListsViewSet.as_view({
            'get':'retrieve',
            'put':'update',
            'patch':'partial_update',
            'delete':'destroy'
        }),
        name='list-detail'
    ),    
    
    path('boards/', BoardsListAPIView.as_view(), name= 'boards'),
    path('create_board/', BoardsCreateAPIView.as_view(), name='create_board' ),
    path('boards/<int:pk>/',BoardsRetrieveUpdateDestroyAPIView.as_view(), name='board_destroy'),
    
    path('', include(router.urls)),
    
]
