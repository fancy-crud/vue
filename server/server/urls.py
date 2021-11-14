from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from server import settings

HOST_PATH = settings.HOST_PATH + '/' if settings.HOST_PATH != '' else ''

urlpatterns = [
    path(f'{HOST_PATH}admin/', admin.site.urls),
    path(f'{HOST_PATH}api/', include('apps.core.urls')),
    path(f'{HOST_PATH}api/', include('apps.users.urls')),
    path(f'{HOST_PATH}api/auth/', include('rest_framework_social_oauth2.urls'))
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
