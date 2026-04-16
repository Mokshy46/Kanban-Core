from django.urls import path,include
from .views import BoardsListAPIView,BoardsCreateAPIView, BoardsRetrieveUpdateDestroyAPIView,ListsViewSet,CardsViewSet, BoardMemberListAPIView,AddBoardMembersAPIView,BoardMemberDestroyAPIView,ActivityListAPIView
from rest_framework import routers


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
    
    path('boards/<int:board_id>/members/', BoardMemberListAPIView.as_view(), name='members_list'),
    path('boards/<int:board_id>/add_members/', AddBoardMembersAPIView.as_view(), name='add_members'),
    path('boards/<int:board_id>/remove_member/<int:user_id>/', BoardMemberDestroyAPIView.as_view(), name='remove_members'),

    path('boards/<int:board_id>/activities/', ActivityListAPIView.as_view(), name='activity'),
    path('', include(router.urls)),
    
]
