import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, XCircle, Trash2, Pencil, ListChecks } from 'lucide-react';
import { format } from 'date-fns';

const TaskList = ({ tasks, onStatusUpdate, onDelete, onTaskClick, onEdit }) => {
    if (tasks.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl border border-gray-100 dark:border-gray-700 mt-6 text-center border-dashed border-2 transition-colors">
                <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                    <CalendarIcon size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">No Tasks found</h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm">Start by adding your first task.</p>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="text-green-500 dark:text-green-400" size={20} />;
            case 'InProgress': return <Clock className="text-blue-500 dark:text-blue-400" size={20} />;
            case 'Cancelled': return <XCircle className="text-red-500 dark:text-red-400" size={20} />;
            default: return <Circle className="text-gray-400 dark:text-gray-500" size={20} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 mt-6 transition-colors">
            <div className="space-y-4">
                {tasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors border border-gray-50 dark:border-gray-700/50 group">
                        <div
                            className="flex items-center gap-4 flex-1 cursor-pointer"
                            onClick={() => onTaskClick(task)}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusUpdate(task._id, task.status === 'Completed' ? 'Todo' : 'Completed');
                                }}
                                className="hover:scale-110 transition-transform"
                            >
                                {getStatusIcon(task.status)}
                            </button>
                            <div>
                                <h4 className={`font-semibold text-gray-800 dark:text-gray-100 ${task.status === 'Completed' ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                                    {task.title}
                                </h4>
                                {task.description && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{task.description}</p>
                                )}
                                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                    <Clock size={10} />
                                    {task.date ? `Deadline: ${format(new Date(task.date), 'MMM d, yyyy')} at ${format(new Date(task.date), 'h:mm a')}` : 'No Deadline'}
                                </div>
                                {task.subtasks && task.subtasks.length > 0 && (
                                    <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                        <ListChecks size={10} />
                                        <span>
                                            {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length} Subtasks
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onEdit(task)}
                                className="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2"
                                title="Edit Task"
                            >
                                <Pencil size={18} />
                            </button>

                            <button
                                onClick={() => onStatusUpdate(task._id, 'Cancelled')}
                                className="text-gray-300 dark:text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 transition-colors p-2"
                                title="Cancel Task"
                            >
                                <XCircle size={18} />
                            </button>

                            <button
                                onClick={() => onDelete(task._id)}
                                className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2"
                                title="Delete Task"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
