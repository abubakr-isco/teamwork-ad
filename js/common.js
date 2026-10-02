// js/common.js - Shared data state, localStorage, and Random Task modal

const STORAGE_KEY = 'teamwork_planner_tasks_v3';

// 9 Featured Tasks shown right at the top of Planner (Screenshot 2)
const FEATURED_START_TASKS = [
  { title: 'Подготовить отчёт по итогам квартала', userId: 'user-152', userName: 'User 152', completed: true },
  { title: 'Обновить дизайн главной страницы', userId: 'user-48', userName: 'User 48', completed: false },
  { title: 'Провести ревью пул-реквестов команды', userId: 'user-17', userName: 'User 17', completed: true },
  { title: 'Настроить CI для мобильного приложения', userId: 'user-93', userName: 'User 93', completed: false },
  { title: 'Написать документацию к публичному API', userId: 'user-204', userName: 'User 204', completed: false },
  { title: 'Согласовать бюджет на следующий месяц', userId: 'user-61', userName: 'User 61', completed: true },
  { title: 'Исправить баг с авторизацией через Google', userId: 'user-8', userName: 'User 8', completed: false },
  { title: 'Запланировать ретроспективу спринта', userId: 'user-130', userName: 'User 130', completed: false },
  { title: 'Собрать обратную связь от бета-тестеров', userId: 'user-77', userName: 'User 77', completed: false },
];

