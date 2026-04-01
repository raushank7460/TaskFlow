const Task = require("../models/taskModel");
const User = require("../models/userModel");


const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Saare tasks fetch karo
    const allTasks = await Task.find({ user: userId });

    // Task counts by status
    const totalTasks = allTasks.length;
    const pendingTasks = allTasks.filter((t) => t.status === "pending").length;
    const inProgressTasks = allTasks.filter((t) => t.status === "in-progress").length;
    const completedTasks = allTasks.filter((t) => t.status === "completed").length;

    // Task counts by priority
    const highPriority = allTasks.filter((t) => t.priority === "high").length;
    const mediumPriority = allTasks.filter((t) => t.priority === "medium").length;
    const lowPriority = allTasks.filter((t) => t.priority === "low").length;

    // Aaj due tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueTodayTasks = allTasks.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return due >= today && due < tomorrow;
    });

    // Overdue tasks (due date nikal gayi aur complete nahi)
    const overdueTasks = allTasks.filter((t) => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < today && t.status !== "completed";
    });

    // Recent 5 tasks
    const recentTasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user: {
        name: req.user.name,
        email: req.user.email,
      },
      stats: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        highPriority,
        mediumPriority,
        lowPriority,
        dueTodayCount: dueTodayTasks.length,
        overdueCount: overdueTasks.length,
      },
      dueTodayTasks,
      overdueTasks,
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sirf task stats
// @route   GET /api/dashboard/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ user: userId });
    const pendingTasks = await Task.countDocuments({ user: userId, status: "pending" });
    const inProgressTasks = await Task.countDocuments({ user: userId, status: "in-progress" });
    const completedTasks = await Task.countDocuments({ user: userId, status: "completed" });
    const highPriority = await Task.countDocuments({ user: userId, priority: "high" });
    const mediumPriority = await Task.countDocuments({ user: userId, priority: "medium" });
    const lowPriority = await Task.countDocuments({ user: userId, priority: "low" });

    // Completion percentage
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      completionRate: `${completionRate}%`,
      priorityBreakdown: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Aaj ke due tasks
// @route   GET /api/dashboard/today
// @access  Private
const getTodayTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = await Task.find({
      user: userId,
      dueDate: { $gte: today, $lt: tomorrow },
    }).sort({ priority: -1 });

    res.json({
      count: todayTasks.length,
      tasks: todayTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Overdue tasks
// @route   GET /api/dashboard/overdue
// @access  Private
const getOverdueTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = await Task.find({
      user: userId,
      dueDate: { $lt: today },
      status: { $ne: "completed" },
    }).sort({ dueDate: 1 });

    res.json({
      count: overdueTasks.length,
      tasks: overdueTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getTaskStats,
  getTodayTasks,
  getOverdueTasks,
};