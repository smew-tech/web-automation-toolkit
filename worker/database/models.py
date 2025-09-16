"""
Database models for workflow management system
"""
import sqlite3
import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict


@dataclass
class Workspace:
    id: Optional[int] = None
    name: str = ""
    description: str = ""
    max_concurrent_workflows: int = 3
    proxy_settings: Optional[Dict] = None
    auth_settings: Optional[Dict] = None
    browser_settings: Optional[Dict] = None
    schedule_settings: Optional[Dict] = None
    notification_settings: Optional[Dict] = None
    total_execution_time: float = 0.0
    completion_percentage: float = 0.0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self) -> Dict:
        data = asdict(self)
        # Convert complex fields to JSON strings for storage
        if self.proxy_settings:
            data['proxy_settings'] = self.proxy_settings
        if self.auth_settings:
            data['auth_settings'] = self.auth_settings
        if self.browser_settings:
            data['browser_settings'] = self.browser_settings
        if self.schedule_settings:
            data['schedule_settings'] = self.schedule_settings
        if self.notification_settings:
            data['notification_settings'] = self.notification_settings
        return data


@dataclass
class Workflow:
    id: Optional[int] = None
    workspace_id: int = 1
    name: str = ""
    file_path: str = ""
    display_order: int = 0
    json_content: str = ""
    node_count: int = 0
    status: str = "pending"
    last_execution_time: Optional[float] = None
    last_run_at: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    def to_dict(self) -> Dict:
        return asdict(self)


@dataclass
class WorkflowExecution:
    id: Optional[int] = None
    workflow_id: int = 0
    status: str = "running"
    execution_time: Optional[float] = None
    error_message: Optional[str] = None
    node_results: Optional[Dict] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

    def to_dict(self) -> Dict:
        data = asdict(self)
        if self.node_results:
            data['node_results'] = json.dumps(self.node_results)
        return data


