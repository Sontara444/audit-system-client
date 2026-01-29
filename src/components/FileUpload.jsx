import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (file) => {
        if (file && file.name.endsWith('.csv')) {
            setFile(file);
            setUploadStatus('idle');
            setMessage('');
        } else {
            setUploadStatus('error');
            setMessage('Please upload a valid CSV file.');
        }
    };

    const removeFile = () => {
        setFile(null);
        setUploadStatus('idle');
        setMessage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploadStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setUploadStatus('success');
                setMessage('File uploaded successfully! Processing started.');
                setFile(null);
                if (onUploadSuccess) onUploadSuccess();
            } else {
                setUploadStatus('error');
                setMessage(data.message || 'Upload failed.');
                setFile(null);
            }
        } catch (error) {
            setUploadStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Transaction Data</h2>

            <div
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                    ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}
                    ${uploadStatus === 'error' ? 'border-red-400 bg-red-50' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv"
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center text-gray-500">
                    {uploadStatus === 'success' ? (
                        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                    ) : uploadStatus === 'error' ? (
                        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                    ) : (
                        <Upload className="w-12 h-12 mb-3 text-gray-400" />
                    )}

                    <p className="text-lg font-medium text-gray-700">
                        {file ? file.name : "Drag & Drop CSV file here"}
                    </p>
                    <p className="text-sm mt-2 text-gray-400">
                        {file ? `${(file.size / 1024).toFixed(2)} KB` : "or click to browse"}
                    </p>
                </div>
            </div>

            {message && (
                <div className={`mt-4 p-3 rounded-md text-sm ${uploadStatus === 'success' ? 'bg-green-100 text-green-700' : uploadStatus === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                    {message}
                </div>
            )}

            {file && uploadStatus !== 'success' && (
                <div className="mt-6 flex items-center justify-between">
                    <button
                        onClick={(e) => { e.stopPropagation(); removeFile(); }}
                        className="px-4 py-2 text-gray-600 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                        <X size={18} /> Cancel
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); uploadFile(); }}
                        disabled={uploadStatus === 'uploading'}
                        className={`px-6 py-2 rounded-lg text-white font-medium transition-colors
                            ${uploadStatus === 'uploading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                    >
                        {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
