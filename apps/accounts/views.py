from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.contrib import messages
from apps.garage.models import Car

class CustomLoginView(LoginView):
    template_name = 'accounts/login.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['demo_cars'] = Car.objects.all().order_by('-created_at')[:4]
        return context

@login_required
def role_redirect(request):
    if request.user.role == 'admin':
        return redirect('dashboard:home')
    return redirect('reception:home')

def customer_lookup(request):
    if request.method == 'POST':
        identifier = request.POST.get('identifier', '').strip()
        if identifier:
            car = Car.objects.filter(plate_number__iexact=identifier).first()
            if not car:
                try:
                    car = Car.objects.filter(secure_token=identifier).first()
                except Exception:
                    car = None
            if car:
                return redirect('client_portal:passport', token=car.secure_token)
            else:
                messages.error(request, f"No registered vehicle found matching '{identifier}'. Please check your plate number or passport token.")
        else:
            messages.error(request, "Please enter your license plate number or digital passport token.")
    return redirect('accounts:login')

