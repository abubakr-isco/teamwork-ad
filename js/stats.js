// js/stats.js - Statistics page controller

import { getTasks, toggleTask, initRandomModal, getSvgIcon } from './common.js';

const TOP_USER_IDS = [
  'user-152',
  'user-48',
  'user-17',
  'user-93',
  'user-204',
  'user-61',
  'user-8',
  'user-130',
  'user-77',
  'user-12',
];

let selectedUserId = 'user-152';

function renderKpis(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const totalEl = document.getElementById('stat-total');
  const completedEl = document.getElementById('stat-completed');
  const activeEl = document.getElementById('stat-active');
  const percentageEl = document.getElementById('stat-percentage');

  if (totalEl) totalEl.textContent = total;
  if (completedEl) completedEl.textContent = completed;
  if (activeEl) activeEl.textContent = active;
  if (percentageEl) percentageEl.textContent = `${percentage}%`;
}

function computeTopUsers(tasks) {
  const userMap = new Map();

  tasks.forEach((t) => {
    const existing = userMap.get(t.userId) || {
      id: t.userId,
      name: t.userName,
      total: 0,
      completed: 0,
    };
    existing.total += 1;
    if (t.completed) existing.completed += 1;
    userMap.set(t.userId, existing);
  });

  const list = [];
  TOP_USER_IDS.forEach((uid) => {
    const u = userMap.get(uid);
    if (u) {
      const percentage = u.total > 0 ? Math.round((u.completed / u.total) * 100) : 0;
      list.push({
        ...u,
        percentage,
      });
    }
  });

  // Sort descending by percentage
  list.sort((a, b) => b.percentage - a.percentage || b.completed - a.completed);

  return list.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

function renderTopUsers(tasks) {
  const container = document.getElementById('users-list');
  if (!container) return;

  const topUsers = computeTopUsers(tasks);

  // If selectedUserId is not in topUsers, pick the first
  if (!topUsers.some((u) => u.id === selectedUserId) && topUsers.length > 0) {
    selectedUserId = topUsers[0].id;
  }

  container.innerHTML = topUsers
    .map((user) => {
      const isSelected = user.id === selectedUserId;
      return `
        <div class="user-row ${isSelected ? 'selected' : ''}" data-user-id="${user.id}">
          <span class="user-rank">${user.rank}</span>
          <span class="user-name" title="${user.name}">${user.name}</span>
          <div class="user-progress-bar">
            <div class="user-progress-fill" style="width: ${user.percentage}%"></div>
          </div>
          <span class="user-stats">${user.completed} из ${user.total} · ${user.percentage}%</span>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('.user-row').forEach((row) => {
    row.addEventListener('click', () => {
      selectedUserId = row.getAttribute('data-user-id');
      renderAll();
    });
  });
}

function renderUserTasks(tasks) {
  const titleEl = document.getElementById('user-tasks-title');
  const listEl = document.getElementById('user-tasks-list');
  if (!listEl) return;

  const topUsers = computeTopUsers(tasks);
  const currentUser = topUsers.find((u) => u.id === selectedUserId) || topUsers[0];

  if (!currentUser) {
    listEl.innerHTML = '<p class="empty-state">Пользователь не найден</p>';
    return;
  }

  const userTasks = tasks.filter((t) => t.userId === currentUser.id);

  if (titleEl) {
    titleEl.textContent = `Задачи ${currentUser.name} (${userTasks.length})`;
  }

  const checkIcon = getSvgIcon('check');

  listEl.innerHTML = userTasks
    .map(
      (task) => `
      <div class="user-task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        <div class="user-task-main">
          <button type="button" class="task-checkbox-btn" aria-label="Переключить статус">
            <div class="checkbox-circle ${task.completed ? 'checked' : ''}">
              ${task.completed ? checkIcon : ''}
            </div>
          </button>
          <span class="user-task-title" title="${task.title}">${task.title}</span>
        </div>
        <span class="badge-status ${task.completed ? 'badge-completed' : 'badge-active'}">
          ${task.completed ? 'Выполнена' : 'Активна'}
        </span>
      </div>
    `
    )
    .join('');

  listEl.querySelectorAll('.user-task-item').forEach((item) => {
    const taskId = item.getAttribute('data-task-id');
    const checkboxBtn = item.querySelector('.task-checkbox-btn');
    const title = item.querySelector('.user-task-title');

    const handleToggle = (e) => {
      e.stopPropagation();
      toggleTask(taskId);
      renderAll();
    };

    if (checkboxBtn) checkboxBtn.addEventListener('click', handleToggle);
    if (title) title.addEventListener('click', handleToggle);
  });
}

function renderAll() {
  const tasks = getTasks();
  renderKpis(tasks);
  renderTopUsers(tasks);
  renderUserTasks(tasks);
}

document.addEventListener('DOMContentLoaded', () => {
  initRandomModal(() => {
    renderAll();
  });

  renderAll();
});
