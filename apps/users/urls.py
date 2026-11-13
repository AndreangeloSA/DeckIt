from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.users.views import RegisterView, Logout, Favorite, UserGeneralInfo, PasswordResetRequest, PasswordReset

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('general-info/', UserGeneralInfo.as_view(), name='user-general-info'),
    path('logout/', Logout.as_view(), name='logout'),
    path('favorite/<int:card_id>/', Favorite.as_view(), name='favorite'),
    path('favorite/', Favorite.as_view(), name='favorite-list'),
    path("password-request/", PasswordResetRequest.as_view(), name="password-request"),
    path('password-reset/', PasswordReset.as_view(), name="password-reset")
]