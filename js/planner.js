// ===== Страница «Планировщик» =====

const state = {
  filter: 'all',
  query: ''
};

const taskList = document.getElementById('taskList');
const shownText = document.getElementById('shownText');
const countAll = document.getElementById('countAll');
const countActive = document.getElementById('countActive');
const countCompleted = document.getElementById('countCompleted');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const searchInput = document.getElementById('searchInput');
const addForm = document.getElementById('addForm');
const addInput = document.getElementById('addInput');

function getFilteredTodos() {
  let result = todos;

  if (state.filter === 'active') {
    result = result.filter(task => task.completed === false);
  } else if (state.filter === 'completed') {
    result = result.filter(task => task.completed === true);
  }

  if (state.query !== '') {
    const query = state.query.toLowerCase();
    result = result.filter(task => task.todo.toLowerCase().includes(query));
  }

  return result;
}

function getDoneCount() {
  return todos.filter(task => task.completed === true).length;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Оборачивает совпадения с поиском в <mark>, остальной текст экранирует
function highlight(text) {
  if (state.query === '') return escapeHtml(text);

  const lowerText = text.toLowerCase();
  const query = state.query.toLowerCase();
  let html = '';
  let start = 0;
  let index = lowerText.indexOf(query);

  while (index !== -1) {
    html = html + escapeHtml(text.slice(start, index));
    html = html + '<mark>' + escapeHtml(text.slice(index, index + query.length)) + '</mark>';
    start = index + query.length;
    index = lowerText.indexOf(query, start);
  }

  return html + escapeHtml(text.slice(start));
}

function renderList(list) {
  if (list.length === 0) {
    taskList.innerHTML = '<p class="empty">Ничего не найдено</p>';
  } else {
    let html = '';

    for (let i = 0; i < list.length; i++) {
      const task = list[i];

      html = html + `
        <div class="task ${task.completed ? 'done' : ''}" onclick="toggleTodo(${task.id})">
          <button class="check" type="button" aria-label="${task.completed ? 'Снять отметку' : 'Отметить выполненной'}"></button>
          <p class="task-text">${highlight(task.todo)}</p>
          <span class="user">User ${task.userId}</span>
          <button class="delete" type="button" onclick="deleteTodo(event, ${task.id})" aria-label="Удалить задачу">×</button>
        </div>
      `;
    }

    taskList.innerHTML = html;
  }

  shownText.textContent = `Показано ${list.length} из ${todos.length}`;
}

function updateCounters() {
  const done = getDoneCount();
  countAll.textContent = todos.length;
  countActive.textContent = todos.length - done;
  countCompleted.textContent = done;
}

function updateProgress() {
  const done = getDoneCount();
  const total = todos.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  progressFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
  progressText.textContent = `Выполнено ${percent}% (${done} из ${total})`;
}

function render() {
  renderList(getFilteredTodos());
  updateCounters();
  updateProgress();
}

function toggleTodo(id) {
  const task = todos.find(item => item.id === id);
  if (!task) return;

  task.completed = !task.completed;
  render();
}

function setFilter(filter) {
  state.filter = filter;

  document.querySelectorAll('.tab').forEach(tab => {
    const isActive = tab.dataset.filter === filter;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  render();
}

searchInput.addEventListener('input', function () {
  state.query = searchInput.value.trim();
  render();
});

// ----- Бонус: своя задача -----

addForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const text = addInput.value.trim();
  if (text === '') return;

  // Новая задача встаёт в начало списка
  todos.unshift({
    id: Date.now(),
    todo: text,
    completed: false,
    userId: 1
  });

  addInput.value = '';
  render();
});

function deleteTodo(event, id) {
  // Иначе клик по «×» всплывёт до строки и отметит задачу
  event.stopPropagation();

  todos = todos.filter(task => task.id !== id);
  render();
}

loadTodos()
  .then(render)
  .catch(function () {
    taskList.innerHTML = '<p class="empty">Не удалось загрузить задачи 😔</p>';
    shownText.textContent = '';
    progressText.textContent = 'Нет данных';
    progressPercent.textContent = '0%';
  });
