const STORAGE_KEY = 'pixel-party-tasks';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'all';
const list = document.querySelector('#task-list');
const empty = document.querySelector('#empty-state');
const remaining = document.querySelector('#remaining');

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function render() {
  const visible = tasks.filter(task => filter === 'all' || (filter === 'active' ? !task.done : task.done));
  list.innerHTML = visible.map(task => `<li class="task ${task.done ? 'done' : ''}" data-id="${task.id}"><input type="checkbox" ${task.done ? 'checked' : ''} aria-label="Complete ${escapeHtml(task.text)}"><span>${escapeHtml(task.text)}</span><button class="delete" type="button" aria-label="Delete ${escapeHtml(task.text)}">×</button></li>`).join('');
  empty.hidden = visible.length > 0;
  remaining.textContent = tasks.filter(task => !task.done).length;
  const percent = tasks.length ? Math.round(tasks.filter(task => task.done).length / tasks.length * 100) : 0;
  document.querySelector('#progress-label').textContent = `${percent}%`;
  document.querySelector('#progress-fill').style.width = `${percent}%`;
}
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
document.querySelector('#task-form').addEventListener('submit', event => { event.preventDefault(); const input = document.querySelector('#task-input'); const text = input.value.trim(); if (!text) return; tasks.unshift({ id: crypto.randomUUID(), text, done: false }); input.value = ''; save(); render(); input.focus(); });
list.addEventListener('change', event => { const task = tasks.find(item => item.id === event.target.closest('.task').dataset.id); task.done = event.target.checked; save(); render(); });
list.addEventListener('click', event => { if (!event.target.matches('.delete')) return; const id = event.target.closest('.task').dataset.id; tasks = tasks.filter(task => task.id !== id); save(); render(); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button)); render(); }));
document.querySelector('#clear-completed').addEventListener('click', () => { tasks = tasks.filter(task => !task.done); save(); render(); });
render();
