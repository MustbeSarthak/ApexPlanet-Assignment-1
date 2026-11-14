// Persistent to-do list behaviour.
(function () {
  "use strict";

  var storageKey = "sharthak-portfolio-tasks";
  var tasks = loadTasks();
  var currentFilter = "all";
  var taskForm = document.getElementById("taskForm");
  var taskInput = document.getElementById("taskInput");
  var taskError = document.getElementById("taskError");
  var taskList = document.getElementById("taskList");
  var emptyState = document.getElementById("emptyState");
  var tasksLeft = document.getElementById("tasksLeft");

  function loadTasks() {
    try {
      var savedTasks = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(savedTasks)) {
        return [];
      }
      return savedTasks.filter(function (task) {
        return task && typeof task.id === "string" && typeof task.text === "string" &&
          typeof task.completed === "boolean";
      });
    } catch (error) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
      taskError.hidden = false;
      taskError.textContent = "Tasks could not be saved in this browser.";
    }
  }

  function visibleTasks() {
    return tasks.filter(function (task) {
      return currentFilter === "all" ||
        (currentFilter === "active" && !task.completed) ||
        (currentFilter === "completed" && task.completed);
    });
  }

  function renderTasks() {
    taskList.textContent = "";
    var filteredTasks = visibleTasks();
    emptyState.hidden = filteredTasks.length !== 0;

    filteredTasks.forEach(function (task) {
      var item = document.createElement("li");
      item.className = "task-item" + (task.completed ? " completed" : "");
      item.dataset.id = task.id;

      var checkbox = document.createElement("input");
      checkbox.className = "task-check";
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", "Mark " + task.text + " complete");
      checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      var text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      var actions = document.createElement("div");
      actions.className = "task-actions";
      actions.appendChild(createActionButton("Edit", function () {
        editTask(task.id);
      }));
      actions.appendChild(createActionButton("Delete", function () {
        tasks = tasks.filter(function (candidate) { return candidate.id !== task.id; });
        saveTasks();
        renderTasks();
      }, "delete-button"));

      item.appendChild(checkbox);
      item.appendChild(text);
      item.appendChild(actions);
      taskList.appendChild(item);
    });

    var remaining = tasks.filter(function (task) { return !task.completed; }).length;
    tasksLeft.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");
  }

  function createActionButton(label, handler, extraClass) {
    var button = document.createElement("button");
    button.className = "icon-button" + (extraClass ? " " + extraClass : "");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", handler);
    return button;
  }

  function editTask(id) {
    var task = tasks.find(function (candidate) { return candidate.id === id; });
    if (!task) return;
    var updatedText = window.prompt("Edit task:", task.text);
    if (updatedText === null) return;
    updatedText = updatedText.trim();
    if (!updatedText) {
      taskError.hidden = false;
      taskError.textContent = "A task cannot be empty.";
      return;
    }
    task.text = updatedText;
    taskError.hidden = true;
    saveTasks();
    renderTasks();
  }

  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = taskInput.value.trim();
    if (!text) {
      taskError.hidden = false;
      taskInput.focus();
      return;
    }
    tasks.push({ id: Date.now().toString(), text: text, completed: false });
    taskInput.value = "";
    taskError.hidden = true;
    saveTasks();
    renderTasks();
    taskInput.focus();
  });

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      currentFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(function (filterButton) {
        var selected = filterButton === button;
        filterButton.classList.toggle("active", selected);
        filterButton.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      renderTasks();
    });
  });

  document.getElementById("clearCompleted").addEventListener("click", function () {
    tasks = tasks.filter(function (task) { return !task.completed; });
    saveTasks();
    renderTasks();
  });

  document.getElementById("currentYear").textContent = new Date().getFullYear();
  renderTasks();
}());
