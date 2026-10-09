.PHONY: all run install build preview clean help

all: run

# Install dependencies if node_modules does not exist, then start the development server
run:
	@if [ ! -d "node_modules" ]; then \
		echo "Installing dependencies..."; \
		npm install; \
	fi
	@echo "Starting StudiesTimer development server..."
	npm run dev

# Explicit install target
install:
	npm install

# Build production bundle
build:
	npm run build

# Preview production build
preview:
	npm run preview

# Clean build artifacts
clean:
	rm -rf dist node_modules

help:
	@echo "Available commands:"
	@echo "  make run      - Install dependencies if needed and start the dev server"
	@echo "  make install  - Install npm dependencies"
	@echo "  make build    - Build production assets in dist/"
	@echo "  make preview  - Preview production build"
	@echo "  make clean    - Remove build artifacts and node_modules"
