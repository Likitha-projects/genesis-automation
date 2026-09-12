from django.urls import path
from . import views

app_name = 'reception'
urlpatterns = [
    path('', views.home, name='home'),
    path('intake/', views.intake, name='intake'),
    path('intake/success/<uuid:token>/', views.intake_success, name='intake_success'),
    path('car/<int:car_id>/', views.car_detail, name='car_detail'),
]
