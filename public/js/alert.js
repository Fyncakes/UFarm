// Alert and Notification Functions

function alertText() {
  // Show success alert
  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  alert.style.zIndex = '9999';
  alert.innerHTML = `
    <strong>Success!</strong> Your form has been submitted.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alert);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Show custom alert
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertDiv.style.zIndex = '9999';
  alertDiv.style.minWidth = '300px';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alertDiv);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 150);
  }, 5000);
}

// Confirm dialog
function confirmAction(message, callback) {
  if (confirm(message)) {
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  }
  return false;
}

// Loading indicator
function showLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loadingOverlay';
  loadingDiv.className = 'loading-overlay';
  loadingDiv.innerHTML = `
    <div class="spinner-border text-success" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  document.body.appendChild(loadingDiv);
}

function hideLoading() {
  const loadingDiv = document.getElementById('loadingOverlay');
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// Toast notification
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer') || createToastContainer();
  
  const toastDiv = document.createElement('div');
  toastDiv.className = `toast align-items-center text-white bg-${type} border-0`;
  toastDiv.setAttribute('role', 'alert');
  toastDiv.setAttribute('aria-live', 'assertive');
  toastDiv.setAttribute('aria-atomic', 'true');
  toastDiv.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  
  toastContainer.appendChild(toastDiv);
  
  const toast = new bootstrap.Toast(toastDiv, { delay: 3000 });
  toast.show();
  
  toastDiv.addEventListener('hidden.bs.toast', function() {
    toastDiv.remove();
  });
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
}

// Auto-dismiss alerts after page load
document.addEventListener('DOMContentLoaded', function() {
  const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
  alerts.forEach(alert => {
    setTimeout(() => {
      const closeBtn = alert.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.click();
      }
    }, 5000);
  });
});

