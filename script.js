/**
 * script.js
 * Advanced client-side interactivity for the Artisanal Crafts website.
 *
 * This script includes:
 * - A simulated backend API using localStorage for data persistence.
 * - Dynamic rendering for products, blog posts, and reviews.
 * - User authentication (login/register/logout) simulation.
 * - Shopping cart and wishlist functionality.
 * - Real-time search and filtering.
 * - Interactive UI elements like modals and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOCK BACKEND API & DATABASE ---
    // In a real application, this data would come from a server.
    // We use localStorage to simulate a persistent database.

    const mockApi = {
        _products: [
             {
                id: '1', name: 'Handwoven Cotton Scarf', price: 699, category: 'apparel',
                image: 'biking.jpg',
                description: 'A soft and lightweight handwoven cotton scarf, perfect for adding a touch of elegance to any outfit. Made with natural dyes and traditional weaving techniques by artisans from Rajasthan.',
                details: { material: '100% Organic Cotton', dimensions: '180cm x 70cm', origin: 'Jaipur, Rajasthan', craft: 'Handloom Weaving' },
                care: 'Hand wash separately in cold water with a mild detergent. Do not bleach. Dry in shade.',
                featured: true
            },
            {
                id: '2', name: 'Terracotta Vase', price: 1299, category: 'home-decor',
                image: 'https://via.placeholder.com/400x300.png?text=Terracotta+Vase',
                description: 'An exquisitely crafted terracotta vase, featuring intricate hand-carved patterns. Ideal for fresh flowers or as a standalone decorative piece, bringing an earthy charm to your space.',
                details: { material: 'Natural Clay (Terracotta)', dimensions: '25cm Height', origin: 'Molela, Rajasthan', craft: 'Pottery, Hand-Carving' },
                care: 'Wipe with a soft, dry cloth. Do not use water on the exterior.',
                featured: true
            },
            {
                id: '3', name: 'Bamboo Basket Set', price: 1999, category: 'baskets',
                image: 'https://via.placeholder.com/400x300.png?text=Bamboo+Basket',
                description: 'A versatile set of three eco-friendly bamboo baskets. Handwoven with sturdy bamboo, they are perfect for organizing your home, storing crafts, or as decorative planters.',
                details: { material: '100% Natural Bamboo', dimensions: 'Set of 3 (S, M, L)', origin: 'Tripura', craft: 'Bamboo Weaving' },
                care: 'Wipe clean with a damp cloth. Keep away from direct sunlight and moisture.',
                featured: false
            },
            {
                id: '4', name: 'Hand-Painted Wall Art', price: 3499, category: 'art',
                image: 'https://via.placeholder.com/400x300.png?text=Wall+Art',
                description: 'A vibrant, hand-painted wall art piece that adds a unique artistic flair to any room. Each piece is an original creation, showcasing traditional motifs and contemporary design elements.',
                details: { material: 'Canvas, Acrylic Paints', dimensions: '60cm x 80cm', origin: 'Madhubani, Bihar', craft: 'Madhubani Painting' },
                care: 'Dust lightly with a dry cloth. Avoid exposure to moisture.',
                featured: true
            }
        ],
        _blogPosts: [
            {
                id: '1', title: 'The Art of Handicrafts: A Journey Through Traditions', date: 'June 15, 2025', author: 'Admin',
                image: 'biking.jpg', tags: ['art', 'heritage'],
                content: `<p>Handicrafts are more than just items; they are stories, histories, and cultural expressions passed down through generations. From the intricate weaves of traditional textiles to the vibrant patterns of Indian pottery, every piece tells a unique tale of its origin and its maker.</p><p>As we dive deeper into the world of handicrafts, we discover the immense skill and patience it takes to create them. These are not just products but labors of love that connect us to the past while adapting to the trends of the modern world.</p><blockquote>"Craftsmanship names an enduring, basic human impulse, the desire to do a job well for its own sake." - Richard Sennett</blockquote><p>Supporting handicrafts means supporting the artisans behind them, preserving their art, and celebrating the cultural heritage they represent. When you purchase a handmade item, you're not just buying an object; you're acquiring a piece of history and contributing to the livelihood of a skilled craftsperson. Explore the rich world of handicrafts and let yourself be inspired by the artistry and dedication they embody.</p>`
            },
            {
                id: '2', title: '5 Tips for Caring for Your Handmade Products', date: 'June 10, 2025', author: 'Admin',
                image: 'https://via.placeholder.com/800x400.png?text=Product+Care', tags: ['tips', 'product-care'],
                content: `<p>Handmade products require a little extra love. Follow these tips to ensure your treasures last a lifetime...</p><h4>1. Read the Care Instructions</h4><p>Always check for specific care instructions provided with the product. Different materials require different care.</p><h4>2. Gentle Cleaning is Key</h4><p>For most textiles, gentle hand washing in cold water is best. For pottery or wood items, a soft, dry cloth is usually sufficient.</p><h4>3. Avoid Harsh Chemicals</h4><p>Bleach and strong detergents can damage natural fibers and colors. Opt for mild, eco-friendly soaps.</p><h4>4. Store Properly</h4><p>Keep your items away from direct sunlight and damp environments to prevent fading and damage.</p><h4>5. Embrace Imperfections</h4><p>The small variations and imperfections in handmade items are part of their unique charm and story. Handle them with care and appreciate their beauty.</p>`
            },
            {
                id: '3', title: 'Empowering Artisans, One Craft at a Time', date: 'May 30, 2025', author: 'Community Manager',
                image: 'https://via.placeholder.com/800x400.png?text=Our+Artisans', tags: ['artisans', 'community'],
                content: `<p>Our mission goes beyond selling products. We are committed to creating sustainable livelihoods for our artisan partners. By ensuring fair wages and ethical working conditions, we empower them to not only continue their craft but also to build a better future for their families and communities.</p><p>Every purchase you make has a direct impact, helping to preserve ancient traditions and support the incredible individuals who keep these arts alive.</p>`
            }
        ],

        // Use a function to get data to simulate an async API call
        getProducts: function() {
            return new Promise(resolve => setTimeout(() => resolve(this._products), 200));
        },
        getProductById: function(id) {
            return new Promise(resolve => {
                const product = this._products.find(p => p.id === id);
                setTimeout(() => resolve(product), 200);
            });
        },
        getBlogPosts: function() {
            return new Promise(resolve => setTimeout(() => resolve(this._blogPosts), 200));
        },
        getBlogPostById: function(id) {
             return new Promise(resolve => {
                const post = this._blogPosts.find(p => p.id === id);
                setTimeout(() => resolve(post), 200);
            });
        },
        
        // Simulated User & Data Management
        _getFromStorage: (key) => JSON.parse(localStorage.getItem(key)) || [],
        _saveToStorage: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        
        registerUser: function(email, password) {
            return new Promise((resolve, reject) => {
                const users = this._getFromStorage('users');
                if (users.find(u => u.email === email)) {
                    reject('User with this email already exists.');
                } else {
                    users.push({ email, password });
                    this._saveToStorage('users', users);
                    resolve('Registration successful!');
                }
            });
        },
        
        loginUser: function(email, password) {
            return new Promise((resolve, reject) => {
                const users = this._getFromStorage('users');
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    this._saveToStorage('currentUser', user);
                    resolve(user);
                } else {
                    reject('Invalid email or password.');
                }
            });
        },

        logoutUser: function() {
            localStorage.removeItem('currentUser');
        },
        
        getCurrentUser: function() {
            return this._getFromStorage('currentUser');
        },

        getReviews: function(productId) {
            const allReviews = this._getFromStorage('reviews');
            return allReviews.filter(r => r.productId === productId);
        },

        postReview: function(productId, userName, rating, comment) {
             const allReviews = this._getFromStorage('reviews');
             allReviews.push({ productId, userName, rating, comment, date: new Date().toLocaleDateString() });
             this._saveToStorage('reviews', allReviews);
             return this.getReviews(productId);
        },

        getWishlist: function() {
            return this._getFromStorage('wishlist');
        },
        
        toggleWishlist: function(productId) {
            let wishlist = this.getWishlist();
            const index = wishlist.indexOf(productId);
            if (index > -1) {
                wishlist.splice(index, 1); // Remove
            } else {
                wishlist.push(productId); // Add
            }
            this._saveToStorage('wishlist', wishlist);
            return wishlist;
        }
    };

    // --- 2. STATE MANAGEMENT ---
    let cart = JSON.parse(localStorage.getItem('artisanalCraftsCart')) || [];
    let currentUser = mockApi.getCurrentUser();
    let wishlist = currentUser ? mockApi.getWishlist() : [];

    // --- 3. UI ELEMENT SELECTORS ---
    const ui = {
        header: document.querySelector('.main-header'),
        hamburger: document.getElementById('hamburger-menu'),
        navList: document.querySelector('.main-nav'),
        backToTopButton: document.getElementById('back-to-top'),
        // Modals & Notifications
        cartModalContainer: document.getElementById('cart-modal'),
        authModalContainer: document.getElementById('auth-modal'),
        toastContainer: document.getElementById('toast-container'),
        // Header actions
        cartIconLink: document.querySelector('.cart-icon-link'),
        cartCountSpan: document.getElementById('cart-count'),
        userAccountLink: document.getElementById('user-account-link'),
        // Page specific containers
        shopGrid: document.getElementById('shop-grid'),
        blogGrid: document.getElementById('blog-grid'),
        featuredGrid: document.getElementById('featured-products-grid'),
        productDetailContainer: document.getElementById('product-detail-container'),
        relatedProductsGrid: document.getElementById('related-products-grid'),
        articleContainer: document.getElementById('article-container'),
        wishlistGrid: document.getElementById('wishlist-grid'),
    };
    
    // --- 4. RENDER & UI FUNCTIONS ---

    const showToast = (message, type = 'info') => {
        if (!ui.toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        ui.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    const openModal = (modalContainer, content) => {
        modalContainer.innerHTML = content;
        modalContainer.classList.add('show');
        document.body.style.overflow = 'hidden';
        modalContainer.querySelector('.close-button')?.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) closeModal();
        });
    };

    const closeModal = () => {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
            modal.innerHTML = '';
        });
        document.body.style.overflow = '';
    };

    const renderProductCard = (product) => {
        const isWishlisted = wishlist.includes(product.id);
        return `
            <div class="grid-item" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-name="${product.name}">
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
                    <i class="fas fa-heart"></i>
                </button>
                <a href="product-detail.html?id=${product.id}" class="product-image-link">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </a>
                <div class="grid-item-content">
                    <a href="product-detail.html?id=${product.id}">
                        <h3>${product.name}</h3>
                    </a>
                    <p class="price">₹${product.price.toLocaleString()}</p>
                    <div class="product-actions">
                        <button class="btn btn-secondary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline">Details</a>
                    </div>
                </div>
            </div>`;
    };

    const renderBlogPostCard = (post) => `
        <div class="grid-item" data-tags="${post.tags.join(',')}">
            <a href="article.html?id=${post.id}">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="grid-item-content">
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100).replace('<p>','')}...</p>
                    <small>${post.date}</small>
                </div>
            </a>
        </div>
    `;

    const updateCartDisplay = () => {
        // Update header cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (ui.cartCountSpan) {
            ui.cartCountSpan.textContent = totalItems;
            ui.cartCountSpan.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        mockApi._saveToStorage('artisanalCraftsCart', cart);
    };

    const renderCartModal = () => {
        let total = 0;
        const cartItemsHtml = cart.length === 0 
            ? '<p class="empty-cart-message">Your cart is currently empty.</p>'
            : cart.map(item => {
                const product = mockApi._products.find(p => p.id === item.id);
                if (!product) return '';
                total += product.price * item.quantity;
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${product.name}</h4>
                            <p class="price">₹${product.price.toLocaleString()}</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button data-id="${product.id}" data-action="decrease" aria-label="Decrease quantity">-</button>
                                <span>${item.quantity}</span>
                                <button data-id="${product.id}" data-action="increase" aria-label="Increase quantity">+</button>
                            </div>
                            <p class="cart-item-price">₹${(product.price * item.quantity).toLocaleString()}</p>
                        </div>
                    </div>`;
            }).join('');

        const modalContent = `
            <div class="modal-content cart-content">
                <button class="close-button" aria-label="Close cart modal">&times;</button>
                <h2>Your Shopping Cart</h2>
                <div id="cart-items">${cartItemsHtml}</div>
                <div class="cart-summary">
                    <p>Total: <span id="cart-total">₹${total.toLocaleString()}</span></p>
                    <button class="btn btn-primary checkout-button" ${cart.length === 0 ? 'disabled' : ''}>Proceed to Checkout</button>
                </div>
            </div>`;
        
        openModal(ui.cartModalContainer, modalContent);
    };
    
    const renderAuthModal = (form = 'login') => {
        const loginForm = `
            <form id="login-form">
                <h2>Login</h2>
                <div class="form-field">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-field">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <p class="form-link">Don't have an account? <a id="show-register">Register here</a></p>
            </form>`;

        const registerForm = `
            <form id="register-form">
                <h2>Register</h2>
                <div class="form-field">
                    <label for="register-email">Email</label>
                    <input type="email" id="register-email" required>
                </div>
                <div class="form-field">
                    <label for="register-password">Password</label>
                    <input type="password" id="register-password" minlength="6" required>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
                <p class="form-link">Already have an account? <a id="show-login">Login here</a></p>
            </form>`;

        const modalContent = `
            <div class="modal-content auth-content">
                <button class="close-button">&times;</button>
                ${form === 'login' ? loginForm : registerForm}
            </div>`;

        openModal(ui.authModalContainer, modalContent);
    };

    const updateUserAccountLink = () => {
        if (!ui.userAccountLink) return;
        if (currentUser && Object.keys(currentUser).length > 0) {
            ui.userAccountLink.href = 'user-profile.html';
            ui.userAccountLink.innerHTML = `<i class="fas fa-user-check"></i>`;
        } else {
            ui.userAccountLink.href = '#';
            ui.userAccountLink.innerHTML = `<i class="fas fa-user"></i>`;
        }
    };

    // --- 5. CORE LOGIC & EVENT HANDLERS ---
    
    function handleGlobalClicks(e) {
        // Add to Cart
        if (e.target.matches('.add-to-cart')) {
            e.preventDefault();
            const id = e.target.dataset.id;
            const product = mockApi._products.find(p => p.id === id);
            if (product) {
                const existingItem = cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ id, quantity: 1 });
                }
                updateCartDisplay();
                showToast(`${product.name} added to cart!`, 'success');
                ui.cartCountSpan.classList.add('bounce');
                setTimeout(() => ui.cartCountSpan.classList.remove('bounce'), 500);
            }
        }
        
        // Wishlist
        if (e.target.matches('.wishlist-btn, .wishlist-btn *')) {
            e.preventDefault();
            const button = e.target.closest('.wishlist-btn');
            const productId = button.dataset.id;
            if (!currentUser || Object.keys(currentUser).length === 0) {
                showToast('Please log in to use the wishlist.', 'error');
                renderAuthModal('login');
                return;
            }
            wishlist = mockApi.toggleWishlist(productId);
            button.classList.toggle('active');
            const isWishlisted = wishlist.includes(productId);
            showToast(isWishlisted ? 'Added to wishlist!' : 'Removed from wishlist.');

            // If on wishlist page, remove the item
            if (document.body.contains(ui.wishlistGrid)) {
                initProfilePage();
            }
        }
        // Buy Now button
if (e.target.matches('.buy-now')) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const product = mockApi._products.find(p => p.id === id);
    if (product) {
        // Add to cart logic (similar to add-to-cart, but then proceeds to checkout)
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, quantity: 1 });
        }
        updateCartDisplay();
        showToast(`${product.name} ready for immediate purchase! Redirecting...`, 'success');
        
        // Simulate immediate checkout or redirection
        // In a real application, this would trigger a direct checkout flow
        setTimeout(() => {
            window.location.href = 'checkout.html'; // Redirect to a hypothetical checkout page
        }, 1000); // Redirect after a short delay
    }
}
        
        // Cart quantity change
        if (e.target.matches('.cart-item-quantity button')) {
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex > -1) {
                if (action === 'increase') {
                    cart[itemIndex].quantity++;
                } else if (action === 'decrease') {
                    cart[itemIndex].quantity--;
                    if (cart[itemIndex].quantity <= 0) {
                        cart.splice(itemIndex, 1);
                    }
                }
                updateCartDisplay();
                renderCartModal(); // Re-render the modal content
            }
        }
        
        // Cart icon click
        if (e.target.closest('.cart-icon-link')) {
            e.preventDefault();
            renderCartModal();
        }

        // Auth modal toggles
        if (e.target.matches('#show-register')) {
            e.preventDefault();
            renderAuthModal('register');
        }
        if (e.target.matches('#show-login')) {
            e.preventDefault();
            renderAuthModal('login');
        }
        
        // User account link
        if (e.target.closest('#user-account-link')) {
            e.preventDefault();
            if (!currentUser || Object.keys(currentUser).length === 0) {
                renderAuthModal('login');
            } else {
                window.location.href = 'user-profile.html';
            }
        }

        // Checkout button
        if(e.target.matches('.checkout-button')) {
            e.preventDefault();
             if (!currentUser || Object.keys(currentUser).length === 0) {
                showToast('Please log in to proceed to checkout.', 'error');
                renderAuthModal('login');
            } else {
                showToast('Checkout functionality is not implemented in this demo.', 'info');
            }
        }
    }
    
    function handleGlobalSubmits(e) {
        e.preventDefault();
        
        // Login form
        if (e.target.matches('#login-form')) {
            const email = e.target.querySelector('#login-email').value;
            const password = e.target.querySelector('#login-password').value;
            mockApi.loginUser(email, password)
                .then(user => {
                    currentUser = user;
                    wishlist = mockApi.getWishlist();
                    updateUserAccountLink();
                    closeModal();
                    showToast(`Welcome back!`, 'success');
                    // Refresh wishlist states on the page
                    document.querySelectorAll('.wishlist-btn').forEach(btn => {
                        btn.classList.toggle('active', wishlist.includes(btn.dataset.id));
                    });
                })
                .catch(error => showToast(error, 'error'));
        }

        // Register form
        if (e.target.matches('#register-form')) {
            const email = e.target.querySelector('#register-email').value;
            const password = e.target.querySelector('#register-password').value;
             mockApi.registerUser(email, password)
                .then(message => {
                    showToast(message, 'success');
                    renderAuthModal('login'); // Switch to login form
                })
                .catch(error => showToast(error, 'error'));
        }

        // Review form
        if (e.target.matches('#review-form')) {
            const comment = e.target.querySelector('#review-text').value;
            const rating = e.target.dataset.rating;
            const productId = e.target.dataset.productId;
            if (!rating || rating === '0') {
                showToast('Please select a star rating.', 'error');
                return;
            }
            if (!comment.trim()) {
                showToast('Please enter your review.', 'error');
                return;
            }
            
            mockApi.postReview(productId, currentUser.email.split('@')[0], rating, comment);
            showToast('Thank you for your review!', 'success');
            initProductDetailPage(); // Re-initialize to show new review
        }
    }

    // --- 6. PAGE-SPECIFIC INITIALIZATION ---

    async function initHomePage() {
        if (!ui.featuredGrid) return;
        const products = await mockApi.getProducts();
        const featured = products.filter(p => p.featured);
        ui.featuredGrid.innerHTML = featured.map(renderProductCard).join('');
    }

    async function initShopPage() {
        if (!ui.shopGrid) return;
        const products = await mockApi.getProducts();
        
        const categoryFilter = document.getElementById('category-filter');
        const sortBy = document.getElementById('sort-by');
        const searchInput = document.getElementById('product-search');
        const noProductsMessage = document.getElementById('no-products-message');

        let allShopItems = [...products];

        function displayProducts() {
            let filteredItems = [...allShopItems];
            const category = categoryFilter.value;
            const searchTerm = searchInput.value.toLowerCase();
            
            // Filter
            if (category !== 'all') {
                filteredItems = filteredItems.filter(item => item.category === category);
            }
            if (searchTerm) {
                 filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(searchTerm));
            }

            // Sort
            switch (sortBy.value) {
                case 'price-asc': filteredItems.sort((a, b) => a.price - b.price); break;
                case 'price-desc': filteredItems.sort((a, b) => b.price - a.price); break;
                case 'name-asc': filteredItems.sort((a, b) => a.name.localeCompare(b.name)); break;
                case 'name-desc': filteredItems.sort((a, b) => b.name.localeCompare(a.name)); break;
            }

            ui.shopGrid.innerHTML = filteredItems.length > 0 ? filteredItems.map(renderProductCard).join('') : '';
            noProductsMessage.style.display = filteredItems.length === 0 ? 'block' : 'none';
        }

        categoryFilter.addEventListener('change', displayProducts);
        sortBy.addEventListener('change', displayProducts);
        searchInput.addEventListener('input', displayProducts);
        
        displayProducts(); // Initial render
    }

    async function initProductDetailPage() {
        if (!ui.productDetailContainer) return;

        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        const product = await mockApi.getProductById(productId);

        if (product) {
            document.title = `${product.name} - Artisanal Crafts`;
            const isWishlisted = wishlist.includes(product.id);
            ui.productDetailContainer.innerHTML = `
                <div class="container">
                    <div class="product-detail-layout">
                        <div class="product-image-gallery">
                            <img src="${product.image}" alt="${product.name}" class="main-product-image">
                        </div>
                        <div class="product-info">
                            <h1 class="product-title">${product.name}</h1>
                            <p class="product-price">₹${product.price.toLocaleString()}</p>
                            <p class="product-short-description">${product.description}</p>
                            <div class="product-purchase-actions">
                                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                                <button class="btn btn-secondary buy-now" data-id="${product.id}">Buy Now</button>
                                <button class="btn btn-outline wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}">
                                    <i class="fas fa-heart"></i> ${isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                                </button>
                            </div>
                            <div class="product-details-accordion">
                                <div class="accordion-item">
                                    <h3>Product Details</h3>
                                    <ul>
                                        ${Object.entries(product.details).map(([key, value]) => `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="accordion-item">
                                    <h3>Care Instructions</h3>
                                    <p>${product.care}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

            // Related products
            const allProducts = await mockApi.getProducts();
            const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
            ui.relatedProductsGrid.innerHTML = related.map(renderProductCard).join('');

            // Reviews
            renderReviews(productId);
        } else {
            ui.productDetailContainer.innerHTML = '<div class="container"><p class="info-message">Product not found. Please <a href="shop.html">return to the shop</a>.</p></div>';
        }
    }

    function renderReviews(productId) {
        const reviews = mockApi.getReviews(productId);
        const reviewsList = document.getElementById('reviews-list');
        const reviewsSummary = document.getElementById('reviews-summary');
        
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;
            reviewsSummary.innerHTML = `Average Rating: ${avgRating.toFixed(1)}/5 (${reviews.length} reviews)`;
            reviewsList.innerHTML = reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${review.userName}</span>
                        <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    <p class="review-text">${review.comment}</p>
                    <small class="review-date">${review.date}</small>
                </div>
            `).join('');
        } else {
            reviewsSummary.innerHTML = 'No reviews yet.';
            reviewsList.innerHTML = '';
        }

        // Render review form if user is logged in
        const reviewFormContainer = document.getElementById('review-form-container');
        if (currentUser && Object.keys(currentUser).length > 0) {
            reviewFormContainer.innerHTML = `
                <h3>Write a Review</h3>
                <form id="review-form" data-product-id="${productId}" data-rating="0">
                    <div class="form-field">
                        <label>Your Rating</label>
                        <div class="star-rating-input">
                            <i class="fas fa-star" data-value="1"></i>
                            <i class="fas fa-star" data-value="2"></i>
                            <i class="fas fa-star" data-value="3"></i>
                            <i class="fas fa-star" data-value="4"></i>
                            <i class="fas fa-star" data-value="5"></i>
                        </div>
                    </div>
                    <div class="form-field">
                        <label for="review-text">Your Review</label>
                        <textarea id="review-text" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Review</button>
                </form>
            `;
            // Add star rating interactivity
            const stars = reviewFormContainer.querySelectorAll('.star-rating-input .fa-star');
            stars.forEach(star => {
                star.addEventListener('mouseover', (e) => {
                    const rating = e.target.dataset.value;
                    stars.forEach(s => s.classList.toggle('selected', s.dataset.value <= rating));
                });
                star.addEventListener('mouseout', () => {
                     const currentRating = document.getElementById('review-form').dataset.rating;
                     stars.forEach(s => s.classList.toggle('selected', s.dataset.value <= currentRating));
                });
                star.addEventListener('click', (e) => {
                    const rating = e.target.dataset.value;
                    document.getElementById('review-form').dataset.rating = rating;
                });
            });
        } else {
            reviewFormContainer.innerHTML = '<p>Please <a href="#" id="login-for-review">log in</a> to write a review.</p>';
            document.getElementById('login-for-review')?.addEventListener('click', e => {
                e.preventDefault();
                renderAuthModal('login');
            });
        }
    }

    async function initBlogPage() {
        if (!ui.blogGrid) return;
        const posts = await mockApi.getBlogPosts();
        const tagCloud = document.getElementById('blog-tag-cloud');
        const searchInput = document.getElementById('blog-search');
        const noArticlesMessage = document.getElementById('no-articles-message');

        // Populate tags
        const allTags = [...new Set(posts.flatMap(p => p.tags))];
        tagCloud.innerHTML = `<span class="tag active" data-tag="all">All</span>` + allTags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('');

        function displayPosts() {
            const activeTag = tagCloud.querySelector('.tag.active').dataset.tag;
            const searchTerm = searchInput.value.toLowerCase();
            let filteredPosts = [...posts];

            if (activeTag !== 'all') {
                filteredPosts = filteredPosts.filter(p => p.tags.includes(activeTag));
            }
            if (searchTerm) {
                filteredPosts = filteredPosts.filter(p => p.title.toLowerCase().includes(searchTerm) || p.content.toLowerCase().includes(searchTerm));
            }

            ui.blogGrid.innerHTML = filteredPosts.length > 0 ? filteredPosts.map(renderBlogPostCard).join('') : '';
            noArticlesMessage.style.display = filteredPosts.length === 0 ? 'block' : 'none';
        }

        tagCloud.addEventListener('click', (e) => {
            if (e.target.matches('.tag')) {
                tagCloud.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                displayPosts();
            }
        });
        searchInput.addEventListener('input', displayPosts);

        displayPosts(); // Initial render
    }
    
    async function initArticlePage() {
        if (!ui.articleContainer) return;
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
        const post = await mockApi.getBlogPostById(postId);

        if (post) {
            document.title = `${post.title} - Artisanal Crafts`;
            ui.articleContainer.innerHTML = `
                <header class="article-header">
                    <h1>${post.title}</h1>
                    <p class="article-meta">Published on ${post.date} | By ${post.author}</p>
                </header>
                <img src="${post.image}" alt="${post.title}" style="width:100%; border-radius: 8px; margin-bottom: 30px;" loading="eager">
                <section class="article-content">${post.content}</section>
                <section class="article-footer" style="margin-top: 40px;">
                    <a href="blog.html" class="btn btn-outline">← Back to Blog</a>
                </section>
            `;
        } else {
            ui.articleContainer.innerHTML = '<p class="info-message">Article not found.</p>';
        }
    }
    
    async function initProfilePage() {
        if (!document.getElementById('profile-hero')) return;
        // Auth guard
        if (!currentUser || Object.keys(currentUser).length === 0) {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('profile-hero').innerHTML = `
            <h1>Welcome, ${currentUser.email.split('@')[0]}</h1>
            <p>Manage your account details and view your saved items.</p>`;
        
        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', e => {
            e.preventDefault();
            mockApi.logoutUser();
            currentUser = null;
            wishlist = [];
            showToast('You have been logged out.');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });

        // Render wishlist
        const products = await mockApi.getProducts();
        const wishlistItems = products.filter(p => wishlist.includes(p.id));
        const noWishlistMessage = document.getElementById('no-wishlist-message');
        
        ui.wishlistGrid.innerHTML = wishlistItems.length > 0 ? wishlistItems.map(renderProductCard).join('') : '';
        noWishlistMessage.style.display = wishlistItems.length === 0 ? 'block' : 'none';
    }


    // --- 7. GENERAL INITIALIZATION ---
    function init() {
        // Global event listeners
        document.addEventListener('click', handleGlobalClicks);
        document.addEventListener('submit', handleGlobalSubmits);

        // Sticky header
        if (ui.header) {
            window.addEventListener('scroll', () => {
                ui.header.classList.toggle('scrolled', window.scrollY > 50);
            });
        }
        
        // Hamburger menu
        
         if (ui.hamburger && ui.navList) {
            ui.hamburger.addEventListener('click', () => {
            ui.navList.classList.toggle('active');
               });
}

        // Back to top button
        if (ui.backToTopButton) {
            window.addEventListener('scroll', () => {
                ui.backToTopButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
            });
            ui.backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }

        // Update UI based on initial state
        updateCartDisplay();
        updateUserAccountLink();
        
        // Page-specific initializers
        if (document.body.contains(ui.featuredGrid)) initHomePage();
        if (document.body.contains(ui.shopGrid)) initShopPage();
        if (document.body.contains(ui.productDetailContainer)) initProductDetailPage();
        if (document.body.contains(ui.blogGrid)) initBlogPage();
        if (document.body.contains(ui.articleContainer)) initArticlePage();
        if (document.body.contains(document.getElementById('profile-hero'))) initProfilePage();
    }

    // Run the app
    init();
});
// Placeholder for specific account page JavaScript initialization (myaccount.html)
        document.addEventListener('DOMContentLoaded', () => {
            const accountNavLinks = document.querySelectorAll('.account-nav-link');
            const accountTabs = document.querySelectorAll('.account-tab');
            const logoutBtn = document.getElementById('logout-btn');

            function showTab(tabId) {
                accountTabs.forEach(tab => {
                    tab.classList.toggle('active', tab.id === tabId);
                    tab.classList.toggle('hidden', tab.id !== tabId);
                });
                accountNavLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.tab === tabId);
                });
            }

            accountNavLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showTab(link.dataset.tab);
                });
            });

            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to log out?')) {
                    if (typeof mockApi !== 'undefined' && typeof mockApi.logoutUser === 'function') {
                        mockApi.logoutUser();
                        updateUserAccountLink(); // Update header link
                        window.location.href = 'index.html'; // Redirect to home or login
                    } else {
                        alert('Logout functionality not available. Please ensure script.js is loaded.');
                    }
                }
            });

            // Simulate loading user data, orders, wishlist etc.
            function loadAccountData() {
                if (typeof mockApi !== 'undefined' && typeof mockApi.getCurrentUser === 'function') {
                    const currentUser = mockApi.getCurrentUser();
                    if (currentUser) {
                        document.getElementById('profile-name').textContent = currentUser.name || currentUser.email;
                        document.getElementById('profile-email').textContent = currentUser.email;
                        document.getElementById('profile-member-since').textContent = new Date(currentUser.memberSince).toLocaleDateString();

                        // Load Orders (simulated)
                        const orderList = document.getElementById('order-list');
                        const noOrdersMessage = document.getElementById('no-orders-message');
                        const orders = mockApi._get('orders') || []; // Assuming mockApi stores orders
                        if (orders.length > 0) {
                            noOrdersMessage.style.display = 'none';
                            orderList.innerHTML = '';
                            orders.forEach(order => {
                                const orderDiv = document.createElement('div');
                                orderDiv.classList.add('order-item');
                                orderDiv.innerHTML = `
                                    <h3>Order ID: ${order.id}</h3>
                                    <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
                                    <p>Total: $${order.total.toFixed(2)}</p>
                                    <p>Status: ${order.status}</p>
                                    <a href="#" class="btn btn-sm btn-secondary view-order-details" data-order-id="${order.id}">View Details</a>
                                `;
                                orderList.appendChild(orderDiv);
                            });
                            // Add event listeners for view details
                            orderList.querySelectorAll('.view-order-details').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    alert('Viewing details for Order ID: ' + e.target.dataset.orderId);
                                    // In a real app, open a modal or navigate to a dedicated order detail page
                                });
                            });
                        } else {
                            noOrdersMessage.style.display = 'block';
                        }

                        // Load Wishlist (simulated)
                        const wishlistItemsContainer = document.getElementById('wishlist-items');
                        const emptyWishlistMessage = document.getElementById('empty-wishlist-message');
                        const wishlist = mockApi.getWishlist();
                        if (wishlist.length > 0) {
                            emptyWishlistMessage.style.display = 'none';
                            wishlistItemsContainer.innerHTML = '';
                            wishlist.forEach(productId => {
                                const product = mockApi.getProducts().find(p => p.id === productId);
                                if (product) {
                                    const productCard = document.createElement('div');
                                    productCard.classList.add('product-card'); // Use existing product card style
                                    productCard.innerHTML = `
                                        <a href="product-detail.html?id=${product.id}">
                                            <img src="${product.image}" alt="${product.name}">
                                            <h3>${product.name}</h3>
                                            <p class="price">$${product.price.toFixed(2)}</p>
                                        </a>
                                        <button class="btn btn-sm btn-remove-from-wishlist" data-product-id="${product.id}">Remove</button>
                                        <button class="btn btn-sm btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                                    `;
                                    wishlistItemsContainer.appendChild(productCard);
                                }
                            });
                            // Add event listeners for remove from wishlist and add to cart
                            wishlistItemsContainer.querySelectorAll('.btn-remove-from-wishlist').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    const productId = e.target.dataset.productId;
                                    mockApi.removeFromWishlist(productId);
                                    loadAccountData(); // Re-load to update wishlist display
                                    showToast('Item removed from wishlist!', 'success');
                                });
                            });
                             wishlistItemsContainer.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    const productId = e.target.dataset.productId;
                                    const product = mockApi.getProducts().find(p => p.id === productId);
                                    if(product) {
                                        mockApi.addToCart(product);
                                        updateCartDisplay(); // from script.js
                                        showToast('Item added to cart!', 'success');
                                    }
                                });
                            });
                        } else {
                            emptyWishlistMessage.style.display = 'block';
                        }
                    } else {
                        // User not logged in, redirect to login or show message
                        document.querySelector('.my-account-section').innerHTML = `
                            <p class="info-message">You need to be logged in to view this page. <a href="#" id="open-auth-modal">Log In / Register</a></p>
                        `;
                         document.getElementById('open-auth-modal').addEventListener('click', (e) => {
                            e.preventDefault();
                            if (typeof openAuthModal === 'function') {
                                openAuthModal(); // From script.js
                            }
                        });
                    }
                } else {
                    document.querySelector('.my-account-section').innerHTML = `
                        <p class="info-message">Error loading account data. Please ensure script.js is correctly loaded.</p>
                    `;
                }
            }

            // Set initial tab based on URL hash or default to profile
            const initialTab = window.location.hash ? window.location.hash.substring(1) : 'profile';
            showTab(initialTab);
            loadAccountData();
        });

 // Placeholder for specific cart page JavaScript initialization
        document.addEventListener('DOMContentLoaded', () => {
            // This function would be in script.js and handle rendering cart items
            if (typeof initCartPage === 'function') {
                initCartPage();
            }
        });


        // Placeholder for specific checkout page JavaScript initialization
        document.addEventListener('DOMContentLoaded', () => {
            let currentStep = 1;
            const steps = document.querySelectorAll('.checkout-step');
            const progressSteps = document.querySelectorAll('.checkout-progress .progress-step');
            const checkoutForm = document.getElementById('checkout-form');
            const placeOrderBtn = document.getElementById('place-order-btn');
            const paymentMethodSelect = document.getElementById('paymentMethod');
            const creditCardFields = document.getElementById('credit-card-fields');

            function showStep(stepNum) {
                steps.forEach((step, index) => {
                    step.classList.toggle('hidden', index + 1 !== stepNum);
                });
                progressSteps.forEach((pStep, index) => {
                    pStep.classList.toggle('active', index + 1 === stepNum);
                });
                currentStep = stepNum;
            }

            function validateStep(stepNum) {
                let isValid = true;
                const currentStepElement = document.getElementById(getStepId(stepNum));
                const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error'); // Add some visual cue
                    } else {
                        input.classList.remove('error');
                    }
                });

                if (stepNum === 2 && paymentMethodSelect.value === 'credit-card') {
                    const cardInputs = creditCardFields.querySelectorAll('input[type="text"]');
                    cardInputs.forEach(input => {
                        if (!input.value.trim()) {
                            isValid = false;
                            input.classList.add('error');
                        } else {
                            input.classList.remove('error');
                        }
                    });
                }
                return isValid;
            }

            function getStepId(stepNum) {
                switch(stepNum) {
                    case 1: return 'shipping-step';
                    case 2: return 'payment-step';
                    case 3: return 'review-step';
                    default: return '';
                }
            }

            document.querySelectorAll('.next-step-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const nextStep = parseInt(button.dataset.step);
                    if (validateStep(currentStep)) {
                         // Populate review details before showing review step
                        if (nextStep === 3) {
                            populateReviewStep();
                        }
                        showStep(nextStep);
                    } else {
                        alert('Please fill in all required fields.'); // Basic validation feedback
                    }
                });
            });

            document.querySelectorAll('.prev-step-btn').forEach(button => {
                button.addEventListener('click', () => {
                    showStep(parseInt(button.dataset.step));
                });
            });

            paymentMethodSelect.addEventListener('change', () => {
                if (paymentMethodSelect.value === 'credit-card') {
                    creditCardFields.style.display = 'block';
                    creditCardFields.querySelectorAll('input').forEach(input => input.setAttribute('required', 'required'));
                } else {
                    creditCardFields.style.display = 'none';
                    creditCardFields.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
                }
            });

            function populateReviewStep() {
                document.getElementById('review-shipping-address').innerHTML = `
                    ${document.getElementById('fullName').value}<br>
                    ${document.getElementById('address1').value}<br>
                    ${document.getElementById('address2').value ? document.getElementById('address2').value + '<br>' : ''}
                    ${document.getElementById('city').value}, ${document.getElementById('state').value} ${document.getElementById('zipCode').value}<br>
                    ${document.getElementById('country').options[document.getElementById('country').selectedIndex].text}
                `;
                document.getElementById('review-payment-method').textContent = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;

                // This part would ideally come from script.js's cart data
                const reviewOrderItems = document.getElementById('review-order-items');
                reviewOrderItems.innerHTML = '<p>Loading cart items...</p>'; // Placeholder
                if (typeof mockApi !== 'undefined' && typeof mockApi.getCart === 'function') {
                    const cart = mockApi.getCart();
                    if (cart.length > 0) {
                        reviewOrderItems.innerHTML = ''; // Clear placeholder
                        let subtotal = 0;
                        cart.forEach(item => {
                            const itemElement = document.createElement('div');
                            itemElement.classList.add('review-item');
                            const itemPrice = item.price * item.quantity;
                            subtotal += itemPrice;
                            itemElement.innerHTML = `
                                <span>${item.name} x ${item.quantity}</span>
                                <span>$${itemPrice.toFixed(2)}</span>
                            `;
                            reviewOrderItems.appendChild(itemElement);
                        });
                        document.getElementById('review-subtotal').textContent = `$${subtotal.toFixed(2)}`;
                        // Simple dummy shipping for now
                        const shippingCost = subtotal > 0 ? 15.00 : 0.00;
                        document.getElementById('review-shipping').textContent = `$${shippingCost.toFixed(2)}`;
                        document.getElementById('review-total').textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
                    } else {
                        reviewOrderItems.innerHTML = '<p>No items in cart to review.</p>';
                        document.getElementById('review-subtotal').textContent = '$0.00';
                        document.getElementById('review-shipping').textContent = '$0.00';
                        document.getElementById('review-total').textContent = '$0.00';
                        placeOrderBtn.disabled = true; // Disable if no items
                    }
                } else {
                     reviewOrderItems.innerHTML = '<p>Error loading cart data. Please ensure script.js is correctly loaded.</p>';
                }
            }


            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    // This is where you'd send the order data to your backend
                    alert('Order Placed Successfully! (Simulation)');
                    // In a real app, clear cart and redirect to order confirmation
                    if (typeof mockApi !== 'undefined' && typeof mockApi.clearCart === 'function') {
                        mockApi.clearCart();
                        updateCartDisplay(); // Update cart count in header
                    }
                    window.location.href = 'order-confirmation.html';
                } else {
                    alert('Please complete all required fields before placing your order.');
                }
            });

            // Initial display
            showStep(1);
        });
// Placeholder for specific contact page JavaScript
        document.addEventListener('DOMContentLoaded', () => {
            const contactForm = document.getElementById('contact-form');
            const formMessage = document.getElementById('form-message');

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // In a real application, you would send this form data to a server
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());

                console.log('Contact form submitted:', data);

                formMessage.style.display = 'block';
                formMessage.style.color = 'var(--primary-color)';
                formMessage.textContent = 'Sending your message...';

                // Simulate API call
                setTimeout(() => {
                    formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                    formMessage.style.color = 'green'; // Success color
                    contactForm.reset();
                }, 2000);
            });
        });

        // FAQ Accordion JavaScript
        document.addEventListener('DOMContentLoaded', () => {
            const faqQuestions = document.querySelectorAll('.faq-question');

            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const answer = question.nextElementSibling;
                    const icon = question.querySelector('i');

                    // Close all other open answers
                    faqQuestions.forEach(otherQuestion => {
                        if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                            otherQuestion.classList.remove('active');
                            otherQuestion.nextElementSibling.classList.remove('open');
                            otherQuestion.nextElementSibling.style.maxHeight = '0';
                            otherQuestion.querySelector('i').classList.remove('active');
                        }
                    });

                    // Toggle current answer
                    question.classList.toggle('active');
                    answer.classList.toggle('open');
                    icon.classList.toggle('active');

                    if (answer.classList.contains('open')) {
                        // Set max-height to scrollHeight to allow smooth transition for variable content
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = '0';
                    }
                });
            });
        });
        // Placeholder for specific order confirmation page JavaScript initialization
        document.addEventListener('DOMContentLoaded', () => {
            // In a real application, you would fetch order details from a server
            // For this simulation, we'll try to get the last cart state or display a generic message.
            const confirmedOrderItems = document.getElementById('confirmed-order-items');
            const confirmedSubtotal = document.getElementById('confirmed-subtotal');
            const confirmedShipping = document.getElementById('confirmed-shipping');
            const confirmedTotal = document.getElementById('confirmed-total');

            if (typeof mockApi !== 'undefined' && typeof mockApi.getCart === 'function') {
                const cart = mockApi.getCart(); // Assuming cart was just cleared after checkout
                // In a real scenario, you'd have an order ID and fetch the order details
                // For demonstration, let's pretend the last cart was the confirmed order
                if (cart.length > 0) {
                    confirmedOrderItems.innerHTML = '';
                    let subtotal = 0;
                    cart.forEach(item => {
                        const itemElement = document.createElement('div');
                        itemElement.classList.add('review-item');
                        const itemPrice = item.price * item.quantity;
                        subtotal += itemPrice;
                        itemElement.innerHTML = `
                            <span>${item.name} x ${item.quantity}</span>
                            <span>$${itemPrice.toFixed(2)}</span>
                        `;
                        confirmedOrderItems.appendChild(itemElement);
                    });
                    const shippingCost = subtotal > 0 ? 15.00 : 0.00; // Dummy shipping
                    confirmedSubtotal.textContent = `$${subtotal.toFixed(2)}`;
                    confirmedShipping.textContent = `$${shippingCost.toFixed(2)}`;
                    confirmedTotal.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
                } else {
                    confirmedOrderItems.innerHTML = '<p>No recent order details found. Please check your account.</p>';
                    confirmedSubtotal.textContent = '$0.00';
                    confirmedShipping.textContent = '$0.00';
                    confirmedTotal.textContent = '$0.00';
                }
            } else {
                confirmedOrderItems.innerHTML = '<p>Order details could not be loaded. Please ensure script.js is correctly loaded.</p>';
            }
        });

        

        