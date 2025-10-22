// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar navigation active state
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  
  sidebarLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
  
  // Confirm delete actions
  const deleteButtons = document.querySelectorAll('button[data-action="delete"], a[data-action="delete"]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (!confirm('Are you sure you want to delete this item?')) {
        e.preventDefault();
      }
    });
  });
  
  // Image preview for upload
  const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
  imageInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          showImagePreview(e.target.result, input);
        };
        reader.readAsDataURL(file);
      }
    });
  });
  
  // Form validation for product upload
  const uploadForms = document.querySelectorAll('form[action*="upload"]');
  uploadForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateUploadForm(form)) {
        e.preventDefault();
        showAlert('Please fill in all required fields', 'danger');
      }
    });
  });
  
  // Auto-refresh dashboard stats
  if (document.querySelector('.stat-card')) {
    setInterval(() => {
      refreshDashboardStats();
    }, 60000); // Refresh every minute
  }
  
  // Product status update
  const statusForms = document.querySelectorAll('form[action*="update"]');
  statusForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Updating...';
      }
    });
  });
  
  // Data tables if present
  initializeDataTables();
  
  // Chart initialization
  initializeCharts();
});

// Show image preview
function showImagePreview(src, inputElement) {
  let preview = inputElement.parentElement.querySelector('.image-preview');
  
  if (!preview) {
    preview = document.createElement('div');
    preview.className = 'image-preview mt-2';
    inputElement.parentElement.appendChild(preview);
  }
  
  preview.innerHTML = `
    <img src="${src}" alt="Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
    <button type="button" class="btn btn-sm btn-danger ms-2" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
}

// Validate upload form
function validateUploadForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      isValid = false;
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    }
  });
  
  return isValid;
}

// Refresh dashboard statistics
function refreshDashboardStats() {
  // This would normally make an AJAX call to get updated stats
  console.log('Refreshing dashboard statistics...');
}

// Initialize data tables
function initializeDataTables() {
  const tables = document.querySelectorAll('.dashboard-table');
  tables.forEach(table => {
    // Add search and sort functionality
    if (table.querySelector('thead')) {
      addTableSearch(table);
    }
  });
}

// Add search to table
function addTableSearch(table) {
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control mb-3';
  searchInput.placeholder = 'Search table...';
  
  table.parentElement.insertBefore(searchInput, table);
  
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
}

// Initialize charts (placeholder for future implementation)
function initializeCharts() {
  const chartContainers = document.querySelectorAll('.chart-container');
  chartContainers.forEach(container => {
    // Initialize charts using Chart.js or similar
    console.log('Chart container found:', container.id);
  });
}

// Export data to CSV
function exportToCSV(tableId, filename = 'export.csv') {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  let csv = [];
  const rows = table.querySelectorAll('tr');
  
  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    const rowData = Array.from(cols).map(col => col.textContent.trim());
    csv.push(rowData.join(','));
  });
  
  const csvContent = csv.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Print dashboard section
function printSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${section.innerHTML}
        <script>window.print(); window.close();</script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Bulk actions
function selectAllCheckboxes(checkbox) {
  const checkboxes = document.querySelectorAll('.item-checkbox');
  checkboxes.forEach(cb => cb.checked = checkbox.checked);
  updateBulkActionButtons();
}

function updateBulkActionButtons() {
  const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
  const bulkActions = document.querySelector('.bulk-actions');
  
  if (bulkActions) {
    bulkActions.style.display = checkedBoxes.length > 0 ? 'block' : 'none';
  }
}

// Add event listeners for checkboxes
document.addEventListener('DOMContentLoaded', function() {
  const itemCheckboxes = document.querySelectorAll('.item-checkbox');
  itemCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateBulkActionButtons);
  });
});

