# Naafi - SaaS Project Summary

## Overview
**Naafi** is a multi-tenant SaaS (Software as a Service) application designed for managing automotive service businesses. It provides comprehensive tools for appointment scheduling, customer management, invoicing, expense tracking, and vehicle management.

## Domain & Business Purpose
The application serves automotive service providers (garages, repair shops, etc.) by offering:
- **Customer Relationship Management**: Track customers and their contact information
- **Vehicle Management**: Manage customer vehicles with brand/model tracking
- **Appointment Scheduling**: Schedule and track service appointments with status management
- **Service Catalog**: Define services with pricing, duration, and categorization
- **Invoicing System**: Generate invoices with automatic tax calculations
- **Expense Tracking**: Track business expenses with categorization and payment status
- **Multi-tenant Architecture**: Each business/organization operates in its own isolated tenant space

## Architecture

### Backend
- **Framework**: Django 5.1.7 + Django REST Framework
- **Multi-tenancy**: django-tenants (schema-based multi-tenancy)
- **Database**: PostgreSQL (with schema isolation per tenant)
- **API**: RESTful API with OpenAPI/Swagger documentation
- **Authentication**: Custom user authentication system
- **Architecture Pattern**: Multi-tenant SaaS with tenant isolation at the database schema level

### Frontend
- **Framework**: React 19.2.3 + TypeScript
- **Routing**: TanStack Router (file-based routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Library**: Chakra UI v3
- **Forms**: React Hook Form with Zod validation
- **API Client**: Auto-generated TypeScript client from OpenAPI schema
- **Build Tool**: Vite
- **Testing**: Playwright for E2E tests

## Key Features & Modules

### 1. **Tenants/Organizations**
- Multi-tenant architecture with isolated data per organization
- Tenant configuration (name, logo, contact info, billing)
- Domain-based tenant routing

### 2. **Users & Authentication**
- User management with role-based permissions
- Authentication endpoints (login, signup, password reset)
- User profiles and settings

### 3. **Customers**
- Customer database with full contact information
- Email, phone, and address management
- Customer-invoice relationship tracking

### 4. **Vehicles**
- Vehicle management (brand, model, license plate, VIN, year)
- Brand and model catalog with soft-delete support
- Vehicle-customer associations
- Vehicle-appointment relationships

### 5. **Services**
- Service catalog with pricing and duration
- Service categorization (hierarchical categories using MPTT)
- Tax configuration per service or category
- Active/inactive service status

### 6. **Appointments**
- Calendar-based appointment scheduling
- Status tracking (To do, In progress, Waiting parts, Done, Cancelled)
- Appointment-vehicle-service relationships
- Soft-delete support for data retention

### 7. **Invoices**
- Invoice generation with automatic numbering
- Invoice items with quantity and unit pricing
- Automatic tax calculation (percentage or fixed amount)
- Subtotal, tax total, and grand total calculations
- Issue date and due date tracking
- Customer-invoice relationships

### 8. **Expenses**
- Expense tracking with categorization
- Multi-currency support (USD, EUR, GBP, JPY, CAD, XOF)
- Payment status and payment method tracking
- Supplier/reference information
- Due date and payment date management

### 9. **Taxes**
- Tax configuration (percentage or fixed amount)
- Tax assignment to services and categories
- Automatic tax calculation in invoices

### 10. **Categories**
- Hierarchical category system (using MPTT - Modified Preorder Tree Traversal)
- Category types: Service and Expense
- Default tax assignment per category
- Slug-based unique identification

### 11. **Settings**
- Organization settings
- Billing configuration
- Tax management
- Vehicle brand/model management

## Technical Highlights

### Backend Features
- **Safe Delete**: Soft-delete functionality for data retention (using django-safedelete)
- **MPTT**: Hierarchical category structure
- **Transaction Safety**: Atomic operations for invoice total calculations
- **OpenAPI Generation**: Automatic API documentation with drf-yasg
- **Filtering**: Django-filter for advanced query filtering
- **Logging**: Structured logging with django-structlog
- **Storage**: Support for file storage (S3 via django-storages)

### Frontend Features
- **Type Safety**: Full TypeScript coverage with auto-generated API client
- **Form Validation**: Zod schemas for runtime validation
- **Table Framework**: DRFTable for consistent list views
- **Calendar Integration**: React Big Calendar for appointment scheduling
- **Theme Support**: Dark/light mode with next-themes
- **Error Handling**: React Error Boundary for graceful error handling

## Project Structure

```
naafi/
├── backend/              # Django backend application
│   ├── naafi/           # Main Django project
│   │   ├── appointments/ # Appointment management
│   │   ├── categories/   # Category management
│   │   ├── customers/    # Customer management
│   │   ├── expenses/     # Expense tracking
│   │   ├── invoices/     # Invoice management
│   │   ├── services/     # Service catalog
│   │   ├── taxes/        # Tax configuration
│   │   ├── tenants/      # Multi-tenant management
│   │   ├── users/        # User authentication
│   │   └── vehicles/     # Vehicle management
│   └── docs/            # API documentation (MkDocs)
│
└── frontend/            # React frontend application
    ├── src/
    │   ├── client/      # Auto-generated API client
    │   ├── components/  # React components
    │   ├── hooks/       # Custom React hooks
    │   ├── routes/      # TanStack Router pages
    │   └── theme/       # Theme configuration
    └── tests/           # Playwright E2E tests
```

## Development Workflow

1. **API-First Development**: Backend defines OpenAPI schema, frontend client is auto-generated
2. **Docker-Based**: Development environment runs in Docker containers
3. **Type Safety**: End-to-end type safety from backend models to frontend components
4. **Testing**: Backend uses pytest-django, frontend uses Playwright for E2E tests

## Dependencies Summary

### Backend Key Libraries
- Django 5.1.7
- Django REST Framework 3.15.2
- django-tenants 3.8.0 (multi-tenancy)
- django-mptt 0.17.0 (hierarchical data)
- django-safedelete 1.4.1 (soft deletes)
- PostgreSQL (via psycopg2-binary)

### Frontend Key Libraries
- React 19.2.3
- TanStack Router 1.143.6
- TanStack Query 5.90.12
- Chakra UI 3.30.0
- React Hook Form 7.69.0
- Zod (via @hookform/resolvers)
- React Big Calendar 1.19.4

## Deployment
- **Containerization**: Docker and Docker Compose
- **Web Server**: Gunicorn for Django
- **Reverse Proxy**: Traefik (docker-compose.traefik.yml)
- **Static Files**: WhiteNoise for Django, Nginx for frontend
- **Monitoring**: New Relic integration available

## Current Status
The project appears to be in active development with a comprehensive feature set covering the core business operations of an automotive service management system. The architecture supports scalability through multi-tenancy and maintains code quality through type safety and structured development practices.

