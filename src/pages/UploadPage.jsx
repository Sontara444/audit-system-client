import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import { useAuth } from '../context/AuthContext';
import { Check, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const UploadPage = () => {
    const [uploads, setUploads] = useState([]);
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchUploads = async () => {
        try {
            const response = await fetch(`${API_URL}/upload`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUploads(data);
            }
        } catch (error) {
            console.error('Error fetching uploads:', error);
        }
    };

    useEffect(() => {
        if (token) fetchUploads();
    }, [token]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary-900">Import Data</h1>
                <p className="text-secondary-500">Upload your transaction records for reconciliation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
                    <h2 className="text-lg font-bold text-secondary-900 mb-4">Upload File</h2>
                    <FileUpload onUploadSuccess={fetchUploads} />
                </section>

                <section className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
                    <h2 className="text-lg font-bold text-secondary-900 mb-4">Recent Uploads</h2>
                    <div className="overflow-hidden">
                        {uploads.length === 0 ? (
                            <div className="p-8 text-center text-secondary-500 bg-secondary-50 rounded-lg border border-secondary-100">
                                No uploads found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary-50 border-b border-secondary-100">
                                        <tr>
                                            <th className="p-3 font-semibold text-secondary-600 text-xs uppercase tracking-wider">Filename</th>
                                            <th className="p-3 font-semibold text-secondary-600 text-xs uppercase tracking-wider">Status</th>
                                            <th className="p-3 font-semibold text-secondary-600 text-xs uppercase tracking-wider">Records</th>
                                            <th className="p-3 font-semibold text-secondary-600 text-xs uppercase tracking-wider">Date</th>
                                            <th className="p-3 font-semibold text-secondary-600 text-xs uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary-100">
                                        {uploads.map((job) => (
                                            <tr key={job._id} className="hover:bg-primary-50/50 transition-colors">
                                                <td className="p-3 font-medium text-secondary-800 text-sm">{job.filename}</td>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                        ${job.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            job.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                job.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                        {job.status === 'Completed' && <Check size={10} />}
                                                        {job.status === 'Processing' && <Clock size={10} />}
                                                        {job.status === 'Failed' && <AlertTriangle size={10} />}
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-secondary-600 text-sm">{job.totalRecords || '-'}</td>
                                                <td className="p-3 text-secondary-500 text-xs">
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-3">
                                                    <Link to={`/reconcile/${job._id}`} className="text-primary-600 hover:text-primary-800 font-medium text-sm hover:underline">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UploadPage;
