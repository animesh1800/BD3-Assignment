const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;
let cors = require('cors');

app.use(cors());

app.use(express.static('static'));

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

app.get('/tasks/add', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;
  let priority = parseInt(req.query.priority);
  let arr = { taskId: taskId, text: text, priority: priority };
  tasks.push(arr);
  return res.json(tasks);
});

app.get('/tasks', (req, res) => {
  return res.json(tasks);
});

function sortPriorotyBased(tasks1, tasks2) {
  return tasks1.priority - tasks2.priority;
}
app.get('/tasks/sort-by-priority', (req, res) => {
  let result = tasks.sort(sortPriorotyBased);
  return res.json(result);
});

function editTaskPriority(tasksCopy, tasksId, newPriority) {
  let taskIndex = tasksCopy.find((task) => task.taskId === tasksId);
  taskIndex.priority = newPriority;
  return tasksCopy;
}

app.get('/tasks/edit-priority', (req, res) => {
  let tasksId = parseInt(req.query.taskId);
  let newPriority = parseInt(req.query.priority);
  let tasksCopy = tasks.slice();
  let result = editTaskPriority(tasksCopy, tasksId, newPriority);

  return res.json(result);
});

function editTaskText(tasksCopy, tasksId, text) {
  let taskIndex = tasksCopy.findIndex((task) => task.taskId === tasksId);
  tasksCopy[taskIndex].text = text;
  return tasksCopy;
}

app.get('/tasks/edit-text', (req, res) => {
  let tasksId = parseInt(req.query.taskId);
  let text = req.query.text;
  let tasksCopy = tasks.slice();
  let result = editTaskText(tasksCopy, tasksId, text);

  return res.json(result);
});

function shouldDeleteById(task, taskId) {
  return task.taskId != taskId;
}

app.get('/tasks/delete', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let result = tasks.filter((task) => shouldDeleteById(task, taskId));
  return res.json(result);
});

function filterByPriority(task, priority) {
  return task.priority === priority;
}

app.get('/tasks/filter-by-priority', (req, res) => {
  let priority = parseInt(req.query.priority);
  let result = tasks.filter((task) => filterByPriority(task, priority));
  return res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
