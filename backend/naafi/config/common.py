import os
from os.path import join

import dj_database_url
import structlog
from configurations import Configuration

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Common(Configuration):
    DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

    SHARED_APPS = (
        "django_tenants",
        "naafi.tenants",
        "naafi.users",
        "naafi.utils",
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        # Third party apps
        "corsheaders",
        "rest_framework",  # utilities for rest apis
        "rest_framework.authtoken",  # token authentication
        "django_filters",  # for filtering rest endpoints
        "django_structlog",  # for logging
        "drf_yasg",  # for swagger
    )

    TENANT_APPS = (
        "mptt",
        "naafi.services",
        "naafi.categories",
        "naafi.expenses",
        "naafi.customers",
        "naafi.taxes",
        "naafi.invoices",
        "naafi.appointments",
        "naafi.settings",
    )

    INSTALLED_APPS = list(SHARED_APPS) + [app for app in TENANT_APPS]

    TENANT_MODEL = "tenants.Tenant"

    TENANT_DOMAIN_MODEL = "tenants.Domain"

    # https://docs.djangoproject.com/en/2.0/topics/http/middleware/
    MIDDLEWARE = (
        "corsheaders.middleware.CorsMiddleware",
        "whitenoise.middleware.WhiteNoiseMiddleware",
        "naafi.tenants.middlewares.UserTenantMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
        "django_structlog.middlewares.RequestMiddleware",
    )

    ALLOWED_HOSTS = ["*"]
    ROOT_URLCONF = "naafi.urls"
    SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
    WSGI_APPLICATION = "naafi.wsgi.application"

    # Email
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

    ADMINS = (
        (
            os.getenv("ADMIN_NAME", "Author"),
            os.getenv("ADMIN_EMAIL", "admin@example.com"),
        ),
    )

    # Postgres
    DATABASES = {
        "default": dj_database_url.config(
            default=(
                f"postgres://{os.getenv('POSTGRES_USER', 'postgres')}:"
                f"{os.getenv('POSTGRES_PASSWORD', 'changethis')}@"
                f"{os.getenv('POSTGRES_SERVER', 'localhost')}:"
                f"{os.getenv('POSTGRES_PORT', '5432')}/"
                f"{os.getenv('POSTGRES_DB', 'app')}"
            ),
            conn_max_age=int(os.getenv("POSTGRES_CONN_MAX_AGE", 600)),
        )
    }

    DATABASES["default"]["ENGINE"] = "django_tenants.postgresql_backend"

    DATABASE_ROUTERS = ("django_tenants.routers.TenantSyncRouter",)

    # General
    APPEND_SLASH = False
    TIME_ZONE = "UTC"
    LANGUAGE_CODE = "en-us"
    # If you set this to False, Django will make some optimizations so as not
    # to load the internationalization machinery.
    USE_I18N = False
    USE_L10N = True
    USE_TZ = True
    LOGIN_REDIRECT_URL = "/"

    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/2.0/howto/static-files/
    STATIC_ROOT = os.path.normpath(join(os.path.dirname(BASE_DIR), "static"))
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
    STATICFILES_DIRS = []
    STATIC_URL = "/static/"
    STATICFILES_FINDERS = (
        "django.contrib.staticfiles.finders.FileSystemFinder",
        "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    )

    # Media files
    MEDIA_ROOT = join(os.path.dirname(BASE_DIR), "media")
    MEDIA_URL = "/media/"

    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": STATICFILES_DIRS,
            "APP_DIRS": True,
            "OPTIONS": {
                "context_processors": [
                    # "django.template.context_processors.debug",
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                ],
            },
        },
    ]

    # Set DEBUG to False as a default for safety
    # https://docs.djangoproject.com/en/dev/ref/settings/#debug
    DEBUG = os.getenv("DJANGO_DEBUG", "yes").lower() in ("true", "1", "yes")

    # Password Validation
    # https://docs.djangoproject.com/en/2.0/topics/auth/passwords/#module-django.contrib.auth.password_validation
    AUTH_PASSWORD_VALIDATORS = [
        {
            "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
        },
    ]

    # Logging
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "plain": {
                "()": structlog.stdlib.ProcessorFormatter,
                "processor": structlog.dev.ConsoleRenderer(),  # pretty printing in dev
                "foreign_pre_chain": [
                    structlog.stdlib.add_log_level,
                    structlog.stdlib.add_logger_name,
                ],
            },
        },
        "handlers": {
            "console": {
                "level": "DEBUG",  # <== This is the key
                "class": "logging.StreamHandler",
                "formatter": "plain",
            },
        },
        "root": {
            "handlers": ["console"],
            "level": "DEBUG",
        },
        "loggers": {
            "django": {
                "handlers": ["console"],
                "level": "WARNING",  # reduce Django noise
                "propagate": False,
            },
            "django.request": {
                "handlers": ["console"],
                "level": "ERROR",
                "propagate": False,
            },
            "django.db.backends": {
                "handlers": ["console"],
                "level": "WARNING",
                "propagate": False,
            },
        },
    }

    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.format_exc_info,  # for better tracebacks
            structlog.dev.ConsoleRenderer(),  # pretty print for dev
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Custom user app
    AUTH_USER_MODEL = "users.User"

    # Django Rest Framework
    REST_FRAMEWORK = {
        "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
        "PAGE_SIZE": int(os.getenv("DJANGO_PAGINATION_LIMIT", 10)),
        "DATETIME_FORMAT": "%Y-%m-%dT%H:%M:%S%z",
        "DEFAULT_RENDERER_CLASSES": (
            "rest_framework.renderers.JSONRenderer",
            "rest_framework.renderers.BrowsableAPIRenderer",
        ),
        "DEFAULT_PERMISSION_CLASSES": [
            "rest_framework.permissions.IsAuthenticated",
        ],
        "DEFAULT_AUTHENTICATION_CLASSES": (
            "rest_framework.authentication.SessionAuthentication",
            "rest_framework.authentication.TokenAuthentication",
        ),
        "DEFAULT_FILTER_BACKENDS": ["rest_framework.filters.OrderingFilter"],
    }

    # Urls config
    TENANT_SCHEMA_URLCONF = "naafi.tenant_urls"
    PUBLIC_SCHEMA_URLCONF = "naafi.urls"

    # CORS Settings
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",  # Your frontend URL
        # Add other origins if needed
    ]

    # For development only - allows cookies to be included in CORS requests
    CORS_ALLOW_CREDENTIALS = True

    AUTHENTICATION_BACKENDS = ["naafi.users.backends.EmailBackend"]
