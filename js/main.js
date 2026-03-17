// ===== ДАННЫЕ ТОВАРОВ (мерч секции) =====
const products = [
    {
        id: 1,
        name: 'Футболка «Высота»',
        price: 1200,
        image: 'images/kids.jpeg',
        category: 'Одежда',
        article: 'VYS-001',
        description: 'Официальная футболка футбольной секции «Высота». Материал: 100% хлопок. Доступные размеры: S, M, L, XL.'
    },
    {
        id: 2,
        name: 'Шорты тренировочные',
        price: 900,
        image: 'images/trenirovka.jpeg',
        category: 'Одежда',
        article: 'VYS-002',
        description: 'Тренировочные шорты с логотипом секции. Материал: полиэстер. Размеры: S, M, L, XL.'
    },
    {
        id: 3,
        name: 'Мяч футбольный',
        price: 2500,
        image: 'images/match.jpeg',
        category: 'Инвентарь',
        article: 'VYS-003',
        description: 'Официальный мяч секции «Высота». Размер 5. Подходит для тренировок и соревнований.'
    },
    {
        id: 4,
        name: 'Бутсы детские',
        price: 3200,
        image: 'images/kids.jpeg',
        category: 'Инвентарь',
        article: 'VYS-004',
        description: 'Детские бутсы для игры на искусственном газоне. Размеры: 28-38.'
    },
    {
        id: 5,
        name: 'Кружка «Высота»',
        price: 600,
        image: 'images/shtab.jpeg',
        category: 'Сувениры',
        article: 'VYS-005',
        description: 'Керамическая кружка с логотипом секции «Высота». Объём 330 мл.'
    },
    {
        id: 6,
        name: 'Шарф болельщика',
        price: 800,
        image: 'images/visotakomanda.jpeg',
        category: 'Сувениры',
        article: 'VYS-006',
        description: 'Шарф болельщика в цветах секции «Высота». Длина 140 см.'
    }
];

// ===== КОРЗИНА =====
let cart = JSON.parse(localStorage.getItem('vysota_cart')) || [];

function saveCart() {
    localStorage.setItem('vysota_cart', JSON.stringify(cart));
}

function updateCartCounter() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    const counter = document.getElementById('cart-counter');
    if (counter) {
        counter.textContent = total;
        counter.style.display = total > 0 ? 'flex' : 'none';
    }
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartCounter();
    showCartNotification(product.name);
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
    const total = document.getElementById('cart-total');
    if (!body) return;

    if (cart.length === 0) {
        body.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        total.textContent = '0 ₽';
        return;
    }

    body.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} ₽</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <button class="cart-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
    `).join('');

    const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
    total.textContent = sum.toLocaleString('ru-RU') + ' ₽';
}

function openCart() {
    renderCart();
    document.getElementById('cart-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showCartNotification(name) {
    const note = document.getElementById('cart-notification');
    if (!note) return;
    note.textContent = `«${name}» добавлен в корзину`;
    note.classList.add('show');
    setTimeout(() => note.classList.remove('show'), 2500);
}

// ===== РЕНДЕР КАТАЛОГА =====
let activeFilter = 'Все';

function renderProducts(filter) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const filtered = filter === 'Все' ? products : products.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-img-wrap" onclick="openProductModal(${p.id})">
                <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="product-info">
                <div class="product-article">Арт: ${p.article}</div>
                <h3 class="product-name" onclick="openProductModal(${p.id})">${p.name}</h3>
                <div class="product-price">${p.price.toLocaleString('ru-RU')} ₽</div>
                <button class="btn product-btn" onclick="addToCart(${p.id})">В корзину</button>
            </div>
        </div>
    `).join('');
}

function setFilter(btn, filter) {
    activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(filter);
}

// ===== МОДАЛЬНОЕ ОКНО ТОВАРА =====
function openProductModal(id) {
    const p = products.find(pr => pr.id === id);
    if (!p) return;
    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-img').alt = p.name;
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-article').textContent = 'Артикул: ' + p.article;
    document.getElementById('modal-price').textContent = p.price.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('modal-desc').textContent = p.description;
    document.getElementById('modal-add-btn').onclick = () => { addToCart(id); closeProductModal(); };
    document.getElementById('product-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===== КОММЕНТАРИИ =====
let comments = JSON.parse(localStorage.getItem('vysota_comments')) || [];

function saveComments() {
    localStorage.setItem('vysota_comments', JSON.stringify(comments));
}

function renderComments() {
    const list = document.getElementById('comments-list');
    if (!list) return;

    if (comments.length === 0) {
        list.innerHTML = '<p class="no-comments">Комментариев пока нет. Будьте первым!</p>';
        return;
    }

    list.innerHTML = comments.map(c => `
        <div class="comment-item" data-id="${c.id}">
            <div class="comment-header">
                <span class="comment-author">👤 ${c.name}</span>
                <span class="comment-date">${c.date}</span>
            </div>
            <div class="comment-text">${c.text}</div>
            <button class="comment-like" onclick="likeComment(${c.id})">
                ❤️ <span>${c.likes}</span>
            </button>
        </div>
    `).join('');
}

function likeComment(id) {
    const comment = comments.find(c => c.id === id);
    if (comment) {
        comment.likes++;
        saveComments();
        renderComments();
    }
}

function addComment(e) {
    e.preventDefault();
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    const nameErr = document.getElementById('name-error');
    const textErr = document.getElementById('text-error');

    let valid = true;

    if (nameInput.value.trim().length < 2) {
        nameErr.textContent = 'Имя должно быть не короче 2 символов';
        valid = false;
    } else {
        nameErr.textContent = '';
    }

    if (textInput.value.trim() === '') {
        textErr.textContent = 'Введите текст комментария';
        valid = false;
    } else {
        textErr.textContent = '';
    }

    if (!valid) return;

    const now = new Date();
    const date = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    comments.unshift({
        id: Date.now(),
        name: nameInput.value.trim(),
        text: textInput.value.trim(),
        date,
        likes: 0
    });

    saveComments();
    renderComments();
    nameInput.value = '';
    textInput.value = '';
}

// ===== ПРОГРЕСС ЧТЕНИЯ =====
function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    });
}

// ===== КНОПКА "НАВЕРХ" =====
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

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('Все');
    updateCartCounter();
    renderComments();
    initReadingProgress();
    initScrollTop();

    // Закрытие корзины по клику на фон
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', e => {
            if (e.target === cartModal) closeCart();
        });
    }

    // Закрытие модального окна товара по клику на фон
    const productModal = document.getElementById('product-modal');
    if (productModal) {
        productModal.addEventListener('click', e => {
            if (e.target === productModal) closeProductModal();
        });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeCart();
            closeProductModal();
        }
    });

    // Форма комментариев
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', addComment);
    }
});
