// Form Validation JavaScript

// Validate Name
function checkName() {
  const nameInput = document.getElementById('Name1');
  const nameHelp = document.getElementById('nameHelp');
  
  if (nameInput) {
    const nameValue = nameInput.value.trim();
    
    if (nameValue.length < 2) {
      nameHelp.textContent = 'Name must be at least 2 characters';
      nameHelp.classList.add('text-danger');
      nameInput.classList.add('is-invalid');
      nameInput.classList.remove('is-valid');
      return false;
    } else {
      nameHelp.textContent = 'Looks good!';
      nameHelp.classList.remove('text-danger');
      nameHelp.classList.add('text-success');
      nameInput.classList.remove('is-invalid');
      nameInput.classList.add('is-valid');
      return true;
    }
  }
  return true;
}

// Validate Gender
function checkGender() {
  const genderInput = document.getElementById('Gender1');
  const genderHelp = document.getElementById('genderHelp');
  
  if (genderInput && genderHelp) {
    const genderValue = genderInput.value;
    
    if (genderValue === '') {
      genderHelp.textContent = 'Please select a gender';
      genderHelp.classList.add('text-danger');
      genderInput.classList.add('is-invalid');
      return false;
    } else {
      genderHelp.textContent = '';
      genderInput.classList.remove('is-invalid');
      genderInput.classList.add('is-valid');
      return true;
    }
  }
  return true;
}

// Validate Date
function checkDate1() {
  const dateInput = document.getElementById('date2') || document.getElementById('Date2');
  const dateHelp = document.getElementById('date2Help');
  
  if (dateInput && dateHelp) {
    const dateValue = dateInput.value;
    
    if (dateValue === '') {
      dateHelp.textContent = 'Please select a date';
      dateHelp.classList.add('text-danger');
      dateInput.classList.add('is-invalid');
      return false;
    } else {
      const selectedDate = new Date(dateValue);
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      
      if (age < 13 || age > 120) {
        dateHelp.textContent = 'Please enter a valid birth date';
        dateHelp.classList.add('text-danger');
        dateInput.classList.add('is-invalid');
        return false;
      }
      
      dateHelp.textContent = '';
      dateInput.classList.remove('is-invalid');
      dateInput.classList.add('is-valid');
      return true;
    }
  }
  return true;
}

// Validate Phone Number
function checkPhone() {
  const phoneInput = document.getElementById('phonenumber1') || document.getElementById('phonenumber');
  const phoneHelp = document.getElementById('phonenumberHelp');
  
  if (phoneInput) {
    const phoneValue = phoneInput.value.trim();
    const phonePattern = /^0[7][0-9]{8}$/;
    
    if (phoneValue === '') {
      if (phoneHelp) {
        phoneHelp.textContent = 'Phone number is required';
        phoneHelp.classList.add('text-danger');
      }
      phoneInput.classList.add('is-invalid');
      return false;
    } else if (!phonePattern.test(phoneValue)) {
      if (phoneHelp) {
        phoneHelp.textContent = 'Please enter a valid Ugandan phone number (e.g., 0700000000)';
        phoneHelp.classList.add('text-danger');
      }
      phoneInput.classList.add('is-invalid');
      return false;
    } else {
      if (phoneHelp) {
        phoneHelp.textContent = 'Valid phone number';
        phoneHelp.classList.remove('text-danger');
        phoneHelp.classList.add('text-success');
      }
      phoneInput.classList.remove('is-invalid');
      phoneInput.classList.add('is-valid');
      return true;
    }
  }
  return true;
}

// Validate NIN
function checkNin() {
  const ninInput = document.getElementById('Nin1');
  const ninHelp = document.getElementById('ninHelp');
  
  if (ninInput && ninHelp) {
    const ninValue = ninInput.value.trim();
    
    if (ninValue.length > 0 && ninValue.length < 14) {
      ninHelp.textContent = 'NIN should be 14 characters';
      ninHelp.classList.add('text-danger');
      ninInput.classList.add('is-invalid');
      return false;
    } else if (ninValue.length === 14) {
      ninHelp.textContent = '';
      ninInput.classList.remove('is-invalid');
      ninInput.classList.add('is-valid');
      return true;
    } else {
      ninHelp.textContent = '';
      ninInput.classList.remove('is-invalid');
      return true;
    }
  }
  return true;
}

