class EmployeeBoardSystem {
    constructor() {
        this.employees = [];
        this.filteredEmployees = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.isAdminMode = false;
        this.editingEmployee = null;
        this.adminPassword = 'admin123'; // In production, use secure authentication
        this.storageKey = 'employeeBoardData';

        this.initializeData();
        this.bindEvents();
    }

    async initializeData() {
        // Try to load from localStorage first (persistent data)
        const savedData = this.loadFromLocalStorage();
        
        if (savedData && savedData.length > 0) {
            console.log('Loading employee data from local storage');
            this.employees = savedData;
        } else {
            // Try to load from JSON file, fallback to sample data
            try {
                const response = await fetch('data/employees.json');
                if (response.ok) {
                    console.log('Loading employee data from JSON file');
                    this.employees = await response.json();
                    // Save to localStorage for future use
                    this.saveToLocalStorage();
                } else {
                    console.log('JSON file not found, loading sample data');
                    this.loadSampleData();
                    this.saveToLocalStorage();
                }
            } catch (error) {
                console.log('Could not load employees.json, using sample data');
                this.loadSampleData();
                this.saveToLocalStorage();
            }
        }

        this.filteredEmployees = [...this.employees];
        this.renderEmployees();
    }

    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.employees));
            console.log('Employee data saved to local storage');
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Warning: Could not save data to local storage. Changes may be lost on refresh.');
            return false;
        }
    }

    resetToDefault() {
        if (confirm('This will reset all employee data to the original defaults. Are you sure?')) {
            localStorage.removeItem(this.storageKey);
            this.loadSampleData();
            this.saveToLocalStorage();
            this.applyFilters();
            alert('Employee data has been reset to defaults');
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.employees, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `employee-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('Employee data exported successfully!');
    }

    loadSampleData() {
        // Sample employee data
        this.employees = [
            {
                id: 1,
                name: "Sarah Johnson",
                department: "HR",
                position: "HR Manager",
                photo: "sarah_johnson.jpg"
            },
            {
                id: 2,
                name: "Michael Chen",
                department: "Logistics",
                position: "Senior Logistics Coordinator",
                photo: "michael_chen.jpg"
            },
            {
                id: 3,
                name: "Emily Davis",
                department: "Warehouse",
                position: "Warehouse Supervisor",
                photo: "emily_davis.jpg"
            },
            {
                id: 4,
                name: "Robert Martinez",
                department: "HR",
                position: "HR Specialist",
                photo: "robert_martinez.jpg"
            },
            {
                id: 5,
                name: "Lisa Thompson",
                department: "Logistics",
                position: "Transportation Manager",
                photo: "lisa_thompson.jpg"
            },
            {
                id: 6,
                name: "David Wilson",
                department: "Warehouse",
                position: "Warehouse Associate",
                photo: "david_wilson.jpg"
            },
            {
                id: 7,
                name: "Jennifer Brown",
                department: "HR",
                position: "Talent Acquisition Specialist",
                photo: "jennifer_brown.jpg"
            },
            {
                id: 8,
                name: "James Anderson",
                department: "Logistics",
                position: "Logistics Analyst",
                photo: "james_anderson.jpg"
            }
        ];
    }

    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.department;
                this.applyFilters();
            });
        });

        // Search box
        document.getElementById('searchBox').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Admin mode toggle
        document.getElementById('adminBtn').addEventListener('click', () => {
            this.toggleAdminMode();
        });

        // Modal events
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('employeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        // Close modal on backdrop click
        document.getElementById('employeeModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Admin utility buttons
        document.getElementById('resetBtn')?.addEventListener('click', () => {
            this.resetToDefault();
        });

        document.getElementById('exportBtn')?.addEventListener('click', () => {
            this.exportData();
        });
    }

    applyFilters() {
        this.filteredEmployees = this.employees.filter(employee => {
            const matchesDepartment = this.currentFilter === 'all' || employee.department === this.currentFilter;
            const matchesSearch = this.currentSearch === '' || 
                employee.name.toLowerCase().includes(this.currentSearch) ||
                employee.position.toLowerCase().includes(this.currentSearch);
            
            return matchesDepartment && matchesSearch;
        });

        this.renderEmployees();
    }

    renderEmployees() {
        const grid = document.getElementById('employeeGrid');
        const count = document.getElementById('employeeCount');
        
        grid.innerHTML = '';

        // Add admin utility buttons in admin mode
        if (this.isAdminMode) {
            const utilitySection = document.createElement('div');
            utilitySection.className = 'admin-utilities';
            utilitySection.innerHTML = `
                <div class="utility-buttons">
                    <button class="utility-btn reset-btn" id="resetBtn">🔄 Reset to Default</button>
                    <button class="utility-btn export-btn" id="exportBtn">📥 Export Data</button>
                </div>
            `;
            grid.appendChild(utilitySection);

            // Re-bind events for new buttons
            document.getElementById('resetBtn').addEventListener('click', () => {
                this.resetToDefault();
            });

            document.getElementById('exportBtn').addEventListener('click', () => {
                this.exportData();
            });
        }

        // Add "Add Employee" card in admin mode
        if (this.isAdminMode) {
            const addCard = document.createElement('div');
            addCard.className = 'add-employee-card';
            addCard.innerHTML = `
                <div class="add-icon">+</div>
                <h3>Add New Employee</h3>
                <p>Click to add a new employee to the directory</p>
            `;
            addCard.addEventListener('click', () => this.openAddModal());
            grid.appendChild(addCard);
        }

        // Render employee cards
        this.filteredEmployees.forEach(employee => {
            const card = document.createElement('div');
            card.className = 'employee-card';
            
            const photoElement = employee.photo ? 
                `<img src="photos/${employee.photo}" alt="${employee.name}" class="employee-photo" onerror="this.outerHTML='<div class=\\"employee-photo\\">👤</div>'">` :
                `<div class="employee-photo">👤</div>`;

            card.innerHTML = `
                ${this.isAdminMode ? `
                    <div class="card-actions">
                        <button class="action-btn edit-btn" onclick="employeeBoard.editEmployee(${employee.id})">✏️</button>
                        <button class="action-btn delete-btn" onclick="employeeBoard.deleteEmployee(${employee.id})">🗑️</button>
                    </div>
                ` : ''}
                ${photoElement}
                <div class="employee-name">${employee.name}</div>
                <div class="employee-position">${employee.position || 'Position Not Set'}</div>
            `;
            
            grid.appendChild(card);
        });

        // Update count with storage status
        const total = this.employees.length;
        const filtered = this.filteredEmployees.length;
        const storageStatus = this.loadFromLocalStorage() ? '💾 Data saved locally' : '⚠️ Using default data';
        
        count.innerHTML = `
            <div>${filtered === total ? `Showing all ${total} employees` : `Showing ${filtered} of ${total} employees`}</div>
            <div style="font-size: 0.9em; margin-top: 5px;">${storageStatus}</div>
        `;
    }

    toggleAdminMode() {
        if (!this.isAdminMode) {
            const password = prompt('Enter admin password:');
            if (password !== this.adminPassword) {
                alert('Incorrect password');
                return;
            }
        }

        this.isAdminMode = !this.isAdminMode;
        const btn = document.getElementById('adminBtn');
        const body = document.body;

        if (this.isAdminMode) {
            btn.textContent = 'Exit Admin';
            btn.classList.add('active');
            body.classList.add('admin-mode');
        } else {
            btn.textContent = 'Admin Mode';
            btn.classList.remove('active');
            body.classList.remove('admin-mode');
        }

        this.renderEmployees();
    }

    openAddModal() {
        this.editingEmployee = null;
        document.getElementById('modalTitle').textContent = 'Add New Employee';
        document.getElementById('saveBtn').textContent = 'Save Employee';
        this.clearForm();
        document.getElementById('employeeModal').style.display = 'block';
    }

    editEmployee(id) {
        this.editingEmployee = this.employees.find(emp => emp.id === id);
        if (!this.editingEmployee) return;

        document.getElementById('modalTitle').textContent = 'Edit Employee';
        document.getElementById('saveBtn').textContent = 'Update Employee';
        
        document.getElementById('employeeName').value = this.editingEmployee.name;
        document.getElementById('employeeDepartment').value = this.editingEmployee.department;
        document.getElementById('employeePosition').value = this.editingEmployee.position;
        document.getElementById('employeePhoto').value = this.editingEmployee.photo || '';
        
        document.getElementById('employeeModal').style.display = 'block';
    }

    deleteEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        if (!employee) return;

        if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
            this.employees = this.employees.filter(emp => emp.id !== id);
            this.applyFilters();
            this.saveToLocalStorage(); // Save changes immediately
            alert('Employee deleted successfully!');
        }
    }

    saveEmployee() {
        const name = document.getElementById('employeeName').value.trim();
        const department = document.getElementById('employeeDepartment').value;
        const position = document.getElementById('employeePosition').value.trim();
        const photo = document.getElementById('employeePhoto').value.trim();

        if (!name || !department) {
            alert('Please fill in all required fields');
            return;
        }

        if (this.editingEmployee) {
            // Update existing employee
            this.editingEmployee.name = name;
            this.editingEmployee.department = department;
            this.editingEmployee.position = position;
            this.editingEmployee.photo = photo;
        } else {
            // Add new employee
            const newEmployee = {
                id: Math.max(...this.employees.map(emp => emp.id), 0) + 1,
                name: name,
                department: department,
                position: position,
                photo: photo
            };
            this.employees.push(newEmployee);
        }

        // Save to localStorage immediately
        const saved = this.saveToLocalStorage();
        if (saved) {
            this.applyFilters();
            this.closeModal();
            alert('Employee saved successfully and data persisted!');
        } else {
            alert('Employee saved but could not persist data. Changes may be lost on refresh.');
        }
    }

    clearForm() {
        document.getElementById('employeeForm').reset();
    }

    closeModal() {
        document.getElementById('employeeModal').style.display = 'none';
        this.editingEmployee = null;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.employeeBoard = new EmployeeBoardSystem();
});