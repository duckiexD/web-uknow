// API Базовый URL
const API_BASE = 'http://localhost:5000/api';

// ==================== Анимация цены ====================

function animatePrice(el) {
    const text = el.textContent;
    const match = text.match(/[\d\s]+/);
    if (!match) return;

    const target = parseInt(match[0].replace(/\s/g, ''), 10);
    if (!target) return;

    const duration = 800;
    const start = performance.now();
    const originalText = text;

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = originalText.replace(/[\d\s]+/, `${current.toLocaleString('ru-RU')} `);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ==================== Уведомления ====================

function showToast(message, isError = false) {
    const toast = document.getElementById('lessons-toast');
    if (!toast) {
        // Создаём toast если его нет
        const newToast = document.createElement('div');
        newToast.id = 'lessons-toast';
        newToast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${isError ? '#d32f2f' : '#1e293b'};
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 30px;
            font-size: 0.95rem;
            z-index: 9999;
            transition: transform 0.3s ease;
            white-space: nowrap;
        `;
        document.body.appendChild(newToast);
        return showToast(message, isError);
    }

    toast.textContent = message;
    toast.style.background = isError ? '#d32f2f' : '#1e293b';
    toast.classList.add('show');
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2800);
}

// ==================== Отправка заявки на абонемент ====================

async function submitGymOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE}/gym-orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();
        if (result.status === 'success') {
            showToast('Заявка отправлена! Мы свяжемся с вами.');
            return true;
        } else {
            showToast('Ошибка при отправке', true);
            return false;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showToast('Ошибка соединения с сервером', true);
        return false;
    }
}

// ==================== Абонементы на спортзал ====================

function initGymCards() {
    const cards = document.querySelectorAll('.gym-card');

    cards.forEach(card => {
        // Выделение карточки при клике
        card.addEventListener('click', e => {
            if (e.target.closest('.gym-order-btn')) return;
            cards.forEach(c => c.classList.remove('gym-card--selected'));
            card.classList.add('gym-card--selected');
        });

        // Кнопка "Оформить"
        const btn = card.querySelector('.gym-order-btn');
        if (btn) {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const title = card.dataset.title;
                const price = card.dataset.price;
                if (title && price) {
                    openGymModal(title, price);
                } else {
                    showToast('Ошибка: данные не найдены', true);
                }
            });
        }
    });
}

// ==================== Тарифы на тренировки ====================

function initPricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('a')) return;

            cards.forEach(c => c.classList.remove('pricing-card--selected'));
            card.classList.add('pricing-card--selected');

            const name = card.querySelector('.pricing-name')?.textContent || '';
            const price = card.querySelector('.pricing-price')?.textContent || '';
            showToast(`Выбран тариф: ${name} — ${price}`);
        });
    });
}

// ==================== Модальное окно абонемента ====================

function openGymModal(title, price) {
    const modal = document.getElementById('gym-modal');
    const form = document.getElementById('gym-order-form');
    const success = document.getElementById('gym-success');

    if (!modal || !form || !success) {
        console.error('Элементы модального окна не найдены');
        return;
    }

    // Заполняем заголовки
    const titleEl = document.getElementById('gym-modal-title');
    const subtitleEl = document.getElementById('gym-modal-subtitle');
    if (titleEl) titleEl.textContent = `Оформление: ${title}`;
    if (subtitleEl) subtitleEl.textContent = `Стоимость: ${price}`;

    // Сбрасываем форму
    success.style.display = 'none';
    form.style.display = 'block';
    
    const nameInput = document.getElementById('gym-name');
    const phoneInput = document.getElementById('gym-phone');
    const nameErr = document.getElementById('gym-name-error');
    const phoneErr = document.getElementById('gym-phone-error');
    
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '+7 ';
    if (nameErr) nameErr.textContent = '';
    if (phoneErr) phoneErr.textContent = '';

    // Сохраняем данные в data-атрибуты для отправки
    modal.dataset.title = title;
    modal.dataset.price = price;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGymModal() {
    const modal = document.getElementById('gym-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ==================== Маска телефона ====================

function initPhoneMask() {
    const input = document.getElementById('gym-phone');
    if (!input) return;

    input.addEventListener('focus', () => {
        if (!input.value || input.value === '+7 ') {
            input.value = '+7 ';
        }
    });

    input.addEventListener('input', () => {
        let val = input.value.replace(/\D/g, '');

        if (val.startsWith('8')) val = '7' + val.slice(1);
        if (!val.startsWith('7')) val = '7' + val;
        val = val.slice(0, 11);

        let result = '+7 ';
        if (val.length > 1) result += '(' + val.slice(1, 4);
        if (val.length >= 4) result += ') ' + val.slice(4, 7);
        if (val.length >= 7) result += '-' + val.slice(7, 9);
        if (val.length >= 9) result += '-' + val.slice(9, 11);

        input.value = result;
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && input.value.length <= 3) {
            e.preventDefault();
        }
    });
}

// ==================== Валидация и отправка формы ====================

function initGymForm() {
    const form = document.getElementById('gym-order-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('gym-name');
        const phone = document.getElementById('gym-phone');
        const nameErr = document.getElementById('gym-name-error');
        const phoneErr = document.getElementById('gym-phone-error');
        const modal = document.getElementById('gym-modal');

        if (!name || !phone || !nameErr || !phoneErr) return;

        let valid = true;

        // Валидация имени
        if (name.value.trim().length < 2) {
            nameErr.textContent = 'Введите имя (минимум 2 символа)';
            valid = false;
        } else {
            nameErr.textContent = '';
        }

        // Валидация телефона
        const phoneClean = phone.value.replace(/\D/g, '');
        if (!/^7\d{10}$/.test(phoneClean)) {
            phoneErr.textContent = 'Введите корректный номер в формате +7 (XXX) XXX-XX-XX';
            valid = false;
        } else {
            phoneErr.textContent = '';
        }

        if (!valid) return;

        // Отправка на сервер
        const title = modal?.dataset.title || '';
        const price = modal?.dataset.price || '';

        const success = await submitGymOrder({
            name: name.value.trim(),
            phone: phone.value.trim(),
            title: title,
            price: price
        });

        if (success) {
            const formEl = document.getElementById('gym-order-form');
            const successEl = document.getElementById('gym-success');
            if (formEl) formEl.style.display = 'none';
            if (successEl) successEl.style.display = 'block';
            setTimeout(closeGymModal, 2500);
        }
    });
}

// ==================== Анимация при скролле ====================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');

            const priceEl = entry.target.querySelector('.pricing-price, .gym-card-price');
            if (priceEl && !priceEl.dataset.animated) {
                priceEl.dataset.animated = '1';
                animatePrice(priceEl);
            }

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.pricing-card, .gym-card').forEach(el => observer.observe(el));
}

// ==================== Инициализация ====================

document.addEventListener('DOMContentLoaded', () => {
    initPricingCards();
    initGymCards();
    initScrollAnimations();
    initPhoneMask();
    initGymForm();

    // Закрытие модального окна
    const closeBtn = document.getElementById('gym-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeGymModal);
    }

    const modal = document.getElementById('gym-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeGymModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeGymModal();
    });
});