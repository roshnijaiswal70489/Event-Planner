import React from 'react';
import { X, Calendar, Clock, Tag, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { format } from 'date-fns';

const TaskDetailsModal = ({ isOpen, onClose, task, onUpdate }) => {
    const [newSubtask, setNewSubtask] = React.useState('');

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !task) return null;

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;

        const updatedSubtasks = [...(task.subtasks || []), { title: newSubtask, isCompleted: false }];
        onUpdate(task._id, { subtasks: updatedSubtasks });
        setNewSubtask('');
    };

    const handleToggleSubtask = (index) => {
        const updatedSubtasks = [...(task.subtasks || [])];
        updatedSubtasks[index].isCompleted = !updatedSubtasks[index].isCompleted;
        onUpdate(task._id, { subtasks: updatedSubtasks });
    };

    const handleDeleteSubtask = (index) => {
        const updatedSubtasks = [...(task.subtasks || [])];
        updatedSubtasks.splice(index, 1);
        onUpdate(task._id, { subtasks: updatedSubtasks });
    };

    const handleRenameSubtask = (index, newTitle) => {
        if (task.subtasks[index].title === newTitle) return; // No change
        const updatedSubtasks = [...(task.subtasks || [])];
        updatedSubtasks[index].title = newTitle;
        onUpdate(task._id, { subtasks: updatedSubtasks });
    };

    const completedSubtasks = task.subtasks?.filter(s => s.isCompleted).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 pr-8 break-words">
                            {task.title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors flex-shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                ${task.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    task.status === 'InProgress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        task.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                {task.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                ${task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    task.priority === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                        task.priority === 'Low' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                {task.priority || 'Medium'}
                            </span>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                                {task.description || "No description provided."}
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {task.date ? format(new Date(task.date), 'MMM d, yyyy') : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {task.date ? format(new Date(task.date), 'h:mm a') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Subtasks Section */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Subtasks ({completedSubtasks}/{totalSubtasks})
                                </h3>
                                <span className="text-xs text-gray-400">{progress}%</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                                <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            <div className="space-y-2 mb-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {task.subtasks && task.subtasks.map((subtask, index) => (
                                    <div key={index} className="flex items-center group p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                        <button
                                            onClick={() => handleToggleSubtask(index)}
                                            className="text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors mr-3 flex-shrink-0"
                                        >
                                            {subtask.isCompleted ? <CheckSquare size={18} className="text-blue-600 dark:text-blue-400" /> : <Square size={18} />}
                                        </button>

                                        <input
                                            type="text"
                                            defaultValue={subtask.title}
                                            onBlur={(e) => handleRenameSubtask(index, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.target.blur();
                                                }
                                            }}
                                            className={`flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 ${subtask.isCompleted ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}
                                        />

                                        <button
                                            onClick={() => handleDeleteSubtask(index)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 flex-shrink-0 ml-2"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleAddSubtask} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                    placeholder="Add a subtask..."
                                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </form>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-center text-gray-400 dark:text-gray-600 font-mono">
                                Task ID: {task._id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
