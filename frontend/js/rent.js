function animatePrice(el) {
    const text = el.textContent;
    const match = text.match(/[\d\s]+/);
    if (!match) return;

    const target = parseInt(match[0].replace(/\s/g, ''), 10);
    if (!target) return;

    const duration = 900;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = text.replace(/[\d\s]+/, `${current.toLocaleString('ru-RU')} `);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function initPriceAnimations() {
    const cards = document.querySelectorAll('.rent-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver(entries => {
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

function openRentModal(title, price) {
    const modal = document.getElementById('rent-modal');
    const form = document.getElementById('rent-order-form');
    const success = document.getElementById('rent-success');
    const modalTitle = document.getElementById('rent-modal-title');
    const modalSubtitle = document.getElementById('rent-modal-subtitle');
    const name = document.getElementById('rent-name');
    const phone = document.getElementById('rent-phone');
    const nameErr = document.getElementById('rent-name-error');
    const phoneErr = document.getElementById('rent-phone-error');

    if (!modal || !form || !success || !modalTitle || !modalSubtitle || !name || !phone || !nameErr || !phoneErr) return;

    modalTitle.textContent = `Бронирование: ${title}`;
    modalSubtitle.textContent = `Стоимость: ${price}`;
    success.style.display = 'none';
    form.style.display = 'block';
    form.reset();
    nameErr.textContent = '';
    phoneErr.textContent = '';
    phone.value = '+7 ';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeRentModal() {
    const modal = document.getElementById('rent-modal');
    const form = document.getElementById('rent-order-form');
    const success = document.getElementById('rent-success');

    if (modal) modal.style.display = 'none';
    if (form) form.style.display = 'block';
    if (success) success.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function initPhoneMask() {
    const input = document.getElementById('rent-phone');
    if (!input) return;

    input.addEventListener('focus', () => {
        if (!input.value) input.value = '+7 ';
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

function initRentForm() {
    const form = document.getElementById('rent-order-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('rent-name');
        const phone = document.getElementById('rent-phone');
        const nameErr = document.getElementById('rent-name-error');
        const phoneErr = document.getElementById('rent-phone-error');
        const success = document.getElementById('rent-success');

        if (!name || !phone || !nameErr || !phoneErr || !success) return;

        let valid = true;

        if (name.value.trim().length < 2) {
            nameErr.textContent = 'Введите имя (минимум 2 символа)';
            valid = false;
        } else {
            nameErr.textContent = '';
        }

        const phoneClean = phone.value.replace(/\D/g, '');
        if (!/^7\d{10}$/.test(phoneClean)) {
            phoneErr.textContent = 'Введите корректный номер в формате +7 (XXX) XXX-XX-XX';
            valid = false;
        } else {
            phoneErr.textContent = '';
        }

        if (!valid) return;

        form.style.display = 'none';
        success.style.display = 'block';
        setTimeout(closeRentModal, 2500);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.rent-book-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            openRentModal(this.dataset.title || '', this.dataset.price || '');
        });
    });

    document.getElementById('rent-modal-close')?.addEventListener('click', closeRentModal);

    document.getElementById('rent-modal')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) closeRentModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeRentModal();
    });

    initPhoneMask();
    initRentForm();
    initPriceAnimations();
});