import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, User, Activity, FileText } from 'lucide-react';

const AuditTimeline = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(`${API_URL}/audit?limit=20`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data.logs);
                }
            } catch (error) {
                console.error("Error fetching audit logs", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchLogs();
    }, [token]);

    const getIcon = (action) => {
        if (action.includes('UPLOAD')) return <FileText size={16} className="text-blue-500" />;
        if (action.includes('RECON')) return <Activity size={16} className="text-purple-500" />;
        if (action.includes('FLAG')) return <User size={16} className="text-orange-500" />;
        return <Clock size={16} className="text-gray-500" />;
    };

    const formatAction = (action) => {
        return action.replace(/_/g, ' ');
    };

    if (loading) return <div className="text-center py-4">Loading timeline...</div>;
    if (logs.length === 0) return <div className="text-center py-4 text-gray-500">No activity recorded.</div>;

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {logs.map((log, logIdx) => (
                    <li key={log._id}>
                        <div className="relative pb-8">
                            {logIdx !== logs.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                        {getIcon(log.action)}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium text-gray-900">{log.user?.username || 'System'}</span>
                                            {' '}{formatAction(log.action).toLowerCase()}{' '}
                                            <span className="font-medium text-gray-900">{log.targetType}</span>
                                        </p>
                                        {log.details && (
                                            <p className="text-xs text-gray-400 mt-1 break-words whitespace-pre-wrap">
                                                {JSON.stringify(log.details, null, 2)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                        <time dateTime={log.createdAt}>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuditTimeline;
