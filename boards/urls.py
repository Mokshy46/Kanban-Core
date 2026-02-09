from django.urls import path,include
from .views import BoardsListCreateAPIView,BoardsRetrieveUpdateDestroyAPIView,ListsViewSet,CardsViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'lists', ListsViewSet)
router.register(r'cards',CardsViewSet)

urlpatterns = router.urls

urlpatterns = [
    path('boards/', BoardsListCreateAPIView.as_view(), name= 'boards'),
    path('boards/<int:pk>/',BoardsRetrieveUpdateDestroyAPIView.as_view(), name='board_destroy'),
    # path('lists/',ListsListCreateAPIView.as_view(), name='lists'),
    # path('create_list/',ListsListCreateAPIView.as_view(), name='create_list'),
    path('', include(router.urls)),
    
]
