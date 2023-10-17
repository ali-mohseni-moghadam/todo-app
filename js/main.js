const taskInput = document.querySelector("#task-input");
const dateInput = document.querySelector("#date-input");
const addButton = document.querySelector("#add-button");
const alertMessage = document.querySelector("#alert-message");
const todosBody = document.querySelector("tbody");
const DeleteAllButton = document.querySelector("#delete-all-button");
const editButton = document.querySelector("#edit-button");
const filterButton = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";

  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  const todosList = data ? data : todos;
  todosBody.innerHTML = "";
  if (!todosList.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>No task found!</td></tr>";
    return;
  }

  todosList.forEach((todo) => {
    todosBody.innerHTML += `
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date || "No Date"}</td>
            <td>${todo.completed ? "Completed" : "Pending"}</td>
            <td>
                <button onclick="editHandler('${todo.id}')">Edit</button>
                <button onclick="toggleHandler('${todo.id}')">
                    ${todo.completed ? "Undo" : "Do"}
                </button>
                <button onclick="deleteHandler('${todo.id}')">Delete</button>
            </td>
        </tr>
    `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    task: task,
    date: date,
    completed: false,
  };

  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("todo added successfully", "success");
  } else {
    showAlert("Please enter a todo", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos cleared successfully", "success");
  } else {
    showAlert("No todos to clear", "error");
  }
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo status change successfully", "success");
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo deleted successfully", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo edited successfully", "success");
};

const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filteredTodos = todos;
      break;
  }
  saveToLocalStorage();
  displayTodos(filteredTodos);
};

window.addEventListener("load", displayTodos);
addButton.addEventListener("click", addHandler);
DeleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButton.forEach((btn) => {
  btn.addEventListener("click", filterHandler);
});
