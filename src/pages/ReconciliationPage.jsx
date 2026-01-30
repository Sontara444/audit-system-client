import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, AlertCircle, BarChart2 } from 'lucide-react';
import DataTable from '../components/DataTable';

const ReconciliationPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [running, setRunning] = useState(false);

    const [records, setRecords] = useState([]);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/recon/${jobId}/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const fetchRecords = async () => {
        setLoadingRecords(true);
        try {
            const response = await fetch(`${API_URL}/recon/${jobId}/records?status=${activeTab}&page=${page}&limit=20`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRecords(data.records);
                setPagination({
                    page: data.page,
                    pages: data.pages,
                    total: data.total
                });
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoadingRecords(false);
        }
    };

    const handleFlagRecord = async (recordId) => {
        try {
            const response = await fetch(`${API_URL}/recon/records/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'Unmatched',
                    note: 'Flagged for review'
                })
            });

            if (response.ok) {
                fetchRecords();
                fetchStats();
            }
        } catch (error) {
            console.error('Error flagging record:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [jobId, token]);

    useEffect(() => {
        fetchRecords();
    }, [jobId, token, activeTab, page]);

    const runReconciliation = async () => {
        setRunning(true);
        // Optimistically set status to Processing to trigger polling
        setStats(prev => ({ ...prev, status: 'Processing' }));

        try {
            const response = await fetch(`${API_URL}/recon/${jobId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                // Revert if failed
                fetchStats();
            }
        } catch (error) {
            console.error('Error starting reconciliation:', error);
            fetchStats();
        } finally {
            setRunning(false);
        }
    };

    // Polling effect
    useEffect(() => {
        let interval;
        if (stats?.status === 'Processing') {
            interval = setInterval(() => {
                fetchStats();
                fetchRecords();
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [stats?.status]);

    const canEdit = user && ['Admin', 'Analyst'].includes(user.role);

    const columns = [
        { header: 'Transaction ID', accessor: 'transactionId', render: (row) => row.data?.transactionId || row.data?.TransactionID || row.data?.id || 'N/A' },
        { header: 'Amount', accessor: 'amount', render: (row) => row.data?.amount || row.data?.Amount || 'N/A' },
        { header: 'Date', accessor: 'date', render: (row) => row.data?.date || row.data?.Date || 'N/A' },
        {
            header: 'Recon Status', accessor: 'reconciliationStatus', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.reconciliationStatus === 'Matched' ? 'bg-green-100 text-green-800' :
                    row.reconciliationStatus === 'Unmatched' ? 'bg-red-100 text-red-800' :
                        row.reconciliationStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {row.reconciliationStatus}
                </span>
            )
        },
        { header: 'Details', accessor: 'reconciliationDetails', render: (row) => row.reconciliationDetails || '-' },
        ...(canEdit ? [{
            header: 'Actions', accessor: '_id', render: (row) => (
                <button
                    onClick={() => handleFlagRecord(row._id)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1 px-2 rounded border border-gray-300 transition-colors"
                    title="Flag for Review"
                >
                    Flag
                </button>
            )
        }] : [])
    ];

    const tabs = ['All', 'Matched', 'Unmatched', 'Partial', 'Duplicate'];

    if (loadingStats) return <div className="p-8 text-center">Loading...</div>;
    if (!stats) return <div className="p-8 text-center">Job not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
                        Reconciliation Dashboard
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${stats.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                            stats.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                            {stats.status}
                        </span>
                    </h1>
                    <p className="text-secondary-500 text-sm mt-1">Job ID: {jobId}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/upload')}
                        className="p-2 text-secondary-500 hover:text-secondary-700 transition-colors"
                        title="Back to Uploads"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={() => { fetchStats(); fetchRecords(); }}
                        className="p-2 text-secondary-500 hover:text-secondary-700 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} />
                    </button>
                    {canEdit && (
                        <button
                            onClick={runReconciliation}
                            disabled={running || stats.status === 'Processing'}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-white transition-all shadow-sm active:transform active:scale-95
                                ${running ? 'bg-primary-400 cursor-wait' : 'bg-primary-600 hover:bg-primary-700'}
                            `}
                        >
                            <Play size={16} />
                            {running ? 'Processing...' : 'Run Reconciliation'}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Records"
                    value={stats.total}
                    icon={<BarChart2 size={20} className="text-primary-600" />}
                    bg="bg-primary-50 border-primary-100"
                />
                <StatCard
                    title="Matched"
                    value={stats.matched}
                    icon={<CheckCircle size={20} className="text-green-600" />}
                    bg="bg-green-50 border-green-100"
                />
                <StatCard
                    title="Unmatched"
                    value={stats.unmatched}
                    icon={<XCircle size={20} className="text-red-600" />}
                    bg="bg-red-50 border-red-100"
                />
                <StatCard
                    title="Partial / Duplicates"
                    value={stats.partial + stats.duplicate}
                    icon={<AlertCircle size={20} className="text-orange-600" />}
                    bg="bg-orange-50 border-orange-100"
                />
            </div>

            <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
                <div className="border-b border-secondary-200 px-6">
                    <div className="flex space-x-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setPage(1); }}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                    ${activeTab === tab
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'}
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-0">
                    <DataTable
                        columns={columns}
                        data={records}
                        pagination={pagination}
                        onPageChange={setPage}
                        loading={loadingRecords}
                    />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, bg }) => (
    <div className={`p-5 rounded-xl border ${bg} transition-all hover:shadow-sm`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary-600 mb-1">{title}</p>
                <div className="text-2xl font-bold text-secondary-900">{value}</div>
            </div>
            <div className="p-2 bg-white bg-opacity-60 rounded-lg">
                {icon}
            </div>
        </div>
    </div>
);

export default ReconciliationPage;
