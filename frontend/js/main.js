// API Базовый URL
const API_BASE = 'http://localhost:5000/api';

let products = [];
let cart = JSON.parse(localStorage.getItem('vysota_cart')) || [];
let comments = [];

// ==================== Загрузка данных с сервера ====================

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        products = await response.json();
        renderProducts(activeFilter);
        console.log('Товары загружены:', products.length);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        // Используем локальные данные если сервер не доступен
        products = [
            {id: 1, name: 'Футболка Сборной России', price: 1200, image: 'images/fytbolka.jpeg', category: 'Одежда', article: 'VYS-001', description: 'Официальная футболка...'},
            {id: 2, name: 'Шорты Сборной России', price: 900, image: 'images/shorti.jpeg', category: 'Одежда', article: 'VYS-002', description: 'Тренировочные шорты...'},
            {id: 3, name: 'Мяч футбольный', price: 2500, image: 'images/myach.jpeg', category: 'Инвентарь', article: 'VYS-003', description: 'Официальный мяч...'},
            {id: 4, name: 'Бутсы детские', price: 3200, image: 'images/bytsi.jpeg', category: 'Инвентарь', article: 'VYS-004', description: 'Детские бутсы...'},
            {id: 5, name: 'Кружка «Высота»', price: 600, image: 'images/kryzhka.jpeg', category: 'Сувениры', article: 'VYS-005', description: 'Керамическая кружка...'},
            {id: 6, name: 'Шарф болельщика', price: 800, image: 'images/scarf.jpeg', category: 'Сувениры', article: 'VYS-006', description: 'Шарф болельщика...'}
        ];
        renderProducts(activeFilter);
    }
}

async function loadComments() {
    try {
        const response = await fetch(`${API_BASE}/comments`);
        comments = await response.json();
        renderComments();
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        comments = [];
        renderComments();
    }
}

async function saveOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();
        if (result.status === 'success') {
            showCartNotification('Заказ оформлен! Спасибо!');
            cart = [];
            saveCart();
            updateCartCounter();
            closeCart();
        }
        return result;
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        showCartNotification('Ошибка при оформлении заказа');
    }
}

