from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.garage.models import Customer, Car, Bay, Staff, ServiceRecord

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with initial demo data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Create Users
        admin_user, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@genesis.local', 'role': 'admin', 'is_superuser': True, 'is_staff': True})
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('Created admin user (admin / admin123)')

        reception_user, created = User.objects.get_or_create(username='reception', defaults={'email': 'reception@genesis.local', 'role': 'receptionist', 'is_staff': True})
        if created:
            reception_user.set_password('reception123')
            reception_user.save()
            self.stdout.write('Created receptionist user (reception / reception123)')

        # 2. Create Staff
        staff_data = [
            {'full_name': 'Marcus Vance', 'role': 'Lead Technician', 'photo': 'staff_photos/staff-01.jpg'},
            {'full_name': 'Elena Rostova', 'role': 'Detailer', 'photo': 'staff_photos/staff-02.jpg'},
            {'full_name': 'Julian Wright', 'role': 'Paint Specialist', 'photo': 'staff_photos/staff-03.jpg'},
            {'full_name': 'Sarah Jenkins', 'role': 'Detailer', 'photo': 'staff_photos/staff-04.jpg'},
        ]
        staff_objs = []
        for s in staff_data:
            staff, created = Staff.objects.get_or_create(full_name=s['full_name'], defaults={'role': s['role'], 'photo': s['photo']})
            staff_objs.append(staff)

        # 3. Create Bays
        bay1, _ = Bay.objects.get_or_create(name='Bay 1 - Wash & Prep')
        bay2, _ = Bay.objects.get_or_create(name='Bay 2 - Paint Correction')
        bay3, _ = Bay.objects.get_or_create(name='Bay 3 - Ceramic & Finishing')

        # 4. Create Customers & Cars
        # Sedan
        cust1, _ = Customer.objects.get_or_create(full_name='James Holden', phone='555-0101', email='james@example.com')
        car1, created = Car.objects.get_or_create(plate_number='RCI-899', defaults={
            'customer': cust1, 'make': 'BMW', 'model': 'M340i', 'year': 2022, 'color': 'Silver',
            'intake_photo': 'cars/sedan-before.png', 'after_photo': 'cars/sedan-after.png', 'current_stage': 'in_progress', 'bay': bay2
        })
        if created:
            ServiceRecord.objects.create(car=car1, zone='Full exterior', description='Initial wash and decontamination', performed_by=staff_objs[1])
            ServiceRecord.objects.create(car=car1, zone='Hood', description='Stage 1 paint correction - removing swirl marks', performed_by=staff_objs[2])

        # SUV
        cust2, _ = Customer.objects.get_or_create(full_name='Naomi Nagata', phone='555-0102', email='naomi@example.com')
        car2, created = Car.objects.get_or_create(plate_number='BTL-421', defaults={
            'customer': cust2, 'make': 'Volvo', 'model': 'XC90', 'year': 2020, 'color': 'White',
            'intake_photo': 'cars/suv-before.png', 'after_photo': 'cars/suv-after.png', 'current_stage': 'intake', 'bay': bay1
        })
        if created:
            ServiceRecord.objects.create(car=car2, zone='Full exterior', description='Vehicle received and inspected', performed_by=staff_objs[0])

        # Sports Car
        cust3, _ = Customer.objects.get_or_create(full_name='Amos Burton', phone='555-0103', email='amos@example.com')
        car3, created = Car.objects.get_or_create(plate_number='RCI-777', defaults={
            'customer': cust3, 'make': 'Porsche', 'model': '911 Carrera', 'year': 2023, 'color': 'Dark Blue',
            'intake_photo': 'cars/sportscar-before.png', 'after_photo': 'cars/sportscar-after.png', 'current_stage': 'quality_check', 'bay': bay3
        })
        if created:
            ServiceRecord.objects.create(car=car3, zone='Wheels', description='Deep cleaning and ceramic coating on wheels', performed_by=staff_objs[3])
            ServiceRecord.objects.create(car=car3, zone='Full exterior', description='Paint correction and finishing', performed_by=staff_objs[2])
            ServiceRecord.objects.create(car=car3, zone='Full interior', description='Interior detail and leather conditioning', performed_by=staff_objs[1])

        self.stdout.write(self.style.SUCCESS('Successfully seeded demo data.'))
        self.stdout.write('\nDemo Links:')
        self.stdout.write(f'Sedan (BMW M340i): /car/{car1.secure_token}/')
        self.stdout.write(f'SUV (Volvo XC90): /car/{car2.secure_token}/')
        self.stdout.write(f'Sports Car (Porsche 911): /car/{car3.secure_token}/')
