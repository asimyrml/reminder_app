document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggle('id_password1', 'rmd-toggle-pw1');
    setupPasswordToggle('id_password2', 'rmd-toggle-pw2');
    preventDoubleSubmit('rmd-register-form', 'rmd-submit-btn', 'Gönderiliyor...');

    // Şifre gücü ve eşleşme kontrolleri
    const pw1 = document.getElementById('id_password1');
    const pw2 = document.getElementById('id_password2');
    const matchErr = document.getElementById('rmd-match-error');
    const strengthBar = document.getElementById('rmd-strength');
    const hint = document.getElementById('rmd-hint');

    function calcStrength(val){
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[a-z]/.test(val)) score++;
        if (/\d/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        return score;
    }
    function updateStrength(){
        const s = calcStrength(pw1.value);
        strengthBar.classList.remove('bad','warn','ok');
        if (!pw1.value) {
            strengthBar.querySelector('span').style.width = '0%';
            hint.textContent = 'En az 8 karakter, harf + rakam önerilir.';
            return;
        }
        if (s <= 2){ strengthBar.classList.add('bad'); hint.textContent = 'Zayıf şifre. Uzunluk ve çeşitliliği artır.'; }
        else if (s === 3){ strengthBar.classList.add('warn'); hint.textContent = 'Orta. Büyük/küçük harf, rakam ve sembol ekle.'; }
        else { strengthBar.classList.add('ok'); hint.textContent = 'Güçlü şifre.'; }
    }
    pw1 && pw1.addEventListener('input', updateStrength);

    function checkMatch(){
        if (!pw2.value) { matchErr.classList.add('d-none'); return; }
        if (pw1.value !== pw2.value) matchErr.classList.remove('d-none');
        else matchErr.classList.add('d-none');
    }
    pw1 && pw1.addEventListener('input', checkMatch);
    pw2 && pw2.addEventListener('input', checkMatch);

    // Form submitte eşleşme kontrolü
    const form = document.getElementById('rmd-register-form');
    const submitBtn = document.getElementById('rmd-submit-btn');
    form && form.addEventListener('submit', function(e){
        if (pw1 && pw2 && pw1.value !== pw2.value){
            e.preventDefault();
            matchErr.classList.remove('d-none');
            pw2.focus();
            return;
        }
        submitBtn.disabled = true;
        submitBtn.textContent = 'Gönderiliyor...';
    });
});