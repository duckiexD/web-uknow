// Выбор карточки тарифа
function initPricingCards() {
    const cards = document.querySelectorAll('.pricing-card');

    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') return;

            cards.forEach(c => c.classList.remove('pricing-card--selected'));
            card.classList.add('pricing-card--selected');

            const name = card.querySelector('.pricing-name').textContent;
            const price = card.querySelector('.pricing-price').textContent;
            showToast(`Выбран тариф: ${name} — ${price}`);
        });
    });
}

// Тост-уведомление
function showToast(message) {
    let toast = document.getElementById('lessons-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// Анимация цен, типа прокрутка
function animatePrice(el) {
    const text = el.textContent;
    const match = text.match(/[\d\s]+/);
    if (!match) return;

    const target = parseInt(match[0].replace(/\s/g, ''), 10);
    const duration = 800;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = text.replace(/[\d\s]+/, current.toLocaleString('ru-RU') + ' ');
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// Intersection observer
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const priceEl = entry.target.querySelector('.pricing-price, .gym-card-price');
                if (priceEl && !priceEl.dataset.animated) {
                    priceEl.dataset.animated = '1';
                    animatePrice(priceEl);
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.pricing-card, .gym-card').forEach(el => {
        observer.observe(el);
    });
}

// Выбор абонемента в спортзал
function initGymCards() {
    const cards = document.querySelectorAll('.gym-card');

    cards.forEach(card => {
        // Клик по карточке (не по кнопке) — выделение
        card.addEventListener('click', function (e) {
            if (e.target.classList.contains('gym-order-btn')) return;
            cards.forEach(c => c.classList.remove('gym-card--selected'));
            card.classList.add('gym-card--selected');
        });

        // Клик по кнопке "Оформить" — открыть модалку
        const btn = card.querySelector('.gym-order-btn');
        if (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const title = card.dataset.title;
                const price = card.dataset.price;
                openGymModal(title, price);
            });
        }
    });
}

// Модальное окно абонемента
function openGymModal(title, price) {
    document.getElementById('gym-modal-title').textContent = `Оформление: ${title}`;
    document.getElementById('gym-modal-subtitle').textContent = `Стоимость: ${price}`;
    document.getElementById('gym-success').style.display = 'none';
    document.getElementById('gym-order-form').style.display = 'block';
    document.getElementById('gym-name').value = '';
    document.getElementById('gym-phone').value = '';
    document.getElementById('gym-name-error').textContent = '';
    document.getElementById('gym-phone-error').textContent = '';
    document.getElementById('gym-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGymModal() {
    document.getElementById('gym-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Маска телефона под рф
function initPhoneMask() {
    const input = document.getElementById('gym-phone');
    if (!input) return;

    input.addEventListener('input', function () {
        let val = input.value.replace(/\D/g, '');

        // Приводим к формату +7
        if (val.startsWith('8')) val = '7' + val.slice(1);
        if (!val.startsWith('7')) val = '7' + val;
        val = val.slice(0, 11);

        let result = '+7';
        if (val.length > 1) result += ' (' + val.slice(1, 4);
        if (val.length >= 4) result += ') ' + val.slice(4, 7);
        if (val.length >= 7) result += '-' + val.slice(7, 9);
        if (val.length >= 9) result += '-' + val.slice(9, 11);

        input.value = result;
    });

    input.addEventListener('keydown', function (e) {
        // Не даём удалить префикс +7
        if (e.key === 'Backspace' && input.value.length <= 2) e.preventDefault();
    });

    input.addEventListener('focus', function () {
        if (!input.value) input.value = '+7 ';
    });
}

// Валидация и отправка формы
function initGymForm() {
    const form = document.getElementById('gym-order-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('gym-name');
        const phone = document.getElementById('gym-phone');
        const nameErr = document.getElementById('gym-name-error');
        const phoneErr = document.getElementById('gym-phone-error');
        let valid = true;

        // Валидация имени
        if (name.value.trim().length < 2) {
            nameErr.textContent = 'Введите имя (минимум 2 символа)';
            valid = false;
        } else {
            nameErr.textContent = '';
        }

        // Валидация телефона РФ: +7 (XXX) XXX-XX-XX
        const phoneClean = phone.value.replace(/\D/g, '');
        if (!/^7\d{10}$/.test(phoneClean)) {
            phoneErr.textContent = 'Введите корректный номер в формате +7 (XXX) XXX-XX-XX';
            valid = false;
        } else {
            phoneErr.textContent = '';
        }

        if (!valid) return;

        form.style.display = 'none';
        document.getElementById('gym-success').style.display = 'block';
        setTimeout(closeGymModal, 2500);
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initPricingCards();
    initGymCards();
    initScrollAnimations();
    initPhoneMask();
    initGymForm();

    document.getElementById('gym-modal-close').addEventListener('click', closeGymModal);
    document.getElementById('gym-modal').addEventListener('click', function (e) {
        if (e.target === this) closeGymModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeGymModal();
    });
});
