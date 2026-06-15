// 🔒 Protect page (must be first line)
if (!localStorage.getItem("user")) {
    window.location.href = "login.html";
}
let tasks = [];

/* =========================
   LOAD TASKS FROM BACKEND
========================= */

function loadTasks() {
    fetch("http://localhost:5000/tasks")
    .then(res => res.json())
    .then(data => {
        tasks = data;
        displayTasks();
    })
    .catch(err => console.log("Error loading tasks:", err));
}

/* =========================
   ADD TASK
========================= */

function addTask() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    if (!title) {
        alert("Enter task title");
        return;
    }

    fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            description,
            dueDate,
            priority
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Task Added 🚀");
        loadTasks();
    });
}

/* =========================
   DISPLAY TASKS
========================= */

function displayTasks() {

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let completed = 0;

    if (tasks.length === 0) {
        taskList.innerHTML = "<p>No tasks found</p>";
    }

    tasks.forEach(task => {

        if (task.status === "Completed") {
            completed++;
        }

        taskList.innerHTML += `
        <div class="task">

            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Due: ${task.dueDate || "Not set"}</p>

            <p class="priority-${task.priority}">
                ${task.priority}
            </p>

            <p class="${task.status === "Completed" ? "completed" : "pending"}">
                ${task.status}
            </p>

            <button onclick="completeTask(${task.id})">Complete</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>

        </div>
        `;
    });

    /* Stats */
    document.getElementById("totalTasks").innerText = tasks.length;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = tasks.length - completed;

    /* Progress */
    let progress = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    document.getElementById("progressPercent").innerText = progress + "%";
    document.getElementById("progressText").innerText = progress + "% Completed";
    document.getElementById("progressFill").style.width = progress + "%";
if (progress === 100 && tasks.length > 0) {

    // 🎉 Confetti burst
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
    });

    // Optional extra burst
    setTimeout(() => {
        confetti({
            particleCount: 80,
            spread: 120
        });
    }, 500);

    // Show reward message
    document.getElementById("progressText").innerText =
        "🎉 Day completed like a pro!";
}
}

/* =========================
   COMPLETE TASK
========================= */

function completeTask(id) {

    fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Completed"
        })
    })
    .then(() => loadTasks());
}

/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    if (confirm("Delete this task?")) {

        fetch(`http://localhost:5000/tasks/${id}`, {
            method: "DELETE"
        })
        .then(() => loadTasks());
    }
}

/* =========================
   EDIT TASK
========================= */

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    const newTitle = prompt("Edit Title", task.title);
    const newDesc = prompt("Edit Description", task.description);
    const newDate = prompt("Edit Due Date", task.dueDate);

    if (!newTitle) return;

    fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: newTitle,
            description: newDesc,
            dueDate: newDate
        })
    })
    .then(() => loadTasks());
}

/* =========================
   SEARCH TASKS
========================= */

function searchTasks() {

    const value = document.getElementById("search").value.toLowerCase();

    document.querySelectorAll(".task").forEach(task => {

        const text = task.innerText.toLowerCase();

        task.style.display = text.includes(value)
            ? "block"
            : "none";
    });
}

/* =========================
   DARK MODE
========================= */

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

/* =========================
   LIVE CLOCK
========================= */

setInterval(() => {

    const timeElement = document.getElementById("currentTime");

    if (timeElement) {
        timeElement.innerText = new Date().toLocaleString();
    }

}, 1000);

/* =========================
   INIT
========================= */

loadTasks();
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
function showSection(section) {

    const sections = [
        "dashboardSection",
        "tasksSection",
        "scheduleSection",
        "settingsSection"
    ];

    // hide all sections
    sections.forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove("active");
    });

    // show selected
    let activeId = "";

    if (section === "dashboard") activeId = "dashboardSection";
    if (section === "tasks") activeId = "tasksSection";
    if (section === "schedule") activeId = "scheduleSection";
    if (section === "settings") activeId = "settingsSection";

    const activeEl = document.getElementById(activeId);

    // small delay for smooth animation reset
    setTimeout(() => {
        activeEl.classList.add("active");
    }, 50);
}
window.onload = () => {
    showSection("dashboard");
};