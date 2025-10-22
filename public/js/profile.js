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
  
  // Profile image preview
  const profileImageInput = document.getElementById('profileImage');
  if (profileImageInput) {
    profileImageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const preview = document.querySelector('.profile-avatar') || 
                         document.querySelector('.profile-avatar-placeholder');
          if (preview) {
            if (preview.tagName === 'IMG') {
              preview.src = e.target.result;
            } else {
              const img = document.createElement('img');
              img.src = e.target.result;
              img.className = 'profile-avatar';
              preview.replaceWith(img);
            }
          }
        };
        reader.readAsDataURL(file);
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

