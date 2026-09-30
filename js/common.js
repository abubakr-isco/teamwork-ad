// ===== Общие данные и функции для обеих страниц =====

let todos = [];

function loadTodos() {
  return axios.get('https://dummyjson.com/todos?limit=0')
    .then(function (response) {
      todos = response.data.todos;
      return todos;
    });
}

// ===== Случайная задача (кнопка в шапке) =====

// Модалка создаётся из JS, чтобы не дублировать разметку на каждой странице
function getRandomModal() {
  let modal = document.getElementById('randomModal');

  if (modal === null) {
    modal = document.createElement('div');
    modal.id = 'randomModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-window">
        <button class="modal-close" onclick="closeRandomModal()" aria-label="Закрыть">×</button>
        <p class="modal-label">🎲 Случайная задача</p>
        <p class="modal-text" id="randomText"></p>
        <div class="modal-meta">
          <span class="status" id="randomStatus"></span>
          <span class="user" id="randomUser"></span>
        </div>
      </div>
    `;

    // Клик по затемнённому фону закрывает окно
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeRandomModal();
      }
    });

    document.body.appendChild(modal);
  }

  return modal;
}

function showRandomTodo() {
  const modal = getRandomModal();
  const text = document.getElementById('randomText');
  const status = document.getElementById('randomStatus');
  const user = document.getElementById('randomUser');

  text.textContent = 'Загрузка...';
  status.textContent = '';
  status.style.display = 'none';
  user.style.display = 'none';
  modal.classList.add('open');

  axios.get('https://dummyjson.com/todos/random')
    .then(function (response) {
      const task = response.data;

      text.textContent = task.todo;
      status.textContent = task.completed ? 'Выполнена' : 'Активна';
      status.classList.toggle('done', task.completed);
      status.style.display = '';
      user.textContent = 'User ' + task.userId;
      user.style.display = '';
    })
    .catch(function () {
      text.textContent = 'Не удалось загрузить задачу 😔';
    });
}

function closeRandomModal() {
  getRandomModal().classList.remove('open');
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeRandomModal();
  }
});
