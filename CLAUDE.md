# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A comprehensive web automation toolkit consisting of three main components:

1. **Visual Workflow Builder** (`toolkit/`) - Drag-and-drop web interface for creating automation workflows
2. **Chrome Extension** (`extension/`) - Element selector tool for generating CSS selectors  
3. **Python Worker System** (`worker/`) - Backend execution engine using Playwright with Strategy and State patterns

## Architecture

### Workflow Builder (`toolkit/`)
- Standalone web application in `toolkit/index.html`
- Canvas-based node editor with SVG connections
- Exports workflows as JSON files for the worker system
- No build process required - pure HTML/CSS/JS

### Chrome Extension (`extension/`)
- Manifest V3 extension for element selection
- Content scripts for page interaction and selector generation
- Multi-language support (English/Vietnamese)
- Communicates with workflow builder via cross-tab messaging

### Python Worker System (`worker/`)
- **Strategy Pattern**: Each node type (`goto`, `click`, `fill`, etc.) has its own strategy class in `strategies/node_strategies.py`
- **State Pattern**: Workflow states (`Pending`, `Running`, `Completed`) managed in `states/workflow_states.py`
- **Core Components**:
  - `core/workflow_manager.py` - Manages multiple concurrent workflows
  - `core/workflow.py` - Individual workflow execution
  - `core/node.py` - Individual automation steps
- **Control Panel**: Comprehensive web UI for workflow management in `worker/web_ui/`

### Worker Control Panel (`worker/web_ui/`)
- **Flask-based Web Interface**: Complete control panel for workflow management
- **Real-time Monitoring**: WebSocket-based live updates and system monitoring
- **Features**:
  - Dashboard with workflow statistics and system metrics
  - Drag & drop workflow upload functionality
  - Canvas-based workflow visualization with interactive nodes
  - Multi-workflow execution control (single, batch, concurrent)
  - Real-time logs streaming with filtering and search
  - Per-workflow proxy settings and system configuration
  - Responsive design with mobile support

## Development Commands

### Worker Control Panel
```bash
# Quick setup and launch (recommended)
cd worker
python quick_start.py  # Interactive setup guide

# Full mode with Playwright support
./start_control_panel.sh  # Auto-setup and start at http://localhost:5001

# Demo mode (no Playwright required)
cd worker/web_ui
python run_demo.py  # Simulation mode with mock data

# Manual setup
cd worker/web_ui
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py  # Full mode
```

### Python Worker System (CLI)
```bash
# Install Playwright (for CLI execution)
cd worker
pip install playwright
playwright install

# Run workflows via command line
python main.py --load-dir workflows_json --run-all
python main.py --load sample.json --run sample_workflow
```

### Testing
```bash
# Test worker system architecture
cd worker
python test_system.py

# Test workflow execution
python main_demo.py
```

## Key Configuration Files

- `worker/workflows_json/` - Contains workflow JSON definitions
- `worker/requirements.txt` - Python dependencies (minimal for testing)
- `worker/web_ui/requirements.txt` - Flask web UI dependencies
- `extension/manifest.json` - Chrome extension configuration

## Integration Workflow

1. **Create workflows**: Use `toolkit/index.html` drag-and-drop interface
2. **Select elements**: Use Chrome extension to generate CSS selectors
3. **Export workflows**: Save as JSON files to `worker/workflows_json/`
4. **Execute workflows**: Choose execution method:
   - **Web UI (Recommended)**: Use Control Panel at http://localhost:5001
   - **Command Line**: Use `python main.py` with various options
   - **Programmatic**: Import and use core classes directly

## Important Notes

- **Concurrent Execution**: Worker system uses asyncio for running multiple workflows simultaneously
- **Proxy Support**: Per-workflow proxy configuration available via Control Panel or CLI
- **Deployment Modes**: 
  - Demo mode (simulation with mock data)
  - Full mode (real browser automation with Playwright)
- **Local Processing**: All data processing happens locally - no external servers required
- **Zero Dependencies**: Toolkit and extension components require no external dependencies
- **Real-time Updates**: Control Panel provides WebSocket-based live monitoring
- **Cross-platform**: Supports Windows, macOS, and Linux environments