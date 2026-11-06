from django.contrib import admin
from django.urls import path, include
from config.health import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/cards/', include('apps.cards.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/decks/', include('apps.decks.urls')),
    path('api/health/', health_check, name='health')
]

