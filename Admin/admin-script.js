document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ADMIN API (interacts with same localStorage as main site) ---
    const adminApi = {
        _get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
        _save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),

        // Products
        getProducts: () => adminApi._get('products'),
        addProduct: (product) => {
            const products = adminApi.getProducts();
            product.id = Date.now().toString(); // Simple unique ID
            products.push(product);
            adminApi._save('products', products);
        },
        updateProduct: (updatedProduct) => {
            let products = adminApi.getProducts();
            products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            adminApi._save('products', products);
        },
        deleteProduct: (id) => {
            let products = adminApi.getProducts();
            products = products.filter(p => p.id !== id);
            adminApi._save('products', products);
        },

        // Blog Posts
        getBlogPosts: () => adminApi._get('blogPosts'),
        addBlogPost: (post) => {
            const posts = adminApi.getBlogPosts();
            post.id = Date.now().toString();
            posts.push(post);
            adminApi._save('blogPosts', posts);
        },
        updateBlogPost: (updatedPost) => {
            let posts = adminApi.getBlogPosts();
            posts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
            adminApi._save('blogPosts', posts);
        },
        deleteBlogPost: (id) => {
            let posts = adminApi.getBlogPosts();
            posts = posts.filter(p => p.id !== id);
            adminApi._save('blogPosts', posts);
        },
        
        // Users & Reviews
        getUsers: () => adminApi._get('users'),
        deleteUser: (email) => {
            let users = adminApi.getUsers();
            users = users.filter(u => u.email !== email);
            adminApi._save('users', users);
        },
        getReviews: () => adminApi._get('reviews'),
        deleteReview: (productId, comment) => {
            let reviews = adminApi.getReviews();
            reviews = reviews.filter(r => !(r.productId === productId && r.comment === comment));
            adminApi._save('reviews', reviews);
        },
    };

    // --- 2. UI SELECTORS & STATE ---
    const ui = {
        viewTitle: document.getElementById('view-title'),
        contentArea: document.getElementById('content-area'),
        navLinks: document.querySelectorAll('.nav-link'),
        modal: document.getElementById('form-modal'),
    };
    let currentView = 'dashboard';
    let quillEditor;

    // --- 3. RENDERING FUNCTIONS ---
    
    // Main View Router
    const renderView = (view) => {
        currentView = view;
        ui.viewTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
        ui.navLinks.forEach(link => link.classList.toggle('active', link.dataset.view === view));

        switch(view) {
            case 'dashboard': renderDashboardView(); break;
            case 'products': renderProductsView(); break;
            case 'blog': renderBlogView(); break;
            case 'reviews': renderReviewsView(); break;
            case 'users': renderUsersView(); break;
        }
    };

    const renderDashboardView = () => {
        const productCount = adminApi.getProducts().length;
        const blogCount = adminApi.getBlogPosts().length;
        const reviewCount = adminApi.getReviews().length;
        const userCount = adminApi.getUsers().length;
        ui.contentArea.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card products">
                    <div class="icon"><i class="fas fa-box-open"></i></div>
                    <div class="info"><h4>Total Products</h4><p>${productCount}</p></div>
                </div>
                 <div class="stat-card blog">
                    <div class="icon"><i class="fas fa-feather-alt"></i></div>
                    <div class="info"><h4>Blog Posts</h4><p>${blogCount}</p></div>
                </div>
                 <div class="stat-card reviews">
                    <div class="icon"><i class="fas fa-star"></i></div>
                    <div class="info"><h4>Total Reviews</h4><p>${reviewCount}</p></div>
                </div>
                 <div class="stat-card users">
                    <div class="icon"><i class="fas fa-users"></i></div>
                    <div class="info"><h4>Registered Users</h4><p>${userCount}</p></div>
                </div>
            </div>`;
    };

    const renderProductsView = () => {
        const products = adminApi.getProducts();
        const tableRows = products.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>₹${p.price}</td>
                <td>${p.category}</td>
                <td>
                    <i class="fas fa-star featured-toggle ${p.featured}" data-id="${p.id}" title="Toggle Featured"></i>
                </td>
                <td class="actions">
                    <button class="edit-btn" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${p.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        
        ui.contentArea.innerHTML = `
            <div class="content-header">
                <h2>All Products</h2>
                <button class="btn btn-primary" id="add-product-btn">Add New Product</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Featured</th><th>Actions</th></tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>`;
    };

    const renderBlogView = () => {
        const posts = adminApi.getBlogPosts();
        const tableRows = posts.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>${p.author}</td>
                <td>${p.date}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${p.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        
        ui.contentArea.innerHTML = `
            <div class="content-header">
                <h2>All Blog Posts</h2>
                <button class="btn btn-primary" id="add-blog-btn">Add New Post</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>`;
    };

    const renderReviewsView = () => {
         const reviews = adminApi.getReviews();
         const tableRows = reviews.map(r => `
            <tr>
                <td>${r.productId}</td>
                <td>${r.userName}</td>
                <td>${'★'.repeat(r.rating)}</td>
                <td>${r.comment.substring(0, 50)}...</td>
                <td class="actions">
                     <button class="delete-btn" data-product-id="${r.productId}" data-comment="${r.comment}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        
        ui.contentArea.innerHTML = `
            <div class="content-header"><h2>All Reviews</h2></div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Product ID</th><th>Author</th><th>Rating</th><th>Comment</th><th>Actions</th></tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>`;
    };

    const renderUsersView = () => {
        const users = adminApi.getUsers();
        const tableRows = users.map(u => `
            <tr>
                <td>${u.email}</td>
                <td class="actions">
                     <button class="delete-btn" data-email="${u.email}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`).join('');
        
        ui.contentArea.innerHTML = `
            <div class="content-header"><h2>Registered Users</h2></div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Email</th><th>Actions</th></tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>`;
    };
    
    // --- 4. MODAL & FORM FUNCTIONS ---

    const openModal = (title, formHtml, onSubmit) => {
        ui.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-button">&times;</button>
                </div>
                <form id="modal-form">${formHtml}</form>
            </div>`;
        ui.modal.classList.add('show');
        ui.modal.querySelector('.close-button').addEventListener('click', closeModal);
        ui.modal.querySelector('#modal-form').addEventListener('submit', onSubmit);

        // Init Quill if the editor element exists
        if (document.getElementById('quill-editor')) {
             quillEditor = new Quill('#quill-editor', {
                theme: 'snow',
                modules: { toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'blockquote']
                ]}
            });
        }
    };
    
    const closeModal = () => ui.modal.classList.remove('show');

    const openProductForm = (product = {}) => {
        const isEditing = !!product.id;
        const formHtml = `
            <input type="hidden" name="id" value="${product.id || ''}">
            <div class="form-grid">
                <div class="form-field">
                    <label for="name">Product Name</label>
                    <input type="text" name="name" id="name" value="${product.name || ''}" required>
                </div>
                <div class="form-field">
                    <label for="price">Price (₹)</label>
                    <input type="number" name="price" id="price" value="${product.price || ''}" required>
                </div>
                <div class="form-field">
                    <label for="category">Category</label>
                    <select name="category" id="category" required>
                        <option value="apparel" ${product.category === 'apparel' ? 'selected' : ''}>Apparel</option>
                        <option value="home-decor" ${product.category === 'home-decor' ? 'selected' : ''}>Home Decor</option>
                        <option value="baskets" ${product.category === 'baskets' ? 'selected' : ''}>Baskets</option>
                        <option value="art" ${product.category === 'art' ? 'selected' : ''}>Art</option>
                    </select>
                </div>
                 <div class="form-field">
                    <label for="image">Image URL</label>
                    <input type="text" name="image" id="image" value="${product.image || ''}" required>
                </div>
            </div>
            <div class="form-field full-width">
                <label for="description">Description</label>
                <textarea name="description" id="description" required>${product.description || ''}</textarea>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary">${isEditing ? 'Update' : 'Save'} Product</button>
            </div>`;
        
        openModal(isEditing ? 'Edit Product' : 'Add New Product', formHtml, (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.price = parseFloat(data.price);
            data.featured = product.featured || false; // Preserve featured status
            // Dummy data for details/care as form is simplified
            data.details = product.details || { material: 'N/A', dimensions: 'N/A', origin: 'N/A', craft: 'N/A' };
            data.care = product.care || 'N/A';
            
            if (isEditing) {
                adminApi.updateProduct(data);
            } else {
                adminApi.addProduct(data);
            }
            closeModal();
            renderView('products');
        });
    };

    const openBlogForm = (post = {}) => {
        const isEditing = !!post.id;
         const formHtml = `
            <input type="hidden" name="id" value="${post.id || ''}">
            <div class="form-grid">
                <div class="form-field">
                    <label for="title">Post Title</label>
                    <input type="text" name="title" id="title" value="${post.title || ''}" required>
                </div>
                 <div class="form-field">
                    <label for="author">Author</label>
                    <input type="text" name="author" id="author" value="${post.author || 'Admin'}" required>
                </div>
                 <div class="form-field">
                    <label for="date">Date</label>
                    <input type="text" name="date" id="date" value="${post.date || new Date().toDateString()}" required>
                </div>
                 <div class="form-field">
                    <label for="tags">Tags (comma-separated)</label>
                    <input type="text" name="tags" id="tags" value="${post.tags ? post.tags.join(', ') : ''}" required>
                </div>
            </div>
            <div class="form-field full-width">
                 <label for="image">Image URL</label>
                 <input type="text" name="image" id="image" value="${post.image || ''}" required>
            </div>
            <div class="form-field full-width">
                <label for="content">Content</label>
                <div id="quill-editor">${post.content || ''}</div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary">${isEditing ? 'Update' : 'Save'} Post</button>
            </div>`;
        
        openModal(isEditing ? 'Edit Post' : 'Add New Post', formHtml, (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.content = quillEditor.root.innerHTML; // Get content from Quill
            data.tags = data.tags.split(',').map(tag => tag.trim());

            if (isEditing) {
                adminApi.updateBlogPost(data);
            } else {
                adminApi.addBlogPost(data);
            }
            closeModal();
            renderView('blog');
        });

        // Set initial content for Quill editor if editing
        if(isEditing && post.content) {
            quillEditor.root.innerHTML = post.content;
        }
    };


    // --- 5. EVENT HANDLERS ---
    const handleNavClick = (e) => {
        e.preventDefault();
        const link = e.target.closest('.nav-link');
        if (link && !link.classList.contains('active')) {
            renderView(link.dataset.view);
        }
    };

    const handleContentAreaClick = (e) => {
        const target = e.target;
        // Add buttons
        if(target.id === 'add-product-btn') openProductForm();
        if(target.id === 'add-blog-btn') openBlogForm();

        // Edit buttons
        if (target.closest('.edit-btn')) {
            const id = target.closest('.edit-btn').dataset.id;
            if (currentView === 'products') {
                const product = adminApi.getProducts().find(p => p.id === id);
                openProductForm(product);
            } else if (currentView === 'blog') {
                 const post = adminApi.getBlogPosts().find(p => p.id === id);
                 openBlogForm(post);
            }
        }
        
        // Delete buttons
        if (target.closest('.delete-btn')) {
            if(!confirm('Are you sure you want to delete this item?')) return;
            
            const btn = target.closest('.delete-btn');
            if (currentView === 'products') {
                adminApi.deleteProduct(btn.dataset.id);
            } else if (currentView === 'blog') {
                adminApi.deleteBlogPost(btn.dataset.id);
            } else if (currentView === 'users') {
                adminApi.deleteUser(btn.dataset.email);
            } else if (currentView === 'reviews') {
                adminApi.deleteReview(btn.dataset.productId, btn.dataset.comment);
            }
            renderView(currentView); // Re-render the view
        }

        // Featured toggle
        if (target.matches('.featured-toggle')) {
            const id = target.dataset.id;
            let product = adminApi.getProducts().find(p => p.id === id);
            if(product) {
                product.featured = !product.featured;
                adminApi.updateProduct(product);
                renderView('products');
            }
        }
    };

    // --- 6. INITIALIZATION ---
    function init() {
        ui.navLinks.forEach(link => link.addEventListener('click', handleNavClick));
        ui.contentArea.addEventListener('click', handleContentAreaClick);
        renderView('dashboard'); // Initial view
    }

    init();
});