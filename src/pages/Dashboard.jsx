import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuditTimeline from '../components/AuditTimeline';

const Dashboard = () => {
    const { user, token, logout } = useAuth();

    const [stats, setStats] = useState({
        uploads: 0,
        pending: 0,
        accuracy: 0
    });

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const uploadRes = await fetch(`${API_URL}/upload`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (uploadRes.ok) {
                    const uploads = await uploadRes.json();
                    const totalUploads = uploads.length;
                    const pending = uploads.filter(u => u.status === 'Processing' || u.status === 'Pending').length;

                    const lastJob = uploads.find(u => u.status === 'Completed');
                    let accuracy = 0;
                    if (lastJob && lastJob.totalRecords > 0) {
                        accuracy = Math.round(((lastJob.matchedCount + lastJob.partialCount) / lastJob.totalRecords) * 100);
                    }

                    setStats({
                        uploads: totalUploads,
                        pending: pending,
                        accuracy: accuracy
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        if (token) fetchDashboardData();
    }, [token]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">Overview</h1>
                <p className="text-secondary-500">Welcome back, {user?.username}. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Total Uploads</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-secondary-900">{stats.uploads}</span>
                        <span className="text-sm text-secondary-400">files processed</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Pending Jobs</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-warning">{stats.pending}</span>
                        <span className="text-sm text-secondary-400">requiring attention</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-secondary-500 uppercase tracking-wider">Recon Accuracy</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-success">{stats.accuracy}%</span>
                        <span className="text-sm text-secondary-400">on last run</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
                    <h3 className="text-lg font-bold text-secondary-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/upload" className="flex flex-col items-center justify-center p-6 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-100 group">
                            <span className="font-semibold text-primary-700 group-hover:text-primary-800">New Upload</span>
                            <span className="text-xs text-primary-500 mt-1">Import CSV files</span>
                        </Link>
                        <div className="flex flex-col items-center justify-center p-6 bg-secondary-50 rounded-lg border border-secondary-100 cursor-not-allowed opacity-60">
                            <span className="font-semibold text-secondary-400">View Reports</span>
                            <span className="text-xs text-secondary-400 mt-1">Coming Soon</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
                    <h3 className="text-lg font-bold text-secondary-900 mb-4">Recent Activity</h3>
                    <AuditTimeline />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
