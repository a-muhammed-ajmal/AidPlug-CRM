import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
    return (
        <div className="text-center py-12 px-6 bg-white rounded-xl border">
            <div className="mb-4 flex justify-center">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-500 mt-1">{message}</p>
        </div>
    );
}