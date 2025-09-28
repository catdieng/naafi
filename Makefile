.PHONY: help run stop build shell logs restart prune clean

# Help message
help: ## Show list of available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

run: ## Start containers in detached mode
	docker compose up -d

stop: ## Stop and remove containers
	docker compose down

build: ## Rebuild images without using cache
	docker compose build --no-cache

shell: ## Open a bash shell inside the backend container
	docker compose exec $(SERVICE) bash

create-superuser: ## Create a superuser
	docker compose exec $(SERVICE) python manage.py createsuperuser

logs: ## Follow container logs
	docker compose logs -f $(SERVICE)

restart: ## Restart containers
	docker compose down && docker compose up -d
