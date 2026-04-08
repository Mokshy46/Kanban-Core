from django.urls import path,include
from .views import BoardsListAPIView,BoardsCreateAPIView, BoardsRetrieveUpdateDestroyAPIView,ListsViewSet,CardsViewSet
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'lists', ListsViewSet)
router.register(r'cards',CardsViewSet)

urlpatterns = router.urls

urlpatterns = [
    path('boards/', BoardsListAPIView.as_view(), name= 'boards'),
    path('boards/<int:pk>/lists', views.add_lists_to_boards, name = 'board_lists' ),
    path('create_board/', BoardsCreateAPIView.as_view(), name='create_board' ),
    
    path('boards/<int:pk>/',BoardsRetrieveUpdateDestroyAPIView.as_view(), name='board_destroy'),
    
    path('', include(router.urls)),
    path('lists/<int:pk>/cards', views.add_cards_to_lists, name='card_lists'),
    
]
