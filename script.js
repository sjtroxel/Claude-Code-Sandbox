const btn = document.getElementById('colorBtn');
let active = false;
btn.addEventListener('click', () => {
  active = !active;
  btn.classList.toggle('active', active);
  btn.textContent = active ? 'Thanks — looking good!' : 'Click me';
  btn.setAttribute('aria-pressed', String(active));
});