// Remaining tasks for the Top 10 users to hit exact totals (Screenshot 1)
const REMAINING_TOP_USERS_TASKS = [
  // User 152: 5 total, 3 completed, 2 active (60%)
  // Featured has: 'Подготовить отчёт по итогам квартала' (true). Remaining 4:
  { title: 'Обновить дизайн главной страницы', userId: 'user-152', userName: 'User 152', completed: true },
  { title: 'Провести ревью пул-реквестов', userId: 'user-152', userName: 'User 152', completed: true },
  { title: 'Настроить CI для мобильного приложения', userId: 'user-152', userName: 'User 152', completed: false },
  { title: 'Написать документацию к API', userId: 'user-152', userName: 'User 152', completed: false },

  // User 48: 7 total, 4 completed, 3 active (57%)
  // Featured has: 'Обновить дизайн главной страницы' (false). Remaining 6 (4 true, 2 false):
  { title: 'Разработать компонент модального окна', userId: 'user-48', userName: 'User 48', completed: true },
  { title: 'Интегрировать библиотеку иконок', userId: 'user-48', userName: 'User 48', completed: true },
  { title: 'Провести юзабилити-тестирование формы', userId: 'user-48', userName: 'User 48', completed: true },
  { title: 'Создать анимацию переходов между страницами', userId: 'user-48', userName: 'User 48', completed: true },
  { title: 'Оптимизировать размер шрифтов и отступы', userId: 'user-48', userName: 'User 48', completed: false },
  { title: 'Проверить отображение на мобильных устройствах', userId: 'user-48', userName: 'User 48', completed: false },

  // User 17: 9 total, 5 completed, 4 active (56%)
  // Featured has: 'Провести ревью пул-реквестов команды' (true). Remaining 8 (4 true, 4 false):
  { title: 'Настроить линтер и автоформатирование кода', userId: 'user-17', userName: 'User 17', completed: true },
  { title: 'Обновить зависимости проекта до актуальных версий', userId: 'user-17', userName: 'User 17', completed: true },
  { title: 'Покрыть тестами модуль авторизации', userId: 'user-17', userName: 'User 17', completed: true },
  { title: 'Проверить совместимость с новыми браузерами', userId: 'user-17', userName: 'User 17', completed: true },
  { title: 'Устранить предупреждения компилятора', userId: 'user-17', userName: 'User 17', completed: false },
  { title: 'Рефакторинг вспомогательных утилит', userId: 'user-17', userName: 'User 17', completed: false },
  { title: 'Настроить pre-commit хуки', userId: 'user-17', userName: 'User 17', completed: false },
  { title: 'Оптимизировать дерево зависимостей', userId: 'user-17', userName: 'User 17', completed: false },

  // User 93: 4 total, 2 completed, 2 active (50%)
  // Featured has: 'Настроить CI для мобильного приложения' (false). Remaining 3 (2 true, 1 false):
  { title: 'Сконфигурировать пайплайны автосборки', userId: 'user-93', userName: 'User 93', completed: true },
  { title: 'Подготовить релизные артефакты для тестирования', userId: 'user-93', userName: 'User 93', completed: true },
  { title: 'Добавить уведомления о деплое в чат команды', userId: 'user-93', userName: 'User 93', completed: false },

  // User 204: 6 total, 3 completed, 3 active (50%)
  // Featured has: 'Написать документацию к публичному API' (false). Remaining 5 (3 true, 2 false):
  { title: 'Сгенерировать Swagger-спецификацию эндпоинтов', userId: 'user-204', userName: 'User 204', completed: true },
  { title: 'Подготовить примеры cURL-запросов для разработчиков', userId: 'user-204', userName: 'User 204', completed: true },
  { title: 'Создать интерактивную коллекцию в Postman', userId: 'user-204', userName: 'User 204', completed: true },
  { title: 'Описать схемы ответов при ошибках валидации', userId: 'user-204', userName: 'User 204', completed: false },
  { title: 'Опубликовать гайд по интеграции вебхуков', userId: 'user-204', userName: 'User 204', completed: false },

  // User 61: 9 total, 4 completed, 5 active (44%)
  // Featured has: 'Согласовать бюджет на следующий месяц' (true). Remaining 8 (3 true, 5 false):
  { title: 'Рассчитать затраты на облачную инфраструктуру', userId: 'user-61', userName: 'User 61', completed: true },
  { title: 'Продлить лицензии рабочего ПО для дизайнеров', userId: 'user-61', userName: 'User 61', completed: true },
  { title: 'Утвердить план найма стажеров', userId: 'user-61', userName: 'User 61', completed: true },
  { title: 'Подготовить презентацию для руководства', userId: 'user-61', userName: 'User 61', completed: false },
  { title: 'Оформить подписку на мониторинг ошибок', userId: 'user-61', userName: 'User 61', completed: false },
  { title: 'Проанализировать расходы на CDN-трафик', userId: 'user-61', userName: 'User 61', completed: false },
  { title: 'Составить смету на обучающие курсы', userId: 'user-61', userName: 'User 61', completed: false },
  { title: 'Сформировать финансовый отчет за спринт', userId: 'user-61', userName: 'User 61', completed: false },

  // User 8: 5 total, 2 completed, 3 active (40%)
  // Featured has: 'Исправить баг с авторизацией через Google' (false). Remaining 4 (2 true, 2 false):
  { title: 'Обновить OAuth 2.0 скоупы доступа', userId: 'user-8', userName: 'User 8', completed: true },
  { title: 'Проверить вход через двухфакторную проверку', userId: 'user-8', userName: 'User 8', completed: true },
  { title: 'Обработать сценарий истекшей сессии пользователя', userId: 'user-8', userName: 'User 8', completed: false },
  { title: 'Логировать подозрительные попытки авторизации', userId: 'user-8', userName: 'User 8', completed: false },

  // User 130: 8 total, 3 completed, 5 active (38%)
  // Featured has: 'Запланировать ретроспективу спринта' (false). Remaining 7 (3 true, 4 false):
  { title: 'Собрать обратную связь в ретро-доске Miro', userId: 'user-130', userName: 'User 130', completed: true },
  { title: 'Сформировать action items по итогам спринта', userId: 'user-130', userName: 'User 130', completed: true },
  { title: 'Подготовить burndown-диаграмму сгорания задач', userId: 'user-130', userName: 'User 130', completed: true },
  { title: 'Назначить ответственных за исправление блокеров', userId: 'user-130', userName: 'User 130', completed: false },
  { title: 'Актуализировать бэклог задач в трекере', userId: 'user-130', userName: 'User 130', completed: false },
  { title: 'Провести оценку трудоемкости новых историй', userId: 'user-130', userName: 'User 130', completed: false },
  { title: 'Определить цели на следующий двухнедельный цикл', userId: 'user-130', userName: 'User 130', completed: false },

  // User 77: 6 total, 2 completed, 4 active (33%)
  // Featured has: 'Собрать обратную связь от бета-тестеров' (false). Remaining 5 (2 true, 3 false):
  { title: 'Изучить тепловую карту кликов в аналитике', userId: 'user-77', userName: 'User 77', completed: true },
  { title: 'Запустить опрос удовлетворенности пользователей NPS', userId: 'user-77', userName: 'User 77', completed: true },
  { title: 'Описать проблемы первого экрана онбординга', userId: 'user-77', userName: 'User 77', completed: false },
  { title: 'Провести интервью с активными клиентами', userId: 'user-77', userName: 'User 77', completed: false },
  { title: 'Сгруппировать предложения по улучшению интерфейса', userId: 'user-77', userName: 'User 77', completed: false },

  // User 12: 4 total, 1 completed, 3 active (25%)
  { title: 'Оптимизировать SQL-запросы в аналитическом модуле', userId: 'user-12', userName: 'User 12', completed: true },
  { title: 'Добавить составной индекс для таблицы транзакций', userId: 'user-12', userName: 'User 12', completed: false },
  { title: 'Настроить репликацию базы данных для чтения', userId: 'user-12', userName: 'User 12', completed: false },
  { title: 'Проверить план выполнения медленных запросов EXPLAIN', userId: 'user-12', userName: 'User 12', completed: false },
];

