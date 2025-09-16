"""
N8N-Style Web UI for Web Automation Toolkit Worker
Three-panel layout: Workspaces (left) | Canvas Visualization (center) | Workflow Management (right)
"""
import os
import json
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
import threading
import time

# Local imports
from database.models import DatabaseManager, Workspace, WorkflowExecution
from database.models import Workflow as WorkflowDB
from core.workflow_manager import WorkflowManager
from core.workflow import Workflow

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'n8n-style-automation-ui'

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global instances
db_manager = DatabaseManager()
workflow_manager = WorkflowManager()

# Global state for real-time updates
active_executions = {}
execution_logs = {}

@app.route('/')
def index():
    """Main N8N-style interface"""
    return render_template('index.html')

@app.route('/api/workspaces', methods=['GET'])
def get_workspaces():
    """Get all workspaces"""
    try:
        workspaces = db_manager.get_all_workspaces()
        return jsonify([ws.to_dict() for ws in workspaces])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces', methods=['POST'])
def create_workspace():
    """Create new workspace"""
    try:
        data = request.get_json()
        workspace = Workspace(
            name=data.get('name', 'New Workspace'),
            description=data.get('description', ''),
            max_concurrent_workflows=data.get('max_concurrent_workflows', 3)
        )
        workspace_id = db_manager.create_workspace(workspace)
        workspace.id = workspace_id
        
        # Emit real-time update
        socketio.emit('workspace_created', workspace.to_dict())
        
        return jsonify(workspace.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces/<int:workspace_id>', methods=['PUT'])
def update_workspace(workspace_id):
    """Update workspace settings"""
    try:
        data = request.get_json()
        workspace = db_manager.get_workspace(workspace_id)
        if not workspace:
            return jsonify({'error': 'Workspace not found'}), 404
        
        # Update workspace fields
        workspace.name = data.get('name', workspace.name)
        workspace.description = data.get('description', workspace.description)
        workspace.max_concurrent_workflows = data.get('max_concurrent_workflows', workspace.max_concurrent_workflows)
        workspace.proxy_settings = data.get('proxy_settings', workspace.proxy_settings)
        
        db_manager.update_workspace(workspace)
        
        # Emit real-time update
        socketio.emit('workspace_updated', workspace.to_dict())
        
        return jsonify(workspace.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces/<int:workspace_id>', methods=['DELETE'])
def delete_workspace(workspace_id):
    """Delete workspace"""
    try:
        success = db_manager.delete_workspace(workspace_id)
        if success:
            socketio.emit('workspace_deleted', {'id': workspace_id})
            return jsonify({'message': 'Workspace deleted successfully'})
        return jsonify({'error': 'Workspace not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces/<int:workspace_id>/workflows', methods=['GET'])
def get_workspace_workflows(workspace_id):
    """Get all workflows in a workspace"""
    try:
        workflows = db_manager.get_workflows_by_workspace(workspace_id)
        return jsonify([wf.to_dict() for wf in workflows])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces/<int:workspace_id>/sync', methods=['POST'])
def sync_workspace_workflows(workspace_id):
    """Sync workflows from workflows_json directory"""
    try:
        workflows_dir = Path('workflows_json')
        result = db_manager.sync_workflows_from_directory(workspace_id, str(workflows_dir))
        
        # Emit real-time update
        socketio.emit('workspace_synced', {
            'workspace_id': workspace_id,
            'result': result
        })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workflows/<int:workflow_id>/canvas-data', methods=['GET'])
def get_workflow_canvas_data(workflow_id):
    """Get workflow data for canvas visualization"""
    try:
        workflow = db_manager.get_workflow(workflow_id)
        if not workflow:
            return jsonify({'error': 'Workflow not found'}), 404
        
        # Parse JSON content to get nodes and connections
        workflow_data = json.loads(workflow.json_content) if workflow.json_content else {}
        
        return jsonify({
            'nodes': workflow_data.get('nodes', []),
            'connections': workflow_data.get('connections', []),
            'workflow_id': workflow_id,
            'name': workflow.name,
            'status': workflow.status
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workflows/<int:workflow_id>/reorder', methods=['PUT'])
def reorder_workflows(workflow_id):
    """Reorder workflows in workspace"""
    try:
        data = request.get_json()
        workflow_orders = data.get('orders', [])
        
        # Convert from dict format to tuple format expected by database
        order_tuples = [(item['workflow_id'], item['display_order']) for item in workflow_orders]
        
        db_manager.update_workflow_order(order_tuples)
        
        # Emit real-time update
        socketio.emit('workflows_reordered', {
            'workspace_id': data.get('workspace_id'),
            'orders': workflow_orders
        })
        
        return jsonify({'message': 'Workflows reordered successfully'})
    except Exception as e:
        print(f"Error reordering workflows: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/workflows/<int:workflow_id>/execute', methods=['POST'])
def execute_single_workflow(workflow_id):
    """Execute a single workflow"""
    try:
        data = request.get_json() or {}
        headless = data.get('headless', True)
        
        workflow = db_manager.get_workflow(workflow_id)
        if not workflow:
            return jsonify({'error': 'Workflow not found'}), 404
        
        # Start execution in background
        execution_thread = threading.Thread(
            target=run_workflow_execution,
            args=(workflow_id, headless)
        )
        execution_thread.daemon = True
        execution_thread.start()
        
        return jsonify({
            'message': 'Workflow execution started',
            'workflow_id': workflow_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces/<int:workspace_id>/execute', methods=['POST'])
def execute_workspace_workflows(workspace_id):
    """Execute all workflows in a workspace"""
    try:
        data = request.get_json() or {}
        headless = data.get('headless', True)
        max_concurrent = data.get('max_concurrent', 3)
        
        workflows = db_manager.get_workflows_by_workspace(workspace_id)
        if not workflows:
            return jsonify({'error': 'No workflows found in workspace'}), 404
        
        # Start batch execution in background
        execution_thread = threading.Thread(
            target=run_batch_execution,
            args=(workspace_id, [wf.id for wf in workflows], headless, max_concurrent)
        )
        execution_thread.daemon = True
        execution_thread.start()
        
        return jsonify({
            'message': f'Started execution of {len(workflows)} workflows',
            'workspace_id': workspace_id,
            'workflow_count': len(workflows)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workflows/<int:workflow_id>/status', methods=['GET'])
def get_workflow_status(workflow_id):
    """Get current workflow status"""
    try:
        workflow = db_manager.get_workflow(workflow_id)
        if not workflow:
            return jsonify({'error': 'Workflow not found'}), 404
        
        execution_info = active_executions.get(workflow_id, {})
        
        return jsonify({
            'workflow_id': workflow_id,
            'status': workflow.status,
            'current_node': execution_info.get('current_node'),
            'progress': execution_info.get('progress', 0),
            'last_execution_time': workflow.last_execution_time,
            'last_run_at': workflow.last_run_at
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workflows/available', methods=['GET'])
def get_available_workflows():
    """Get all available workflow files from filesystem"""
    try:
        workflows_dir = Path('workflows_json')
        if not workflows_dir.exists():
            return jsonify([])
        
        available_workflows = []
        
        for json_file in workflows_dir.glob('*.json'):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    workflow_data = json.loads(f.read())
                
                file_stat = json_file.stat()
                available_workflows.append({
                    'name': json_file.stem,
                    'file_path': str(json_file),
                    'node_count': len(workflow_data.get('nodes', [])),
                    'file_size': f"{file_stat.st_size / 1024:.1f} KB",
                    'modified_at': datetime.fromtimestamp(file_stat.st_mtime).isoformat()
                })
            except Exception as e:
                print(f"Error reading {json_file}: {e}")
                continue
        
        return jsonify(available_workflows)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workflows/add', methods=['POST'])
def add_workflow_to_workspace():
    """Add an available workflow to a workspace"""
    try:
        data = request.get_json()
        workspace_id = data.get('workspace_id')
        workflow_name = data.get('workflow_name')
        
        if not workspace_id or not workflow_name:
            return jsonify({'error': 'workspace_id and workflow_name are required'}), 400
        
        # Check if workspace exists
        workspace = db_manager.get_workspace(workspace_id)
        if not workspace:
            return jsonify({'error': 'Workspace not found'}), 404
        
        # Check if workflow file exists
        workflow_file = Path('workflows_json') / f"{workflow_name}.json"
        if not workflow_file.exists():
            return jsonify({'error': 'Workflow file not found'}), 404
        
        # Check if workflow already exists in workspace
        existing_workflows = db_manager.get_workflows_by_workspace(workspace_id)
        if any(w.name == workflow_name for w in existing_workflows):
            return jsonify({'error': 'Workflow already exists in workspace'}), 400
        
        # Load and add workflow
        try:
            with open(workflow_file, 'r', encoding='utf-8') as f:
                json_content = f.read()
                workflow_data = json.loads(json_content)
            
            new_workflow = WorkflowDB(
                workspace_id=workspace_id,
                name=workflow_name,
                file_path=str(workflow_file),
                json_content=json_content,
                node_count=len(workflow_data.get('nodes', [])),
                display_order=len(existing_workflows)
            )
            
            workflow_id = db_manager.create_workflow(new_workflow)
            new_workflow.id = workflow_id
            
            return jsonify(new_workflow.to_dict()), 201
            
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON in workflow file'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def run_workflow_execution(workflow_id: int, headless: bool = True):
    """Run a single workflow execution"""
    try:
        workflow = db_manager.get_workflow(workflow_id)
        if not workflow:
            return
        
        # Update status to running
        db_manager.update_workflow_status(workflow_id, 'running')
        active_executions[workflow_id] = {
            'status': 'running',
            'started_at': datetime.now().isoformat(),
            'current_node': None,
            'progress': 0
        }
        
        # Emit start event
        socketio.emit('workflow_started', {
            'workflow_id': workflow_id,
            'timestamp': datetime.now().isoformat()
        })
        
        # Parse workflow data
        workflow_data = json.loads(workflow.json_content)
        nodes = workflow_data.get('nodes', [])
        
        # Create workflow engine
        engine = Workflow(workflow.name, workflow_data)
        
        start_time = time.time()
        
        # Execute workflow synchronously (the engine handles async internally)
        success = asyncio.run(engine.run())
        
        if not success:
            raise Exception("Workflow execution failed")
        
        execution_time = time.time() - start_time
        
        # Update workflow status
        db_manager.update_workflow_status(workflow_id, 'completed', execution_time)
        
        # Clean up active execution
        if workflow_id in active_executions:
            del active_executions[workflow_id]
        
        # Emit completion event
        socketio.emit('workflow_completed', {
            'workflow_id': workflow_id,
            'execution_time': execution_time,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        # Handle error
        db_manager.update_workflow_status(workflow_id, 'failed')
        
        # Clean up active execution
        if workflow_id in active_executions:
            del active_executions[workflow_id]
        
        # Emit error event
        socketio.emit('workflow_error', {
            'workflow_id': workflow_id,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        })

def run_batch_execution(workspace_id: int, workflow_ids: List[int], headless: bool = True, max_concurrent: int = 3):
    """Run batch workflow execution"""
    try:
        # Emit batch start event
        socketio.emit('batch_execution_started', {
            'workspace_id': workspace_id,
            'workflow_count': len(workflow_ids),
            'timestamp': datetime.now().isoformat()
        })
        
        # Execute workflows with concurrency limit
        # For demo purposes, execute sequentially
        completed = 0
        failed = 0
        
        for workflow_id in workflow_ids:
            try:
                run_workflow_execution(workflow_id, headless)
                completed += 1
            except Exception as e:
                failed += 1
                print(f"Workflow {workflow_id} failed: {e}")
            
            # Emit batch progress
            progress = int(((completed + failed) / len(workflow_ids)) * 100)
            socketio.emit('batch_execution_progress', {
                'workspace_id': workspace_id,
                'progress': progress,
                'completed': completed,
                'failed': failed
            })
        
        # Update workspace statistics
        db_manager.update_workspace_execution_stats(workspace_id)
        
        # Emit batch completion
        socketio.emit('batch_execution_completed', {
            'workspace_id': workspace_id,
            'completed': completed,
            'failed': failed,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        socketio.emit('batch_execution_error', {
            'workspace_id': workspace_id,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        })

# WebSocket events
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connected', {'message': 'Connected to N8N-style automation server'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_workspace')
def handle_join_workspace(data):
    workspace_id = data.get('workspace_id')
    join_room(f"workspace_{workspace_id}")
    print(f"Client joined workspace {workspace_id}")

@socketio.on('leave_workspace')
def handle_leave_workspace(data):
    workspace_id = data.get('workspace_id')
    leave_room(f"workspace_{workspace_id}")
    print(f"Client left workspace {workspace_id}")

# Static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

def create_default_workspace():
    """Create default workspace if none exists"""
    try:
        workspaces = db_manager.get_all_workspaces()
        if not workspaces:
            default_workspace = Workspace(
                name="Default Workspace",
                description="Default workspace for web automation workflows",
                max_concurrent_workflows=3
            )
            workspace_id = db_manager.create_workspace(default_workspace)
            
            # Sync workflows from directory
            workflows_dir = Path('workflows_json')
            if workflows_dir.exists():
                db_manager.sync_workflows_from_directory(workspace_id, str(workflows_dir))
                print(f"✅ Created default workspace and synced workflows")
            
            return workspace_id
        return workspaces[0].id
    except Exception as e:
        print(f"❌ Error creating default workspace: {e}")
        return 1

if __name__ == '__main__':
    print("🚀 Starting N8N-Style Web Automation UI...")
    
    # Ensure workflows_json directory exists
    workflows_dir = Path('workflows_json')
    workflows_dir.mkdir(exist_ok=True)
    
    # Create default workspace
    default_workspace_id = create_default_workspace()
    
    print(f"📊 Database initialized with workspace ID: {default_workspace_id}")
    print("🌐 Starting Flask-SocketIO server...")
    print("📝 Interface will be available at: http://localhost:5001")
    
    # Create templates and static directories
    templates_dir = Path('templates')
    static_dir = Path('static')
    templates_dir.mkdir(exist_ok=True)
    static_dir.mkdir(exist_ok=True)
    
    socketio.run(app, host='0.0.0.0', port=5001, debug=True, allow_unsafe_werkzeug=True)