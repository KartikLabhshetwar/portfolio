# Portfolio — common tasks. Run `make` (or `make help`) to list them.
.DEFAULT_GOAL := help
.PHONY: help install dev cms build preview check test clean deploy

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-9s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start dev server (site + /keystatic CMS) at http://localhost:4321
	npm run dev

cms: ## Edit blog posts in the CMS — run `make dev`, then open /keystatic
	npm run dev

build: ## Production build (clears the Vite cache first to dodge stale-cache errors)
	rm -rf node_modules/.vite
	npm run build

preview: build ## Build, then serve the production output locally
	npm run preview

check: ## Type-check with astro check
	rm -rf node_modules/.vite
	npx astro check

test: ## Run unit tests (vitest)
	npx vitest run

clean: ## Remove build output and caches
	rm -rf dist node_modules/.vite

deploy: build ## Build and deploy to Cloudflare (needs `wrangler login`)
	npx wrangler deploy