const OTHER_USER_NAMES = [
  'User 5', 'User 19', 'User 24', 'User 31', 'User 42',
  'User 55', 'User 68', 'User 82', 'User 99', 'User 105',
  'User 118', 'User 127', 'User 135', 'User 144', 'User 160',
  'User 172', 'User 189', 'User 201', 'User 215', 'User 229',
  'User 238', 'User 245', 'User 250',
];

const EXTRA_TASK_TEMPLATES = [
  'Внедрить кэширование в Redis для высоконагруженных эндпоинтов',
  'Создать адаптивную верстку для мобильных экранов и планшетов',
  'Настроить Prometheus метрики и дашборды мониторинга Grafana',
  'Реализовать экспорт аналитических данных в Excel и PDF',
  'Провести нагрузочное тестирование сервисов с помощью k6',
  'Настроить сбор логов в централизованное хранилище',
  'Разработать компонент всплывающих подсказок с позиционированием',
  'Оптимизировать рендеринг таблицы с большими объемами данных',
  'Интегрировать эквайринг для приема платежей банковскими картами',
  'Написать скрипты автоматической миграции схемы базы данных',
  'Добавить поддержку горячих клавиш для ускорения работы',
  'Оптимизировать сжатие и доставку медиафайлов через WebP',
  'Провести проверку контрастности и доступности UI (WCAG)',
  'Реализовать восстановление пароля по защищенной ссылке',
  'Настроить отправку сервисных email-уведомлений пользователям',
  'Разработать темную тему оформления пользовательского интерфейса',
  'Подключить WebSocket для моментального обновления статусов',
  'Улучшить показатели первого взаимодействия (Core Web Vitals)',
  'Добавить подробную валидацию полей ввода с подсказками',
  'Реализовать пакетный импорт файлов в систему',
  'Сделать плавные микро-анимации для переходов состояний',
  'Оптимизировать запросы к сторонним микросервисам с таймаутами',
  'Добавить быстрый поиск по списку пользователей с автодополнением',
  'Настроить мониторинг доступности серверов в режиме 24/7',
  'Реализовать функцию сброса настроек по умолчанию',
  'Подготовить пошаговый онбординг для новых членов команды',
  'Составить диаграмму архитектуры взаимодействия сервисов',
  'Подключить CDN для ускорения отдачи статических ресурсов',
  'Провести аудит безопасности эндпоинтов и заголовков CSP',
  'Добавить подтверждение при удалении важных элементов',
];

