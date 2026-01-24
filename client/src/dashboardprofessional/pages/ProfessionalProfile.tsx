import React, { useState } from 'react';
import { Save, Award, MapPin, Building2, Book, GraduationCap, Globe, BadgeCheck, Plus, Trash2 } from 'lucide-react';

const ProfessionalProfile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'services'>('personal');

    // Mock data states
    const [languages, setLanguages] = useState(['English', 'French', 'Arabic']);
    const [services, setServices] = useState([
        { id: 1, name: 'Initial Consultation', price: '120 TND', duration: '60 min' },
        { id: 2, name: 'Therapy Session', price: '80 TND', duration: '45 min' },
        { id: 3, name: 'Online Counseling', price: '70 TND', duration: '45 min' },
    ]);

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'personal' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                        Personal Info
                    </button>
                    <button
                        onClick={() => setActiveTab('professional')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'professional' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                        Professional Details
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'services' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                        Services & Clinic
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Banner - Visible on all tabs */}
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-100 overflow-hidden relative group cursor-pointer">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">Change</span>
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h3 className="text-2xl font-bold text-gray-900">Dr. Sarah Johnson</h3>
                                <BadgeCheck className="text-blue-500" size={20} fill="currentColor" className="text-white" />
                            </div>
                            <p className="text-blue-600 font-medium mb-2">Psychologist & Therapist</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100">
                                    <Award size={14} className="text-orange-500" />
                                    <span>15 Years Exp.</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100">
                                    <MapPin size={14} className="text-red-500" />
                                    <span>Tunis, Tunisia</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:ml-auto">
                            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200">
                                <Save size={20} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">

                    {/* ================= PERSONAL INFO TAB ================= */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Display Name</label>
                                    <input type="text" defaultValue="Dr. Sarah Johnson" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <input type="email" defaultValue="sarah.johnson@solidarity.com" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                    <input type="tel" defaultValue="+216 20 123 456" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Gender</label>
                                    <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none">
                                        <option>Female</option>
                                        <option>Male</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Bio & About</label>
                                <textarea
                                    rows={4}
                                    defaultValue="Experienced Psychologist specializing in anxiety and depression management. Committed to providing compassionate care..."
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                />
                                <p className="text-xs text-gray-400 text-right">Max 500 characters</p>
                            </div>
                        </div>
                    )}

                    {/* ================= PROFESSIONAL DETAILS TAB ================= */}
                    {activeTab === 'professional' && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Credentials */}
                            <section>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Book className="text-orange-500" size={20} /> Credentials
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Specialty</label>
                                        <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none">
                                            <option>Psychologist</option>
                                            <option>Psychiatrist</option>
                                            <option>Counselor</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">License Number</label>
                                        <input type="text" defaultValue="PSY-12345-TN" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                                    </div>
                                </div>
                            </section>

                            {/* Education */}
                            <section>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <GraduationCap className="text-blue-500" size={20} /> Education
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex gap-4 items-start p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                                            <span className="font-bold text-gray-600">PhD</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">Clinical Psychology</p>
                                            <p className="text-sm text-gray-500">University of Tunis El Manar • 2010</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                    <button className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700">
                                        <Plus size={16} /> Add Education
                                    </button>
                                </div>
                            </section>

                            {/* Languages */}
                            <section>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Globe className="text-green-500" size={20} /> Languages
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((lang, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                                            {lang}
                                            <button className="hover:text-green-900"><Trash2 size={14} /></button>
                                        </span>
                                    ))}
                                    <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 flex items-center gap-1">
                                        <Plus size={14} /> Add
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ================= SERVICES & CLINIC TAB ================= */}
                    {activeTab === 'services' && (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Clinic Info */}
                            <section>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Building2 className="text-purple-500" size={20} /> Clinic Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Clinic Name</label>
                                        <input type="text" defaultValue="Mind & Soul Healing Center" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input type="text" defaultValue="123 Health Ave, Tunis" className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Services List */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Services Provided
                                    </h4>
                                    <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1">
                                        <Plus size={14} /> Add New
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {services.map((service) => (
                                        <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4 group hover:border-gray-200 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                                                    {service.id}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{service.name}</p>
                                                    <p className="text-xs text-gray-500">{service.duration}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 ml-14 sm:ml-0">
                                                <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 min-w-[80px] text-center">
                                                    {service.price}
                                                </div>
                                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default ProfessionalProfile;
