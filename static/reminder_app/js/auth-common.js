// Şifre göster/gizle için ortak fonksiyon
function setupPasswordToggle(inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (input && btn) {
        btn.addEventListener('click', function () {
            const showing = input.getAttribute('type') === 'text';
            input.setAttribute('type', showing ? 'password' : 'text');
            btn.textContent = showing ? 'Göster' : 'Gizle';
            btn.setAttribute('aria-label', showing ? 'Şifreyi göster' : 'Şifreyi gizle');
        });
    }
}
// Çifte submit engelle
function preventDoubleSubmit(formId, btnId, sendingText='Gönderiliyor...') {
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById(btnId);
    if (form && submitBtn) {
        form.addEventListener('submit', function () {
            submitBtn.disabled = true;
            submitBtn.textContent = sendingText;
        });
    }
}