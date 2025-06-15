#!/bin/bash

# DUFSX Build Script
# Generates optimized Tailwind CSS with only required classes

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Configuration
NODE_VERSION="18"
BUILD_MODE="${1:-production}"
DIST_DIR="dist"
OUTPUT_CSS="index.css"
INPUT_CSS="input.css"

# Print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js ${NODE_VERSION}+ and try again."
        exit 1
    fi

    NODE_VER=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VER" -lt "$NODE_VERSION" ]; then
        print_error "Node.js version ${NODE_VERSION}+ is required. Current version: $(node --version)"
        exit 1
    fi

    print_success "Node.js $(node --version) detected"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    print_success "npm $(npm --version) detected"
}

# Install dependencies
install_deps() {
    print_info "Installing dependencies..."

    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the assets directory."
        exit 1
    fi

    # Install dependencies
    npm install --silent

    print_success "Dependencies installed"
}

# Clean build directory
clean_build() {
    print_info "Cleaning build directory..."

    if [ -d "$DIST_DIR" ]; then
        rm -rf "$DIST_DIR"
    fi

    mkdir -p "$DIST_DIR"
    print_success "Build directory cleaned"
}

# Generate Tailwind CSS
generate_css() {
    print_info "Generating Tailwind CSS for $BUILD_MODE mode..."

    if [ ! -f "$INPUT_CSS" ]; then
        print_error "Input CSS file '$INPUT_CSS' not found"
        exit 1
    fi

    # Tailwind CSS options based on build mode
    if [ "$BUILD_MODE" = "development" ]; then
        TAILWIND_OPTS="--watch"
        print_info "Running in development mode with file watching..."
    else
        TAILWIND_OPTS="--minify"
        print_info "Running in production mode with minification..."
    fi

    # Generate CSS with Tailwind
    npx tailwindcss \
        -i "./$INPUT_CSS" \
        -o "./$DIST_DIR/$OUTPUT_CSS" \
        --config ./tailwind.config.js \
        $TAILWIND_OPTS

    print_success "Tailwind CSS generated"
}

# Optimize CSS further with PurgeCSS (production only)
optimize_css() {
    if [ "$BUILD_MODE" != "production" ]; then
        return
    fi

    print_info "Optimizing CSS with PurgeCSS..."

    # Use PurgeCSS to remove unused styles
    npx purgecss \
        --css "./$DIST_DIR/$OUTPUT_CSS" \
        --content "./*.html" "./index.js" \
        --safelist "hidden collapsed expanded selected dragging resizing dark" \
        --output "./$DIST_DIR/"

    print_success "CSS optimized"
}

# Copy static assets
copy_assets() {
    print_info "Copying static assets..."

    # Copy HTML file
    if [ -f "index.html" ]; then
        cp "index.html" "$DIST_DIR/"
        print_success "HTML file copied"
    fi

    # Copy JavaScript file
    if [ -f "index.js" ]; then
        cp "index.js" "$DIST_DIR/"
        print_success "JavaScript file copied"
    fi

    # Copy CodeMirror
    if [ -f "codemirror.js" ]; then
        cp "codemirror.js" "$DIST_DIR/"
        print_success "CodeMirror copied"
    fi

    # Copy chunmde
    if [ -f "chunmde.bundle.min.js" ]; then
        cp "chunmde.bundle.min.js" "$DIST_DIR/"
        print_success "ChudMDE copied"
    fi

    # Copy favicon
    if [ -f "favicon.ico" ]; then
        cp "favicon.ico" "$DIST_DIR/"
        print_success "Favicon copied"
    fi
}

