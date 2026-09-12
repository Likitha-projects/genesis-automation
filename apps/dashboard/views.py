from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from apps.garage.models import Car, Staff, Bay
from .forms import StaffForm

@login_required
def home(request):
    if request.user.role != 'admin':
        return redirect('reception:home')
        
    # Counts
    active_stages = ['intake', 'in_progress', 'quality_check']
    cars_in_studio = Car.objects.filter(current_stage__in=active_stages).count()
    
    today = timezone.now().date()
    cars_ready_today = Car.objects.filter(current_stage='ready', created_at__date=today).count()
    
    active_staff = Staff.objects.filter(is_active=True).count()
    
    # Staff list
    staff_list = Staff.objects.all().order_by('-is_active', 'full_name')
    
    # Cars grouped by stage
    cars_by_stage = {
        'intake': Car.objects.filter(current_stage='intake').order_by('-created_at'),
        'in_progress': Car.objects.filter(current_stage='in_progress').order_by('-created_at'),
        'quality_check': Car.objects.filter(current_stage='quality_check').order_by('-created_at'),
        'ready': Car.objects.filter(current_stage='ready').order_by('-created_at')[:5] # Show only latest 5 ready
    }
    
    context = {
        'cars_in_studio': cars_in_studio,
        'cars_ready_today': cars_ready_today,
        'active_staff': active_staff,
        'staff_list': staff_list,
        'cars_by_stage': cars_by_stage,
    }
    return render(request, 'dashboard/home.html', context)

@login_required
def staff_create(request):
    if request.user.role != 'admin':
        return redirect('reception:home')
        
    if request.method == 'POST':
        form = StaffForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Staff member added.')
            return redirect('dashboard:home')
    else:
        form = StaffForm()
        
    return render(request, 'dashboard/staff_form.html', {'form': form, 'title': 'Add Staff Member'})

@login_required
def staff_edit(request, staff_id):
    if request.user.role != 'admin':
        return redirect('reception:home')
        
    staff = get_object_or_404(Staff, id=staff_id)
    if request.method == 'POST':
        form = StaffForm(request.POST, request.FILES, instance=staff)
        if form.is_valid():
            form.save()
            messages.success(request, 'Staff member updated.')
            return redirect('dashboard:home')
    else:
        form = StaffForm(instance=staff)
        
    return render(request, 'dashboard/staff_form.html', {'form': form, 'title': f'Edit {staff.full_name}', 'staff': staff})
