import uuid
from django.db import models

class Customer(models.Model):
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.full_name

class Bay(models.Model):
    name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Car(models.Model):
    STAGE_CHOICES = (
        ('intake', 'Intake'),
        ('in_progress', 'In Progress'),
        ('quality_check', 'Quality Check'),
        ('ready', 'Ready'),
    )

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='cars')
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    color = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=20)
    intake_photo = models.ImageField(upload_to='cars/', blank=True, null=True)
    after_photo = models.ImageField(upload_to='cars/', blank=True, null=True)
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='intake')
    secure_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    bay = models.ForeignKey(Bay, on_delete=models.SET_NULL, null=True, blank=True, related_name='cars')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.make} {self.model} ({self.plate_number})"

class Staff(models.Model):
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=50)
    photo = models.ImageField(upload_to='staff_photos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name

class ServiceRecord(models.Model):
    ZONE_CHOICES = (
        ('Front bumper', 'Front bumper'),
        ('Hood', 'Hood'),
        ('Interior', 'Interior'),
        ('Wheels', 'Wheels'),
        ('Doors', 'Doors'),
        ('Rear bumper', 'Rear bumper'),
        ('Trunk', 'Trunk'),
        ('Roof', 'Roof'),
        ('Full exterior', 'Full exterior'),
        ('Full interior', 'Full interior')
    )
    
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='service_records')
    zone = models.CharField(max_length=50, choices=ZONE_CHOICES)
    description = models.TextField()
    performed_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.car} - {self.zone} on {self.date.strftime('%Y-%m-%d')}"
