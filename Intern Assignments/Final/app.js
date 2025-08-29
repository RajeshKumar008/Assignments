
(() => {
  const $list = document.querySelector('#taskList');
  const $template = document.querySelector('#taskItemTemplate');
  const $empty = document.querySelector('#emptyState');
  const $stats = document.querySelector('#stats');
  const storeKey = 'pro-todo.tasks';

  let tasks = JSON.parse(localStorage.getItem(storeKey)) || [];

  function save() {
    localStorage.setItem(storeKey, JSON.stringify(tasks));
  }

  function render() {
    $list.innerHTML = '';
    if (!tasks.length) { $empty.style.display = 'block'; return; }
    $empty.style.display = 'none';

    tasks.forEach(task => {
      const item = $template.content.cloneNode(true);
      const root = item.querySelector('.task');
      root.dataset.id = task.id;

      const $chk = item.querySelector('.checkbox');
      const $title = item.querySelector('.title');
      const $tags = item.querySelector('.tags');
      const $due = item.querySelector('.due');
      const $prio = item.querySelector('.priority');

      $chk.checked = task.completed;
      $title.textContent = task.title;
      $tags.textContent = (task.tags || []).map(t => "#" + t).join(' ');
      $prio.dataset.level = task.priority;
      $prio.textContent = task.priority;

      if (task.due) {
        const d = new Date(task.due);
        $due.textContent = d.toLocaleDateString();
        if (!task.completed && d < new Date()) $due.classList.add('overdue');
      } else {
        $due.textContent = "no due";
      }

      root.classList.toggle('completed', task.completed);

    
      $chk.addEventListener('change', () => {
        task.completed = $chk.checked;
        save(); render();
      });

      item.querySelector('.deleteBtn').addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        save(); render();
      });

      item.querySelector('.editBtn').addEventListener('click', () => {
        $title.contentEditable = true;
        $title.focus();
      });

      $title.addEventListener('blur', () => {
        task.title = $title.textContent.trim();
        save(); render();
      });

      $list.appendChild(item);
    });

    const active = tasks.filter(t => !t.completed).length;
    $stats.textContent = `${active} active / ${tasks.length} total`;
  }

  
  document.querySelector('#taskForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.querySelector('#titleInput').value.trim();
    if (!title) return;
    const tags = document.querySelector('#tagsInput').value.split(',').map(t => t.trim()).filter(Boolean);
    const due = document.querySelector('#dateInput').value || null;
    const priority = document.querySelector('#priorityInput').value;

    tasks.push({ id: Date.now().toString(), title, tags, due, priority, completed: false });
    save();
    e.target.reset();
    render();
  });

  render();
})();
