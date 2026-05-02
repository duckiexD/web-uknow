const products = [
    {
        id: 1,
        name: 'Футболка Сборной России',
        price: 1200,
        image: 'images/fytbolka.jpeg',
        category: 'Одежда',
        article: 'VYS-001',
        description: 'Официальная футболка Сборной России по футболу. Материал: 100% хлопок. Доступные размеры: S, M, L, XL.'
    },
    {
        id: 2,
        name: 'Шорты Сборной России',
        price: 900,
        image: 'images/shorti.jpeg',
        category: 'Одежда',
        article: 'VYS-002',
        description: 'Тренировочные шорты Сборной России. Материал: полиэстер. Размеры: S, M, L, XL.'
    },
    {
        id: 3,
        name: 'Мяч футбольный',
        price: 2500,
        image: 'images/myach.jpeg',
        category: 'Инвентарь',
        article: 'VYS-003',
        description: 'Официальный мяч ЧМ 2018. Размер 5. Подходит для тренировок и соревнований.'
    },
    {
        id: 4,
        name: 'Бутсы детские',
        price: 3200,
        image: 'images/bytsi.jpeg',
        category: 'Инвентарь',
        article: 'VYS-004',
        description: 'Детские бутсы для игры на искусственном газоне. Размеры: 28-38.'
    },
    {
        id: 5,
        name: 'Кружка «Высота»',
        price: 600,
        image: 'images/kryzhka.jpeg',
        category: 'Сувениры',
        article: 'VYS-005',
        description: 'Керамическая кружка секции "Высота". Объём 330 мл.'
    },
    {
        id: 6,
        name: 'Шарф болельщика',
        price: 800,
        image: 'images/scarf.jpeg',
        category: 'Сувениры',
        article: 'VYS-006',
        description: 'Шарф болельщика с надписью Россия. Длина 140 см.'
    }
];

let cart = JSON.parse(localStorage.getItem('vysota_cart')) || [];
let comments = JSON.parse(localStorage.getItem('vysota_comments')) || [];
let activeFilter = 'Все';

function saveCart() {
    localStorage.setItem('vysota_cart', JSON.stringify(cart));
}

function saveComments() {
    localStorage.setItem('vysota_comments', JSON.stringify(comments));
}

function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (!counter) return;

    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    counter.textContent = total;
    counter.style.display = total > 0 ? 'flex' : 'none';
}

function showCartNotification(name) {
    const note = document.getElementById('cart-notification');
    if (!note) return;

    note.textContent = `«${name}» добавлен в корзину`;
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
    if (!body || !total) return;

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
    total.textContent = `${sum.toLocaleString('ru-RU')} ₽`;
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
                <div class="product-article">Арт: ${product.article}</div>
                <h3 class="product-name" onclick="openProductModal(${product.id})">${product.name}</h3>
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
    if (article) article.textContent = `Артикул: ${product.article}`;
    if (price) price.textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
    if (desc) desc.textContent = product.description;
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
                <span class="comment-author">👤 ${comment.name}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
            <button class="comment-like" onclick="likeComment(${comment.id})">
                ❤️ <span>${comment.likes}</span>
            </button>
        </div>
    `).join('');
}

function likeComment(id) {
    const comment = comments.find(item => item.id === id);
    if (!comment) return;

    comment.likes += 1;
    saveComments();
    renderComments();
}

function addComment(e) {
    e.preventDefault();

    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    const nameErr = document.getElementById('name-error');
    const textErr = document.getElementById('text-error');

    if (!nameInput || !textInput || !nameErr || !textErr) return;

    let valid = true;
    const nameValue = nameInput.value.trim();
    const textValue = textInput.value.trim();

    if (nameValue.length < 2) {
        nameErr.textContent = 'Имя должно быть не короче 2 символов';
        valid = false;
    } else {
        nameErr.textContent = '';
    }

    if (!textValue) {
        textErr.textContent = 'Введите текст комментария';
        valid = false;
    } else {
        textErr.textContent = '';
    }

    if (!valid) return;

    const now = new Date();
    const date = `${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    })}`;

    comments.unshift({
        id: Date.now(),
        name: nameValue,
        text: textValue,
        date,
        likes: 0
    });

    saveComments();
    renderComments();
    nameInput.value = '';
    textInput.value = '';
}

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

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(activeFilter);
    updateCartCounter();
    renderComments();
    initReadingProgress();
    initScrollTop();

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