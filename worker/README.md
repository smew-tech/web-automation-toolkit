# Web Automation Toolkit - N8N Style UI

A modern, N8N-inspired web interface for managing and executing web automation workflows.

## Features

### 🖥️ Three-Panel Interface
- **Left Panel**: Workspace management with proxy settings per workspace
- **Center Panel**: Real-time canvas visualization showing workflow execution progress
- **Right Panel**: Workflow management and execution controls

### 🚀 Key Capabilities
- **Workspace Management**: Create and configure multiple isolated workspaces
- **Real-time Visualization**: Watch workflows execute with live node status updates
- **Batch Execution**: Run multiple workflows simultaneously with configurable concurrency
- **Proxy Support**: Per-workspace proxy configuration for different environments
- **SQLite Storage**: Local database for workspace and workflow management
- **WebSocket Updates**: Real-time UI updates during workflow execution

## Quick Start

> **📝 Note**: If using Python 3.13, you may see greenlet build warnings. This is normal and doesn't affect functionality. See [Python 3.13 Compatibility Guide](PYTHON313_COMPATIBILITY.md) for details.

### Method 1: Auto Setup Script (Recommended)
```bash
cd worker
./start_n8n_ui.sh
```

### Method 2: Simple Setup (No Build Warnings)
```bash
cd worker
./start_n8n_ui_simple.sh
```

### Method 3: Manual Setup
```bash
cd worker

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements_new.txt

# Install Playwright browsers
playwright install

# Start the application
python app.py
```

## Interface Access

Open your browser and navigate to: **http://localhost:5001**

## Architecture

### Backend (Flask + SocketIO)
- `app.py` - Main Flask application with WebSocket support
- `database/models.py` - SQLite database models and operations
- `core/` - Workflow execution engine using Strategy and State patterns
- `static/` - CSS and JavaScript for the frontend
- `templates/` - HTML templates

### Database Schema
- **Workspaces**: Isolated environments with proxy settings
- **Workflows**: JSON workflow definitions linked to workspaces
- **Executions**: Historical execution data and results

### Real-time Updates
- Workflow start/completion events
- Node-level execution progress
- Batch execution status
- Error notifications

## Workflow Management

### Sync Workflows
1. Place JSON workflow files in the `workflows_json/` directory
2. Click the sync button in the selected workspace
3. Workflows will be automatically loaded and available for execution

### Execution Modes
- **Single Workflow**: Execute one workflow at a time
- **Batch Execution**: Run multiple workflows with configurable concurrency
- **Headless Mode**: Toggle browser visibility during execution

### Proxy Configuration
Each workspace can have its own proxy settings:
- Host and port configuration
- Username/password authentication
- Independent proxy settings per workspace

## Development

### Project Structure
```
worker/
├── app.py                 # Main Flask application
├── templates/
│   └── index.html        # N8N-style interface
├── static/
│   ├── css/main.css      # N8N-inspired styling
│   └── js/main.js        # Frontend JavaScript with WebSocket
├── database/
│   ├── models.py         # SQLite ORM models
│   └── schema.sql        # Database schema
├── core/                 # Workflow execution engine
├── workflows_json/       # JSON workflow definitions
└── start_n8n_ui.sh      # Quick setup script
```

### Dependencies
- Flask 2.3.3 - Web framework
- Flask-SocketIO 5.3.6 - Real-time WebSocket support
- Playwright 1.40.0 - Browser automation
- SQLite3 - Local database

## Usage Workflow

1. **Create Workspace**: Add a new workspace for organizing related workflows
2. **Configure Proxy** (Optional): Set proxy settings for the workspace
3. **Sync Workflows**: Load workflow JSON files from the filesystem
4. **Select Workflow**: Choose a workflow to visualize on the canvas
5. **Execute**: Run single workflow or batch execute all workflows
6. **Monitor**: Watch real-time progress on the canvas and results panel

## Canvas Visualization

The center canvas provides:
- **Read-only visualization** of workflow structure
- **Real-time execution status** with animated node states
- **Connection flow animation** during execution
- **Zoom and pan controls** for large workflows
- **Node status indicators** (pending, running, completed, failed)

## Compatibility

This interface is designed to work with existing workflow JSON files from the toolkit system while providing a modern, user-friendly experience similar to N8N's interface.

## Troubleshooting

### Common Issues
1. **Port 5001 in use**: Change the port in `app.py` or kill the process using the port
2. **Playwright browsers not installed**: Run `playwright install`
3. **Permission errors**: Ensure the script has execute permissions: `chmod +x start_n8n_ui.sh`

### Debug Mode
Set `debug=True` in the `socketio.run()` call in `app.py` for detailed logging.

## License

Part of the Web Automation Toolkit project.