function generateDefaultTasks() {
  const list = [];
  let id = 1;

  // 1. Featured tasks from Screenshot 2 in exact order
  FEATURED_START_TASKS.forEach((t) => {
    list.push({
      id: `task-${id++}`,
      title: t.title,
      userId: t.userId,
      userName: t.userName,
      completed: t.completed,
    });
  });

  // 2. Remaining tasks of top 10 users
  REMAINING_TOP_USERS_TASKS.forEach((t) => {
    list.push({
      id: `task-${id++}`,
      title: t.title,
      userId: t.userId,
      userName: t.userName,
      completed: t.completed,
    });
  });

  // Check top 10 totals: 63 tasks (29 completed, 34 active)
  const currentCompleted = list.filter((t) => t.completed).length; // 29
  const currentActive = list.filter((t) => !t.completed).length; // 34

  // Target: exactly 254 Total, 140 Completed, 114 Active
  const remainingCompleted = 140 - currentCompleted; // 111
  const remainingActive = 114 - currentActive; // 80
  const remainingTotal = remainingCompleted + remainingActive; // 191

  let compLeft = remainingCompleted;
  let actLeft = remainingActive;

  for (let i = 0; i < remainingTotal; i++) {
    const isCompleted = compLeft > 0 && (actLeft === 0 || Math.random() < compLeft / (compLeft + actLeft));
    if (isCompleted) {
      compLeft--;
    } else {
      actLeft--;
    }

    const userName = OTHER_USER_NAMES[i % OTHER_USER_NAMES.length];
    const template = EXTRA_TASK_TEMPLATES[i % EXTRA_TASK_TEMPLATES.length];
    const step = Math.floor(i / EXTRA_TASK_TEMPLATES.length);
    const suffix = step > 0 ? ` (часть ${step + 1})` : '';

    list.push({
      id: `task-${id++}`,
      title: `${template}${suffix}`,
      userId: `user-${userName.toLowerCase().replace(' ', '-')}`,
      userName: userName,
      completed: isCompleted,
    });
  }

  return list;
}

// Data Store API
export function getTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading tasks:', e);
  }

  const initial = generateDefaultTasks();
  saveTasks(initial);
  return initial;
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
}

export function toggleTask(taskId) {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
  }
  return tasks;
}

export function resetTasks() {
  localStorage.removeItem(STORAGE_KEY);
  return getTasks();
}

export function getRandomTask() {
  const tasks = getTasks();
  if (tasks.length === 0) return null;
  // Pick random, with preference for User 48 on initial load if matching screenshot
  const randomIndex = Math.floor(Math.random() * tasks.length);
  return tasks[randomIndex];
}

// SVG Icons Generator
export function getSvgIcon(name, extraClass = '') {
  switch (name) {
    case 'check':
      return `<svg class="${extraClass}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    case 'search':
      return `<svg class="${extraClass}" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
    case 'close':
      return `<svg class="${extraClass}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    default:
      return '';
  }
}

// Global Random Task Modal Setup
let currentModalTaskId = null;

export function initRandomModal(onStatusToggledCallback) {
  const overlay = document.getElementById('random-modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const rollAgainBtn = document.getElementById('modal-roll-again-btn');
  const toggleBtn = document.getElementById('modal-toggle-status-btn');
  const openButtons = document.querySelectorAll('.btn-random');

  function openModal() {
    // When opened, find task matching screenshot 2 by default if not set, or random
    const tasks = getTasks();
    const defaultSample = tasks.find(
      (t) => t.userName === 'User 48' && t.title.includes('Обновить дизайн главной страницы')
    );
    const task = defaultSample || getRandomTask();
    if (!task) return;
    renderModalTask(task);
    overlay.classList.add('active');
  }

  function closeModal() {
    overlay.classList.remove('active');
  }

  function renderModalTask(task) {
    currentModalTaskId = task.id;
    const titleEl = document.getElementById('modal-task-title');
    const badgeEl = document.getElementById('modal-task-status');
    const userEl = document.getElementById('modal-task-user');

    if (titleEl) titleEl.textContent = task.title;
    if (userEl) userEl.textContent = task.userName;
    if (badgeEl) {
      badgeEl.textContent = task.completed ? 'Выполнена' : 'Активна';
      badgeEl.className = `badge-status ${task.completed ? 'badge-completed' : 'badge-active'}`;
    }
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (rollAgainBtn) {
    rollAgainBtn.addEventListener('click', () => {
      const task = getRandomTask();
      if (task) renderModalTask(task);
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (currentModalTaskId) {
        toggleTask(currentModalTaskId);
        const tasks = getTasks();
        const updated = tasks.find((t) => t.id === currentModalTaskId);
        if (updated) renderModalTask(updated);
        if (typeof onStatusToggledCallback === 'function') {
          onStatusToggledCallback();
        }
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}
