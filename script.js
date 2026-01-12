// ===================================
// CHASED E-Commerce - Interactive Features
// ===================================

// Cart State Management
let cart = [];
let cartCount = 0;

// Image viewer state
let currentRotation = 0;
let currentZoom = 1;

// Initialize when DOM is loaded
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('CHASED Website Initializing...');
    try {
        initializeSidebar();
    } catch (e) { console.error('Error initializing sidebar:', e); }

    try {
        initializeCart();
    } catch (e) { console.error('Error initializing cart:', e); }

    try {
        initializeAuth();
    } catch (e) { console.error('Error initializing auth:', e); }

    try {
        initializeSellMenu();
    } catch (e) { console.error('Error initializing sell menu:', e); }

    try {
        initializeImageViewer();
    } catch (e) { console.error('Error initializing image viewer:', e); }

    try {
        initializeNavigation();
    } catch (e) { console.error('Error initializing navigation:', e); }

    try {
        initializeHeaderSearch();
    } catch (e) { console.error('Error initializing header search:', e); }

    try {
        initializeProfileForms();
    } catch (e) { console.error('Error initializing profile forms:', e); }

    try {
        initializeProductCategories();
    } catch (e) { console.error('Error initializing product categories:', e); }

    try {
        initializeHeaderInteractions();
    } catch (e) { console.error('Error initializing header interactions:', e); }

    try {
        initializeMobileCart();
    } catch (e) { console.error('Error initializing mobile cart:', e); }

    // Set home section as default landing page
    navigateToSection('home');
    console.log('CHASED Website Initialization Complete');
});

function initializeMobileCart() {
    const mobileCartBtn = document.getElementById('cart-link-mobile');
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showCartModal();
        });
    }
}

