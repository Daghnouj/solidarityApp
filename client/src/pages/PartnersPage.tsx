import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink,
    Handshake,
    Mail,
    MapPin,
    Globe,
    Briefcase,
    Search,
    ShieldCheck,
    ArrowRight,
    Users,
    CheckCircle2,
    Heart,
    Zap,
    Layers,
    Filter
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Partner {
    _id: string;
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    description?: string;
    logo?: {
        url: string;
        public_id: string;
    };
    service?: string;
    link: string;
    createdAt: string;
}

const PartnersPage: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/partners`);
                const data = await response.json();
                if (data.success && data.data) {
                    setPartners(data.data);
                }
            } catch (err) {
                console.error('Error fetching partners:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);

    // 🧠 Dynamic Calculations
    const categories = useMemo(() => {
        const cats = partners.map(p => p.service).filter((s): s is string => !!s);
        return ['All', ...Array.from(new Set(cats))];
    }, [partners]);

    const citiesCount = useMemo(() => {
        const cities = partners.map(p => {
            if (!p.adresse) return null;
            // Simple heuristic to get city: last segment or before comma
            const segments = p.adresse.split(',');
            return segments[segments.length - 1].trim();
        }).filter(Boolean);
        return new Set(cities).size;
    }, [partners]);

    const filteredPartners = useMemo(() => {
        return partners.filter(p => {
            const matchesSearch = p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.service || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || p.service === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [partners, searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* 🌟 Dynamic Hero */}
            <section className="relative pt-32 pb-20 border-b border-slate-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -mr-96 -mt-96"></div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100">
                            <Handshake size={14} />
                            <span>United Ecosystem</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 leading-[1] tracking-tighter">
                            A Stronger <br />
                            <span className="text-blue-600">Circle of Trust.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed mb-12">
                            Connecting {partners.length} institutions across {citiesCount} cities. Explore our network of vetted medical and support partners.
                        </p>

                        {/* 📊 Dynamic Impact Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-8 border-t border-slate-100 max-w-4xl mx-auto">
                            <div className="text-center">
                                <p className="text-4xl font-black text-slate-900 tracking-tight">{partners.length}</p>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Partners</p>
                            </div>
                            <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                            <div className="text-center">
                                <p className="text-4xl font-black text-slate-900 tracking-tight">{categories.length - 1}</p>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sectors</p>
                            </div>
                            <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                            <div className="text-center">
                                <p className="text-4xl font-black text-slate-900 tracking-tight">{citiesCount}</p>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cities Covered</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 🌊 Dynamic Logo Cloud */}
            <div className="bg-slate-50/50 py-12 border-b border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-8 text-center text-slate-400 text-xs font-black uppercase tracking-widest">Our Global Members</div>
                <div className="relative flex overflow-hidden group">
                    <div className="flex gap-20 animate-marquee whitespace-nowrap min-w-full items-center">
                        {[...partners, ...partners].map((p, i) => (
                            p.logo?.url && (
                                <img
                                    key={`${p._id}-${i}`}
                                    src={p.logo.url}
                                    alt={p.nom}
                                    className="h-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 object-contain"
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* 📁 Dynamic Filters & Cards */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Member Directory</h2>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Users size={16} />
                            <span className="font-bold text-sm tracking-widest uppercase">{filteredPartners.length} Available Partners</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* 🔍 Search */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white transition-all text-sm font-medium"
                            />
                        </div>

                        {/* 🏷️ Dynamic Category Filter */}
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                            <div className="p-2 text-slate-400 shrink-0"><Filter size={14} /></div>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {filteredPartners.map((partner) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={partner._id}
                                    className="group flex flex-col p-6 bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:border-blue-100 transition-all duration-300"
                                >
                                    <div className="h-14 w-14 mb-6 rounded-2xl bg-slate-50 flex items-center justify-center p-2 group-hover:bg-blue-50/50 transition-colors">
                                        {partner.logo?.url ? (
                                            <img src={partner.logo.url} alt={partner.nom} className="max-h-full max-w-full object-contain" />
                                        ) : (
                                            <Handshake size={20} className="text-slate-300" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900 leading-tight flex-1 group-hover:text-blue-600 transition-colors">{partner.nom}</h3>
                                            <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                        </div>

                                        {partner.service && (
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                                                {partner.service}
                                            </p>
                                        )}

                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-6">
                                            {partner.description || "Active member of the solidarity ecosystem, providing essential services to our community."}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <a href={`mailto:${partner.email}`} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                                                <Mail size={14} />
                                            </a>
                                            {partner.adresse && (
                                                <div className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 group/loc relative">
                                                    <MapPin size={14} />
                                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[9px] rounded pointer-events-none opacity-0 group-hover/loc:opacity-100 transition-all whitespace-nowrap">
                                                        {partner.adresse}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <a
                                            href={partner.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 transition-all active:scale-95"
                                        >
                                            Link <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {/* 💬 dynamic Why section */}
            <section className="bg-slate-50/50 py-24 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 border border-blue-100">
                                <Heart size={28} />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-3 tracking-tight">Trust Network</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Integrated directly with {partners.length} organizations to ensure consistent care quality.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-3xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-6 border border-cyan-100">
                                <Zap size={28} />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-3 tracking-tight">Local Presence</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Spanning {citiesCount} cities, our partners are closer than ever to those who need support.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 border border-amber-100">
                                <Layers size={28} />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-3 tracking-tight">Expert Breadth</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Access expertise across {categories.length - 1} different health and wellness sectors.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🚀 Dynamic CTA */}
            <section className="max-w-7xl mx-auto px-6 py-32 text-center">
                <div className="max-w-3xl mx-auto p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Join our network.</h2>
                    <p className="text-slate-500 mb-10">Be the {partners.length + 1}th partner to help us transform mental healthcare.</p>
                    <a href="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1">
                        Apply Now <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default PartnersPage;