// Validate Role
function checkRole() {
  const roleInput = document.getElementById('role1') || document.getElementById('role');
  const roleHelp = document.getElementById('roleHelp');
  
  if (roleInput) {
    const roleValue = roleInput.value;
    
    if (roleValue === '') {
      if (roleHelp) {
        roleHelp.textContent = 'Please select a role';
        roleHelp.classList.add('text-danger');
      }
      roleInput.classList.add('is-invalid');
      return false;
    } else {
      if (roleHelp) {
        roleHelp.textContent = '';
      }
      roleInput.classList.remove('is-invalid');
      roleInput.classList.add('is-valid');
      return true;
    }
  }
  return true;
}

// Validate User ID
function checkUserID() {
  const userIDInput = document.getElementById('UserID');
  const userIDHelp = document.getElementById('userIDHelp') || document.getElementById('usernameHelp');
  
  if (userIDInput) {
    const userIDValue = userIDInput.value.trim();
    
    if (userIDValue.length < 3) {
      if (userIDHelp) {
        userIDHelp.textContent = 'User ID must be at least 3 characters';
        userIDHelp.classList.add('text-danger');
      }
      userIDInput.classList.add('is-invalid');
      return false;
    } else {
      if (userIDHelp) {
        userIDHelp.textContent = '';
      }
      userIDInput.classList.remove('is-invalid');
      userIDInput.classList.add('is-valid');
      return true;
    }
  }
  return true;
}

// Validate Password
function checkPassword() {
  const passwordInput = document.getElementById('password');
  const passwordHelp = document.getElementById('passwordHelp');
  
  if (passwordInput) {
    const passwordValue = passwordInput.value;
    
    if (passwordValue.length < 6) {
      if (passwordHelp) {
        passwordHelp.textContent = 'Password must be at least 6 characters';
        passwordHelp.classList.add('text-danger');
      }
      passwordInput.classList.add('is-invalid');
      return false;
    } else {
      if (passwordHelp) {
        passwordHelp.textContent = 'Strong password';
        passwordHelp.classList.remove('text-danger');
        passwordHelp.classList.add('text-success');
      }
      passwordInput.classList.remove('is-invalid');
      passwordInput.classList.add('is-valid');
      return true;
    }
  }
  return true;
}

// Form submission validation
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      // Check all validation functions
      if (typeof checkName === 'function' && document.getElementById('Name1')) {
        isValid = checkName() && isValid;
      }
      if (typeof checkPhone === 'function' && (document.getElementById('phonenumber') || document.getElementById('phonenumber1'))) {
        isValid = checkPhone() && isValid;
      }
      if (typeof checkUserID === 'function' && document.getElementById('UserID')) {
        isValid = checkUserID() && isValid;
      }
      if (typeof checkPassword === 'function' && document.getElementById('password')) {
        isValid = checkPassword() && isValid;
      }
      
      // If form is invalid, prevent submission
      if (!isValid) {
        e.preventDefault();
        alert('Please fix the errors in the form before submitting.');
      }
    });
  });
});

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
  // Name validation
  const nameInput = document.getElementById('Name1');
  if (nameInput) {
    nameInput.addEventListener('input', checkName);
  }
  
  // Phone validation
  const phoneInput = document.getElementById('phonenumber1') || document.getElementById('phonenumber');
  if (phoneInput) {
    phoneInput.addEventListener('input', checkPhone);
  }
  
  // User ID validation
  const userIDInput = document.getElementById('UserID');
  if (userIDInput) {
    userIDInput.addEventListener('input', checkUserID);
  }
  
  // Password validation
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', checkPassword);
  }
});

