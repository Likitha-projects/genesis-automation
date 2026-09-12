from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.garage.models import Car

def car_passport(request, token):
    car = get_object_or_404(Car, secure_token=token)
    
    # Calculate zones serviced count
    zone_counts = {}
    history = car.service_records.all().order_by('-date')
    for record in history:
        if record.zone in zone_counts:
            zone_counts[record.zone] += 1
        else:
            zone_counts[record.zone] = 1
            
    # Mask plate number for privacy (e.g. ABC-1234 -> A**-***4)
    if car.plate_number:
        plate = car.plate_number
        if len(plate) > 4:
            masked_plate = f"{plate[0]}***-***{plate[-1]}"
        else:
            masked_plate = "***"
    else:
        masked_plate = "N/A"

    # Passport details calculation
    last_service = history.first()
    last_serviced_date = last_service.date if last_service else car.created_at
    total_services_count = history.count()
    service_location = f"Bay {car.bay.name}" if car.bay else "Unassigned"

    # Synthesize parts changed/installed from service records or studio defaults
    parts_list = []
    for r in history:
        # Extract keywords or use zone-derived parts
        desc = r.description
        if "ceramic" in desc.lower():
            parts_list.append({"name": "9H Ceramic Matrix Coat", "category": "Protection", "zone": r.zone})
        elif "ppf" in desc.lower() or "film" in desc.lower():
            parts_list.append({"name": "Self-Healing Clear PPF", "category": "Aero / Armor", "zone": r.zone})
        elif "wheel" in desc.lower() or "caliper" in desc.lower():
            parts_list.append({"name": "Brembo High-Temp Ceramic Coating", "category": "Wheels", "zone": r.zone})
        elif "exhaust" in desc.lower():
            parts_list.append({"name": "Titanium Quad Exhaust Tips", "category": "Exhaust", "zone": r.zone})
        elif "spoiler" in desc.lower() or "wing" in desc.lower() or "splitter" in desc.lower():
            parts_list.append({"name": "Carbon Composite Aero Splitter", "category": "Aero", "zone": r.zone})
        elif "leather" in desc.lower() or "interior" in desc.lower():
            parts_list.append({"name": "Alcantara & Nappa Leather Hydration", "category": "Interior", "zone": r.zone})
        else:
            parts_list.append({"name": f"{r.zone} Precision Treatment", "category": "Studio Spec", "zone": r.zone})

    # Default fallback parts if none are logged yet
    if not parts_list:
        pass # No parts for new intakes
            
    context = {
        'car': car,
        'history': history,
        'zone_counts': zone_counts,
        'total_zones': len(zone_counts),
        'masked_plate': masked_plate,
        'last_serviced_date': last_serviced_date,
        'total_services_count': total_services_count,
        'service_location': service_location,
        'parts_list': parts_list,
        'parts_count': len(parts_list),
    }
    return render(request, 'client_portal/passport.html', context)

@api_view(['GET'])
def car_status_api(request, token):
    car = get_object_or_404(Car, secure_token=token)
    
    # Simple JSON representation of the current status
    return Response({
        'current_stage': car.current_stage,
        'stage_display': car.get_current_stage_display(),
        'bay': car.bay.name if car.bay else None,
        'record_count': car.service_records.count(),
    })
