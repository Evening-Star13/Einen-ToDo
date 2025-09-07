document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const themeToggle = document.getElementById('theme-toggle');
    const currentYearSpan = document.getElementById('current-year');

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
    }

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => createTaskElement(task));
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

    // Event listeners for user actions
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    themeToggle.addEventListener('click', toggleTheme);
});
