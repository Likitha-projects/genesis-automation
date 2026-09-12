from django import forms
from apps.garage.models import Customer, Car, ServiceRecord, Invoice

class CustomerForm(forms.ModelForm):
    email = forms.EmailField(required=False, widget=forms.EmailInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'placeholder': 'jane@example.com'}))
    
    class Meta:
        model = Customer
        fields = ['full_name', 'phone', 'email']
        widgets = {
            'full_name': forms.TextInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'placeholder': 'Jane Doe'}),
            'phone': forms.TextInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'placeholder': '555-0199'}),
        }

class CarForm(forms.ModelForm):
    class Meta:
        model = Car
        fields = ['make', 'model', 'year', 'color', 'plate_number', 'intake_photo']
        widgets = {
            'make': forms.TextInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'placeholder': 'Porsche'}),
            'model': forms.TextInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'placeholder': '911 Carrera'}),
            'year': forms.NumberInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'placeholder': '2023'}),
            'color': forms.TextInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'placeholder': 'Dark Blue'}),
            'plate_number': forms.TextInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'placeholder': 'ABC-1234'}),
            'intake_photo': forms.FileInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black border border-chrome-silver rounded-lg px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-pearl file:border file:border-chrome-silver file:text-graphite-black hover:file:bg-chrome-silver transition-all'}),
        }

class ServiceRecordForm(forms.ModelForm):
    class Meta:
        model = ServiceRecord
        fields = ['zone', 'description', 'performed_by']
        widgets = {
            'zone': forms.Select(attrs={'class': 'w-full bg-showroom-white text-graphite-black border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm'}),
            'description': forms.Textarea(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'rows': 3, 'placeholder': 'Describe the service performed...'}),
            'performed_by': forms.Select(attrs={'class': 'w-full bg-showroom-white text-graphite-black border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm'}),
        }

class InvoiceForm(forms.ModelForm):
    class Meta:
        model = Invoice
        fields = ['amount', 'details']
        widgets = {
            'amount': forms.NumberInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'step': '0.01'}),
            'details': forms.Textarea(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm', 'rows': 4, 'placeholder': 'Itemized services...'}),
        }
