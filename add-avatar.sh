#!/bin/bash

# Helper script to add avatar image

echo "=========================================="
echo "  SHUG Ticket Master - Add Avatar Image"
echo "=========================================="
echo ""

# Check if an image file was provided as argument
if [ -z "$1" ]; then
    echo "Usage: ./add-avatar.sh <path-to-image-file>"
    echo ""
    echo "Example:"
    echo "  ./add-avatar.sh ~/Downloads/my-photo.jpg"
    echo "  ./add-avatar.sh ~/Pictures/avatar.png"
    echo ""
    echo "Supported formats: JPG, JPEG, PNG, WebP, SVG"
    echo ""
    exit 1
fi

IMAGE_FILE="$1"

# Check if file exists
if [ ! -f "$IMAGE_FILE" ]; then
    echo "❌ Error: File not found: $IMAGE_FILE"
    exit 1
fi

# Get file extension
EXTENSION="${IMAGE_FILE##*.}"
EXTENSION_LOWER=$(echo "$EXTENSION" | tr '[:upper:]' '[:lower:]')

# Copy to public directory
PUBLIC_DIR="$(dirname "$0")/public"
TARGET_FILE="$PUBLIC_DIR/avatar.$EXTENSION_LOWER"

echo "📁 Copying image..."
cp "$IMAGE_FILE" "$TARGET_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Avatar image successfully added!"
    echo ""
    echo "📸 Image saved as: public/avatar.$EXTENSION_LOWER"
    echo ""
    
    # Update app.vue if not using .jpg
    if [ "$EXTENSION_LOWER" != "jpg" ] && [ "$EXTENSION_LOWER" != "jpeg" ]; then
        echo "ℹ️  Note: Your image is .$EXTENSION_LOWER format"
        echo "   Update app.vue line 5 to use: /avatar.$EXTENSION_LOWER"
        echo ""
    fi
    
    echo "🌐 Refresh your browser at http://localhost:3001/ to see the changes!"
else
    echo "❌ Error: Failed to copy image"
    exit 1
fi
