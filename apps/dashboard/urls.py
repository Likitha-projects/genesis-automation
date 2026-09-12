from django.urls import path
from . import views

app_name = 'dashboard'
urlpatterns = [
    path('', views.home, name='home'),
    path('staff/new/', views.staff_create, name='staff_create'),
    path('staff/<int:staff_id>/edit/', views.staff_edit, name='staff_edit'),
]
