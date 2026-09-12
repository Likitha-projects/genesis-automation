from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from apps.garage.models import Car, Bay, ServiceRecord, Invoice
from .forms import CustomerForm, CarForm, ServiceRecordForm, InvoiceForm

@login_required
def home(request):
    # Cars currently in studio
    active_stages = ['intake', 'in_progress', 'quality_check']
    cars = Car.objects.filter(current_stage__in=active_stages).order_by('-created_at')
    
    context = {
        'cars': cars,
    }
    return render(request, 'reception/home.html', context)

@login_required
def intake(request):
    if request.method == 'POST':
        customer_form = CustomerForm(request.POST)
        car_form = CarForm(request.POST, request.FILES)
        
        if customer_form.is_valid() and car_form.is_valid():
            customer = customer_form.save()
            car = car_form.save(commit=False)
            car.customer = customer
            car.save()
            messages.success(request, 'Intake successful!')
            return redirect('reception:intake_success', token=car.secure_token)
    else:
        customer_form = CustomerForm()
        car_form = CarForm()
        
    context = {
        'customer_form': customer_form,
        'car_form': car_form,
    }
    return render(request, 'reception/intake.html', context)

@login_required
def intake_success(request, token):
    car = get_object_or_404(Car, secure_token=token)
    return render(request, 'reception/intake_success.html', {'car': car})

@login_required
def car_detail(request, car_id):
    car = get_object_or_404(Car, id=car_id)
    
    if request.method == 'POST':
        if 'send_email' in request.POST:
            # Simulate sending email
            messages.success(request, f"Digital Passport link successfully emailed to {car.customer.email}.")
            return redirect('reception:car_detail', car_id=car.id)
            
        # Handle stage or bay update
        elif 'update_status' in request.POST:
            car.current_stage = request.POST.get('current_stage')
            bay_id = request.POST.get('bay')
            if bay_id:
                car.bay_id = bay_id
            else:
                car.bay = None
            car.save()
            messages.success(request, 'Status updated successfully.')
            return redirect('reception:car_detail', car_id=car.id)
            
        # Handle new service record
        elif 'add_record' in request.POST:
            record_form = ServiceRecordForm(request.POST)
            if record_form.is_valid():
                record = record_form.save(commit=False)
                record.car = car
                record.save()
                messages.success(request, 'Service record added.')
                return redirect('reception:car_detail', car_id=car.id)
                
    else:
        record_form = ServiceRecordForm()
        
    bays = Bay.objects.filter(is_active=True)
    history = car.service_records.all().order_by('-date')
    
    context = {
        'car': car,
        'bays': bays,
        'record_form': record_form,
        'history': history,
        'stage_choices': Car.STAGE_CHOICES,
    }
    return render(request, 'reception/car_detail.html', context)

@login_required
def ready_cars(request):
    cars = Car.objects.filter(current_stage='ready').order_by('-created_at')
    
    if request.method == 'POST':
        car_id = request.POST.get('car_id')
        car = get_object_or_404(Car, id=car_id)
        invoice_form = InvoiceForm(request.POST)
        if invoice_form.is_valid():
            invoice = invoice_form.save(commit=False)
            invoice.car = car
            invoice.save()
            # Redirect to the new beautiful invoice preview page
            messages.success(request, f"Invoice for ₹{invoice.amount} successfully generated.")
            return redirect('reception:invoice_preview', invoice_id=invoice.id)
    else:
        invoice_form = InvoiceForm()

    context = {
        'cars': cars,
        'invoice_form': invoice_form,
    }
    return render(request, 'reception/ready_cars.html', context)

@login_required
def delete_car(request, car_id):
    if not (request.user.is_superuser or request.user.role == 'admin'):
        messages.error(request, "You do not have permission to delete vehicles.")
        return redirect('reception:home')
        
    car = get_object_or_404(Car, id=car_id)
    
    if request.method == 'POST':
        car_plate = car.plate_number
        car.delete()
        messages.success(request, f"Vehicle {car_plate} has been permanently deleted.")
        return redirect('reception:home')
        
    return redirect('reception:car_detail', car_id=car.id)

@login_required
def invoice_preview(request, invoice_id):
    invoice = get_object_or_404(Invoice, id=invoice_id)
    # The Invoice model has a FK to Car, which has a FK to Customer
    # We will pass the invoice to the template to render
    context = {
        'invoice': invoice,
        'car': invoice.car,
        'customer': invoice.car.customer,
        'service_records': invoice.car.service_records.all()
    }
    return render(request, 'reception/invoice_preview.html', context)