class DatabaseManager:
    """Manages SQLite database operations for the workflow system"""
    
    def __init__(self, db_path: str = "workflow_manager.db"):
        self.db_path = Path(db_path)
        self.init_database()
    
    def get_connection(self) -> sqlite3.Connection:
        """Get database connection with row factory"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Initialize database with schema"""
        schema_path = Path(__file__).parent / "schema.sql"
        
        with self.get_connection() as conn:
            with open(schema_path, 'r', encoding='utf-8') as f:
                conn.executescript(f.read())
        
        # Run migrations for existing databases
        self.migrate_database()
    
    def migrate_database(self):
        """Apply database migrations for new columns"""
        with self.get_connection() as conn:
            # Check if new columns exist, if not add them
            cursor = conn.cursor()
            
            # Get current table schema
            cursor.execute("PRAGMA table_info(workspaces)")
            columns = [column[1] for column in cursor.fetchall()]
            
            # Add missing columns
            if 'browser_settings' not in columns:
                cursor.execute("ALTER TABLE workspaces ADD COLUMN browser_settings TEXT")
                print("✅ Added browser_settings column to workspaces table")
            
            if 'schedule_settings' not in columns:
                cursor.execute("ALTER TABLE workspaces ADD COLUMN schedule_settings TEXT")
                print("✅ Added schedule_settings column to workspaces table")
            
            if 'total_execution_time' not in columns:
                cursor.execute("ALTER TABLE workspaces ADD COLUMN total_execution_time REAL DEFAULT 0")
                print("✅ Added total_execution_time column to workspaces table")
            
            if 'completion_percentage' not in columns:
                cursor.execute("ALTER TABLE workspaces ADD COLUMN completion_percentage REAL DEFAULT 0")
                print("✅ Added completion_percentage column to workspaces table")
            
            conn.commit()
    
    # Workspace operations
    def create_workspace(self, workspace: Workspace) -> int:
        """Create a new workspace"""
        with self.get_connection() as conn:
            proxy_json = json.dumps(workspace.proxy_settings) if workspace.proxy_settings else None
            auth_json = json.dumps(workspace.auth_settings) if workspace.auth_settings else None
            browser_json = json.dumps(workspace.browser_settings) if workspace.browser_settings else None
            schedule_json = json.dumps(workspace.schedule_settings) if workspace.schedule_settings else None
            cursor = conn.execute(
                """INSERT INTO workspaces (name, description, max_concurrent_workflows, proxy_settings, 
                   auth_settings, browser_settings, schedule_settings, total_execution_time, completion_percentage)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (workspace.name, workspace.description, workspace.max_concurrent_workflows, proxy_json,
                 auth_json, browser_json, schedule_json, workspace.total_execution_time, workspace.completion_percentage)
            )
            return cursor.lastrowid
    
    def get_workspace(self, workspace_id: int) -> Optional[Workspace]:
        """Get workspace by ID"""
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM workspaces WHERE id = ?", (workspace_id,)).fetchone()
            if row:
                proxy_settings = json.loads(row['proxy_settings']) if row['proxy_settings'] else None
                
                # Handle new columns that might not exist in older databases
                auth_settings = None
                browser_settings = None
                schedule_settings = None
                notification_settings = None
                total_execution_time = 0.0
                completion_percentage = 0.0
                
                try:
                    auth_settings = json.loads(row['auth_settings']) if row['auth_settings'] else None
                except (KeyError, IndexError):
                    pass
                
                try:
                    browser_settings = json.loads(row['browser_settings']) if row['browser_settings'] else None
                except (KeyError, IndexError):
                    pass
                    
                try:
                    schedule_settings = json.loads(row['schedule_settings']) if row['schedule_settings'] else None
                except (KeyError, IndexError):
                    pass
                    
                try:
                    notification_settings = json.loads(row['notification_settings']) if row['notification_settings'] else None
                except (KeyError, IndexError):
                    pass
                    
                try:
                    total_execution_time = float(row['total_execution_time']) if row['total_execution_time'] else 0.0
                except (KeyError, IndexError, TypeError):
                    pass
                    
                try:
                    completion_percentage = float(row['completion_percentage']) if row['completion_percentage'] else 0.0
                except (KeyError, IndexError, TypeError):
                    pass
                
                return Workspace(
                    id=row['id'],
                    name=row['name'],
                    description=row['description'],
                    max_concurrent_workflows=row['max_concurrent_workflows'],
                    proxy_settings=proxy_settings,
                    auth_settings=auth_settings,
                    browser_settings=browser_settings,
                    schedule_settings=schedule_settings,
                    notification_settings=notification_settings,
                    total_execution_time=total_execution_time,
                    completion_percentage=completion_percentage,
                    created_at=row['created_at'],
                    updated_at=row['updated_at']
                )
        return None
    
    def get_all_workspaces(self) -> List[Workspace]:
        """Get all workspaces"""
        with self.get_connection() as conn:
            rows = conn.execute(
                "SELECT * FROM workspaces ORDER BY created_at"
            ).fetchall()
            
            workspaces = []
            for row in rows:
                proxy_settings = json.loads(row['proxy_settings']) if row['proxy_settings'] else None
                
                # Handle new columns that might not exist in older databases
                auth_settings = None
                browser_settings = None
                schedule_settings = None
                notification_settings = None
                total_execution_time = 0.0
                completion_percentage = 0.0
                
                try:
                    auth_settings = json.loads(row['auth_settings']) if row['auth_settings'] else None
                except (KeyError, IndexError):
                    pass
                
                try:
                    browser_settings = json.loads(row['browser_settings']) if row['browser_settings'] else None
                except (KeyError, IndexError):
                    pass
                    
                try:
                    schedule_settings = json.loads(row['schedule_settings']) if row['schedule_settings'] else None
                except (KeyError, IndexError):
                    pass
                    
                try:
                    notification_settings = json.loads(row['notification_settings']) if row['notification_settings'] else None
                except (KeyError, IndexError):
                    pass
                    
                try:
                    total_execution_time = float(row['total_execution_time']) if row['total_execution_time'] else 0.0
                except (KeyError, IndexError, TypeError):
                    pass
                    
                try:
                    completion_percentage = float(row['completion_percentage']) if row['completion_percentage'] else 0.0
                except (KeyError, IndexError, TypeError):
                    pass
                
                workspaces.append(Workspace(
                    id=row['id'],
                    name=row['name'],
                    description=row['description'],
                    max_concurrent_workflows=row['max_concurrent_workflows'],
                    proxy_settings=proxy_settings,
                    auth_settings=auth_settings,
                    browser_settings=browser_settings,
                    schedule_settings=schedule_settings,
                    notification_settings=notification_settings,
                    total_execution_time=total_execution_time,
                    completion_percentage=completion_percentage,
                    created_at=row['created_at'],
                    updated_at=row['updated_at']
                ))
            return workspaces
    
    def update_workspace(self, workspace: Workspace) -> bool:
        """Update workspace"""
        with self.get_connection() as conn:
            proxy_json = json.dumps(workspace.proxy_settings) if workspace.proxy_settings else None
            auth_json = json.dumps(workspace.auth_settings) if workspace.auth_settings else None
            browser_json = json.dumps(workspace.browser_settings) if workspace.browser_settings else None
            schedule_json = json.dumps(workspace.schedule_settings) if workspace.schedule_settings else None
            notification_json = json.dumps(workspace.notification_settings) if workspace.notification_settings else None
            cursor = conn.execute(
                """UPDATE workspaces 
                   SET name = ?, description = ?, max_concurrent_workflows = ?, 
                       proxy_settings = ?, auth_settings = ?, browser_settings = ?, schedule_settings = ?, notification_settings = ?,
                       total_execution_time = ?, completion_percentage = ?, updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?""",
                (workspace.name, workspace.description, workspace.max_concurrent_workflows, 
                 proxy_json, auth_json, browser_json, schedule_json, notification_json, workspace.total_execution_time,
                 workspace.completion_percentage, workspace.id)
            )
            return cursor.rowcount > 0
    
    def delete_workspace(self, workspace_id: int) -> bool:
        """Delete workspace and all its workflows"""
        with self.get_connection() as conn:
            cursor = conn.execute("DELETE FROM workspaces WHERE id = ?", (workspace_id,))
            return cursor.rowcount > 0
    
    # Workflow operations
    def create_workflow(self, workflow: Workflow) -> int:
        """Create a new workflow"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """INSERT INTO workflows (workspace_id, name, file_path, display_order, 
                                        json_content, node_count, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (workflow.workspace_id, workflow.name, workflow.file_path, 
                 workflow.display_order, workflow.json_content, workflow.node_count, workflow.status)
            )
            return cursor.lastrowid
    
    def get_workflow(self, workflow_id: int) -> Optional[Workflow]:
        """Get workflow by ID"""
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM workflows WHERE id = ?", (workflow_id,)).fetchone()
            if row:
                return Workflow(**dict(row))
        return None
    
    def get_workflows_by_workspace(self, workspace_id: int) -> List[Workflow]:
        """Get all workflows in a workspace"""
        with self.get_connection() as conn:
            rows = conn.execute(
                "SELECT * FROM workflows WHERE workspace_id = ? ORDER BY display_order, created_at",
                (workspace_id,)
            ).fetchall()
            return [Workflow(**dict(row)) for row in rows]
    
    def update_workflow(self, workflow: Workflow) -> bool:
        """Update workflow"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """UPDATE workflows 
                   SET name = ?, file_path = ?, display_order = ?, json_content = ?, 
                       node_count = ?, status = ?, last_execution_time = ?, 
                       last_run_at = ?, updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?""",
                (workflow.name, workflow.file_path, workflow.display_order, workflow.json_content,
                 workflow.node_count, workflow.status, workflow.last_execution_time,
                 workflow.last_run_at, workflow.id)
            )
            return cursor.rowcount > 0
    
    def update_workflow_order(self, workflow_orders: List[Tuple[int, int]]) -> bool:
        """Update display order for multiple workflows"""
        with self.get_connection() as conn:
            cursor = conn.executemany(
                "UPDATE workflows SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                [(order, workflow_id) for workflow_id, order in workflow_orders]
            )
            return cursor.rowcount > 0
    
    def update_workflow_status(self, workflow_id: int, status: str, 
                              execution_time: Optional[float] = None) -> bool:
        """Update workflow status and execution time"""
        with self.get_connection() as conn:
            if execution_time is not None:
                cursor = conn.execute(
                    """UPDATE workflows 
                       SET status = ?, last_execution_time = ?, last_run_at = CURRENT_TIMESTAMP,
                           updated_at = CURRENT_TIMESTAMP
                       WHERE id = ?""",
                    (status, execution_time, workflow_id)
                )
            else:
                cursor = conn.execute(
                    """UPDATE workflows 
                       SET status = ?, updated_at = CURRENT_TIMESTAMP
                       WHERE id = ?""",
                    (status, workflow_id)
                )
            return cursor.rowcount > 0
    
    def delete_workflow(self, workflow_id: int) -> bool:
        """Delete workflow"""
        with self.get_connection() as conn:
            cursor = conn.execute("DELETE FROM workflows WHERE id = ?", (workflow_id,))
            return cursor.rowcount > 0
    
    # Workflow execution operations
    def create_execution(self, execution: WorkflowExecution) -> int:
        """Create a new workflow execution record"""
        with self.get_connection() as conn:
            node_results_json = json.dumps(execution.node_results) if execution.node_results else None
            cursor = conn.execute(
                """INSERT INTO workflow_executions (workflow_id, status, execution_time, 
                                                   error_message, node_results, started_at)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (execution.workflow_id, execution.status, execution.execution_time,
                 execution.error_message, node_results_json, execution.started_at)
            )
            return cursor.lastrowid
    
    def update_execution(self, execution_id: int, status: str, 
                        execution_time: Optional[float] = None,
                        error_message: Optional[str] = None,
                        node_results: Optional[Dict] = None) -> bool:
        """Update workflow execution"""
        with self.get_connection() as conn:
            node_results_json = json.dumps(node_results) if node_results else None
            cursor = conn.execute(
                """UPDATE workflow_executions 
                   SET status = ?, execution_time = ?, error_message = ?, 
                       node_results = ?, completed_at = CURRENT_TIMESTAMP
                   WHERE id = ?""",
                (status, execution_time, error_message, node_results_json, execution_id)
            )
            return cursor.rowcount > 0
    
    def get_execution_history(self, workflow_id: int, limit: int = 50) -> List[WorkflowExecution]:
        """Get execution history for a workflow"""
        with self.get_connection() as conn:
            rows = conn.execute(
                """SELECT * FROM workflow_executions 
                   WHERE workflow_id = ? 
                   ORDER BY started_at DESC 
                   LIMIT ?""",
                (workflow_id, limit)
            ).fetchall()
            
            executions = []
            for row in rows:
                node_results = json.loads(row['node_results']) if row['node_results'] else None
                executions.append(WorkflowExecution(
                    id=row['id'],
                    workflow_id=row['workflow_id'],
                    status=row['status'],
                    execution_time=row['execution_time'],
                    error_message=row['error_message'],
                    node_results=node_results,
                    started_at=row['started_at'],
                    completed_at=row['completed_at']
                ))
            return executions
    
    # Utility methods
    def sync_workflows_from_directory(self, workspace_id: int, directory_path: str) -> Dict[str, str]:
        """Sync workflows from workflows_json directory to database"""
        directory = Path(directory_path)
        if not directory.exists():
            return {"error": f"Directory not found: {directory}"}
        
        json_files = list(directory.glob("*.json"))
        if not json_files:
            return {"message": "No JSON files found"}
        
        results = {"loaded": 0, "updated": 0, "errors": []}
        
        with self.get_connection() as conn:
            for json_file in json_files:
                try:
                    with open(json_file, 'r', encoding='utf-8') as f:
                        json_content = f.read()
                        data = json.loads(json_content)
                    
                    workflow_name = json_file.stem
                    node_count = len(data.get('nodes', []))
                    
                    # Check if workflow exists
                    existing = conn.execute(
                        "SELECT id FROM workflows WHERE workspace_id = ? AND name = ?",
                        (workspace_id, workflow_name)
                    ).fetchone()
                    
                    if existing:
                        # Update existing workflow
                        conn.execute(
                            """UPDATE workflows 
                               SET file_path = ?, json_content = ?, node_count = ?,
                                   updated_at = CURRENT_TIMESTAMP
                               WHERE id = ?""",
                            (str(json_file), json_content, node_count, existing['id'])
                        )
                        results["updated"] += 1
                    else:
                        # Create new workflow
                        conn.execute(
                            """INSERT INTO workflows (workspace_id, name, file_path, json_content, 
                                                    node_count, display_order)
                               VALUES (?, ?, ?, ?, ?, ?)""",
                            (workspace_id, workflow_name, str(json_file), json_content, 
                             node_count, len(json_files))
                        )
                        results["loaded"] += 1
                
                except Exception as e:
                    results["errors"].append(f"{json_file.name}: {str(e)}")
        
        return results
    
    def get_workspace_statistics(self, workspace_id: int) -> Dict:
        """Get statistics for a workspace"""
        with self.get_connection() as conn:
            # Get workflow counts by status
            status_counts = conn.execute(
                """SELECT w.status, COUNT(*) as count 
                   FROM workflows w 
                   WHERE w.workspace_id = ? 
                   GROUP BY w.status""",
                (workspace_id,)
            ).fetchall()
            
            # Get total executions
            total_executions = conn.execute(
                """SELECT COUNT(*) as count 
                   FROM workflow_executions we
                   JOIN workflows w ON we.workflow_id = w.id
                   WHERE w.workspace_id = ?""",
                (workspace_id,)
            ).fetchone()
            
            # Get recent execution success rate
            recent_executions = conn.execute(
                """SELECT we.status, COUNT(*) as count
                   FROM workflow_executions we
                   JOIN workflows w ON we.workflow_id = w.id
                   WHERE w.workspace_id = ? AND we.started_at > datetime('now', '-24 hours')
                   GROUP BY we.status""",
                (workspace_id,)
            ).fetchall()
            
            return {
                "workflow_counts": {row['status']: row['count'] for row in status_counts},
                "total_executions": total_executions['count'] if total_executions else 0,
                "recent_executions": {row['status']: row['count'] for row in recent_executions}
            }
    
    def update_workspace_execution_stats(self, workspace_id: int):
        """Update workspace execution time and completion percentage"""
        with self.get_connection() as conn:
            # Calculate total execution time
            total_time = conn.execute(
                """SELECT SUM(we.execution_time) as total_time
                   FROM workflow_executions we
                   JOIN workflows w ON we.workflow_id = w.id
                   WHERE w.workspace_id = ? AND we.status = 'completed'""",
                (workspace_id,)
            ).fetchone()
            
            # Calculate completion percentage
            completion_stats = conn.execute(
                """SELECT 
                    COUNT(*) as total_workflows,
                    SUM(CASE WHEN w.status = 'completed' THEN 1 ELSE 0 END) as completed_workflows
                   FROM workflows w
                   WHERE w.workspace_id = ?""",
                (workspace_id,)
            ).fetchone()
            
            total_execution_time = total_time['total_time'] or 0.0
            completion_percentage = 0.0
            
            if completion_stats and completion_stats['total_workflows'] > 0:
                completion_percentage = (completion_stats['completed_workflows'] / completion_stats['total_workflows']) * 100
            
            # Update workspace
            conn.execute(
                """UPDATE workspaces 
                   SET total_execution_time = ?, completion_percentage = ?, updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?""",
                (total_execution_time, completion_percentage, workspace_id)
            )
            
            return total_execution_time, completion_percentage
    
    def add_execution_time_to_workspace(self, workspace_id: int, execution_time: float):
        """Add execution time to workspace total"""
        with self.get_connection() as conn:
            conn.execute(
                """UPDATE workspaces 
                   SET total_execution_time = total_execution_time + ?, updated_at = CURRENT_TIMESTAMP
                   WHERE id = ?""",
                (execution_time, workspace_id)
            )