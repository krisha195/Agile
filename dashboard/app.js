// Configuration
const API_URL = '/api'; // Using relative path since frontend and backend are on same server

// State management
let state = {
    equipment: [],
    teams: [],
    requests: [],
    currentPage: 'dashboard'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadDashboard();
    
    // Set up new request button
    document.getElementById('new-request-btn').addEventListener('click', showNewRequestForm);
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get page name
            const page = link.dataset.page;
            state.currentPage = page;
            
            // Update page title
            const pageTitle = link.textContent.trim();
            document.getElementById('page-title').textContent = pageTitle;
            
            // Load appropriate content
            switch(page) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'equipment':
                    loadEquipmentPage();
                    break;
                case 'requests':
                    loadRequestsPage();
                    break;
                case 'teams':
                    loadTeamsPage();
                    break;
                case 'calendar':
                    loadCalendarPage();
                    break;
            }
        });
    });
}

// Load Dashboard
async function loadDashboard() {
    try {
        // Fetch all data
        const [equipmentRes, teamsRes, requestsRes, statsRes] = await Promise.all([
            fetch(`${API_URL}/equipment`),
            fetch(`${API_URL}/teams`),
            fetch(`${API_URL}/requests`),
            fetch(`${API_URL}/stats`)
        ]);
        
        state.equipment = await equipmentRes.json();
        state.teams = await teamsRes.json();
        state.requests = await requestsRes.json();
        const stats = await statsRes.json();
        
        // Update stats
        document.getElementById('total-equipment').textContent = stats.totalEquipment;
        document.getElementById('total-teams').textContent = stats.totalTeams;
        document.getElementById('active-requests').textContent = stats.requestsByStage.inProgress || 0;
        document.getElementById('completed-requests').textContent = stats.requestsByStage.repaired || 0;
        
        // Update kanban board
        updateKanbanBoard();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

// Update Kanban Board
function updateKanbanBoard() {
    const stages = {
        'New': 'new',
        'In Progress': 'progress',
        'Repaired': 'repaired',
        'Scrap': 'scrap'
    };
    
    // Clear all columns
    Object.values(stages).forEach(stage => {
        const column = document.getElementById(`column-${stage}`);
        column.innerHTML = '';
    });
    
    // Group requests by stage
    const requestsByStage = {
        'New': [],
        'In Progress': [],
        'Repaired': [],
        'Scrap': []
    };
    
    state.requests.forEach(request => {
        if (requestsByStage[request.stage]) {
            requestsByStage[request.stage].push(request);
        }
    });
    
    // Render requests in each column
    Object.entries(stages).forEach(([stageName, stageId]) => {
        const requests = requestsByStage[stageName];
        const column = document.getElementById(`column-${stageId}`);
        const countEl = document.getElementById(`count-${stageId}`);
        
        countEl.textContent = requests.length;
        
        if (requests.length === 0) {
            column.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">${getStageIcon(stageName)}</div>
                    <div class="empty-state-text">No ${stageName.toLowerCase()} requests</div>
                </div>
            `;
        } else {
            column.innerHTML = requests.map(request => createRequestCard(request)).join('');
        }
    });
}

// Create Request Card
function createRequestCard(request) {
    const equipment = state.equipment.find(e => e.id === request.equipmentId);
    const equipmentName = equipment ? equipment.name : 'Unknown Equipment';
    
    const typeClass = request.type === 'Corrective' ? 'badge-corrective' : 'badge-preventive';
    
    return `
        <div class="request-card" data-id="${request.id}">
            <div class="request-title">${request.subject}</div>
            <div class="request-meta">
                🔧 ${equipmentName}
            </div>
            <div class="request-meta">
                📅 ${formatDate(request.scheduledDate || request.createdAt)}
            </div>
            <div class="request-footer">
                <span class="badge ${typeClass}">${request.type || 'Corrective'}</span>
                ${request.assignedTo ? `<div class="avatar">${request.assignedTo.charAt(0).toUpperCase()}</div>` : ''}
            </div>
        </div>
    `;
}

// Get Stage Icon
function getStageIcon(stage) {
    const icons = {
        'New': '📥',
        'In Progress': '⚙️',
        'Repaired': '✨',
        'Scrap': '🗑️'
    };
    return icons[stage] || '📋';
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Show New Request Form
function showNewRequestForm() {
    // This would open a modal or navigate to a form page
    // For now, we'll create a simple demo request
    createDemoRequest();
}

// Create Demo Request (for testing)
async function createDemoRequest() {
    const demoRequest = {
        subject: 'Sample Maintenance Request',
        type: 'Corrective',
        equipmentId: state.equipment[0]?.id || 'demo-1',
        scheduledDate: new Date().toISOString(),
        description: 'This is a demo request to show functionality'
    };
    
    try {
        const response = await fetch(`${API_URL}/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(demoRequest)
        });
        
        if (response.ok) {
            showNotification('Request created successfully!', 'success');
            loadDashboard();
        }
    } catch (error) {
        console.error('Error creating request:', error);
        showNotification('Failed to create request', 'error');
    }
}

// Load Equipment Page
function loadEquipmentPage() {
    const mainContent = document.querySelector('.main-content');
    const dashboardContent = document.getElementById('dashboard-content');
    
    dashboardContent.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
            <div style="font-size: 48px; margin-bottom: 16px;">🔧</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">Equipment Management</h3>
            <p>Equipment listing and management will be implemented here.</p>
            <p style="margin-top: 16px; font-size: 14px;">This section will include equipment forms, filtering, and smart buttons.</p>
        </div>
    `;
}

// Load Requests Page
function loadRequestsPage() {
    const dashboardContent = document.getElementById('dashboard-content');
    
    dashboardContent.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
            <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">Maintenance Requests</h3>
            <p>Full request management interface will be implemented here.</p>
            <p style="margin-top: 16px; font-size: 14px;">This section will include advanced filtering, sorting, and request creation.</p>
        </div>
    `;
}

// Load Teams Page
function loadTeamsPage() {
    const dashboardContent = document.getElementById('dashboard-content');
    
    dashboardContent.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
            <div style="font-size: 48px; margin-bottom: 16px;">👥</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">Maintenance Teams</h3>
            <p>Team management and member assignment will be implemented here.</p>
            <p style="margin-top: 16px; font-size: 14px;">This section will include team creation, member management, and workload distribution.</p>
        </div>
    `;
}

// Load Calendar Page
function loadCalendarPage() {
    const dashboardContent = document.getElementById('dashboard-content');
    
    dashboardContent.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
            <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
            <h3 style="color: var(--text-primary); margin-bottom: 8px;">Maintenance Calendar</h3>
            <p>Calendar view for preventive maintenance scheduling will be implemented here.</p>
            <p style="margin-top: 16px; font-size: 14px;">This section will include calendar visualization and drag-and-drop scheduling.</p>
        </div>
    `;
}

// Show Notification
function showNotification(message, type = 'info') {
    // Simple console notification for now
    // Will be replaced with a proper toast notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Utility function to check API health
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log('API Health:', data);
    } catch (error) {
        console.error('API is not reachable:', error);
    }
}

checkAPIHealth();
