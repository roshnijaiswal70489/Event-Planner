
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Todo', 'InProgress', 'Completed', 'Cancelled'],
        default: 'Todo',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
    },
    subtasks: [{
        title: String,
        isCompleted: {
            type: Boolean,
            default: false
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
