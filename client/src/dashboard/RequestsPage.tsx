import React, { useState } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye,
  Clock,
  Calendar,
  FileText,
  Download
} from 'lucide-react';

interface Request {
  id: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  type: 'therapist' | 'center' | 'user';
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  description: string;
}

const RequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const requests: Request[] = [
    {
      id: '1',
      applicant: {
        name: 'Dr. Karim Ferjani',
        email: 'karim.ferjani@example.com',
        phone: '+216 98 123 456',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim'
      },
      type: 'therapist',
      submittedDate: '2026-01-16',
      status: 'pending',
      documents: ['license.pdf', 'certificate.pdf', 'cv.pdf'],
      description: 'Experienced CBT therapist with 10 years of practice. Specialized in anxiety and depression treatment.'
    },
    {
      id: '2',
      applicant: {
        name: 'Wellness Center Sousse',
        email: 'contact@wellness-sousse.tn',
        phone: '+216 73 456 789',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wellness'
      },
      type: 'center',
      submittedDate: '2026-01-15',
      status: 'pending',
      documents: ['business_license.pdf', 'facility_photos.zip', 'insurance.pdf'],
      description: 'Mental health wellness center offering group therapy, meditation, and counseling services.'
    },
    {
      id: '3',
      applicant: {
        name: 'Nour El Houda',
        email: 'nour.houda@example.com',
        phone: '+216 99 876 543',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nour'
      },
      type: 'therapist',
      submittedDate: '2026-01-14',
      status: 'pending',
      documents: ['diploma.pdf', 'recommendation.pdf'],
      description: 'Licensed clinical psychologist specializing in family therapy and relationship counseling.'
    },
    {
      id: '4',
      applicant: {
        name: 'Mindfulness Hub Tunis',
        email: 'info@mindfulness-hub.tn',
        phone: '+216 71 234 567',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mindfulness'
      },
      type: 'center',
      submittedDate: '2026-01-13',
      status: 'approved',
      documents: ['registration.pdf', 'staff_credentials.pdf'],
      description: 'Mindfulness and meditation center with certified instructors and modern facilities.'
    }
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'therapist': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'center': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'user': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const getRequestCount = () => {
    switch(activeTab) {
      case 'pending': return pendingRequests.length;
      case 'approved': return approvedRequests.length;
      case 'rejected': return rejectedRequests.length;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Activation Requests</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Review and approve account activation requests</p>
        </div>
        <Button variant="ghost" icon={<Download size={18} />}>
          Export Requests
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-900">{pendingRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-900">{approvedRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-2 border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500 rounded-xl shadow-lg">
              <XCircle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-900">{rejectedRequests.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-900 shadow-md'
                    : 'text-gray-600 hover:text-blue-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getRequestCount()})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <Button variant="ghost" icon={<Filter size={18} />} className="px-4">
            Filter
          </Button>
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {(activeTab === 'pending' ? pendingRequests : 
          activeTab === 'approved' ? approvedRequests : 
          rejectedRequests).map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Applicant Info */}
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={request.applicant.avatar}
                  alt={request.applicant.name}
                  className="w-16 h-16 rounded-xl border-2 border-orange-500 shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">{request.applicant.name}</h3>
                      <p className="text-sm text-gray-600">{request.applicant.email}</p>
                      <p className="text-sm text-gray-600">{request.applicant.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(request.type)}`}>
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{request.description}</p>

                  {/* Documents */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Attached Documents:</p>
                    <div className="flex flex-wrap gap-2">
                      {request.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                          <FileText size={14} className="text-blue-600" />
                          <span className="text-sm text-blue-900">{doc}</span>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Download size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-teal-600" />
                    <span>Submitted on {new Date(request.submittedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2 lg:min-w-[200px]">
                <Button 
                  variant="ghost" 
                  icon={<Eye size={18} />}
                  className="flex-1 lg:flex-none"
                >
                  View Details
                </Button>
                
                {request.status === 'pending' && (
                  <>
                    <Button 
                      variant="secondary"
                      icon={<CheckCircle size={18} />}
                      className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="ghost"
                      icon={<XCircle size={18} />}
                      className="flex-1 lg:flex-none border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  </>
                )}

                {request.status === 'approved' && (
                  <div className="px-4 py-3 bg-green-100 border-2 border-green-200 rounded-xl text-center">
                    <CheckCircle className="mx-auto mb-1 text-green-600" size={20} />
                    <p className="text-sm font-semibold text-green-700">Approved</p>
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="px-4 py-3 bg-red-100 border-2 border-red-200 rounded-xl text-center">
                    <XCircle className="mx-auto mb-1 text-red-600" size={20} />
                    <p className="text-sm font-semibold text-red-700">Rejected</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {getRequestCount() === 0 && (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No {activeTab} requests
          </h3>
          <p className="text-gray-500">
            There are no {activeTab} requests at the moment.
          </p>
        </Card>
      )}
    </div>
  );
};

export default RequestsPage;