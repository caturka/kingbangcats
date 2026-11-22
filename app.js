// app.js - Aman, tidak ada API Key di sini
const form = document.getElementById('formChat');
const input = document.getElementById('input');
const tombol = document.getElementById('tombol');
const status = document.getElementById('status');
const jawaban = document.getElementById('jawaban');

input.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const teks = input.value.trim();
  if (!teks) {
    status.textContent = 'Tolong ketik dulu pesannya.';
    return;
  }

  tombol.disabled = true;
  tombol.textContent = 'Sedang mikir...';
  status.textContent = 'King Bangcats sedang mikir...';
  jawaban.hidden = true;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: teks }),
      signal: controller.signal
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal');

    jawaban.textContent = data.reply;
    jawaban.hidden = false;
    status.textContent = 'Selesai ✅';
    input.value = '';
  } catch (err) {
    if (err.name === 'AbortError') {
      status.textContent = 'Waktu habis 60 detik, coba lagi ya.';
    } else {
      status.textContent = 'Gagal, coba lagi ya. (' + err.message + ')';
    }
  } finally {
    clearTimeout(timer);
    tombol.disabled = false;
    tombol.textContent = 'Kirim ke King Bangcats';
  }
});