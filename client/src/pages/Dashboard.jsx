import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';
import { format, isSameDay } from 'date-fns';
import { Plus, ListFilter, CheckCircle2, Clock, CalendarDays, XCircle, Search, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import ProgressSection from '../components/ProgressSection';
import TaskList from '../components/TaskList';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';

const Dashboard = ({ filter = 'today' }) => {
    const navigate = useNavigate(); // Assume useNavigate needs to be imported or use window.location
    // Note: Dashboard doesn't currently import useNavigate, I should add it or use a prop if passed, but typically Pages use hooks.
    // I need to add import { useNavigate } ... below. Or just check localStorage logic.

    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, todo: 0, cancelled: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null); // New state for editing

    // Get userId from localStorage
    const userId = localStorage.getItem('userId');

    const fetchTasks = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/api/tasks?userId=${userId}`);
            setTasks(res.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/api/tasks/stats?userId=${userId}`);
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const refreshData = async () => {
        if (!userId) return;
        await Promise.all([fetchTasks(), fetchStats()]);
    };

    useEffect(() => {
        if (!userId) {
            // If no user, redirect to login (could use navigate if I add it)
            window.location.href = '/login';
            return;
        }
        refreshData();
    }, [userId]);

    const handleCreateTask = async (taskData) => {
        try {
            if (editingTask) {
                await axios.put(`${API_BASE_URL}/api/tasks/${editingTask._id}`, taskData);
            } else {
                await axios.post(`${API_BASE_URL}/api/tasks`, { ...taskData, userId });
            }
            await refreshData();
            setEditingTask(null); // Clear editing state
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/tasks/${id}`, { status: newStatus });
            refreshData();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
            refreshData();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleTaskUpdate = async (id, updates) => {
        try {
            await axios.put(`${API_BASE_URL}/api/tasks/${id}`, updates);
            await refreshData();
            // Update selectedTask if it's the one being viewed so the modal reflects changes immediately
            if (selectedTask && selectedTask._id === id) {
                // We need to fetch the updated task or merge updates. 
                // refreshData updates 'tasks' state, but 'selectedTask' is a separate state copy.
                // Let's find the updated task from the new list or just merge locally for UI responsiveness.
                // Since refreshData is async and setsTasks, we can't easily grab the new task immediately from state here.
                // Better to just merge local updates into selectedTask.
                setSelectedTask(prev => ({ ...prev, ...updates }));
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        // Date Filter
        const matchesDate = filter === 'all' ? true : isSameDay(new Date(task.date), new Date());

        // Search Filter
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesDate && matchesSearch;
    });

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Welcome {localStorage.getItem('userName') || 'User'}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {filter === 'today' ? "Today's Tasks" : "All Tasks"} <span className="text-yellow-400">✨</span>
                        </h1>
                        <p className="text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-2 text-sm">
                            {format(new Date(), 'EEEE, MMMM d, yyyy')} • {filteredTasks.length} tasks
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks..."
                                className="pl-10 pr-10 py-2.5 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-gray-600 dark:text-gray-300 placeholder:text-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            <Plus size={20} />
                            Create Task
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <StatsCard
                        title="Total Tasks"
                        value={stats.total}
                        subtext=""
                        icon={<ListFilter size={24} className="text-blue-600 dark:text-blue-400" />}
                        iconBg="bg-blue-100 dark:bg-blue-900/30"
                    />
                    <StatsCard
                        title="Completed"
                        value={stats.completed}
                        subtext={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% of total`}
                        icon={<CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />}
                        iconBg="bg-green-100 dark:bg-green-900/30"
                    />
                    <StatsCard
                        title="In Progress"
                        value={stats.inProgress}
                        subtext={`${stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% of total`}
                        icon={<Clock size={24} className="text-blue-600 dark:text-blue-400" />}
                        iconBg="bg-blue-100 dark:bg-blue-900/30"
                    />
                    <StatsCard
                        title="Cancelled"
                        value={stats.cancelled}
                        subtext={`${stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}% of total`}
                        icon={<XCircle size={24} className="text-red-600 dark:text-red-400" />}
                        iconBg="bg-red-100 dark:bg-red-900/30"
                    />
                </div>

                {/* Main Content Area */}
                <div className="space-y-6">
                    <ProgressSection completed={stats.completed} total={stats.total} />

                    {isLoading ? (
                        <div className="text-center py-10 text-gray-400">Loading tasks...</div>
                    ) : (
                        <TaskList
                            tasks={filteredTasks}
                            onStatusUpdate={handleStatusUpdate}
                            onDelete={handleDelete}
                            onTaskClick={setSelectedTask}
                            onEdit={handleEditTask}
                        />
                    )}
                </div>
            </main>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                }}
                onCreate={handleCreateTask}
                showDate={true}
                task={editingTask}
            />

            <TaskDetailsModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onUpdate={handleTaskUpdate}
            />
        </div>
    );
};

export default Dashboard;
