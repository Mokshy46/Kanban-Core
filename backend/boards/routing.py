from django.urls import path
from .consumers import ActivityConsumer

websocket_urlpatterns = [
    path('ws/boards/<int:board_id>/', ActivityConsumer.as_asgi()),
]