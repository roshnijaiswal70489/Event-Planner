
import React from 'react';

const StatsCard = ({ title, value, subtext, icon, iconBg, iconColor }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className={`text-3xl font-bold ${title === 'Completed' ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'}`}>{value}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{subtext}</p>
                </div>
                <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
