const Task = require("../models/taskModel");

// @desc    Naya task banao
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logged-in user ke saare tasks dekho
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Optional filters: status, priority
    const filter = { user: req.user._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ek specific task dekho
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task nahi mila" });
    }

    // Check karo ye task is user ka hai ya nahi
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Is task ko dekhne ki permission nahi hai" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Task update karo
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task nahi mila" });
    }

    // Check karo ye task is user ka hai ya nahi
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Is task ko update karne ki permission nahi hai" });
    }

    const { title, description, status, priority, dueDate } = req.body;

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Task delete karo
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task nahi mila" });
    }

    // Check karo ye task is user ka hai ya nahi
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Is task ko delete karne ki permission nahi hai" });
    }

    await task.deleteOne();
    res.json({ message: "Task successfully delete ho gaya" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};