from django.urls import path
from . import views

app_name = 'reception'
urlpatterns = [
    path('', views.home, name='home'),
    path('intake/', views.intake, name='intake'),
    path('intake/success/<uuid:token>/', views.intake_success, name='intake_success'),
    path('car/<int:car_id>/', views.car_detail, name='car_detail'),
    path('ready-cars/', views.ready_cars, name='ready_cars'),
    path('car/<int:car_id>/delete/', views.delete_car, name='delete_car'),
    path('invoice/<int:invoice_id>/', views.invoice_preview, name='invoice_preview'),
]