// ===================================
// SIDEBAR TOGGLE
// ===================================
function initializeSidebar() {
    const popButton = document.getElementById('popButton');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (popButton && sidebar && mainContent) {
        popButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            mainContent.classList.toggle('expanded');

            // Change icon based on state
            const icon = popButton.querySelector('i');
            if (sidebar.classList.contains('hidden')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-list-ul');
            } else {
                icon.classList.remove('fa-list-ul');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// ===================================
// SHOPPING CART FUNCTIONALITY
// ===================================
function initializeCart() {
    // Add cart icon to page if not exists
    createCartIcon();

    // Add click handlers to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Add click handlers to cart overlay buttons
    const cartOverlayButtons = document.querySelectorAll('.cart-overlay-btn');
    cartOverlayButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

function createCartIcon() {
    // Check if cart icon already exists
    if (document.getElementById('floating-cart')) return;

    const cartHTML = `
        <div class="cart-icon-container" id="floating-cart">
            <button class="cart-button" id="cart-btn">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" id="cart-count">0</span>
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', cartHTML);

    // Add click handler to show cart modal
    document.getElementById('cart-btn').addEventListener('click', showCartModal);
}

function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    // Find the product card
    const productCard = event.target.closest('.product-card');
    if (!productCard) return;

    // Extract product information
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('.product-image').src;

    // Create product object
    const product = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    };

    // Add to cart
    cart.push(product);
    cartCount++;

    // Update cart count
    updateCartCount();

    // Visual feedback
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    button.style.backgroundColor = '#28a745';

    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
    }, 1500);
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    const mobileCountElement = document.getElementById('cart-count-mobile');

    if (countElement) {
        countElement.textContent = cartCount;
        countElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            countElement.style.transform = 'scale(1)';
        }, 200);
    }

    if (mobileCountElement) {
        mobileCountElement.textContent = cartCount;
        mobileCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            mobileCountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function showCartModal() {
    // Check if modal already exists
    let cartModal = document.getElementById('cart-modal');

    if (!cartModal) {
        const modalHTML = `
            <div class="modal" id="cart-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Shopping Cart</h2>
                        <button class="modal-close" id="close-cart-modal">&times;</button>
                    </div>
                    <div class="cart-items" id="cart-items-container"></div>
                    <div class="cart-total">
                        <h3>Total: <span id="cart-total-amount">£0</span></h3>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-primary">Proceed to Checkout</button>
                        <button class="btn btn-secondary" id="close-cart-btn">Continue Shopping</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        cartModal = document.getElementById('cart-modal');

        document.getElementById('close-cart-modal').addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        document.getElementById('close-cart-btn').addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

    // Update cart display
    updateCartDisplay();

    // Show modal
    cartModal.classList.add('active');
}

function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total-amount');

    if (!container || !totalElement) return;

    // Clear container
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem;">Your cart is empty</p>';
        totalElement.textContent = '£0';
        return;
    }

    // Add cart items
    let total = 0;
    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace('£', ''));
        total += price;

        const itemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });

    totalElement.textContent = `£${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    cartCount--;
    updateCartCount();
    updateCartDisplay();
}

// ===================================
// USER AUTHENTICATION
// ===================================


// Initialize Supabase Client (Lazy Load)
let supabase;

function initializeAuth() {
    console.log('Initializing Auth...');

    // Check if Supabase SDK is loaded
    if (!window.supabase) {
        console.error('CRITICAL ERROR: Supabase SDK not loaded. Check your internet connection or ad blocker.');
        alert('Authentication system failed to load. Please refresh the page.');
        return;
    }

    try {
        const supabaseUrl = 'https://keznpnwibyphyvjbslox.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlem5wbndpYnlwaHl2amJzbG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxODE0MzIsImV4cCI6MjA4Mzc1NzQyMn0.efisBO6y3ySFV9InD2boDIIWpBnFVpKfsMBGH7K9OTM';

        // Initialize client only if not already done
        if (!supabase) {
            supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
            console.log('Supabase Client Connected');
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth State Change:', event, session);
            updateAuthUI(session);
        });

        // Check initial session
        checkSession();

    } catch (err) {
        console.error('Auth Initialization Failed:', err);
    }
}

async function checkSession() {
    if (!supabase) return;
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        updateAuthUI(session);
    } catch (e) {
        console.error('Error checking session:', e);
    }
}

function updateAuthUI(session) {
    const loginContainer = document.querySelector('.profile-container');

    if (session) {
        // User is logged in
        renderLoggedInView(session.user, loginContainer);
    } else {
        // User is logged out
        renderLoggedOutView(loginContainer);
    }
}

function renderLoggedInView(user, container) {
    if (!container) return;
    const userEmail = user.email;
    const userName = user.user_metadata.full_name || 'User';

    container.innerHTML = `
        <div class="header">
            <h1 class="header-title">Welcome Back</h1>
            <p class="header-subtitle">${userName}</p>
        </div>
        
        <div class="user-dashboard" style="text-align: center; margin-top: 2rem;">
            <div class="user-avatar" style="width: 80px; height: 80px; background: #333; color: #fff; border-radius: 50%; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                ${userName.charAt(0).toUpperCase()}
            </div>
            <p style="margin-bottom: 2rem; color: #666;">${userEmail}</p>
            
            <div class="dashboard-actions">
                <button id="logout-btn" class="btn btn-secondary">Sign Out</button>
            </div>
        </div>
    `;

    // Attach logout listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const { error } = await supabase.auth.signOut();
            if (error) alert('Error signing out: ' + error.message);
        });
    }
}

function renderLoggedOutView(container) {
    if (!container) return;

    // check if login form already exists to avoid unnecessary re-render
    if (document.getElementById('profile-login-form')) {
        console.log('Logged out view already current, skipping render');
        // Ensure listeners are attached even if we don't re-render
        initializeProfileForms();
        return;
    }

    // Restore original login forms
    container.innerHTML = `
        <div class="header">
            <h1 class="header-title">Your Account</h1>
            <p class="header-subtitle">Login or create a new account to get started</p>
        </div>

        <div class="auth-tabs">
            <button class="auth-tab active" id="login-tab">Login</button>
            <button class="auth-tab" id="signup-tab">Create Account</button>
        </div>

        <!-- Login Form -->
        <div class="auth-form-container" id="login-form-container">
            <form class="profile-form" id="profile-login-form">
                <div class="form-group">
                    <label for="login-email">Email Address</label>
                    <input type="email" id="login-email" class="form-input" placeholder="your@email.com" required>
                </div>

                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" class="form-input" placeholder="Enter your password" required>
                </div>

                <div class="form-options">
                    <label class="checkbox-label">
                        <input type="checkbox" id="remember-me">
                        <span>Remember me</span>
                    </label>
                    <a href="#" class="forgot-password">Forgot Password?</a>
                </div>

                <button type="submit" class="btn btn-primary btn-full">Login</button>
            </form>
        </div>

        <!-- Create Account Form -->
        <div class="auth-form-container" id="signup-form-container" style="display: none;">
            <form class="profile-form" id="profile-signup-form">
                <div class="form-group">
                    <label for="signup-name">Full Name</label>
                    <input type="text" id="signup-name" class="form-input" placeholder="John Doe" required>
                </div>

                <div class="form-group">
                    <label for="signup-email">Email Address</label>
                    <input type="email" id="signup-email" class="form-input" placeholder="your@email.com" required>
                </div>

                <div class="form-group">
                    <label for="signup-password">Password</label>
                    <input type="password" id="signup-password" class="form-input" placeholder="Create a strong password" required>
                </div>

                <div class="form-group">
                    <label for="signup-confirm">Confirm Password</label>
                    <input type="password" id="signup-confirm" class="form-input" placeholder="Re-enter your password" required>
                </div>

                <label class="checkbox-label">
                    <input type="checkbox" id="terms-agree" required>
                    <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>

                <button type="submit" class="btn btn-primary btn-full">Create Account</button>
            </form>
        </div>
    `;

    // Re-initialize listeners since we replaced DOM
    initializeProfileForms();
}

function initializeProfileForms() {
    console.log('Initializing Profile Forms Logic...');

    // Remove old listeners to prevent duplicates (not easily possible with anon functions, 
    // but the check above prevents re-rendering which is the main cause)

    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form-container');
    const signupForm = document.getElementById('signup-form-container');

    if (loginTab && signupTab && loginForm && signupForm) {
        // Tab switching
        loginTab.onclick = () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        };

        signupTab.onclick = () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
        };
    }

    // Handle login form submission
    const loginFormElement = document.getElementById('profile-login-form');
    if (loginFormElement) {
        console.log('Attaching Login Listener');
        // Use onclick on the button instead of submit on form to be safer? 
        // No, form submit is better for enter key support. 
        // We set onsubmit property to avoid multiple listeners if this function is called multiple times
        loginFormElement.onsubmit = async (e) => {
            e.preventDefault();
            console.log('Login Form Submitted');
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const btn = loginFormElement.querySelector('button');
            const originalText = btn.textContent;

            try {
                btn.textContent = 'Logging in...';
                btn.disabled = true;

                if (!supabase) throw new Error("Supabase client not initialized");

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;
                // Success handled by onAuthStateChange
            } catch (error) {
                console.error('Login Error:', error);
                alert('Login failed: ' + error.message);
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        };
    } else {
        console.error('Login Form Element NOT FOUND');
    }

    // Handle signup form submission
    const signupFormElement = document.getElementById('profile-signup-form');
    if (signupFormElement) {
        console.log('Attaching Signup Listener');
        signupFormElement.onsubmit = async (e) => {
            e.preventDefault();
            console.log('Signup Form Submitted');
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            const btn = signupFormElement.querySelector('button');
            const originalText = btn.textContent;

            if (password !== confirm) {
                alert('Passwords do not match!');
                return;
            }

            try {
                btn.textContent = 'Creating Account...';
                btn.disabled = true;

                if (!supabase) throw new Error("Supabase client not initialized");

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });

                if (error) throw error;

                if (data.session) {
                    alert('Account created! You are now logged in.');
                } else {
                    alert('Account created! Please check your email to confirm your account.');
                }

            } catch (error) {
                console.error('Signup Error:', error);
                alert('Signup failed: ' + error.message);
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        };
    }
}

// ===================================
// PRODUCT CATEGORIES (Dresses, Footwear, Tops, Pants)
// ===================================
function initializeProductCategories() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const placeholder = document.getElementById('category-placeholder');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const categoryName = tab.getAttribute('data-category');

            // Hide placeholder
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show selected category content
            const allCategories = document.querySelectorAll('.category-content');
            allCategories.forEach(cat => {
                cat.style.display = 'none';
                cat.classList.remove('active');
            });

            const selectedCategory = document.getElementById(`${categoryName}-category`);
            if (selectedCategory) {
                selectedCategory.style.display = 'block';
                selectedCategory.classList.add('active');
            }
        });
    });
}
