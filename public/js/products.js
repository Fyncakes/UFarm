// Enhanced Products Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initializeProducts();
  setupEventListeners();
  createScrollToTopButton();
});

function initializeProducts() {
  // Hide products beyond initial load (show first 8)
  const allProducts = document.querySelectorAll('.product-item');
  allProducts.forEach((product, index) => {
    if (index >= 8) {
      product.style.display = 'none';
    }
  });
  
  updateProductCount();
  updateLoadMoreButton();
}

function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }
  
  // Category filter
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryFilter);
  }
  
  // Sort select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSort);
  }
  
  // View toggle (Grid/List)
  const gridView = document.getElementById('gridView');
  const listView = document.getElementById('listView');
  const productsContainer = document.getElementById('productsContainer');
  
  if (gridView && listView) {
    gridView.addEventListener('click', () => {
      productsContainer.classList.remove('list-view');
      gridView.classList.add('active');
      listView.classList.remove('active');
    });
    
    listView.addEventListener('click', () => {
      productsContainer.classList.add('list-view');
      listView.classList.add('active');
      gridView.classList.remove('active');
    });
  }
  
  // Load More button
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', handleLoadMore);
  }
  
  // Clear filters
  const clearFilters = document.getElementById('clearFilters');
  if (clearFilters) {
    clearFilters.addEventListener('click', resetFilters);
  }
  
  // Wishlist buttons
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', handleWishlist);
  });
  
  // Add to cart forms
  const addToCartForms = document.querySelectorAll('.add-to-cart-form');
  addToCartForms.forEach(form => {
    form.addEventListener('submit', handleAddToCart);
  });
  
  // Quantity inputs
  const qtyInputs = document.querySelectorAll('.qty-input');
  qtyInputs.forEach(input => {
    input.addEventListener('change', validateQuantity);
  });
}

// Search Handler
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  const products = document.querySelectorAll('.product-item');
  let hasResults = false;
  
  products.forEach(product => {
    const title = product.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const seller = product.querySelector('.text-muted')?.textContent.toLowerCase() || '';
    const description = product.querySelector('.card-text')?.textContent.toLowerCase() || '';
    
    if (title.includes(searchTerm) || seller.includes(searchTerm) || description.includes(searchTerm)) {
      product.style.display = '';
      hasResults = true;
    } else {
      product.style.display = 'none';
    }
  });
  
  updateProductCount();
  toggleClearFilters();
  
  if (!hasResults && searchTerm) {
    showNoResults();
  } else {
    hideNoResults();
  }
}

// Category Filter Handler
function handleCategoryFilter(e) {
  const category = e.target.value.toLowerCase();
  const products = document.querySelectorAll('.product-item');
  
  products.forEach(product => {
    const title = product.querySelector('.card-title')?.textContent.toLowerCase() || '';
    
    if (category === 'all') {
      product.style.display = '';
    } else if (title.includes(category) || title.includes(category.slice(0, -1))) {
      product.style.display = '';
    } else {
      product.style.display = 'none';
    }
  });
  
  updateProductCount();
  toggleClearFilters();
}

// Sort Handler
function handleSort(e) {
  const sortBy = e.target.value;
  const container = document.getElementById('productsContainer');
  const products = Array.from(document.querySelectorAll('.product-item'));
  
  products.sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return getPrice(a) - getPrice(b);
      case 'price-high':
        return getPrice(b) - getPrice(a);
      case 'popular':
        return getRating(b) - getRating(a);
      case 'newest':
      default:
        return parseInt(b.dataset.index) - parseInt(a.dataset.index);
    }
  });
  
  products.forEach(product => container.appendChild(product));
}

