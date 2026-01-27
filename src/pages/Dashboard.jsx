import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.username} ({user?.role})</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Total Uploads</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Pending Reconciliation</h3>
                        <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Accuracy</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">0%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
