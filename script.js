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
// USER AUTHENTICATION (Enhanced)
// ===================================

// Initialize Supabase Client (Lazy Load)
let supabase;
let currentUserEmail = ''; // Store email for OTP verification

function initializeAuth() {
    console.log('Initializing Auth...');

    // Check if Supabase SDK is loaded
    if (!window.supabase) {
        console.error('CRITICAL ERROR: Supabase SDK not loaded. Check your internet connection or ad blocker.');
        showAuthMessage('Authentication system failed to load. Please refresh the page.', 'error');
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
            if (event === 'SIGNED_IN') {
                // Redirect to welcome page on successful login
                window.location.href = 'welcome.html';
            } else {
                updateAuthUI(session);
            }
        });

        // Check initial session
        checkSession();

    } catch (err) {
        console.error('Auth Initialization Failed:', err);
        showAuthMessage('Authentication initialization failed.', 'error');
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
        // User is logged in - redirect to welcome page
        window.location.href = 'welcome.html';
    } else {
        // User is logged out
        renderLoggedOutView(loginContainer);
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
        <!-- Loading Spinner -->
        <div class="auth-loading" id="auth-loading" style="display: none;">
            <div class="spinner"></div>
            <p id="loading-text">Processing...</p>
        </div>

        <!-- Error/Success Messages -->
        <div class="auth-message" id="auth-message" style="display: none;"></div>

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
                    <span class="field-error" id="login-email-error"></span>
                </div>

                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" class="form-input" placeholder="Enter your password" required>
                    <span class="field-error" id="login-password-error"></span>
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
                    <span class="field-error" id="signup-email-error"></span>
                </div>

                <div class="form-group">
                    <label for="signup-password">Password</label>
                    <input type="password" id="signup-password" class="form-input" placeholder="Create a strong password (min 6 characters)" required>
                    <span class="field-error" id="signup-password-error"></span>
                </div>

                <div class="form-group">
                    <label for="signup-confirm">Confirm Password</label>
                    <input type="password" id="signup-confirm" class="form-input" placeholder="Re-enter your password" required>
                    <span class="field-error" id="signup-confirm-error"></span>
                </div>

                <label class="checkbox-label">
                    <input type="checkbox" id="terms-agree" required>
                    <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>

                <button type="submit" class="btn btn-primary btn-full">Create Account</button>
            </form>
        </div>

        <!-- OTP Verification Form (Hidden by default) -->
        <div class="auth-form-container" id="otp-form-container" style="display: none;">
            <div class="otp-header">
                <h2>Verify Your Email</h2>
                <p>We've sent a 6-digit code to <strong id="otp-email-display"></strong></p>
            </div>
            <form class="profile-form" id="otp-verification-form">
                <div class="otp-input-group">
                    <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" required>
                    <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" required>
                    <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" required>
                    <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" required>
                    <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" required>
                    <input type="text" class="otp-input" maxlength="1" pattern="[0-9]" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full">Verify Code</button>
                <button type="button" class="btn btn-secondary btn-full" id="resend-otp-btn">Resend Code</button>
                <button type="button" class="btn-link" id="back-to-login-btn">Back to Login</button>
            </form>
        </div>
    `;

    // Re-initialize listeners since we replaced DOM
    initializeProfileForms();
}

// Helper function to show loading state
function showLoading(message = 'Processing...') {
    const loadingEl = document.getElementById('auth-loading');
    const loadingText = document.getElementById('loading-text');
    if (loadingEl && loadingText) {
        loadingText.textContent = message;
        loadingEl.style.display = 'block';
    }
}

function hideLoading() {
    const loadingEl = document.getElementById('auth-loading');
    if (loadingEl) {
        loadingEl.style.display = 'none';
    }
}

// Helper function to show auth messages
function showAuthMessage(message, type = 'error') {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show OTP verification form
function showOTPVerification(email) {
    currentUserEmail = email;
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('otp-form-container').style.display = 'block';
    document.getElementById('otp-email-display').textContent = email;

    // Focus first OTP input
    const firstInput = document.querySelector('.otp-input');
    if (firstInput) firstInput.focus();
}

function initializeProfileForms() {
    console.log('Initializing Profile Forms Logic...');

    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form-container');
    const signupForm = document.getElementById('signup-form-container');
    const otpForm = document.getElementById('otp-form-container');

    if (loginTab && signupTab && loginForm && signupForm) {
        // Tab switching
        loginTab.onclick = () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            if (otpForm) otpForm.style.display = 'none';
        };

        signupTab.onclick = () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
            if (otpForm) otpForm.style.display = 'none';
        };
    }

    // Handle login form submission
    const loginFormElement = document.getElementById('profile-login-form');
    if (loginFormElement) {
        console.log('Attaching Login Listener');
        loginFormElement.onsubmit = async (e) => {
            e.preventDefault();
            console.log('Login Form Submitted');

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            // Validation
            if (!isValidEmail(email)) {
                showAuthMessage('Please enter a valid email address.', 'error');
                return;
            }

            if (password.length < 6) {
                showAuthMessage('Password must be at least 6 characters.', 'error');
                return;
            }

            try {
                showLoading('Logging in...');

                if (!supabase) throw new Error("Supabase client not initialized");

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    // Enhanced error handling
                    if (error.message.includes('Invalid login credentials')) {
                        showAuthMessage('Account not found or incorrect password. Please check your credentials or create an account.', 'error');
                    } else if (error.message.includes('Email not confirmed')) {
                        showAuthMessage('Please verify your email first. Check your inbox for the verification code.', 'error');
                        showOTPVerification(email);
                    } else {
                        showAuthMessage('Login failed: ' + error.message, 'error');
                    }
                    throw error;
                }

                // Success - redirect handled by onAuthStateChange
                showAuthMessage('Login successful! Redirecting...', 'success');

            } catch (error) {
                console.error('Login Error:', error);
            } finally {
                hideLoading();
            }
        };
    }

    // Handle signup form submission
    const signupFormElement = document.getElementById('profile-signup-form');
    if (signupFormElement) {
        console.log('Attaching Signup Listener');
        signupFormElement.onsubmit = async (e) => {
            e.preventDefault();
            console.log('Signup Form Submitted');

            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;

            // Validation
            if (!isValidEmail(email)) {
                showAuthMessage('Please enter a valid email address.', 'error');
                return;
            }

            if (password.length < 6) {
                showAuthMessage('Password must be at least 6 characters.', 'error');
                return;
            }

            if (password !== confirm) {
                showAuthMessage('Passwords do not match!', 'error');
                return;
            }

            try {
                showLoading('Creating account...');

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

                // Show OTP verification form
                showAuthMessage('Account created! Please check your email for the verification code.', 'success');
                showOTPVerification(email);

            } catch (error) {
                console.error('Signup Error:', error);
                if (error.message.includes('already registered')) {
                    showAuthMessage('This email is already registered. Please login instead.', 'error');
                } else {
                    showAuthMessage('Signup failed: ' + error.message, 'error');
                }
            } finally {
                hideLoading();
            }
        };
    }

    // Handle OTP verification
    const otpFormElement = document.getElementById('otp-verification-form');
    if (otpFormElement) {
        console.log('Attaching OTP Listener');

        // Auto-focus next input
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        otpFormElement.onsubmit = async (e) => {
            e.preventDefault();

            // Collect OTP code
            const otpCode = Array.from(otpInputs).map(input => input.value).join('');

            if (otpCode.length !== 6) {
                showAuthMessage('Please enter the complete 6-digit code.', 'error');
                return;
            }

            try {
                showLoading('Verifying code...');

                const { data, error } = await supabase.auth.verifyOtp({
                    email: currentUserEmail,
                    token: otpCode,
                    type: 'email'
                });

                if (error) throw error;

                showAuthMessage('Email verified successfully! Redirecting...', 'success');
                // Redirect handled by onAuthStateChange

            } catch (error) {
                console.error('OTP Verification Error:', error);
                showAuthMessage('Invalid or expired code. Please try again.', 'error');
                // Clear inputs
                otpInputs.forEach(input => input.value = '');
                otpInputs[0].focus();
            } finally {
                hideLoading();
            }
        };
    }

    // Resend OTP button
    const resendBtn = document.getElementById('resend-otp-btn');
    if (resendBtn) {
        let resendCooldown = false;
        resendBtn.onclick = async () => {
            if (resendCooldown) {
                showAuthMessage('Please wait before requesting another code.', 'error');
                return;
            }

            try {
                showLoading('Sending new code...');

                const { error } = await supabase.auth.signInWithOtp({
                    email: currentUserEmail
                });

                if (error) throw error;

                showAuthMessage('New code sent! Check your email.', 'success');

                // Set cooldown
                resendCooldown = true;
                resendBtn.disabled = true;
                resendBtn.textContent = 'Code Sent';

                setTimeout(() => {
                    resendCooldown = false;
                    resendBtn.disabled = false;
                    resendBtn.textContent = 'Resend Code';
                }, 60000); // 60 second cooldown

            } catch (error) {
                console.error('Resend Error:', error);
                showAuthMessage('Failed to resend code. Please try again.', 'error');
            } finally {
                hideLoading();
            }
        };
    }

    // Back to login button
    const backBtn = document.getElementById('back-to-login-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            document.getElementById('otp-form-container').style.display = 'none';
            document.getElementById('login-form-container').style.display = 'block';
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
