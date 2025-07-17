from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, CartViewSet, ReviewViewSet, OrderViewSet, RegisterView, LoginView, UserViewSet, AdminStatsView, ArtisanListView, ArtisanDetailView, ArtisanValidateView, ArtisanRejectView, check_email_exists, send_verification_code, get_artisan_by_shop, reviews_by_artisan, artisans_stats, TrainingFieldViewSet, TutorialCategoryViewSet, TutorialViewSet, ContactFormView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'reviews', ReviewViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'users', UserViewSet, basename='user')
router.register(r'training-fields', TrainingFieldViewSet)
router.register(r'tutorial-categories', TutorialCategoryViewSet)
router.register(r'tutorials', TutorialViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]

urlpatterns += [
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]

urlpatterns += [
    path('artisans/', ArtisanListView.as_view(), name='artisan-list'),
    path('artisans/<int:pk>/', ArtisanDetailView.as_view(), name='artisan-detail'),
    path('artisans/<int:pk>/validate/', ArtisanValidateView.as_view(), name='artisan-validate'),
    path('artisans/<int:pk>/reject/', ArtisanRejectView.as_view(), name='artisan-reject'),
    path('artisan-by-shop/', get_artisan_by_shop, name='artisan-by-shop'),
]

urlpatterns += [
    path('check-email/', check_email_exists, name='check-email'),
]

urlpatterns += [
    path('send-verification-code/', send_verification_code, name='send-verification-code'),
]

urlpatterns += [
    path('reviews/by-artisan/<int:artisan_id>/', reviews_by_artisan, name='reviews-by-artisan'),
]

urlpatterns += [
    path('artisans/stats/', artisans_stats, name='artisans-stats'),
]

urlpatterns += [
    path('contact/', ContactFormView.as_view(), name='contact-form'),
]