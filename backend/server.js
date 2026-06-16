const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "tasks.json");

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const tasks = JSON.parse(data);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// POST task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const tasks = JSON.parse(data);

    const newTask = {
      id: uuidv4(),
      title,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    await fs.writeFile(
      filePath,
      JSON.stringify(tasks, null, 2)
    );

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});