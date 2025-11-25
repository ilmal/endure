#!/bin/bash

# Camera Data Generator Script
# Usage: ./generate-cameras.sh [number_of_cameras] [--inject]
# Example: ./generate-cameras.sh 100
# Example with auto-inject: ./generate-cameras.sh 100 --inject

# Default to 50 cameras if no argument provided
NUM_CAMERAS=${1:-50}
INJECT_FLAG=""

# Check for --inject flag
if [[ "$2" == "--inject" ]] || [[ "$2" == "-i" ]]; then
    INJECT_FLAG="--inject"
fi

echo "======================================"
echo "ViltKameraNätverk Camera Data Generator"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    echo "Please install Node.js to run this script."
    exit 1
fi

# Run the generator
if [[ -n "$INJECT_FLAG" ]]; then
    echo "Auto-injecting data into assets/js/data.js..."
    node generate-cameras.js "$NUM_CAMERAS" "$INJECT_FLAG"
else
    node generate-cameras.js "$NUM_CAMERAS"
fi

echo ""
echo "======================================"
echo "Generation complete!"
echo "======================================"
echo ""

if [[ -z "$INJECT_FLAG" ]]; then
    echo "Note: Data was not automatically injected."
    echo "To auto-inject, run: ./generate-cameras.sh $NUM_CAMERAS --inject"
    echo ""
fi
