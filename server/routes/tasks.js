
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks (filtered by userId)
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        const tasks = await Task.find({ userId }).sort({ date: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get stats
router.get('/stats', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        const total = await Task.countDocuments({ userId });
        const completed = await Task.countDocuments({ userId, status: 'Completed' });
        const inProgress = await Task.countDocuments({ userId, status: 'InProgress' });
        const todo = await Task.countDocuments({ userId, status: 'Todo' });
        const cancelled = await Task.countDocuments({ userId, status: 'Cancelled' });

        res.json({
            total,
            completed,
            inProgress,
            todo,
            cancelled
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a task
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        status: req.body.status,
        description: req.body.description,
        date: req.body.date,
        userId: req.body.userId, // Require userId
        subtasks: req.body.subtasks
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.body.title != null) task.title = req.body.title;
        if (req.body.status != null) task.status = req.body.status;
        if (req.body.description != null) task.description = req.body.description;
        if (req.body.date != null) task.date = req.body.date;
        if (req.body.subtasks != null) task.subtasks = req.body.subtasks;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
