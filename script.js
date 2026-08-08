// ---------- Theme toggle ----------
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
});

// ---------- Mobile menu (simple fallback: reuse nav-links) ----------
const navMenuBtn = document.getElementById('nav-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (navMenuBtn) {
  navMenuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '56px';
    navLinks.style.right = '16px';
    navLinks.style.background = 'var(--bg)';
    navLinks.style.border = '1px solid var(--border)';
    navLinks.style.borderRadius = '8px';
    navLinks.style.padding = '16px';
  });
}

// ---------- Resume request modal ----------
const modalOverlay = document.getElementById('resume-modal');
const openModalBtn = document.getElementById('open-resume-modal');
const closeModalBtn = document.getElementById('close-modal');
const stepForm = document.getElementById('modal-step-form');
const stepDone = document.getElementById('modal-step-done');

openModalBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('hidden');
});
closeModalBtn.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
  resetModal();
});
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
    resetModal();
  }
});

function resetModal() {
  stepForm.classList.remove('hidden');
  stepDone.classList.add('hidden');
  document.getElementById('resume-request-form').reset();
  document.getElementById('request-status').textContent = '';
}

document.getElementById('resume-request-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('request-status');
  status.textContent = 'Sending…';

  const payload = {
    name: form.name.value,
    email: form.email.value,
    purpose: form.purpose.value,
    mobile: form.mobile.value,
  };

  try {
    const res = await fetch('/api/request-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');

    status.textContent = '';
    stepForm.classList.add('hidden');
    stepDone.classList.remove('hidden');
  } catch (err) {
    status.textContent = err.message;
  }
});

// ---------- Guidance form ----------
document.getElementById('guidance-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('guidance-status');
  status.textContent = 'Sending…';

  const payload = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
  };

  try {
    const res = await fetch('/api/send-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Could not send. Try again.');
    status.textContent = 'Sent — thanks, I\'ll reply by email.';
    form.reset();
  } catch (err) {
    status.textContent = err.message;
  }
});
