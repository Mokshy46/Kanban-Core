from django.urls import path,include
from .views import BoardsListAPIView,BoardsCreateAPIView, BoardsRetrieveUpdateDestroyAPIView,ListsViewSet,CardsViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'lists', ListsViewSet)
router.register(r'cards',CardsViewSet)

urlpatterns = router.urls

urlpatterns = [
    path('boards/', BoardsListAPIView.as_view(), name= 'boards'),
    path('create_board/', BoardsCreateAPIView.as_view(), name='create_board' ),
    
    path('boards/<int:pk>/',BoardsRetrieveUpdateDestroyAPIView.as_view(), name='board_destroy'),
    
    path('', include(router.urls)),
    
]
