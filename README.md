# Customizable Employee Board

A fully customizable, interactive employee organizational chart and directory system. This self-contained HTML application allows you to create, manage, and visualize your organization's structure with complete flexibility.

## Features

### Fully Customizable Organization
- **Add/Edit/Remove Departments** - Create custom departments with your own colors
- **Add/Edit/Remove Employees** - Full CRUD operations for employee management
- **Flexible Hierarchy** - Set any reporting structure with "Reports To" relationships
- **Custom Position Levels** - Define your own position hierarchy (Director, Manager, etc.)
- **Company Branding** - Set your own company name

### Multiple Views
- **Grid View** - Card-based employee directory with search and filters
- **Hierarchy View** - Visual organizational tree showing reporting relationships
- **Department View** - Department overview with employee counts

### Admin Panel
Access the admin panel to manage everything:
- **Toggle Methods:**
  - Click the gear icon (⚙) in the top right
  - Press `Ctrl+Shift+A`
  - Click the company name 5 times rapidly (hidden toggle)

### Data Management
- **localStorage Persistence** - All data automatically saved to browser
- **Export to JSON** - Download your data for backup or migration
- **Import from JSON** - Load data from exported files
- **Reset to Default** - Start fresh with sample data

### Search & Filter
- Search employees by name
- Filter by department
- Filter by position

## Quick Start

1. Open `index.html` in any modern web browser
2. View the sample organization with default data
3. Click the gear icon (⚙) or press `Ctrl+Shift+A` to open admin mode
4. Start customizing:
   - Add your departments with custom colors
   - Add your employees
   - Set reporting relationships
   - Update company name in settings

## Admin Panel Features

### Overview Section
- Total employee count
- Total department count

### Employee Management
- **Add Employee** - Create new employee with name, position, department, manager, shift, email, phone
- **Edit Employee** - Click edit button on any employee card
- **Delete Employee** - Remove employees (direct reports become top-level)

### Department Management
- **Add Department** - Create with custom name and color
- **Edit Department** - Modify name, color, or description
- **Delete Department** - Remove department (employees become unassigned)

### Data Management
- **Export Data** - Download complete data as JSON file
- **Import Data** - Upload JSON file to restore or migrate data
- **Reset to Default** - Clear all data and restore sample organization

### Settings
- **Company Name** - Set your organization's name
- **Position Levels** - Define position hierarchy (comma separated)

## Data Structure

The application uses a simple JSON structure:

```json
{
  "settings": {
    "companyName": "Your Company",
    "positionLevels": ["Director", "Manager", "Supervisor", "Lead", "Employee"]
  },
  "departments": [
    {
      "id": 1,
      "name": "Engineering",
      "color": "#3498db",
      "description": "Software development team"
    }
  ],
  "employees": [
    {
      "id": 1,
      "name": "John Smith",
      "position": "Director",
      "department": "Engineering",
      "parentId": null,
      "shift": "",
      "email": "john@company.com",
      "phone": ""
    }
  ]
}
```

### Employee Fields
| Field | Description |
|-------|-------------|
| `id` | Unique identifier (auto-generated) |
| `name` | Full name |
| `position` | Job title/position |
| `department` | Department name |
| `parentId` | ID of manager (null = top level) |
| `shift` | Shift information (optional) |
| `email` | Email address (optional) |
| `phone` | Phone number (optional) |

### Department Fields
| Field | Description |
|-------|-------------|
| `id` | Unique identifier (auto-generated) |
| `name` | Department name |
| `color` | Hex color code for styling |
| `description` | Brief description (optional) |

## Browser Compatibility

Works with all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Technical Details

- **Self-Contained** - Single HTML file, no external dependencies
- **No Backend Required** - Runs entirely in the browser
- **localStorage** - Data persists in browser storage
- **Responsive Design** - Works on desktop and mobile devices

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+A` | Toggle admin panel |
| `Escape` | Close open modals |

## Tips

1. **Backup Regularly** - Use Export Data to save your organization periodically
2. **Plan Your Hierarchy** - Add managers before their direct reports for easier "Reports To" selection
3. **Use Meaningful Colors** - Choose department colors that help identify teams quickly
4. **Hidden Admin Access** - Click the company name 5 times for secret admin toggle (useful for presentations)

## License

Free to use and modify for any purpose.
