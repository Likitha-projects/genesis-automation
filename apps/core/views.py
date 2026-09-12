from django.shortcuts import render, redirect
from django.contrib import messages
from apps.garage.models import Car, Bay, ServiceRecord
import uuid

def landing_page(request):
    all_cars = Car.objects.all().order_by('-created_at')
    demo_car = all_cars.filter(current_stage='in_progress').first() or all_cars.first()
    demo_cars = all_cars[:4]
    bays = Bay.objects.filter(is_active=True)
    
    total_services = ServiceRecord.objects.count()
    active_builds = Car.objects.filter(current_stage__in=['intake', 'in_progress', 'quality_check']).count()
    
    context = {
        'demo_car_token': demo_car.secure_token if demo_car else None,
        'demo_car': demo_car,
        'demo_cars': demo_cars,
        'bays': bays,
        'total_services': total_services,
        'active_builds': active_builds,
    }
    return render(request, 'landing/index.html', context)

