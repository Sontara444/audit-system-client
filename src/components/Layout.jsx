import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    UploadCloud,
    FileText,
    LogOut,
    Menu,
    X,
    User,
    ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/upload', label: 'Upload Data', icon: UploadCloud },
    ];

    return (
        <div className="flex h-screen bg-secondary-50">
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-secondary-200 shadow-sm">
                <div className="flex items-center gap-2 p-6 border-b border-secondary-100">
                    <ShieldCheck className="w-8 h-8 text-primary-600" />
                    <span className="text-xl font-bold text-secondary-900 tracking-tight">ReconAudit</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                ${isActive(item.path)
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                                }
                            `}
                        >
                            <item.icon size={20} className={isActive(item.path) ? 'text-primary-600' : 'text-secondary-400'} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-secondary-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-secondary-50">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-900 truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-secondary-500 truncate capitalize">{user?.role || 'Viewer'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-secondary-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-secondary-200">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary-600" />
                        <span className="font-bold text-secondary-900">ReconAudit</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-secondary-600">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 bg-white pt-16 px-4">
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                                        ${isActive(item.path)
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-secondary-600 hover:bg-secondary-50'
                                        }
                                    `}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-secondary-500 mt-4 border-t border-secondary-100"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
