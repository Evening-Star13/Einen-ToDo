document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const themeToggle = document.getElementById('theme-toggle');
    const currentYearSpan = document.getElementById('current-year');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    // Set the current year
    currentYearSpan.textContent = new Date().getFullYear();

    // Load tasks and theme from local storage
    loadTasks();
    loadTheme();

    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = {
                text: taskText,
                completed: false
            };
            createTaskElement(task);
            saveTasks();
            taskInput.value = '';
        }
    }

    // Create and append a task element to the list
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="delete-btn">&times;</button>
        `;

        // Event listener for marking task as complete
        li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            const span = e.target.nextElementSibling;
            span.classList.toggle('completed');
            saveTasks();
        });

        // Event listener for deleting a task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        // Event listener for editing a task
        li.querySelector('.task-text').addEventListener('click', (e) => {
            const span = e.target;
            const originalText = span.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'task-item-edit-input';
            input.value = originalText;

            span.replaceWith(input);
            input.focus();

            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText !== '') {
                    span.textContent = newText;
                } else {
                    span.textContent = originalText;
                }
                input.replaceWith(span);
                saveTasks();
            };

            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });
        });

        taskList.appendChild(li);
    }

    // Save tasks to local storage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.querySelector('input[type="checkbox"]').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateClearButtonVisibility();
    }

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => createTaskElement(task));
        updateClearButtonVisibility();
    }

    // Toggle dark mode
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    }

    // Load theme from local storage
    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }
    }

    // Update the visibility of the "Clear Completed" button
    function updateClearButtonVisibility() {
        const completedTasks = document.querySelectorAll('.task-text.completed').length;
        if (completedTasks > 0) {
            clearCompletedBtn.style.display = 'block';
        } else {
            clearCompletedBtn.style.display = 'none';
        }
    }

    // Event listeners for user actions
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    themeToggle.addEventListener('click', toggleTheme);
    clearCompletedBtn.addEventListener('click', () => {
        document.querySelectorAll('.task-item').forEach(item => {
            if (item.querySelector('input[type="checkbox"]').checked) {
                item.remove();
            }
        });
        saveTasks();
    });
});
