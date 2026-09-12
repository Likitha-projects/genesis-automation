from django.urls import path
from . import views

app_name = 'client_portal'
urlpatterns = [
    path('<uuid:token>/', views.car_passport, name='passport'),
    path('api/<uuid:token>/status/', views.car_status_api, name='api_status'),
]
