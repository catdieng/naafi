# Project Architecture

## Backend
- Django + Django REST Framework
- Multi-tenant SaaS architecture
- OpenAPI schema generated from Django
- Frontend client is generated from OpenAPI

## Frontend
- React + TypeScript
- TanStack Router with file-based routing
- Chakra UI

## Folder Rules

### routes/
- TanStack Router pages only
- No business logic
- Calls feature hooks only

### features/
- Domain logic per Django app (appointments, invoices, brands, etc.)
- Each feature mirrors a Django app
- Contains hooks, components, services, permissions

### client/
- Auto-generated from Django OpenAPI
- MUST NOT be edited manually

### components/
- Generic UI components only
- Must not depend on Django domain concepts

### DRFTable
- Shared table framework
- Used by all list pages
