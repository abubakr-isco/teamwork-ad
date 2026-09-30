// ===== Страница «Статистика» =====

let selectedUserId = null;

const metricTotal = document.getElementById('metricTotal');
const metricCompleted = document.getElementById('metricCompleted');
const metricActive = document.getElementById('metricActive');
const metricPercent = document.getElementById('metricPercent');
const ranking = document.getElementById('ranking');
const selectedTitle = document.getElementById('selectedTitle');
const selectedTasks = document.getElementById('selectedTasks');

function getMetrics() {
  const total = todos.length;
  const completed = todos.filter(task => task.completed === true).length;
  const active = todos.filter(task => task.completed === false).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, active, percent };
}

function getUserRanking() {
  const users = new Map();

  todos.forEach(task => {
    if (!users.has(task.userId)) {
      users.set(task.userId, { userId: task.userId, total: 0, completed: 0 });
    }

    const user = users.get(task.userId);
    user.total += 1;
    if (task.completed === true) user.completed += 1;
  });

  return Array.from(users.values())
    .map(user => ({
      ...user,
      percent: user.total === 0 ? 0 : Math.round((user.completed / user.total) * 100)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

function renderMetrics() {
  const metrics = getMetrics();
  metricTotal.textContent = metrics.total;
  metricCompleted.textContent = metrics.completed;
  metricActive.textContent = metrics.active;
  metricPercent.textContent = `${metrics.percent}%`;
}

function renderRanking(users) {
  if (users.length === 0) {
    ranking.innerHTML = '<p class="empty">Нет данных для рейтинга.</p>';
    return;
  }

  ranking.innerHTML = users.map((user, index) => `
    <button
      type="button"
      class="ranking-row ${selectedUserId === user.userId ? 'selected' : ''}"
      onclick="selectUser(${user.userId})"
      aria-label="User ${user.userId}, ${user.completed} из ${user.total}, ${user.percent}%"
    >
      <span class="rank-number">${index + 1}</span>
      <strong class="rank-user">User ${user.userId}</strong>
      <span class="rank-progress" aria-hidden="true">
        <span style="width: ${user.percent}%"></span>
      </span>
      <span class="rank-value">${user.completed} из ${user.total} · ${user.percent}%</span>
    </button>
  `).join('');
}

function renderSelectedUser() {
  if (selectedUserId === null) {
    selectedTitle.textContent = 'Выберите пользователя';
    selectedTasks.innerHTML = '<p class="empty">Нажмите на пользователя в рейтинге.</p>';
    return;
  }

  const userTasks = todos.filter(task => task.userId === selectedUserId);
  selectedTitle.innerHTML = `Задачи User ${selectedUserId} <span>(${userTasks.length})</span>`;

  if (userTasks.length === 0) {
    selectedTasks.innerHTML = '<p class="empty">У пользователя нет задач.</p>';
    return;
  }

  selectedTasks.innerHTML = userTasks.map(task => `
    <div class="selected-task ${task.completed ? 'done' : ''}">
      <span class="selected-check" aria-hidden="true">${task.completed ? '✓' : ''}</span>
      <span class="selected-task-text">${escapeHtml(task.todo)}</span>
      <span class="selected-status">${task.completed ? 'Выполнена' : 'Активна'}</span>
    </div>
  `).join('');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function selectUser(userId) {
  selectedUserId = userId;
  const users = getUserRanking();
  renderRanking(users);
  renderSelectedUser();
}

function render() {
  const users = getUserRanking();
  renderMetrics();

  if (users.length > 0 && selectedUserId === null) {
    selectedUserId = users[0].userId;
  }

  renderRanking(users);
  renderSelectedUser();
}

loadTodos()
  .then(render)
  .catch(function () {
    metricTotal.textContent = '—';
    metricCompleted.textContent = '—';
    metricActive.textContent = '—';
    metricPercent.textContent = '—';
    ranking.innerHTML = '<p class="empty">Не удалось загрузить статистику 😔</p>';
    selectedTasks.innerHTML = '';
  });
