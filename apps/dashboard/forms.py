from django import forms
from apps.garage.models import Staff

class StaffForm(forms.ModelForm):
    class Meta:
        model = Staff
        fields = ['full_name', 'role', 'is_active']
        widgets = {
            'full_name': forms.TextInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm'}),
            'role': forms.TextInput(attrs={'class': 'w-full bg-showroom-white text-graphite-black placeholder-steel-grey/50 border border-chrome-silver rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-ignition-gold/50 focus:border-ignition-gold focus:outline-none transition-all shadow-sm'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'h-5 w-5 text-ignition-gold bg-showroom-white border-chrome-silver focus:ring-ignition-gold/50 rounded transition-all'}),
        }