// Load More Handler
function handleLoadMore(e) {
  const btn = e.target.closest('#loadMoreBtn');
  const loadedCount = parseInt(btn.dataset.loaded);
  const products = document.querySelectorAll('.product-item');
  const nextBatch = 8;
  let newlyLoaded = 0;
  
  // Show loading state
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Loading...';
  btn.disabled = true;
  
  setTimeout(() => {
    products.forEach((product, index) => {
      if (index >= loadedCount && index < loadedCount + nextBatch) {
        product.style.display = '';
        newlyLoaded++;
      }
    });
    
    const newLoadedCount = loadedCount + newlyLoaded;
    btn.dataset.loaded = newLoadedCount;
    
    updateProductCount();
    updateLoadMoreButton();
    
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    
    // Smooth scroll to first newly loaded item
    if (newlyLoaded > 0) {
      const firstNewProduct = products[loadedCount];
      firstNewProduct.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 500);
}

// Wishlist Handler
function handleWishlist(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  const icon = btn.querySelector('i');
  
  if (icon.classList.contains('far')) {
    icon.classList.remove('far');
    icon.classList.add('fas');
    btn.classList.add('active');
    showToast('Added to wishlist!', 'success');
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
    btn.classList.remove('active');
    showToast('Removed from wishlist', 'info');
  }
}

// Add to Cart Handler
function handleAddToCart(e) {
  const button = e.target.querySelector('button[type="submit"]');
  if (button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Adding...';
    button.disabled = true;
  }
}

// Quantity Validation
function validateQuantity(e) {
  const input = e.target;
  const max = parseInt(input.getAttribute('max'));
  const min = parseInt(input.getAttribute('min')) || 1;
  let value = parseInt(input.value);
  
  if (isNaN(value) || value < min) {
    input.value = min;
  } else if (value > max) {
    input.value = max;
    showToast(`Maximum ${max} units available`, 'warning');
  }
}

// Reset Filters
function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = 'all';
  document.getElementById('sortSelect').value = 'newest';
  
  const products = document.querySelectorAll('.product-item');
  products.forEach((product, index) => {
    if (index < 8) {
      product.style.display = '';
    } else {
      product.style.display = 'none';
    }
  });
  
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.dataset.loaded = '8';
  
  updateProductCount();
  updateLoadMoreButton();
  toggleClearFilters();
}

// Helper Functions
function getPrice(product) {
  const priceText = product.querySelector('.text-success')?.textContent || '0';
  return parseInt(priceText.replace(/[^0-9]/g, ''));
}

function getRating(product) {
  return product.querySelectorAll('.fa-star.text-warning').length || 0;
}

function updateProductCount() {
  const visible = document.querySelectorAll('.product-item:not([style*="display: none"])').length;
  const countBadge = document.getElementById('productCount');
  if (countBadge) {
    countBadge.innerHTML = `<span class="badge bg-success">${visible} Product${visible !== 1 ? 's' : ''}</span>`;
  }
}

function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!loadMoreBtn) return;
  
  const allProducts = document.querySelectorAll('.product-item');
  const visibleProducts = document.querySelectorAll('.product-item:not([style*="display: none"])').length;
  const remaining = allProducts.length - visibleProducts;
  
  if (remaining <= 0) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'inline-block';
    const badge = loadMoreBtn.querySelector('.badge');
    if (badge) {
      badge.textContent = `${remaining} more`;
    }
  }
}

function toggleClearFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const clearBtn = document.getElementById('clearFilters');
  
  if (clearBtn) {
    if (searchInput.value || categoryFilter.value !== 'all') {
      clearBtn.style.display = 'inline-block';
    } else {
      clearBtn.style.display = 'none';
    }
  }
}

function showNoResults() {
  let noResults = document.getElementById('noResults');
  if (!noResults) {
    noResults = document.createElement('div');
    noResults.id = 'noResults';
    noResults.className = 'col-12 text-center py-5';
    noResults.innerHTML = `
      <i class="fas fa-search fa-4x text-muted mb-3"></i>
      <h4>No products found</h4>
      <p class="text-muted">Try adjusting your search or filters</p>
    `;
    document.getElementById('productsContainer').appendChild(noResults);
  }
}

function hideNoResults() {
  const noResults = document.getElementById('noResults');
  if (noResults) noResults.remove();
}

function createScrollToTopButton() {
  const btn = document.createElement('button');
  btn.id = 'scrollToTop';
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.title = 'Scroll to top';
  document.body.appendChild(btn);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
  toast.style.zIndex = '9999';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

