// Eğer base.html global scriptleri (SweetAlert2, Bootstrap 5, flatpickr) yüklemiyorsa
// buradan eklemeyi düşünebilirsin. Şimdilik mevcut kurulumuna güveniyorum.

(function () {
  // --- CSRF helper ---
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  }
  const csrftoken = getCookie('csrftoken');

  // --- Flatpickr init ---
  if (window.flatpickr) {
    const opts = {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      time_24hr: true,
      locale: "tr",
      minDate: "today",
      defaultDate: null,
      onOpen: function(selectedDates, dateStr, instance) {
        if (!instance.input.value) instance.setDate(new Date());
      }
    };
    const remindAt = document.getElementById("remindAtInput");
    const noteAt = document.getElementById("noteReminderInput");
    if (remindAt) flatpickr(remindAt, opts);
    if (noteAt) flatpickr(noteAt, opts);
  }

  // --- Repeat type toggles ---
  const repeatSelect = document.getElementById("repeatTypeSelect");
  function hideAllRepeatWrappers() {
    ["intervalInputWrapper","customDayWrapper","customWeekdayWrapper"]
      .forEach(id => document.getElementById(id)?.classList.add("d-none"));
  }
  repeatSelect?.addEventListener("change", function () {
    hideAllRepeatWrappers();
    if (this.value === "interval") {
      document.getElementById("intervalInputWrapper")?.classList.remove("d-none");
    } else if (this.value === "custom_day") {
      document.getElementById("customDayWrapper")?.classList.remove("d-none");
    } else if (this.value === "custom_weekday") {
      document.getElementById("customWeekdayWrapper")?.classList.remove("d-none");
    }
  });

  // --- Reminder create (AJAX) ---
  const reminderForm = document.getElementById('reminderForm');
  reminderForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const repeatType = formData.get('repeat_type');
    if (repeatType === 'interval') {
      formData.append('interval_minutes', form.querySelector('[name="interval_minutes"]')?.value || '');
    } else if (repeatType === 'custom_day') {
      formData.append('day_of_month', form.querySelector('[name="day_of_month"]')?.value || '');
    } else if (repeatType === 'custom_weekday') {
      formData.append('day_of_week', form.querySelector('[name="day_of_week"]')?.value || '');
    }

    fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      body: formData
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        if (window.Swal) {
          Swal.fire({ icon: 'success', title: 'Başarılı', text: data.message, timer: 1400, showConfirmButton: false });
        }
        // Liste güncelle
        const list = document.getElementById('reminderList');
        const emptyMsg = document.getElementById('reminderEmpty');
        const li = document.createElement('li');
        li.className = 'list-group-item rmd-list-item d-flex justify-content-between align-items-start';
        const deleteUrl = data.reminder.delete_url || (data.reminder.id ? `reminders/delete/${data.reminder.id}/` : '#');
        li.innerHTML = `
          <div>
            <strong class="rmd-item-title">${data.reminder.title}</strong><br>
            <small class="text-muted">${data.reminder.date}</small>
          </div>
          <button class="btn btn-sm btn-outline-danger ms-2 delete-reminder-btn" data-url="${deleteUrl}">
            <i class="bi bi-x-lg"></i>
          </button>
        `;
        if (list) {
          list.prepend(li);
        } else {
          const newList = document.createElement('ul');
          newList.id = 'reminderList';
          newList.className = 'list-group list-group-flush';
          newList.appendChild(li);
          const pane = document.querySelector('#pane-reminders .rmd-scrollable');
          if (pane) { pane.innerHTML = ''; pane.appendChild(newList); }
        }
        emptyMsg && emptyMsg.remove();
        form.reset();
      } else {
        window.Swal ? Swal.fire({ icon: 'error', title: 'Hata', text: data.message }) : alert(data.message);
      }
    })
    .catch(err => {
      console.error('İstek hatası:', err);
      window.Swal ? Swal.fire({ icon: 'error', title: 'Hata', text: 'Sunucu ile iletişimde hata oluştu.' }) : alert('Sunucu hatası');
    });
  });

  // --- Note create (AJAX) ---
  const noteForm = document.getElementById('noteForm');
  noteForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    fetch(form.getAttribute('action'), {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      body: formData
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        if (window.Swal) {
          Swal.fire({ icon: 'success', title: 'Başarılı', text: data.message, timer: 1400, showConfirmButton: false });
        }
        const notesBody = document.getElementById('notesBody');
        let grid = document.getElementById('notesGrid');
        const emptyMsg = document.getElementById('notesEmpty');
        if (!grid) {
          grid = document.createElement('div');
          grid.id = 'notesGrid';
          grid.className = 'row row-cols-1 row-cols-md-2 g-3';
          notesBody && (notesBody.innerHTML = '');
          notesBody && notesBody.appendChild(grid);
        }
        const col = document.createElement('div');
        col.className = 'col rmd-note-col';
        const deleteUrl = data.note.delete_url || (data.note.id ? `notes/delete/${data.note.id}/` : '#');
        col.innerHTML = `
          <div class="card h-100 rmd-note-card">
            <div class="card-body d-flex justify-content-between align-items-start position-relative">
              <div>
                <h6 class="card-title rmd-note-title">${data.note.title}</h6>
                <p class="card-text text-muted rmd-note-text">${data.note.content}</p>
                ${data.note.reminder_date ? `<span class="badge bg-warning text-dark">Hatırlatma: ${data.note.reminder_date}</span>` : ''}
              </div>
              <button class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 delete-note-btn" data-url="${deleteUrl}">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        `;
        grid.prepend(col);
        emptyMsg && emptyMsg.remove();
        form.reset();

        if (window.bootstrap) {
          const modalEl = document.getElementById('addNoteModal');
          const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          modal.hide();
        }
      } else {
        window.Swal ? Swal.fire({ icon: 'error', title: 'Hata', text: data.message }) : alert(data.message);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      window.Swal ? Swal.fire({ icon: 'error', title: 'Hata', text: 'İstek gönderilirken bir hata oluştu.' }) : alert('Sunucu hatası');
    });
  });

  // --- Delete handlers (event delegation) ---
  document.addEventListener('click', function (e) {
    // Reminder delete
    const remBtn = e.target.closest('.delete-reminder-btn');
    if (remBtn) {
      const url = remBtn.dataset.url;
      const confirmAndDelete = () => {
        fetch(url, { method: 'POST', headers: { 'X-CSRFToken': csrftoken }})
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            if (window.Swal) Swal.fire('Silindi', data.message, 'success');
            const li = remBtn.closest('li');
            li && li.remove();
            const list = document.getElementById('reminderList');
            if (!list || list.children.length === 0) {
              const pane = document.querySelector('#pane-reminders .rmd-scrollable');
              if (pane) pane.innerHTML = '<div class="rmd-empty"><i class="bi bi-bell-slash"></i><p>Henüz bir hatırlatıcınız yok.</p></div>';
            }
          } else {
            window.Swal ? Swal.fire('Hata', data.message, 'error') : alert(data.message);
          }
        })
        .catch(() => window.Swal ? Swal.fire('Hata','Silme işlemi başarısız.','error') : alert('Silme işlemi başarısız'));
      };

      if (window.Swal) {
        Swal.fire({
          title:'Emin misiniz?', text:'Bu hatırlatıcı silinecek!',
          icon:'warning', showCancelButton:true,
          confirmButtonColor:'#d33', cancelButtonColor:'#3085d6',
          confirmButtonText:'Evet, sil!', cancelButtonText:'Vazgeç'
        }).then(res => res.isConfirmed && confirmAndDelete());
      } else {
        if (confirm('Silinsin mi?')) confirmAndDelete();
      }
    }

    // Note delete
    const noteBtn = e.target.closest('.delete-note-btn');
    if (noteBtn) {
      const url = noteBtn.dataset.url;
      const confirmAndDelete = () => {
        fetch(url, { method:'POST', headers:{ 'X-CSRFToken': csrftoken }})
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            if (window.Swal) Swal.fire('Silindi', data.message, 'success');
            const col = noteBtn.closest('.col');
            col && col.remove();
            const grid = document.getElementById('notesGrid');
            if (!grid || grid.children.length === 0) {
              const nb = document.getElementById('notesBody');
              if (nb) nb.innerHTML = '<div class="rmd-empty"><i class="bi bi-journal-x"></i><p>Henüz bir notunuz yok.</p></div>';
            }
          } else {
            window.Swal ? Swal.fire('Hata', data.message, 'error') : alert(data.message);
          }
        })
        .catch(() => window.Swal ? Swal.fire('Hata','Silme işlemi başarısız.','error') : alert('Silme işlemi başarısız'));
      };

      if (window.Swal) {
        Swal.fire({
          title:'Emin misiniz?', text:'Bu not silinecek!',
          icon:'warning', showCancelButton:true,
          confirmButtonColor:'#d33', cancelButtonColor:'#3085d6',
          confirmButtonText:'Evet, sil!', cancelButtonText:'Vazgeç'
        }).then(res => res.isConfirmed && confirmAndDelete());
      } else {
        if (confirm('Silinsin mi?')) confirmAndDelete();
      }
    }
  });

  /* === EKLEMELER === */

  // 1) Not arama (başlık + içerik üzerinde client-side filtre)
  const noteSearch = document.getElementById('noteSearch');
  noteSearch?.addEventListener('input', function(){
    const q = this.value.trim().toLowerCase();
    const items = document.querySelectorAll('#notesGrid .rmd-note-col');
    let visible = 0;
    items.forEach(col => {
      const title = col.querySelector('.rmd-note-title')?.textContent.toLowerCase() || '';
      const text  = col.querySelector('.rmd-note-text')?.textContent.toLowerCase() || '';
      const show = title.includes(q) || text.includes(q);
      col.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (items.length && visible === 0){
      document.getElementById('notesBody').dataset.empty = '1';
    } else {
      delete document.getElementById('notesBody').dataset.empty;
    }
  });

  // 2) Hızlı tarih çipleri (Bugün 18:00 / Yarın 09:00)
  function pad(n){ return n < 10 ? '0'+n : n; }
  document.querySelectorAll('.rmd-q-time').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const now = new Date();
      let target = new Date(now);
      if (btn.dataset.q === 'today-18'){
        target.setHours(18,0,0,0);
        if (target < now) target = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 18,0,0,0);
      } else if (btn.dataset.q === 'tomorrow-09'){
        target = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 9,0,0,0);
      }
      const formatted = `${target.getFullYear()}-${pad(target.getMonth()+1)}-${pad(target.getDate())} ${pad(target.getHours())}:${pad(target.getMinutes())}`;
      const input = document.getElementById('remindAtInput');
      if (input){
        input.value = formatted;
        // flatpickr varsa input değerini de senkronla
        if (input._flatpickr) input._flatpickr.setDate(target, true);
      }
    });
  });

})();


document.addEventListener('shown.bs.modal', function (e) {
  if (e.target.id === 'addNoteModal') {
    e.target.querySelector('input[name="title"]')?.focus();
  }
});
