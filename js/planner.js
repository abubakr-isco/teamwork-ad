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
const searchInput = document.getElementById('searchInput');
const addForm = document.getElementById('addForm');
const addInput = document.getElementById('addInput');

// Вкладка и поиск проходят через одну функцию и не сбрасывают друг друга
function getFilteredTodos() {
  let result = todos;

  if (state.filter === 'active') {
    result = result.filter(t => t.completed === false);
  }
  if (state.filter === 'completed') {
    result = result.filter(t => t.completed === true);
  }
  if (state.query !== '') {
    result = result.filter(t =>
      t.todo.toLowerCase().includes(state.query.toLowerCase())
    );
  }

  return result;
}

function getDoneCount() {
  return todos.filter(t => t.completed === true).length;
}

// Текст задачи может ввести пользователь — экранируем HTML
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderList(list) {
  if (list.length === 0) {
    taskList.innerHTML = '<p class="empty">Ничего не найдено</p>';
  } else {
    let html = '';

    for (let i = 0; i < list.length; i++) {
      const task = list[i];

      html = html + `
        <div class="task ${task.completed ? 'done' : ''}"
             onclick="toggleTodo(${task.id})">
          <span class="check"></span>
          <p>${escapeHtml(task.todo)}</p>
          <span class="user">User ${task.userId}</span>
          <button class="delete" onclick="deleteTodo(event, ${task.id})" title="Удалить">×</button>
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
  const percent = total === 0 ? 0 : Math.round(done / total * 100);

  progressFill.style.width = percent + '%';
  progressText.textContent = `Выполнено ${percent}% (${done} из ${total})`;
}

function render() {
  renderList(getFilteredTodos());
  updateCounters();
  updateProgress();
}

function toggleTodo(id) {
  const task = todos.find(t => t.id === id);
  task.completed = !task.completed;
  render();
}

function setFilter(filter) {
  state.filter = filter;

  const tabs = document.querySelectorAll('.tab');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.toggle('active', tabs[i].dataset.filter === filter);
  }

  render();
}

searchInput.addEventListener('input', function () {
  state.query = searchInput.value.trim();
  render();
});

// ----- Бонус: добавление и удаление задач -----

addForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const text = addInput.value.trim();
  if (text === '') {
    return;
  }

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
  // Чтобы клик по «×» не отмечал задачу выполненной
  event.stopPropagation();

  todos = todos.filter(t => t.id !== id);
  render();
}

// ----- Старт -----

loadTodos()
  .then(function () {
    render();
  })
  .catch(function () {
    taskList.innerHTML = '<p class="empty">Не удалось загрузить задачи 😔</p>';
    progressText.textContent = 'Нет данных';
  });
