
import React from 'react';

const ProgressSection = ({ completed, total }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-12 mt-6 transition-colors">
            <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-100 dark:text-gray-700"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 56}
                        strokeDashoffset={2 * Math.PI * 56 * (1 - percentage / 100)}
                        className="text-gray-800 dark:text-white transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">{percentage}%</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Complete</span>
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Today's Progress</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    You've completed <span className="font-semibold text-blue-500 dark:text-blue-400">{completed}</span> out of <span className="font-semibold text-gray-700 dark:text-gray-300">{total}</span> tasks for today.
                </p>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-400 dark:text-gray-500">
                        <span>Progress</span>
                        <span>{completed}/{total} tasks</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressSection;
