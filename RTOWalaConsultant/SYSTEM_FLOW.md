# RTOWalaConsultant

Django UI + DRF API project for RTO client, vehicle, and vehicle document expiry management.

## Setup with MySQL
1. Create database: `CREATE DATABASE rtowala_consultant CHARACTER SET utf8mb4;`
2. Copy `.env.example` to `.env` and set DB password.
3. Install: `pip install -r requirements.txt`
4. Run: `python manage.py migrate`
5. Seed roles/admin/categories: `python manage.py seed_initial_data`
6. Start: `python manage.py runserver`

## Default seeded admin
Username: `admin`  Password: `Admin@12345`

## Structure
- `api/models/api_Role.py`, `api_User.py`, `api_Client.py`, `api_Vehicle.py`, `api_VehicleDocumentCategory.py`, `api_VehicleDocument.py`, `api_Log.py`
- `api/serializers/api_*.py`
- `api/views/api_*.py`
- UI templates under `ui/template_view/partial_view`
- Common JS in `static/js/common.js`
- Common CSS in `static/css/admin.css` with page ids.

## Permissions
Admin can create/read/update/delete. Staff can create/read/update but cannot delete.
