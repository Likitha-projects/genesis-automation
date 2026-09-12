# Genesis Automation — Premium Car Detailing Platform

An MVP web platform for a premium car detailing studio featuring a reception intake tool, a simple admin dashboard, and a digital 3D car passport for clients.

## Tech Stack
- **Backend**: Django 5, Django REST Framework
- **Frontend**: Django Templates, Tailwind CSS, Vanilla JS
- **3D**: Three.js (via CDN)
- **Database**: SQLite (dev)

## Local Development Setup

1. **Python Environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   # Update variables in .env if needed
   ```

3. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py seed
   ```

4. **Run Server**
   ```bash
   python manage.py runserver
   ```

## Demo Credentials & Links

After running `python manage.py seed`, use these credentials to log in at `/accounts/login/`:

- **Admin Dashboard**: `admin` / `admin123`
- **Reception Intake**: `reception` / `reception123`

The seed script also creates 3 demo vehicles with active client portal links. Check your terminal output during the seed process for the exact URLs, or navigate to `/reception/` to see the generated links in the "View Client Passport" buttons.

## Important Note on Assets
The project currently uses stylized CSS/SVG placeholders where the AI-generated media (hero video, car images, 3D models) is expected, so no screen is ever broken or blank. To add the real assets, place them in their respective folders under `static/images/`, `static/video/`, and `static/models/` as detailed in `03_AI_ASSET_PROMPTS.md`.