# Generate build report
generate_report() {
    print_info "Generating build report..."

    CSS_SIZE=$(du -h "$DIST_DIR/$OUTPUT_CSS" | cut -f1)
    CSS_SIZE_BYTES=$(wc -c < "$DIST_DIR/$OUTPUT_CSS")

    echo
    echo "==============================================="
    echo "               BUILD REPORT"
    echo "==============================================="
    echo "Build Mode:     $BUILD_MODE"
    echo "CSS File:       $OUTPUT_CSS"
    echo "CSS Size:       $CSS_SIZE ($CSS_SIZE_BYTES bytes)"
    echo "Output Dir:     $DIST_DIR"
    echo "==============================================="
    echo

    # Count CSS classes if in production mode
    if [ "$BUILD_MODE" = "production" ]; then
        CSS_CLASSES=$(grep -o '\.[a-zA-Z0-9_-]*' "$DIST_DIR/$OUTPUT_CSS" | sort | uniq | wc -l)
        print_info "Estimated CSS classes: $CSS_CLASSES"
    fi

    print_success "Build completed successfully!"
}

# Watch mode for development
watch_mode() {
    print_info "Starting watch mode..."
    print_warning "Press Ctrl+C to stop watching"

    # Use concurrent for watching multiple files
    npx concurrently \
        "npx tailwindcss -i ./$INPUT_CSS -o ./$DIST_DIR/$OUTPUT_CSS --watch" \
        "echo 'Watching for file changes...'"
}

# Validate files
validate_files() {
    print_info "Validating generated files..."

    # Check if CSS file exists and is not empty
    if [ ! -s "$DIST_DIR/$OUTPUT_CSS" ]; then
        print_error "Generated CSS file is empty or missing"
        exit 1
    fi

    # Basic CSS validation
    if ! grep -q "tailwind" "$DIST_DIR/$OUTPUT_CSS"; then
        print_warning "CSS file may not contain Tailwind styles"
    fi

    print_success "File validation passed"
}

# Deploy preparation
prepare_deploy() {
    if [ "$BUILD_MODE" != "production" ]; then
        return
    fi

    print_info "Preparing files for deployment..."

    # Create a deployment package
    DEPLOY_DIR="deploy"
    if [ -d "$DEPLOY_DIR" ]; then
        rm -rf "$DEPLOY_DIR"
    fi

    mkdir -p "$DEPLOY_DIR"
    cp -r "$DIST_DIR"/* "$DEPLOY_DIR/"

    # Create a compressed archive
    tar -czf "dufsx-assets-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$DEPLOY_DIR" .
    if [ -d "$DEPLOY_DIR" ]; then
        rm -rf "$DEPLOY_DIR"
    fi
    print_success "Deployment package created"
}

# Main function
main() {
    echo
    print_info "DUFSX Asset Build System"
    print_info "========================="
    echo

    # Parse command line arguments
    case "$BUILD_MODE" in
        "development"|"dev")
            BUILD_MODE="development"
            ;;
        "production"|"prod")
            BUILD_MODE="production"
            ;;
        "watch")
            BUILD_MODE="development"
            ;;
        *)
            print_error "Invalid build mode: $BUILD_MODE"
            print_info "Usage: $0 [development|production|watch]"
            exit 1
            ;;
    esac

    # Check prerequisites
    check_node
    check_npm

    # Install dependencies
    install_deps

    # Clean and prepare
    clean_build

    # Special handling for watch mode
    if [ "$1" = "watch" ]; then
        copy_assets
        watch_mode
        return
    fi

    # Generate CSS
    generate_css

    # Optimize for production
    optimize_css

    # Copy static assets
    copy_assets

    # Validate output
    validate_files

    # Prepare for deployment (production only)
    prepare_deploy

    # Generate report
    generate_report
}

# Help function
show_help() {
    echo "DUFSX Asset Build System"
    echo "========================"
    echo
    echo "Usage: $0 [MODE]"
    echo
    echo "Modes:"
    echo "  development, dev  - Build for development (no minification)"
    echo "  production, prod  - Build for production (minified, optimized)"
    echo "  watch            - Development mode with file watching"
    echo
    echo "Examples:"
    echo "  $0 development    # Development build"
    echo "  $0 production     # Production build"
    echo "  $0 watch          # Watch mode"
    echo
    echo "Environment Variables:"
    echo "  DIST_DIR         - Output directory (default: dist)"
    echo "  OUTPUT_CSS       - CSS filename (default: index.css)"
    echo
}

# Handle help flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

# Trap Ctrl+C in watch mode
trap 'print_info "Build interrupted by user"; exit 0' INT

# Run main function
main "$@"
