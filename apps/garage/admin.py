from django.contrib import admin
from .models import Customer, Car, Bay, Staff, ServiceRecord

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'email')
    search_fields = ('full_name', 'phone', 'email')

@admin.register(Bay)
class BayAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'plate_number', 'customer', 'current_stage', 'bay')
    list_filter = ('current_stage', 'bay')
    search_fields = ('plate_number', 'make', 'model', 'customer__full_name')

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'role', 'is_active')
    list_filter = ('is_active', 'role')

@admin.register(ServiceRecord)
class ServiceRecordAdmin(admin.ModelAdmin):
    list_display = ('car', 'zone', 'performed_by', 'date')
    list_filter = ('zone', 'date')
    search_fields = ('car__plate_number', 'description')
