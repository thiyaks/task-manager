const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("🚀 Task Manager API is running");
});

const FILE = "tasks.json";

if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
}

/* GET TASKS */
app.get("/tasks", (req, res) => {
    const tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    res.json(tasks);
});

/* ADD TASK */
app.post("/tasks", (req, res) => {

    const tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    const newTask = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        status: "Pending"
    };

    tasks.push(newTask);

    fs.writeFileSync(
        FILE,
        JSON.stringify(tasks, null, 2)
    );

    res.json(newTask);
});

/* UPDATE TASK */
app.put("/tasks/:id", (req, res) => {

    let tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    tasks = tasks.map(task => {

        if (task.id == req.params.id) {
            return {
                ...task,
                ...req.body
            };
        }

        return task;
    });

    fs.writeFileSync(
        FILE,
        JSON.stringify(tasks, null, 2)
    );

    res.json({
        message: "Task Updated"
    });
});

/* DELETE TASK */
app.delete("/tasks/:id", (req, res) => {

    let tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    tasks = tasks.filter(
        task => task.id != req.params.id
    );

    fs.writeFileSync(
        FILE,
        JSON.stringify(tasks, null, 2)
    );

    res.json({
        message: "Task Deleted"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on", PORT);
});
