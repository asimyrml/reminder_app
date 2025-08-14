document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggle('id_password', 'rmd-toggle-password');
    preventDoubleSubmit('rmd-login-form', 'rmd-submit-btn', 'Gönderiliyor...');
});