// js/planner.js - Planner page controller

import { getTasks, toggleTask, initRandomModal, getSvgIcon } from './common.js';

let currentFilter = 'all';
let currentSearch = '';

function renderProgress(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const headerEl = document.getElementById('progress-text');
  const fillEl = document.getElementById('progress-fill');

  if (headerEl) {
    headerEl.textContent = `Выполнено ${percentage}% (${completed} из ${total})`;
  }
  if (fillEl) {
    fillEl.style.width = `${percentage}%`;
  }
}

function renderFilterCounts(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  const btnAll = document.getElementById('filter-all');
  const btnActive = document.getElementById('filter-active');
  const btnCompleted = document.getElementById('filter-completed');

  if (btnAll) {
    btnAll.innerHTML = `
      <img src="/public/icon/users.svg" width="16" height="16" alt="" class="icon-filter-users" />
      <span>Все (${total})</span>
    `;
  }
  if (btnActive) btnActive.textContent = `Активные (${active})`;
  if (btnCompleted) btnCompleted.textContent = `Выполненные (${completed})`;
}

function filterTasks(tasks) {
  return tasks.filter((t) => {
    if (currentFilter === 'active' && t.completed) return false;
    if (currentFilter === 'completed' && !t.completed) return false;

    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchUser = t.userName.toLowerCase().includes(q);
      return matchTitle || matchUser;
    }

    return true;
  });
}

function renderTaskList(allTasks) {
  const listEl = document.getElementById('tasks-list');
  const footerEl = document.getElementById('tasks-footer');
  if (!listEl) return;

  const filtered = filterTasks(allTasks);

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <li class="empty-state">
        <div class="empty-state-icon">${getSvgIcon('search', 'w-8 h-8')}</div>
        <p>Задачи не найдены</p>
      </li>
    `;
    if (footerEl) footerEl.textContent = `Показано 0 из ${allTasks.length}`;
    return;
  }

  const checkIcon = getSvgIcon('check');

  listEl.innerHTML = filtered
    .map(
      (task) => `
      <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        <div class="task-main">
          <button type="button" class="task-checkbox-btn" aria-label="Переключить статус">
            <div class="checkbox-circle ${task.completed ? 'checked' : ''}">
              ${task.completed ? checkIcon : ''}
            </div>
          </button>
          <span class="task-title" title="${task.title}">${task.title}</span>
        </div>
        <span class="user-badge">${task.userName}</span>
      </li>
    `
    )
    .join('');

  if (footerEl) {
    footerEl.textContent = `Показано ${filtered.length} из ${allTasks.length}`;
  }

  // Attach click listeners to rows and checkboxes
  listEl.querySelectorAll('.task-item').forEach((item) => {
    const taskId = item.getAttribute('data-task-id');
    const checkboxBtn = item.querySelector('.task-checkbox-btn');
    const titleEl = item.querySelector('.task-title');

    const handleToggle = (e) => {
      e.stopPropagation();
      toggleTask(taskId);
      renderAll();
    };

    if (checkboxBtn) checkboxBtn.addEventListener('click', handleToggle);
    if (titleEl) titleEl.addEventListener('click', handleToggle);
  });
}

function renderAll() {
  const tasks = getTasks();
  renderProgress(tasks);
  renderFilterCounts(tasks);
  renderTaskList(tasks);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize random task modal
  initRandomModal(() => {
    renderAll();
  });

  // 2. Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      const tasks = getTasks();
      renderTaskList(tasks);
    });
  });

  // 3. Search input
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (searchClear) {
        searchClear.classList.toggle('visible', currentSearch.length > 0);
      }
      const tasks = getTasks();
      renderTaskList(tasks);
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
        searchClear.classList.remove('visible');
        const tasks = getTasks();
        renderTaskList(tasks);
      }
    });
  }

  // 4. Initial render
  renderAll();
});
