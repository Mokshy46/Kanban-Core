"""
ASGI config for system project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'system.settings')
django_asgi_app = get_asgi_application()

import boards.routing  

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(
        boards.routing.websocket_urlpatterns
    ),
})