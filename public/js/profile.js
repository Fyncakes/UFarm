// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Password confirmation validation
  const securityForm = document.getElementById('securityForm');
  if (securityForm) {
    securityForm.addEventListener('submit', function(e) {
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (newPassword !== confirmPassword) {
        e.preventDefault();
        alert('New password and confirm password do not match!');
        return false;
      }
    });
  }
  
  // Enhanced Profile image preview
  const profileImageInput = document.getElementById('profileImage');
  const imagePreview = document.getElementById('imagePreview');
  const preview = document.getElementById('preview');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const removeImageBtn = document.getElementById('removeImage');
  
  // Maximum file size: 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  
  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  // Validate file
  function validateFile(file) {
    if (!file) return false;
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      profileImageInput.value = '';
      return false;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG, or GIF image.');
      profileImageInput.value = '';
      return false;
    }
    
    return true;
  }
  
  if (profileImageInput) {
    profileImageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        if (!validateFile(file)) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
          // Show preview in form
          if (preview && imagePreview) {
            preview.src = e.target.result;
            imagePreview.style.display = 'block';
            if (removeImageBtn) removeImageBtn.style.display = 'block';
            
            // Show file info
            if (fileName && fileSize && fileInfo) {
              fileName.textContent = file.name;
              fileSize.textContent = formatFileSize(file.size);
              fileInfo.style.display = 'block';
            }
          }
          
          // Also update sidebar preview if exists
          const sidebarPreview = document.querySelector('.profile-avatar') || 
                               document.querySelector('.profile-avatar-placeholder');
          if (sidebarPreview) {
            if (sidebarPreview.tagName === 'IMG') {
              sidebarPreview.src = e.target.result;
            } else {
              const img = document.createElement('img');
              img.src = e.target.result;
              img.className = 'profile-avatar mb-3';
              img.style.cssText = 'width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 3px solid #28a745;';
              sidebarPreview.replaceWith(img);
            }
          }
        };
        reader.onerror = function() {
          alert('Error reading file. Please try again.');
        };
        reader.readAsDataURL(file);
      } else {
        if (imagePreview) imagePreview.style.display = 'none';
        if (fileInfo) fileInfo.style.display = 'none';
        if (removeImageBtn) removeImageBtn.style.display = 'none';
      }
    });
  }
  
  // Remove image button
  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', function() {
      if (confirm('Remove this image?')) {
        profileImageInput.value = '';
        if (imagePreview) imagePreview.style.display = 'none';
        if (fileInfo) fileInfo.style.display = 'none';
        removeImageBtn.style.display = 'none';
        if (preview) preview.src = '';
      }
    });
  }
  
  // Support drag and drop
  const uploadContainer = document.querySelector('.image-upload-container');
  if (uploadContainer) {
    uploadContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
      uploadContainer.style.border = '2px dashed #28a745';
    });
    
    uploadContainer.addEventListener('dragleave', function(e) {
      e.preventDefault();
      uploadContainer.style.border = '';
    });
    
    uploadContainer.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadContainer.style.border = '';
      const files = e.dataTransfer.files;
      if (files.length > 0 && profileImageInput) {
        profileImageInput.files = files;
        const event = new Event('change', { bubbles: true });
        profileImageInput.dispatchEvent(event);
      }
    });
  }
  
  // Form validation
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      
      if (!username || !email) {
        e.preventDefault();
        alert('Username and email are required!');
        return false;
      }
      
      // Show loading state
      const submitBtn = profileForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Saving...';
      submitBtn.disabled = true;
    });
  }
});

