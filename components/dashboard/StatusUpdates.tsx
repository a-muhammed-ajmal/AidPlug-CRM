import React from 'react';
import { mockStatusUpdates } from '../../lib/constants';
import { Server, AlertTriangle, CheckCircle } from 'lucide-react';

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'resolved':
            return {
                icon: <CheckCircle className="w-4 h-4 text-white" />,
                bgColor: 'bg-green-500',
            };
        case 'investigating':
            return {
                icon: <AlertTriangle className="w-4 h-4 text-white" />,
                bgColor: 'bg-orange-500',
            };
        default:
            return {
                icon: <Server className="w-4 h-4 text-white" />,
                bgColor: 'bg-gray-500',
            };
    }
};

export default function StatusUpdates() {
    return (
        <div className="bg-white rounded-xl p-4 border shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Server className="w-5 h-5 mr-2 text-gray-600" />
                System Status
            </h3>
            <div className="relative pl-5">
                {/* Timeline line */}
                <div className="absolute left-7 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                <div className="space-y-6">
                    {mockStatusUpdates.map(update => {
                        const { icon, bgColor } = getStatusStyles(update.status);
                        return (
                            <div key={update.id} className="relative flex items-start space-x-4">
                                <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center ${bgColor}`}>
                                    {icon}
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <p className="text-sm font-semibold text-gray-800">{update.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{update.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">{update.timestamp}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
