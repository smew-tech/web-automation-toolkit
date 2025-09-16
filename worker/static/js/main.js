// N8N-Style Web Automation Toolkit JavaScript

class AutomationUI {
    constructor() {
        this.socket = null;
        this.currentWorkspace = null;
        this.currentWorkflow = null;
        this.workspaces = [];
        this.workflows = [];
        this.canvasZoom = 1;
        this.canvasOffset = { x: 0, y: 0 };
        this.executionState = {
            isRunning: false,
            currentNodes: new Set()
        };
        
        // Canvas interaction state
        this.isSpacePressed = false;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.lastTouchDistance = null;
        
        this.init();
    }
    
    async init() {
        this.initSocketIO();
        this.bindEvents();
        await this.loadWorkspaces();
        this.updateConnectionStatus(false);
    }
    
    // Socket.IO initialization
    initSocketIO() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.updateConnectionStatus(true);
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.updateConnectionStatus(false);
        });
        
        // Real-time workflow events
        this.socket.on('workflow_started', (data) => {
            this.onWorkflowStarted(data);
        });
        
        this.socket.on('node_started', (data) => {
            this.onNodeStarted(data);
        });
        
        this.socket.on('node_completed', (data) => {
            this.onNodeCompleted(data);
        });
        
        this.socket.on('node_error', (data) => {
            this.onNodeError(data);
        });
        
        this.socket.on('workflow_completed', (data) => {
            this.onWorkflowCompleted(data);
        });
        
        this.socket.on('workflow_error', (data) => {
            this.onWorkflowError(data);
        });
        
        this.socket.on('workflows_reordered', (data) => {
            this.onWorkflowsReordered(data);
        });
        
        this.socket.on('batch_execution_started', (data) => {
            this.onBatchExecutionStarted(data);
        });
        
        this.socket.on('batch_execution_progress', (data) => {
            this.onBatchExecutionProgress(data);
        });
        
        this.socket.on('batch_execution_completed', (data) => {
            this.onBatchExecutionCompleted(data);
        });
        
        // Workspace events
        this.socket.on('workspace_created', (data) => {
            this.workspaces.push(data);
            this.renderWorkspaces();
        });
        
        this.socket.on('workspace_updated', (data) => {
            const index = this.workspaces.findIndex(w => w.id === data.id);
            if (index !== -1) {
                this.workspaces[index] = data;
                this.renderWorkspaces();
            }
        });
        
        this.socket.on('workspace_deleted', (data) => {
            this.workspaces = this.workspaces.filter(w => w.id !== data.id);
            this.renderWorkspaces();
            if (this.currentWorkspace && this.currentWorkspace.id === data.id) {
                this.currentWorkspace = null;
                this.selectWorkspace(null);
            }
        });
    }
    
    // Event binding
    bindEvents() {
        // Header buttons
        document.getElementById('executeBtn').addEventListener('click', () => {
            this.executeCurrentWorkflow();
        });
        
        document.getElementById('executeAllBtn').addEventListener('click', () => {
            this.executeAllWorkflows();
        });
        
        document.getElementById('stopBtn').addEventListener('click', () => {
            this.stopExecution();
        });
        
        // Workspace management
        document.getElementById('createWorkspaceBtn').addEventListener('click', () => {
            this.openModal('createWorkspaceModal');
        });
        
        document.getElementById('syncWorkflowsBtn').addEventListener('click', () => {
            this.syncWorkflows();
        });
        
        // Canvas controls
        document.getElementById('zoomInBtn').addEventListener('click', () => {
            this.zoomCanvas(1.2);
        });
        
        document.getElementById('zoomOutBtn').addEventListener('click', () => {
            this.zoomCanvas(0.8);
        });
        
        document.getElementById('fitToScreenBtn').addEventListener('click', () => {
            this.fitCanvasToScreen();
        });
        
        // Modal events
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });
        
        // Form submissions
        document.getElementById('createWorkspaceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createWorkspace();
        });
        
        document.getElementById('proxySettingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProxySettings();
        });
        
        // Settings - Max Concurrent with enhanced UX
        const maxConcurrentInput = document.getElementById('maxConcurrent');
        let saveTimeout;
        
        maxConcurrentInput.addEventListener('input', (e) => {
            // Clear existing timeout
            if (saveTimeout) clearTimeout(saveTimeout);
            
            // Add pending state
            e.target.classList.add('saving');
            
            // Debounce the save to avoid too many requests
            saveTimeout = setTimeout(async () => {
                try {
                    const value = parseInt(e.target.value);
                    if (value < 1 || value > 10) {
                        throw new Error('Value must be between 1 and 10');
                    }
                    
                    console.log('Updating max concurrent to:', value); // Debug log
                    const result = await this.updateWorkspaceSettings({ 
                        max_concurrent_workflows: value 
                    });
                    console.log('Update result:', result); // Debug log
                    
                    // Success feedback
                    e.target.classList.remove('saving');
                    e.target.classList.add('saved');
                    this.showNotification(`Max concurrent updated to ${value}`, 'success');
                    
                    // Remove saved indicator after 2 seconds
                    setTimeout(() => {
                        e.target.classList.remove('saved');
                    }, 2000);
                    
                } catch (error) {
                    console.error('Failed to update max concurrent:', error);
                    e.target.classList.remove('saving');
                    e.target.classList.add('error');
                    this.showNotification('Failed to update setting: ' + error.message, 'error');
                    
                    // Remove error indicator after 3 seconds
                    setTimeout(() => {
                        e.target.classList.remove('error');
                    }, 3000);
                }
            }, 1000); // 1 second debounce
        });
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        // Add workflow button
        document.getElementById('addWorkflowBtn').addEventListener('click', () => {
            this.openAddWorkflowModal();
        });
        
        // Settings Modal Tab Management
        this.initSettingsModalTabs();
        
        // Settings Modal Form Controls
        this.initSettingsModalControls();
        
        // Canvas interaction events
        this.initCanvasInteraction();
    }
    
    initCanvasInteraction() {
        const canvas = document.getElementById('workflowCanvas');
        const canvasContainer = document.querySelector('.canvas-container');
        
        // Keyboard events for spacebar
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.repeat) {
                e.preventDefault();
                this.isSpacePressed = true;
                canvasContainer.style.cursor = 'grab';
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.isSpacePressed = false;
                this.isDragging = false;
                canvasContainer.style.cursor = 'default';
            }
        });
        
        // Mouse events for canvas panning
        canvasContainer.addEventListener('mousedown', (e) => {
            if (this.isSpacePressed) {
                e.preventDefault();
                this.isDragging = true;
                this.dragStart = { x: e.clientX, y: e.clientY };
                canvasContainer.style.cursor = 'grabbing';
            }
        });
        
        canvasContainer.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.isSpacePressed) {
                e.preventDefault();
                const deltaX = e.clientX - this.dragStart.x;
                const deltaY = e.clientY - this.dragStart.y;
                
                this.canvasOffset.x += deltaX;
                this.canvasOffset.y += deltaY;
                
                this.dragStart = { x: e.clientX, y: e.clientY };
                this.updateCanvasTransform();
            }
        });
        
        canvasContainer.addEventListener('mouseup', (e) => {
            if (this.isDragging) {
                this.isDragging = false;
                canvasContainer.style.cursor = this.isSpacePressed ? 'grab' : 'default';
            }
        });
        
        // Handle mouse leave to stop dragging
        canvasContainer.addEventListener('mouseleave', (e) => {
            if (this.isDragging) {
                this.isDragging = false;
                canvasContainer.style.cursor = this.isSpacePressed ? 'grab' : 'default';
            }
        });
        
        // Touch events for mobile support
        canvasContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                this.isDragging = true;
                this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2) {
                e.preventDefault();
                // Store initial touch distance for pinch zoom
                this.lastTouchDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        });
        
        canvasContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && this.isDragging) {
                e.preventDefault();
                const deltaX = e.touches[0].clientX - this.dragStart.x;
                const deltaY = e.touches[0].clientY - this.dragStart.y;
                
                this.canvasOffset.x += deltaX;
                this.canvasOffset.y += deltaY;
                
                this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                this.updateCanvasTransform();
            } else if (e.touches.length === 2 && this.lastTouchDistance) {
                e.preventDefault();
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const zoomFactor = currentDistance / this.lastTouchDistance;
                const newZoom = Math.max(0.1, Math.min(3, this.canvasZoom * zoomFactor));
                
                if (newZoom !== this.canvasZoom) {
                    this.canvasZoom = newZoom;
                    this.updateCanvasTransform();
                }
                
                this.lastTouchDistance = currentDistance;
            }
        });
        
        canvasContainer.addEventListener('touchend', (e) => {
            this.isDragging = false;
            this.lastTouchDistance = null;
        });
        
        // Mouse wheel for zooming
        canvasContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const rect = canvasContainer.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.max(0.1, Math.min(3, this.canvasZoom * zoomFactor));
            
            if (newZoom !== this.canvasZoom) {
                // Zoom towards mouse position
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const zoomChange = newZoom / this.canvasZoom;
                
                this.canvasOffset.x = mouseX - (mouseX - this.canvasOffset.x) * zoomChange;
                this.canvasOffset.y = mouseY - (mouseY - this.canvasOffset.y) * zoomChange;
                
                this.canvasZoom = newZoom;
                this.updateCanvasTransform();
            }
        });
    }
    
    initSettingsModalTabs() {
        // Tab switching functionality
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs and panels
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                
                // Activate clicked tab
                button.classList.add('active');
                const targetTab = button.getAttribute('data-tab');
                document.getElementById(targetTab + 'Tab').classList.add('active');
            });
        });
    }
    
    initSettingsModalControls() {
        // Schedule toggle
        const enableSchedule = document.getElementById('enableSchedule');
        const cronExpression = document.getElementById('cronExpression');
        const presetButtons = document.querySelectorAll('.preset-btn');
        
        enableSchedule.addEventListener('change', (e) => {
            cronExpression.disabled = !e.target.checked;
            presetButtons.forEach(btn => btn.disabled = !e.target.checked);
        });
        
        // Cron preset buttons
        presetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (!cronExpression.disabled) {
                    cronExpression.value = button.getAttribute('data-cron');
                }
            });
        });
        
        // Telegram toggle
        const enableTelegram = document.getElementById('enableTelegram');
        const telegramInputs = [
            document.getElementById('telegramBotToken'),
            document.getElementById('telegramChatId')
        ];
        
        enableTelegram.addEventListener('change', (e) => {
            telegramInputs.forEach(input => {
                input.disabled = !e.target.checked;
            });
        });
        
        // Webhook toggle
        const enableWebhook = document.getElementById('enableWebhook');
        const webhookInputs = [
            document.getElementById('webhookUrl'),
            document.getElementById('webhookFormat')
        ];
        
        enableWebhook.addEventListener('change', (e) => {
            webhookInputs.forEach(input => {
                input.disabled = !e.target.checked;
            });
        });
    }
    
    // API calls
    async loadWorkspaces() {
        try {
            const response = await fetch('/api/workspaces');
            this.workspaces = await response.json();
            this.renderWorkspaces();
            
            // Auto-select first workspace
            if (this.workspaces.length > 0) {
                this.selectWorkspace(this.workspaces[0]);
            }
        } catch (error) {
            console.error('Failed to load workspaces:', error);
            this.showNotification('Failed to load workspaces', 'error');
        }
    }
    
    async loadWorkflows(workspaceId) {
        try {
            const response = await fetch(`/api/workspaces/${workspaceId}/workflows`);
            this.workflows = await response.json();
            this.renderWorkflows();
            this.updateWorkflowCount();
        } catch (error) {
            console.error('Failed to load workflows:', error);
            this.showNotification('Failed to load workflows', 'error');
        }
    }
    
    async syncWorkflows() {
        if (!this.currentWorkspace) return;
        
        try {
            this.showLoading(true);
            const response = await fetch(`/api/workspaces/${this.currentWorkspace.id}/sync`, {
                method: 'POST'
            });
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            this.showNotification(`Synced: ${result.loaded} loaded, ${result.updated} updated`, 'success');
            await this.loadWorkflows(this.currentWorkspace.id);
        } catch (error) {
            console.error('Failed to sync workflows:', error);
            this.showNotification('Failed to sync workflows', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Workspace management
    async createWorkspace() {
        const name = document.getElementById('workspaceName').value;
        const description = document.getElementById('workspaceDescription').value;
        const maxConcurrent = parseInt(document.getElementById('workspaceMaxConcurrent').value);
        
        if (!name.trim()) {
            this.showNotification('Workspace name is required', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    max_concurrent_workflows: maxConcurrent
                })
            });
            
            const workspace = await response.json();
            if (workspace.error) {
                throw new Error(workspace.error);
            }
            
            this.closeModal('createWorkspaceModal');
            this.showNotification('Workspace created successfully', 'success');
            
            // Reset form
            document.getElementById('createWorkspaceForm').reset();
            
        } catch (error) {
            console.error('Failed to create workspace:', error);
            this.showNotification('Failed to create workspace', 'error');
        }
    }
    
    selectWorkspace(workspace) {
        this.currentWorkspace = workspace;
        this.currentWorkflow = null;
        
        // Update UI
        document.querySelectorAll('.workspace-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (workspace) {
            document.querySelector(`[data-workspace-id="${workspace.id}"]`).classList.add('active');
            document.getElementById('workspaceTitle').textContent = workspace.name;
            document.getElementById('syncWorkflowsBtn').disabled = false;
            
            // Load workflows
            this.loadWorkflows(workspace.id);
            
            // Update settings
            document.getElementById('maxConcurrent').value = workspace.max_concurrent_workflows || 3;
            
            // Join workspace room for real-time updates
            this.socket.emit('join_workspace', { workspace_id: workspace.id });
        } else {
            document.getElementById('workspaceTitle').textContent = 'Select Workspace';
            document.getElementById('syncWorkflowsBtn').disabled = true;
            this.workflows = [];
            this.renderWorkflows();
            this.clearCanvas();
        }
        
        this.updateExecutionButtons();
    }
    
    selectWorkflow(workflow) {
        this.currentWorkflow = workflow;
        
        // Update UI
        document.querySelectorAll('.workflow-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (workflow) {
            document.querySelector(`[data-workflow-id="${workflow.id}"]`).classList.add('active');
            this.loadWorkflowCanvas(workflow.id);
        } else {
            this.clearCanvas();
        }
        
        this.updateExecutionButtons();
    }
    
    // Canvas management
    async loadWorkflowCanvas(workflowId) {
        try {
            const response = await fetch(`/api/workflows/${workflowId}/canvas-data`);
            const canvasData = await response.json();
            
            if (canvasData.error) {
                throw new Error(canvasData.error);
            }
            
            this.renderCanvas(canvasData);
        } catch (error) {
            console.error('Failed to load canvas data:', error);
            this.showNotification('Failed to load workflow visualization', 'error');
        }
    }
    
    renderCanvas(canvasData) {
        const canvas = document.getElementById('workflowCanvas');
        const placeholder = document.getElementById('canvasPlaceholder');
        
        // Hide placeholder
        placeholder.style.display = 'none';
        
        // Update title
        document.getElementById('canvasTitle').textContent = canvasData.name || 'Workflow';
        
        // Clear canvas
        canvas.innerHTML = '';
        
        // Add arrow marker definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#9ca3af');
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        canvas.appendChild(defs);
        
        const nodes = canvasData.nodes || [];
        const connections = canvasData.connections || [];
        
        // Render connections first
        connections.forEach(connection => {
            this.renderConnection(canvas, connection, nodes);
        });
        
        // Render nodes
        nodes.forEach((node, index) => {
            this.renderNode(canvas, node, index);
        });
        
        // Fit to screen initially
        setTimeout(() => {
            this.fitCanvasToScreen();
        }, 100);
    }
    
    renderNode(canvas, node, index) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('node');
        g.setAttribute('data-node-id', node.id || index);
        
        // Use actual node coordinates from the JSON data
        const x = node.x || (index % 4) * 200 + 100;
        const y = node.y || Math.floor(index / 4) * 150 + 100;
        
        g.setAttribute('transform', `translate(${x}, ${y})`);
        
        // Node rectangle (similar to original toolkit styling)
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '150');
        rect.setAttribute('height', '80');
        rect.setAttribute('x', '-75');
        rect.setAttribute('y', '-40');
        rect.setAttribute('rx', '8');
        rect.setAttribute('ry', '8');
        g.appendChild(rect);
        
        // Node type label (top)
        const typeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        typeLabel.setAttribute('x', '0');
        typeLabel.setAttribute('y', '-20');
        typeLabel.setAttribute('text-anchor', 'middle');
        typeLabel.setAttribute('font-size', '10');
        typeLabel.setAttribute('class', 'node-type');
        typeLabel.setAttribute('fill', '#6b7280');
        typeLabel.textContent = node.type || 'node';
        g.appendChild(typeLabel);
        
        // Node icon (FontAwesome)
        this.renderNodeIcon(g, node.type || 'default', 0, 5);
        
        // Node display name (bottom)
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '0');
        label.setAttribute('y', '25');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('class', 'node-text');
        label.setAttribute('font-size', '12');
        const displayName = node.displayName || node.name || node.id || 'Node';
        label.textContent = this.truncateText(displayName, 15);
        g.appendChild(label);
        
        // Status indicator
        const statusCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        statusCircle.setAttribute('cx', '65');
        statusCircle.setAttribute('cy', '-30');
        statusCircle.setAttribute('r', '6');
        statusCircle.setAttribute('fill', '#9ca3af');
        statusCircle.setAttribute('class', 'status-indicator');
        g.appendChild(statusCircle);
        
        canvas.appendChild(g);
        
        // Add click event
        g.addEventListener('click', () => {
            this.selectNode(node, g);
        });
    }
    
    renderConnection(canvas, connection, nodes) {
        const sourceNode = nodes.find(n => n.id === connection.fromNode);
        const targetNode = nodes.find(n => n.id === connection.toNode);
        
        if (!sourceNode || !targetNode) return;
        
        // Calculate positions based on node layout
        const sourceIndex = nodes.indexOf(sourceNode);
        const targetIndex = nodes.indexOf(targetNode);
        
        // Get actual positions from node data or calculate grid positions
        let sourceX = sourceNode.x || (sourceIndex % 4) * 200 + 100;
        let sourceY = sourceNode.y || Math.floor(sourceIndex / 4) * 150 + 100;
        let targetX = targetNode.x || (targetIndex % 4) * 200 + 100;
        let targetY = targetNode.y || Math.floor(targetIndex / 4) * 150 + 100;
        
        // Adjust for port positions (similar to original toolkit)
        const fromPort = connection.fromPort || 'out';
        const toPort = connection.toPort || 'in';
        
        // Calculate port offsets based on port type
        const sourcePortOffset = this.getPortOffset(fromPort);
        const targetPortOffset = this.getPortOffset(toPort);
        
        sourceX += sourcePortOffset.x;
        sourceY += sourcePortOffset.y;
        targetX += targetPortOffset.x;
        targetY += targetPortOffset.y;
        
        // Create curved connection (same as original toolkit)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = this.drawCurve(sourceX, sourceY, targetX, targetY);
        
        // Create connection group
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('connector-group');
        group.setAttribute('data-connection-id', `${connection.fromNode}-${connection.toNode}`);
        
        // Main connection path
        path.setAttribute('d', pathData);
        path.setAttribute('class', 'connector-path');
        path.setAttribute('stroke', '#9ca3af');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        
        // Hitbox for interaction
        const hitbox = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hitbox.setAttribute('d', pathData);
        hitbox.setAttribute('class', 'connector-hitbox');
        hitbox.setAttribute('stroke', 'transparent');
        hitbox.setAttribute('stroke-width', '20');
        hitbox.setAttribute('fill', 'none');
        hitbox.style.cursor = 'pointer';
        
        group.appendChild(hitbox);
        group.appendChild(path);
        canvas.appendChild(group);
    }
    
    drawCurve(x1, y1, x2, y2) {
        // Same curve drawing logic as original toolkit
        const handleOffset = Math.max(50, Math.abs(x2 - x1) * 0.4);
        return `M ${x1},${y1} C ${x1 + handleOffset},${y1} ${x2 - handleOffset},${y2} ${x2},${y2}`;
    }
    
    getPortOffset(portName) {
        // Port position offsets based on port type (similar to original toolkit)
        const offsets = {
            'out': { x: 75, y: 0 },
            'out_right': { x: 75, y: 0 },
            'out_bottom': { x: 0, y: 40 },
            'in': { x: -75, y: 0 },
            'in_top': { x: 0, y: -40 },
            'in_left': { x: -75, y: 0 }
        };
        return offsets[portName] || { x: 75, y: 0 };
    }
    
    getNodeIcon(nodeType) {
        // Icons matching the original toolkit exactly  
        const icons = {
            // Control Flow
            'start': 'fas fa-play-circle',
            'stop': 'fas fa-stop-circle', 
            'if': 'fas fa-code-branch',
            'advancedCondition': 'fas fa-project-diagram',
            'forEach': 'fas fa-sync-alt',
            'setVariable': 'fas fa-equals',
            'comment': 'fas fa-comment-dots',
            
            // Navigation
            'goto': 'fas fa-external-link-alt',
            'goBack': 'fas fa-arrow-left',
            'goForward': 'fas fa-arrow-right',
            'reload': 'fas fa-redo',
            'scrollTo': 'fas fa-arrows-alt-v',
            
            // Form Interaction
            'click': 'fas fa-mouse-pointer',
            'fill': 'fas fa-edit',
            'selectOption': 'fas fa-list-ul',
            'setCheckboxState': 'fas fa-check-square',
            'uploadFile': 'fas fa-upload',
            'submitForm': 'fas fa-paper-plane',
            'clearField': 'fas fa-eraser',
            
            // Data Extraction
            'extract': 'fas fa-search',
            'extractTable': 'fas fa-table',
            'extractList': 'fas fa-list',
            'extractAll': 'fas fa-layer-group',
            
            // Validation & Testing
            'assertVisible': 'fas fa-eye',
            'assertNotVisible': 'fas fa-eye-slash',
            'assertText': 'fas fa-font',
            'assertValue': 'fas fa-equals',
            'assertUrl': 'fas fa-link',
            'assertTitle': 'fas fa-heading',
            
            // Wait & Delay
            'wait': 'fas fa-clock',
            'waitForElement': 'fas fa-hourglass-half',
            'waitForUrl': 'fas fa-globe',
            'waitForText': 'fas fa-search',
            
            // Screenshot & Media
            'screenshot': 'fas fa-camera',
            'recordVideo': 'fas fa-video',
            'recordScreen': 'fas fa-desktop',
            
            // Mouse & Keyboard
            'hover': 'fas fa-hand-pointer',
            'doubleClick': 'fas fa-mouse-pointer',
            'rightClick': 'fas fa-mouse-pointer',
            'keyPress': 'fas fa-keyboard',
            'keyCombo': 'fas fa-keyboard',
            
            // Browser Control
            'openTab': 'fas fa-plus-square',
            'closeTab': 'fas fa-times',
            'switchTab': 'fas fa-exchange-alt',
            'resizeWindow': 'fas fa-expand-arrows-alt',
            
            // API & Network
            'httpRequest': 'fas fa-exchange-alt',
            'mockResponse': 'fas fa-server',
            'setCookie': 'fas fa-cookie-bite',
            'clearCookies': 'fas fa-trash',
            
            // Data Processing
            'transform': 'fas fa-exchange-alt',
            'filter': 'fas fa-filter',
            'sort': 'fas fa-sort',
            'aggregate': 'fas fa-calculator',
            'merge': 'fas fa-object-group',
            
            // File Operations
            'downloadFile': 'fas fa-download',
            'readFile': 'fas fa-file-alt',
            'writeFile': 'fas fa-save',
            'deleteFile': 'fas fa-trash',
            
            // Database & Storage
            'databaseQuery': 'fas fa-database',
            'saveToDatabase': 'fas fa-save',
            'loadFromDatabase': 'fas fa-download',
            'cacheData': 'fas fa-memory',
            
            // Notification & Communication
            'sendEmail': 'fas fa-envelope',
            'sendSlack': 'fab fa-slack',
            'webhook': 'fas fa-plug',
            'notification': 'fas fa-bell',
            
            // Analysis & Performance
            'performance': 'fas fa-tachometer-alt',
            'consoleLog': 'fas fa-terminal',
            'debugBreak': 'fas fa-bug',
            'measure': 'fas fa-ruler',
            
            // Default fallback
            'default': 'fas fa-cog'
        };
        return icons[nodeType] || icons.default;
    }
    
    renderNodeIcon(g, nodeType, x, y) {
        const iconClass = this.getNodeIcon(nodeType);
        
        // Create FontAwesome icon
        const iconElement = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        iconElement.setAttribute('x', x - 8);
        iconElement.setAttribute('y', y - 8);
        iconElement.setAttribute('width', '16');
        iconElement.setAttribute('height', '16');
        
        const iconDiv = document.createElement('div');
        iconDiv.style.display = 'flex';
        iconDiv.style.alignItems = 'center';
        iconDiv.style.justifyContent = 'center';
        iconDiv.innerHTML = `<i class="${iconClass}" style="font-size: 14px; color: #6b7280;"></i>`;
        
        iconElement.appendChild(iconDiv);
        g.appendChild(iconElement);
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    
    clearCanvas() {
        const canvas = document.getElementById('workflowCanvas');
        const placeholder = document.getElementById('canvasPlaceholder');
        
        canvas.innerHTML = '';
        placeholder.style.display = 'block';
        document.getElementById('canvasTitle').textContent = 'Select a workflow to view';
    }
    
    zoomCanvas(factor) {
        this.canvasZoom *= factor;
        this.canvasZoom = Math.max(0.1, Math.min(3, this.canvasZoom));
        this.updateCanvasTransform();
    }
    
    fitCanvasToScreen() {
        this.canvasZoom = 1;
        this.canvasOffset = { x: 0, y: 0 };
        this.updateCanvasTransform();
    }
    
    updateCanvasTransform() {
        const canvas = document.getElementById('workflowCanvas');
        const transform = `translate(${this.canvasOffset.x}, ${this.canvasOffset.y}) scale(${this.canvasZoom})`;
        
        // Apply transform to a group containing all canvas elements
        let transformGroup = canvas.querySelector('#canvas-transform-group');
        if (!transformGroup) {
            transformGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            transformGroup.id = 'canvas-transform-group';
            
            // Move all existing elements to the transform group
            while (canvas.firstChild && canvas.firstChild !== transformGroup) {
                transformGroup.appendChild(canvas.firstChild);
            }
            canvas.appendChild(transformGroup);
        }
        
        transformGroup.setAttribute('transform', transform);
    }
    
    // Execution
    async executeCurrentWorkflow() {
        if (!this.currentWorkflow) return;
        
        try {
            this.executionState.isRunning = true;
            this.updateExecutionButtons();
            
            const response = await fetch(`/api/workflows/${this.currentWorkflow.id}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    headless: document.getElementById('headlessMode').checked
                })
            });
            
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            
            this.showNotification('Workflow execution started', 'success');
        } catch (error) {
            console.error('Failed to execute workflow:', error);
            this.showNotification('Failed to start workflow execution', 'error');
            this.executionState.isRunning = false;
            this.updateExecutionButtons();
        }
    }
    
    async executeAllWorkflows() {
        if (!this.currentWorkspace || this.workflows.length === 0) return;
        
        try {
            this.executionState.isRunning = true;
            this.updateExecutionButtons();
            
            const response = await fetch(`/api/workspaces/${this.currentWorkspace.id}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    headless: document.getElementById('headlessMode').checked,
                    max_concurrent: parseInt(document.getElementById('maxConcurrent').value)
                })
            });
            
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            
            this.showNotification(`Started execution of ${result.workflow_count} workflows`, 'success');
        } catch (error) {
            console.error('Failed to execute workflows:', error);
            this.showNotification('Failed to start batch execution', 'error');
            this.executionState.isRunning = false;
            this.updateExecutionButtons();
        }
    }
    
    stopExecution() {
        // Implement stop functionality
        this.executionState.isRunning = false;
        this.executionState.currentNodes.clear();
        this.updateExecutionButtons();
        this.clearNodeStatuses();
        this.showNotification('Execution stopped', 'warning');
    }
    
    // Real-time event handlers
    onWorkflowStarted(data) {
        console.log('Workflow started:', data);
        this.updateWorkflowStatus(data.workflow_id, 'running');
        this.addExecutionResult(`Workflow ${data.workflow_id} started`, 'running');
    }
    
    onNodeStarted(data) {
        console.log('Node started:', data);
        this.executionState.currentNodes.add(data.node_id);
        this.updateNodeStatus(data.node_id, 'running');
        
        // Update connection animation if applicable
        this.animateConnection(data.node_id);
    }
    
    onNodeCompleted(data) {
        console.log('Node completed:', data);
        this.executionState.currentNodes.delete(data.node_id);
        this.updateNodeStatus(data.node_id, 'completed');
    }
    
    onNodeError(data) {
        console.log('Node error:', data);
        this.executionState.currentNodes.delete(data.node_id);
        this.updateNodeStatus(data.node_id, 'failed');
        this.showNotification(`Node error: ${data.error}`, 'error');
    }
    
    onWorkflowCompleted(data) {
        console.log('Workflow completed:', data);
        this.updateWorkflowStatus(data.workflow_id, 'completed');
        this.addExecutionResult(
            `Workflow ${data.workflow_id} completed in ${data.execution_time.toFixed(2)}s`,
            'completed'
        );
        
        // Check if this was the last running workflow
        if (this.executionState.currentNodes.size === 0) {
            this.executionState.isRunning = false;
            this.updateExecutionButtons();
        }
    }
    
    onWorkflowError(data) {
        console.log('Workflow error:', data);
        this.updateWorkflowStatus(data.workflow_id, 'failed');
        this.addExecutionResult(`Workflow ${data.workflow_id} failed: ${data.error}`, 'failed');
        
        this.executionState.isRunning = false;
        this.updateExecutionButtons();
    }
    
    onWorkflowsReordered(data) {
        console.log('Workflows reordered:', data);
        // Only reload if it's for the current workspace and not triggered by current user
        if (this.currentWorkspace && data.workspace_id === this.currentWorkspace.id) {
            // Just update the local state without full reload to avoid infinite loop
            if (data.orders) {
                data.orders.forEach(order => {
                    const workflow = this.workflows.find(w => w.id === order.workflow_id);
                    if (workflow) {
                        workflow.display_order = order.display_order;
                    }
                });
                // Sort workflows by display_order
                this.workflows.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
                this.renderWorkflows();
            }
        }
    }
    
    onBatchExecutionStarted(data) {
        console.log('Batch execution started:', data);
        this.addExecutionResult(
            `Started batch execution of ${data.workflow_count} workflows`,
            'running'
        );
    }
    
    onBatchExecutionProgress(data) {
        console.log('Batch execution progress:', data);
        // Update progress indicator if needed
    }
    
    onBatchExecutionCompleted(data) {
        console.log('Batch execution completed:', data);
        this.addExecutionResult(
            `Batch execution completed: ${data.completed} successful, ${data.failed} failed`,
            'completed'
        );
        
        this.executionState.isRunning = false;
        this.updateExecutionButtons();
    }
    
    // UI Updates
    updateConnectionStatus(connected) {
        const status = document.getElementById('connectionStatus');
        if (connected) {
            status.classList.remove('offline');
            status.classList.add('online');
            status.innerHTML = '<i class=\"fas fa-circle\"></i> Connected';
        } else {
            status.classList.remove('online');
            status.classList.add('offline');
            status.innerHTML = '<i class=\"fas fa-circle\"></i> Offline';
        }
    }
    
    updateExecutionButtons() {
        const executeBtn = document.getElementById('executeBtn');
        const executeAllBtn = document.getElementById('executeAllBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        const hasWorkflow = !!this.currentWorkflow;
        const hasWorkflows = this.workflows.length > 0;
        const isRunning = this.executionState.isRunning;
        
        executeBtn.disabled = !hasWorkflow || isRunning;
        executeAllBtn.disabled = !hasWorkflows || isRunning;
        stopBtn.disabled = !isRunning;
    }
    
    updateWorkflowCount() {
        document.getElementById('workflowCount').textContent = this.workflows.length;
    }
    
    updateWorkflowStatus(workflowId, status) {
        const workflowItem = document.querySelector(`[data-workflow-id=\"${workflowId}\"]`);
        if (workflowItem) {
            const statusDot = workflowItem.querySelector('.status-dot');
            if (statusDot) {
                statusDot.className = `status-dot ${status}`;
            }
        }
    }
    
    updateNodeStatus(nodeId, status) {
        const node = document.querySelector(`[data-node-id=\"${nodeId}\"]`);
        if (node) {
            node.className = `node ${status}`;
            
            const statusIndicator = node.querySelector('.status-indicator');
            if (statusIndicator) {
                const colors = {
                    running: '#ffc107',
                    completed: '#28a745',
                    failed: '#dc3545',
                    pending: '#9ca3af'
                };
                statusIndicator.setAttribute('fill', colors[status] || colors.pending);
            }
        }
    }
    
    clearNodeStatuses() {
        document.querySelectorAll('.node').forEach(node => {
            node.className = 'node';
            const statusIndicator = node.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.setAttribute('fill', '#9ca3af');
            }
        });
        
        document.querySelectorAll('.connection').forEach(connection => {
            connection.classList.remove('active');
        });
    }
    
    animateConnection(nodeId) {
        // Find and animate connections leading to this node
        const connections = document.querySelectorAll('.connection');
        connections.forEach(connection => {
            const connectionId = connection.getAttribute('data-connection-id');
            if (connectionId && connectionId.endsWith(nodeId)) {
                connection.classList.add('active');
                
                // Remove animation after a delay
                setTimeout(() => {
                    connection.classList.remove('active');
                }, 2000);
            }
        });
    }
    
    addExecutionResult(message, type) {
        const resultsContainer = document.getElementById('executionResults');
        const placeholder = resultsContainer.querySelector('.result-placeholder');
        
        if (placeholder) {
            placeholder.remove();
        }
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const statusColors = {
            running: '#ffc107',
            completed: '#28a745',
            failed: '#dc3545',
            warning: '#fd7e14'
        };
        
        resultItem.innerHTML = `
            <div class=\"result-header\">
                <div class=\"result-title\">
                    <span class=\"status-dot ${type}\"></span>
                    ${message}
                </div>
                <div class=\"result-time\">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        
        resultsContainer.appendChild(resultItem);
        
        // Scroll to bottom
        resultsContainer.scrollTop = resultsContainer.scrollHeight;
        
        // Remove old results (keep last 10)
        const results = resultsContainer.querySelectorAll('.result-item');
        if (results.length > 10) {
            results[0].remove();
        }
    }
    
    // Rendering
    renderWorkspaces() {
        const container = document.getElementById('workspaceList');
        container.innerHTML = '';
        
        if (this.workspaces.length === 0) {
            container.innerHTML = `
                <div class=\"empty-state\">
                    <p>No workspaces found</p>
                    <button class=\"btn btn-primary btn-sm\" onclick=\"ui.openModal('createWorkspaceModal')\">
                        Create First Workspace
                    </button>
                </div>
            `;
            return;
        }
        
        this.workspaces.forEach(workspace => {
            const item = document.createElement('div');
            item.className = 'workspace-item';
            item.setAttribute('data-workspace-id', workspace.id);
            
            const hasProxy = workspace.proxy_settings && Object.keys(workspace.proxy_settings).length > 0;
            const hasAuth = workspace.auth_settings && Object.keys(workspace.auth_settings).length > 0;
            
            item.innerHTML = `
                <div class=\"workspace-header\">
                    <div class=\"workspace-name\">${workspace.name}</div>
                    <div class=\"workspace-status-icons\">
                        <span class=\"status-icon ${hasProxy ? 'active' : 'inactive'}\" title=\"${hasProxy ? 'Proxy configured' : 'No proxy'}\">
                            <i class=\"fas fa-globe\"></i>
                        </span>
                        <span class=\"status-icon ${hasAuth ? 'active' : 'inactive'}\" title=\"${hasAuth ? 'Auth configured' : 'No authentication'}\">
                            <i class=\"fas fa-user-shield\"></i>
                        </span>
                    </div>
                </div>
                <div class=\"workspace-description\">${workspace.description || 'No description'}</div>
                <div class=\"workspace-stats\">
                    <span title=\"Maximum concurrent workflows\">
                        <i class=\"fas fa-layer-group\"></i>
                        Max: ${workspace.max_concurrent_workflows || 3}
                    </span>
                    <span title=\"Completion percentage\">
                        <i class=\"fas fa-chart-pie\"></i>
                        ${workspace.completion_percentage?.toFixed(0) || 0}%
                    </span>
                </div>
                <div class=\"workspace-actions\">
                    <button class=\"btn btn-icon btn-outline\" onclick=\"ui.openProxySettings(${workspace.id})\" title=\"Proxy Settings\">
                        <i class=\"fas fa-cog\"></i>
                    </button>
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectWorkspace(workspace);
            });
            
            container.appendChild(item);
        });
    }
    
    renderWorkflows() {
        const container = document.getElementById('workflowList');
        container.innerHTML = '';
        
        if (this.workflows.length === 0) {
            container.innerHTML = `
                <div class=\"empty-state\">
                    <p>No workflows found</p>
                    <p class=\"text-muted\">Sync workflows from the workflows_json directory</p>
                </div>
            `;
            return;
        }
        
        this.workflows.forEach(workflow => {
            const item = document.createElement('div');
            item.className = 'workflow-item';
            item.setAttribute('data-workflow-id', workflow.id);
            item.setAttribute('draggable', 'true');
            
            const statusText = workflow.status || 'pending';
            const executionTime = workflow.last_execution_time ? 
                `${workflow.last_execution_time.toFixed(2)}s` : 'N/A';
            
            item.innerHTML = `
                <div class=\"workflow-name\">
                    <i class=\"fas fa-grip-vertical drag-handle\"></i>
                    <span class=\"status-dot ${statusText}\"></span>
                    ${workflow.name}
                </div>
                <div class=\"workflow-stats\">
                    <span>Nodes: ${workflow.node_count || 0}</span>
                    <span>Time: ${executionTime}</span>
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectWorkflow(workflow);
            });
            
            // Drag and drop for reordering
            item.addEventListener('dragstart', (e) => {
                console.log('Drag started:', workflow.id); // Debug log
                e.dataTransfer.setData('text/plain', workflow.id.toString());
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            item.addEventListener('dragend', (e) => {
                console.log('Drag ended'); // Debug log
                item.classList.remove('dragging');
                // Remove all drag-over indicators
                document.querySelectorAll('.workflow-item.drag-over').forEach(el => {
                    el.classList.remove('drag-over');
                });
            });
            
            item.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (!item.classList.contains('dragging')) {
                    item.classList.add('drag-over');
                    console.log('Drag enter:', workflow.id); // Debug log
                }
            });
            
            item.addEventListener('dragleave', (e) => {
                e.preventDefault();
                // Only remove if we're actually leaving the item
                if (!item.contains(e.relatedTarget)) {
                    item.classList.remove('drag-over');
                }
            });
            
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                console.log('Drop event triggered'); // Debug log
                item.classList.remove('drag-over');
                const draggedId = e.dataTransfer.getData('text/plain');
                console.log('Dropped:', draggedId, 'on:', workflow.id); // Debug log
                this.reorderWorkflows(draggedId, workflow.id.toString());
            });
            
            container.appendChild(item);
        });
    }
    
    // Modal management
    openModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }
    
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }
    
    openProxySettings(workspaceId) {
        this.currentProxyWorkspace = this.workspaces.find(w => w.id === workspaceId);
        
        if (this.currentProxyWorkspace) {
            // General settings
            document.getElementById('workspaceNameEdit').value = this.currentProxyWorkspace.name || '';
            document.getElementById('workspaceDescEdit').value = this.currentProxyWorkspace.description || '';
            document.getElementById('maxConcurrentEdit').value = this.currentProxyWorkspace.max_concurrent_workflows || 3;
            
            // Proxy settings
            if (this.currentProxyWorkspace.proxy_settings) {
                document.getElementById('proxyHost').value = this.currentProxyWorkspace.proxy_settings.host || '';
                document.getElementById('proxyPort').value = this.currentProxyWorkspace.proxy_settings.port || '';
                document.getElementById('proxyUsername').value = this.currentProxyWorkspace.proxy_settings.username || '';
                document.getElementById('proxyPassword').value = this.currentProxyWorkspace.proxy_settings.password || '';
            } else {
                document.getElementById('proxyHost').value = '';
                document.getElementById('proxyPort').value = '';
                document.getElementById('proxyUsername').value = '';
                document.getElementById('proxyPassword').value = '';
            }
            
            // Schedule settings
            const scheduleSettings = this.currentProxyWorkspace.schedule_settings || {};
            const scheduleEnabled = scheduleSettings.enabled || false;
            document.getElementById('enableSchedule').checked = scheduleEnabled;
            document.getElementById('cronExpression').value = scheduleSettings.cron_expression || '';
            document.getElementById('cronExpression').disabled = !scheduleEnabled;
            
            // Notification settings
            const notificationSettings = this.currentProxyWorkspace.notification_settings || {};
            
            // Telegram
            const telegramSettings = notificationSettings.telegram || {};
            const telegramEnabled = telegramSettings.enabled || false;
            document.getElementById('enableTelegram').checked = telegramEnabled;
            document.getElementById('telegramBotToken').value = telegramSettings.bot_token || '';
            document.getElementById('telegramChatId').value = telegramSettings.chat_id || '';
            document.getElementById('telegramBotToken').disabled = !telegramEnabled;
            document.getElementById('telegramChatId').disabled = !telegramEnabled;
            
            // Webhook
            const webhookSettings = notificationSettings.webhook || {};
            const webhookEnabled = webhookSettings.enabled || false;
            document.getElementById('enableWebhook').checked = webhookEnabled;
            document.getElementById('webhookUrl').value = webhookSettings.url || '';
            document.getElementById('webhookFormat').value = webhookSettings.format || 
                '{"workspace": "{{workspace}}", "status": "{{status}}", "message": "{{message}}", "timestamp": "{{timestamp}}"}';
            document.getElementById('webhookUrl').disabled = !webhookEnabled;
            document.getElementById('webhookFormat').disabled = !webhookEnabled;
        }
        
        this.openModal('proxySettingsModal');
    }
    
    async openAddWorkflowModal() {
        if (!this.currentWorkspace) {
            this.showNotification('Please select a workspace first', 'warning');
            return;
        }
        
        try {
            // Load all available workflows from filesystem
            const response = await fetch('/api/workflows/available');
            const availableWorkflows = await response.json();
            
            if (availableWorkflows.error) {
                throw new Error(availableWorkflows.error);
            }
            
            this.renderAvailableWorkflows(availableWorkflows);
            this.openModal('addWorkflowModal');
            
        } catch (error) {
            console.error('Failed to load available workflows:', error);
            this.showNotification('Failed to load available workflows', 'error');
        }
    }
    
    renderAvailableWorkflows(workflows) {
        const container = document.getElementById('availableWorkflows');
        const currentWorkflowIds = this.workflows.map(w => w.name);
        
        container.innerHTML = '';
        
        if (workflows.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No workflow files found</p>
                    <p class="text-muted">Place JSON files in the workflows_json directory</p>
                </div>
            `;
            return;
        }
        
        workflows.forEach(workflow => {
            const isAlreadyAdded = currentWorkflowIds.includes(workflow.name);
            
            const option = document.createElement('div');
            option.className = `workflow-option ${isAlreadyAdded ? 'disabled' : ''}`;
            
            option.innerHTML = `
                <input type="checkbox" 
                       value="${workflow.name}" 
                       ${isAlreadyAdded ? 'disabled' : ''}
                       id="workflow_${workflow.name}">
                <div class="workflow-option-content">
                    <div class="workflow-option-name">${workflow.name}</div>
                    <div class="workflow-option-info">
                        <span>Nodes: ${workflow.node_count || 0}</span>
                        <span>Size: ${workflow.file_size || 'Unknown'}</span>
                        ${isAlreadyAdded ? '<span class="workflow-option-badge">Already Added</span>' : ''}
                    </div>
                </div>
            `;
            
            if (!isAlreadyAdded) {
                option.addEventListener('click', (e) => {
                    if (e.target.type !== 'checkbox') {
                        const checkbox = option.querySelector('input[type="checkbox"]');
                        checkbox.checked = !checkbox.checked;
                    }
                    option.classList.toggle('selected', option.querySelector('input[type="checkbox"]').checked);
                });
            }
            
            container.appendChild(option);
        });
        
        // Search functionality
        document.getElementById('workflowSearch').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = container.querySelectorAll('.workflow-option');
            
            options.forEach(option => {
                const name = option.querySelector('.workflow-option-name').textContent.toLowerCase();
                option.style.display = name.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }
    
    async addSelectedWorkflows() {
        if (!this.currentWorkspace) return;
        
        const selectedCheckboxes = document.querySelectorAll('#availableWorkflows input[type="checkbox"]:checked');
        const selectedWorkflows = Array.from(selectedCheckboxes).map(cb => cb.value);
        
        if (selectedWorkflows.length === 0) {
            this.showNotification('Please select at least one workflow', 'warning');
            return;
        }
        
        try {
            this.showLoading(true);
            
            for (const workflowName of selectedWorkflows) {
                const response = await fetch('/api/workflows/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workspace_id: this.currentWorkspace.id,
                        workflow_name: workflowName
                    })
                });
                
                const result = await response.json();
                if (result.error) {
                    throw new Error(result.error);
                }
            }
            
            this.closeModal('addWorkflowModal');
            this.showNotification(`Added ${selectedWorkflows.length} workflow(s)`, 'success');
            
            // Reload workflows
            await this.loadWorkflows(this.currentWorkspace.id);
            
        } catch (error) {
            console.error('Failed to add workflows:', error);
            this.showNotification('Failed to add workflows', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    async saveWorkspaceSettings() {
        if (!this.currentProxyWorkspace) return;
        
        try {
            const settings = {};
            
            // General settings
            const name = document.getElementById('workspaceNameEdit').value.trim();
            const description = document.getElementById('workspaceDescEdit').value.trim();
            const maxConcurrent = parseInt(document.getElementById('maxConcurrentEdit').value);
            
            if (name && name !== this.currentProxyWorkspace.name) {
                settings.name = name;
            }
            
            if (description !== (this.currentProxyWorkspace.description || '')) {
                settings.description = description;
            }
            
            if (maxConcurrent && maxConcurrent !== this.currentProxyWorkspace.max_concurrent_workflows) {
                settings.max_concurrent_workflows = maxConcurrent;
            }
            
            // Proxy settings
            const proxySettings = {
                host: document.getElementById('proxyHost').value.trim(),
                port: parseInt(document.getElementById('proxyPort').value) || null,
                username: document.getElementById('proxyUsername').value.trim(),
                password: document.getElementById('proxyPassword').value.trim()
            };
            
            Object.keys(proxySettings).forEach(key => {
                if (!proxySettings[key]) {
                    delete proxySettings[key];
                }
            });
            
            settings.proxy_settings = Object.keys(proxySettings).length > 0 ? proxySettings : null;
            
            // Schedule settings
            const scheduleSettings = {
                enabled: document.getElementById('enableSchedule').checked,
                cron_expression: document.getElementById('cronExpression').value.trim()
            };
            
            if (!scheduleSettings.enabled) {
                scheduleSettings.cron_expression = '';
            }
            
            settings.schedule_settings = scheduleSettings;
            
            // Notification settings
            const notificationSettings = {
                telegram: {
                    enabled: document.getElementById('enableTelegram').checked,
                    bot_token: document.getElementById('telegramBotToken').value.trim(),
                    chat_id: document.getElementById('telegramChatId').value.trim()
                },
                webhook: {
                    enabled: document.getElementById('enableWebhook').checked,
                    url: document.getElementById('webhookUrl').value.trim(),
                    format: document.getElementById('webhookFormat').value.trim()
                }
            };
            
            // Clean up empty notification settings
            if (!notificationSettings.telegram.enabled) {
                notificationSettings.telegram = { enabled: false };
            }
            if (!notificationSettings.webhook.enabled) {
                notificationSettings.webhook = { enabled: false };
            }
            
            settings.notification_settings = notificationSettings;
            
            console.log('Saving workspace settings:', settings);
            
            await this.updateWorkspaceSettings(settings);
            
            this.closeModal('proxySettingsModal');
            this.showNotification('Workspace settings saved successfully', 'success');
            
        } catch (error) {
            console.error('Failed to save workspace settings:', error);
            this.showNotification('Failed to save workspace settings', 'error');
        }
    }
    
    // Legacy method for compatibility
    async saveProxySettings() {
        await this.saveWorkspaceSettings();
    }
    
    async updateWorkspaceSettings(settings) {
        if (!this.currentWorkspace) {
            throw new Error('No workspace selected');
        }
        
        try {
            console.log('Sending update request:', settings); // Debug log
            const response = await fetch(`/api/workspaces/${this.currentWorkspace.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            
            console.log('Response status:', response.status); // Debug log
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const updatedWorkspace = await response.json();
            console.log('Updated workspace:', updatedWorkspace); // Debug log
            
            if (updatedWorkspace.error) {
                throw new Error(updatedWorkspace.error);
            }
            
            // Update local workspace data
            const index = this.workspaces.findIndex(w => w.id === this.currentWorkspace.id);
            if (index !== -1) {
                this.workspaces[index] = updatedWorkspace;
                this.currentWorkspace = updatedWorkspace;
                // Re-render workspaces to show updated max concurrent
                this.renderWorkspaces();
            }
            
            return updatedWorkspace;
        } catch (error) {
            console.error('Failed to update workspace settings:', error);
            throw error;
        }
    }
    
    // Utility functions
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class=\"notification-content\">
                <span>${message}</span>
                <button class=\"notification-close\">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Remove on click
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        console.log(`${type.toUpperCase()}: ${message}`);
    }
    
    selectNode(node, element) {
        // Remove previous selection
        document.querySelectorAll('.node.selected').forEach(n => {
            n.classList.remove('selected');
        });
        
        // Add selection
        element.classList.add('selected');
        
        console.log('Selected node:', node);
    }
    
    async reorderWorkflows(draggedId, targetId) {
        if (draggedId === targetId) return;
        
        try {
            console.log('Reordering workflows:', draggedId, 'to', targetId); // Debug log
            
            // Find the workflows
            const draggedWorkflow = this.workflows.find(w => w.id.toString() === draggedId);
            const targetWorkflow = this.workflows.find(w => w.id.toString() === targetId);
            
            if (!draggedWorkflow || !targetWorkflow) {
                console.log('Workflows not found:', draggedWorkflow, targetWorkflow);
                return;
            }
            
            // Create new order based on drag position
            const draggedIndex = this.workflows.findIndex(w => w.id.toString() === draggedId);
            const targetIndex = this.workflows.findIndex(w => w.id.toString() === targetId);
            
            console.log('Reordering from index', draggedIndex, 'to', targetIndex); // Debug log
            
            // Remove dragged item and insert at target position
            const reorderedWorkflows = [...this.workflows];
            const [movedItem] = reorderedWorkflows.splice(draggedIndex, 1);
            reorderedWorkflows.splice(targetIndex, 0, movedItem);
            
            // Create order array with new display_order values
            const orders = reorderedWorkflows.map((workflow, index) => ({
                workflow_id: workflow.id, 
                display_order: index + 1
            }));
            
            console.log('New order:', orders); // Debug log
            
            // Send to server
            const response = await fetch(`/api/workflows/${draggedId}/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspace_id: this.currentWorkspace.id,
                    orders: orders
                })
            });
            
            console.log('Reorder response:', response.status); // Debug log
            
            if (response.ok) {
                const result = await response.json();
                console.log('Reorder result:', result); // Debug log
                
                // Update local state immediately
                this.workflows = reorderedWorkflows;
                this.renderWorkflows();
                this.showNotification('Workflows reordered successfully', 'success');
            } else {
                const errorText = await response.text();
                console.error('Reorder error response:', errorText);
                throw new Error(`Failed to reorder workflows: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Failed to reorder workflows:', error);
            this.showNotification('Failed to reorder workflows: ' + error.message, 'error');
        }
    }
}

// Initialize the UI when the page loads
let ui;
document.addEventListener('DOMContentLoaded', () => {
    ui = new AutomationUI();
});

// Global functions for HTML event handlers
function openModal(modalId) {
    ui.openModal(modalId);
}

function closeModal(modalId) {
    ui.closeModal(modalId);
}

function createWorkspace() {
    ui.createWorkspace();
}

function saveProxySettings() {
    ui.saveProxySettings();
}

function saveWorkspaceSettings() {
    ui.saveWorkspaceSettings();
}

function addSelectedWorkflows() {
    ui.addSelectedWorkflows();
}