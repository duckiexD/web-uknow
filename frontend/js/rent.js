// API Базовый URL
const API_BASE = 'http://localhost:5000/api';

// ==================== Анимация цены ====================

function animatePrice(el) {
    const text = el.textContent;
    const match = text.match(/[\d\s]+/);
    if (!match) return;

    const target = parseInt(match[0].replace(/\s/g, ''), 10);
    if (!target) return;

    const duration = 900;
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

function showRentToast(message, isError = false) {
    let toast = document.getElementById('rent-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'rent-toast';
        toast.style.cssText = `
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
            font-family: 'Roboto', sans-serif;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.background = isError ? '#d32f2f' : '#1e293b';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2800);
}

// ==================== Отправка заявки на аренду на сервер ====================

async function submitRentOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE}/rent-orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: orderData.name,
                phone: orderData.phone,
                title: orderData.title,
                price: orderData.price
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showRentToast('✅ Заявка отправлена! Менеджер свяжется с вами.');
            return true;
        } else {
            showRentToast('❌ Ошибка при отправке заявки', true);
            return false;
        }
    } catch (error) {
        console.error('Ошибка при отправке заявки на аренду:', error);
        showRentToast('❌ Ошибка соединения с сервером', true);
        return false;
    }
}

// ==================== Открытие модального окна аренды ====================

function openRentModal(title, price) {
    const modal = document.getElementById('rent-modal');
    const form = document.getElementById('rent-order-form');
    const success = document.getElementById('rent-success');

    if (!modal || !form || !success) {
        console.error('Элементы модального окна не найдены');
        showRentToast('Ошибка: не удалось открыть форму', true);
        return;
    }

    // Заполняем заголовки
    const titleEl = document.getElementById('rent-modal-title');
    const subtitleEl = document.getElementById('rent-modal-subtitle');
    
    if (titleEl) titleEl.textContent = `Бронирование: ${title}`;
    if (subtitleEl) subtitleEl.textContent = `Стоимость: ${price}`;

    // Сбрасываем форму
    success.style.display = 'none';
    form.style.display = 'block';
    
    const nameInput = document.getElementById('rent-name');
    const phoneInput = document.getElementById('rent-phone');
    const nameErr = document.getElementById('rent-name-error');
    const phoneErr = document.getElementById('rent-phone-error');
    
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '+7 ';
    if (nameErr) nameErr.textContent = '';
    if (phoneErr) phoneErr.textContent = '';

    // Сохраняем данные в data-атрибуты модального окна
    modal.dataset.title = title;
    modal.dataset.price = price;

    // Показываем модальное окно
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ==================== Закрытие модального окна аренды ====================

function closeRentModal() {
    const modal = document.getElementById('rent-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
}

// ==================== Маска телефона для аренды ====================

function initRentPhoneMask() {
    const input = document.getElementById('rent-phone');
    if (!input) return;

    // При фокусе устанавливаем маску
    input.addEventListener('focus', () => {
        if (!input.value || input.value === '+7 ') {
            input.value = '+7 ';
        }
    });

    // При вводе форматируем номер
    input.addEventListener('input', (e) => {
        let val = input.value.replace(/\D/g, '');

        // Если начинается с 8, меняем на 7
        if (val.startsWith('8')) {
            val = '7' + val.slice(1);
        }
        // Если не начинается с 7, добавляем 7
        if (!val.startsWith('7')) {
            val = '7' + val;
        }
        // Ограничиваем длину
        val = val.slice(0, 11);

        // Форматируем номер
        let result = '+7 ';
        if (val.length > 1) {
            result += '(' + val.slice(1, 4);
        }
        if (val.length >= 4) {
            result += ') ' + val.slice(4, 7);
        }
        if (val.length >= 7) {
            result += '-' + val.slice(7, 9);
        }
        if (val.length >= 9) {
            result += '-' + val.slice(9, 11);
        }

        input.value = result;
    });

    // Обработка удаления
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value.length <= 3) {
            e.preventDefault();
            input.value = '+7 ';
        }
    });
}

// ==================== Валидация и отправка формы аренды ====================

function initRentForm() {
    const form = document.getElementById('rent-order-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('rent-name');
        const phoneInput = document.getElementById('rent-phone');
        const nameError = document.getElementById('rent-name-error');
        const phoneError = document.getElementById('rent-phone-error');
        const modal = document.getElementById('rent-modal');

        let isValid = true;

        // Валидация имени
        if (!nameInput || !nameError) return;
        
        const nameValue = nameInput.value.trim();
        if (nameValue.length < 2) {
            nameError.textContent = 'Введите имя (минимум 2 символа)';
            isValid = false;
        } else if (nameValue.length > 50) {
            nameError.textContent = 'Имя не должно превышать 50 символов';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

        // Валидация телефона
        if (!phoneInput || !phoneError) return;
        
        const phoneClean = phoneInput.value.replace(/\D/g, '');
        if (!/^7\d{10}$/.test(phoneClean)) {
            phoneError.textContent = 'Введите корректный номер в формате +7 (XXX) XXX-XX-XX';
            isValid = false;
        } else {
            phoneError.textContent = '';
        }

        if (!isValid) return;

        // Получаем данные из модального окна
        const title = modal?.dataset.title || '';
        const price = modal?.dataset.price || '';

        // Отправка на сервер
        const success = await submitRentOrder({
            name: nameValue,
            phone: phoneInput.value.trim(),
            title: title,
            price: price
        });

        if (success) {
            // Показываем сообщение об успехе
            const formElement = document.getElementById('rent-order-form');
            const successElement = document.getElementById('rent-success');
            
            if (formElement) formElement.style.display = 'none';
            if (successElement) successElement.style.display = 'block';
            
            // Закрываем модальное окно через 2.5 секунды
            setTimeout(() => {
                closeRentModal();
                // Сбрасываем форму для следующего раза
                if (formElement) formElement.style.display = 'block';
                if (successElement) successElement.style.display = 'none';
            }, 2500);
        }
    });
}

// ==================== Анимация цен при скролле ====================

function initPriceAnimations() {
    const cards = document.querySelectorAll('.rent-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const priceEl = entry.target.querySelector('.rent-price');
            if (priceEl && !priceEl.dataset.animated) {
                priceEl.dataset.animated = '1';
                animatePrice(priceEl);
            }

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    cards.forEach(el => observer.observe(el));
}

// ==================== Инициализация кнопок бронирования ====================

function initRentButtons() {
    const buttons = document.querySelectorAll('.rent-book-btn');
    
    buttons.forEach(btn => {
        // Удаляем старые обработчики, создаём новый элемент
        const newBtn = btn.cloneNode(true);
        btn.parentNode?.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const title = newBtn.dataset.title;
            const price = newBtn.dataset.price;
            
            if (title && price) {
                openRentModal(title, price);
            } else {
                showRentToast('Ошибка: данные о бронировании не найдены', true);
            }
        });
    });
}

// ==================== Инициализация ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('rent.js инициализирован');
    
    // Инициализация всех компонентов
    initRentButtons();
    initPriceAnimations();
    initRentPhoneMask();
    initRentForm();

    // Закрытие модального окна по крестику
    const closeBtn = document.getElementById('rent-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeRentModal);
    }

    // Закрытие по клику на фон
    const modal = document.getElementById('rent-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeRentModal();
            }
        });
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeRentModal();
        }
    });
});