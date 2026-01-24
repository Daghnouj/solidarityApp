import React from 'react';
import { FileText, Download, Eye, Plus } from 'lucide-react';

const ProfessionalRecords: React.FC = () => {
    const records = [
        { id: 1, patient: 'John Doe', type: 'Lab Results', date: 'Jan 20, 2026', size: '2.4 MB' },
        { id: 2, patient: 'Jane Smith', type: 'Prescription', date: 'Jan 18, 2026', size: '156 KB' },
        { id: 3, patient: 'Mike Johnson', type: 'Session Notes', date: 'Jan 15, 2026', size: '45 KB' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Medical Records</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    Upload Record
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {records.map((record) => (
                    <div key={record.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <FileText size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors" title="View">
                                    <Eye size={18} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors" title="Download">
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-1">{record.type}</h3>
                        <p className="text-sm text-gray-500 mb-4">Patient: {record.patient}</p>

                        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                            <span>{record.date}</span>
                            <span>{record.size}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfessionalRecords;
