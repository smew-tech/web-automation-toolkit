#!/bin/bash
# Start N8N-Style Web Automation Toolkit

echo "🚀 Starting N8N-Style Web Automation Toolkit..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip

# Install dependencies
echo "🔧 Installing Flask and SocketIO dependencies..."
pip install -r requirements_new.txt

# Optionally install Playwright (uncomment in requirements_new.txt if needed)
if python -c "import playwright" 2>/dev/null; then
    echo "🎭 Installing Playwright browsers..."
    playwright install
else
    echo "ℹ️  Running in web-only mode (Playwright not installed)"
fi

# Check if workflows_json directory exists
if [ ! -d "workflows_json" ]; then
    echo "📁 Creating workflows_json directory..."
    mkdir workflows_json
fi

# Start the application
echo "🌟 Starting N8N-Style Web UI..."
echo "📱 Interface will be available at: http://localhost:5001"
echo "🔄 Press Ctrl+C to stop the server"
echo ""

# Run the application
python app.py