import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ columns, data, pagination, onPageChange, loading }) => {
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl border border-secondary-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full p-12 text-center bg-white rounded-xl border border-secondary-200 text-secondary-500">
                No records found.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-secondary-50 border-b border-secondary-200">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider whitespace-nowrap">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {data.map((row, rowIdx) => (
                            <tr key={row._id || rowIdx} className="hover:bg-primary-50/50 transition-colors group">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 text-sm text-secondary-700 whitespace-nowrap group-hover:text-secondary-900">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-secondary-200 mt-auto">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-secondary-600">
                                Page <span className="font-medium text-secondary-900">{pagination.page}</span> of{' '}
                                <span className="font-medium text-secondary-900">{pagination.pages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => onPageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium transition-colors
                                        ${pagination.page === 1
                                            ? 'text-secondary-300 cursor-not-allowed'
                                            : 'text-secondary-500 hover:bg-secondary-50 hover:text-secondary-700'
                                        }`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => onPageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium transition-colors
                                        ${pagination.page === pagination.pages
                                            ? 'text-secondary-300 cursor-not-allowed'
                                            : 'text-secondary-500 hover:bg-secondary-50 hover:text-secondary-700'
                                        }`}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
