-- SQLite Database Schema for Web Automation Workflow Manager
-- Manages workspaces, workflows, and execution tracking

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    max_concurrent_workflows INTEGER DEFAULT 3,
    proxy_settings TEXT, -- JSON string for proxy configuration
    auth_settings TEXT, -- JSON string for authentication configuration
    browser_settings TEXT, -- JSON string for browser configuration (headless, etc.)
    schedule_settings TEXT, -- JSON string for scheduling configuration
    notification_settings TEXT, -- JSON string for notification configuration (Telegram, Webhook)
    total_execution_time REAL DEFAULT 0, -- Total time spent executing workflows
    completion_percentage REAL DEFAULT 0, -- Percentage of workflows completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Path to JSON file
    display_order INTEGER DEFAULT 0, -- For drag-and-drop ordering
    json_content TEXT NOT NULL, -- Workflow JSON data
    node_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- pending, running, completed, failed
    last_execution_time REAL, -- Execution time in seconds
    last_run_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE,
    UNIQUE(workspace_id, name)
);

-- Workflow execution history
CREATE TABLE IF NOT EXISTS workflow_executions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id INTEGER NOT NULL,
    status TEXT NOT NULL, -- running, completed, failed
    execution_time REAL,
    error_message TEXT,
    node_results TEXT, -- JSON string with individual node results
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflows_workspace_id ON workflows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started_at ON workflow_executions(started_at);

-- Default workspace
INSERT OR IGNORE INTO workspaces (id, name, description, max_concurrent_workflows) 
VALUES (1, 'Default Workspace', 'Workspace mặc định cho tất cả workflow', 3);