async function addCommentToServer(name, text) {
    try {
        const response = await fetch(`${API_BASE}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, text })
        });
        const result = await response.json();
        if (result.status === 'success') {
            await loadComments(); // Перезагружаем отзывы
        }
        return result;
    } catch (error) {
        console.error('Ошибка добавления отзыва:', error);
    }
}

// ==================== Корзина ====================

function saveCart() {
    localStorage.setItem('vysota_cart', JSON.stringify(cart));
}

function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (!counter) return;
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    counter.textContent = total;
    counter.style.display = total > 0 ? 'flex' : 'none';
}

function showCartNotification(message) {
    const note = document.getElementById('cart-notification');
    if (!note) return;
    note.textContent = message;
    note.classList.add('show');
    clearTimeout(note._timer);
    note._timer = setTimeout(() => note.classList.remove('show'), 2500);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartCounter();
    showCartNotification(`${product.name} добавлен в корзину`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCounter();
    renderCart();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    saveCart();
    updateCartCounter();
    renderCart();
}

function renderCart() {
    const body = document.getElementById('cart-body');
    const totalEl = document.getElementById('cart-total');
    if (!body || !totalEl) return;
    
    if (cart.length === 0) {
        body.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        totalEl.textContent = '0 ₽';
        return;
    }
    
    body.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <button class="cart-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
    `).join('');
    
    const sum = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    totalEl.textContent = `${sum.toLocaleString('ru-RU')} ₽`;
}

async function checkout() {
    if (cart.length === 0) {
        showCartNotification('Корзина пуста');
        return;
    }
    
    // Здесь можно запросить имя и телефон
    const name = prompt('Введите ваше имя:');
    const phone = prompt('Введите ваш телефон:');
    
    if (!name || !phone) {
        showCartNotification('Необходимо указать имя и телефон');
        return;
    }
    
    const orderData = {
        name: name,
        phone: phone,
        items: cart.map(item => ({ id: item.id, name: item.name, qty: item.qty, price: item.price })),
        total: cart.reduce((acc, item) => acc + item.price * item.qty, 0)
    };
    
    await saveOrder(orderData);
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    renderCart();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ==================== Отзывы ====================

function renderComments() {
    const list = document.getElementById('comments-list');
    if (!list) return;
    
    if (comments.length === 0) {
        list.innerHTML = '<p class="no-comments">Комментариев пока нет. Будьте первым!</p>';
        return;
    }
    
    list.innerHTML = comments.map(comment => `
        <div class="comment-item" data-id="${comment.id}">
            <div class="comment-header">
                <span class="comment-author">👤 ${escapeHtml(comment.name)}</span>
                <span class="comment-date">${comment.date || ''}</span>
            </div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
            <button class="comment-like" onclick="likeComment(${comment.id})">
                ❤️ <span>${comment.likes || 0}</span>
            </button>
        </div>
    `).join('');
}

async function likeComment(id) {
    try {
        await fetch(`${API_BASE}/comments/${id}/like`, { method: 'POST' });
        await loadComments();
    } catch (error) {
        console.error('Ошибка лайка:', error);
    }
}

async function addComment(e) {
    e.preventDefault();
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    const nameErr = document.getElementById('name-error');
    const textErr = document.getElementById('text-error');
    
    if (!nameInput || !textInput) return;
    
    let valid = true;
    const nameValue = nameInput.value.trim();
    const textValue = textInput.value.trim();
    
    if (nameValue.length < 2) {
        if (nameErr) nameErr.textContent = 'Имя должно быть не короче 2 символов';
        valid = false;
    } else if (nameErr) {
        nameErr.textContent = '';
    }
    
    if (!textValue) {
        if (textErr) textErr.textContent = 'Введите текст комментария';
        valid = false;
    } else if (textErr) {
        textErr.textContent = '';
    }
    
    if (!valid) return;
    
    await addCommentToServer(nameValue, textValue);
    nameInput.value = '';
    textInput.value = '';
}

// ==================== Товары и фильтры ====================

let activeFilter = 'Все';

function renderProducts(filter = 'Все') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    const filtered = filter === 'Все' 
        ? products 
        : products.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-img-wrap" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-article">Арт: ${product.article || 'VYS-00' + product.id}</div>
                <h3 class="product-name" onclick="openProductModal(${product.id})">${escapeHtml(product.name)}</h3>
                <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                <button class="btn product-btn" onclick="addToCart(${product.id})">В корзину</button>
            </div>
        </div>
    `).join('');
}

function setFilter(btn, filter) {
    activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(button => button.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderProducts(activeFilter);
}

function openProductModal(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const img = document.getElementById('modal-img');
    const name = document.getElementById('modal-name');
    const article = document.getElementById('modal-article');
    const price = document.getElementById('modal-price');
    const desc = document.getElementById('modal-desc');
    const addBtn = document.getElementById('modal-add-btn');
    
    if (img) {
        img.src = product.image;
        img.alt = product.name;
    }
    if (name) name.textContent = product.name;
    if (article) article.textContent = `Артикул: ${product.article || 'VYS-00' + product.id}`;
    if (price) price.textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
    if (desc) desc.textContent = product.description || 'Описание товара';
    if (addBtn) {
        addBtn.onclick = () => {
            addToCart(id);
            closeProductModal();
        };
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ==================== Вспомогательные функции ====================

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ==================== Прогресс чтения и кнопка наверх ====================

function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
    });
}

function initScrollTop() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== Инициализация ====================

document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    await loadComments();
    updateCartCounter();
    initReadingProgress();
    initScrollTop();
    
    // Добавляем кнопку оформления заказа
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter && !document.getElementById('checkout-btn')) {
        const checkoutBtn = document.createElement('button');
        checkoutBtn.id = 'checkout-btn';
        checkoutBtn.className = 'btn';
        checkoutBtn.textContent = 'Оформить заказ';
        checkoutBtn.style.marginLeft = 'auto';
        checkoutBtn.onclick = checkout;
        cartFooter.appendChild(checkoutBtn);
    }
    
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', e => {
            if (e.target === cartModal) closeCart();
        });
    }
    
    const productModal = document.getElementById('product-modal');
    if (productModal) {
        productModal.addEventListener('click', e => {
            if (e.target === productModal) closeProductModal();
        });
    }
    
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeCart();
            closeProductModal();
        }
    });
    
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', addComment);
    }
});