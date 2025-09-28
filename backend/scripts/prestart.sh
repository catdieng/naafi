#!/bin/bash

echo "Running prestart script..."

# Run migrations
echo "Applying database migrations..."
python manage.py migrate_schemas --shared --noinput
python manage.py migrate_schemas --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser from environment variables
if [ "$FIRST_SUPERUSER_PASSWORD" ] && [ "$FIRST_SUPERUSER_EMAIL" ]; then
  echo "Creating default superuser..."
  python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='${FIRST_SUPERUSER_EMAIL}').exists():
    User.objects.create_superuser(
        '${FIRST_SUPERUSER_EMAIL}',
        '${FIRST_SUPERUSER_PASSWORD}'
    )
END
else
  echo "Superuser credentials not provided. Skipping superuser creation."
fi

echo "Prestart script completed."
