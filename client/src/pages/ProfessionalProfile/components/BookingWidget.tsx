import React from 'react';
import { Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Professional } from '../../Professionals/types';

interface BookingWidgetProps {
    professional: Professional;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ professional }) => {
    const price = professional.services?.[0]?.price || "60 DT"; // Default or first service price

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 sticky top-24" style={{ borderColor: '#4FB2E520' }}>
            <div className="text-center mb-6">
                <p className="text-slate-500 font-medium mb-1">Session Price</p>
                <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-slate-900">{price}</span>
                    <span className="text-sm text-slate-400">/ session</span>
                </div>
            </div>

            <Link
                to={`/book/${professional._id}`}
                className="w-full text-white py-3.5 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg mb-4"
                style={{ backgroundColor: '#4FB2E5' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A9FD4'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4FB2E5'}
            >
                <Calendar size={20} />
                Book a Session
            </Link>

            <button
                onClick={() => {
                    const event = new CustomEvent('open_chat_with_user', {
                        detail: {
                            userId: professional._id,
                            userName: professional.nom,
                            userPhoto: professional.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(professional.nom)}`
                        }
                    });
                    window.dispatchEvent(event);
                }}
                className="w-full bg-white py-3 rounded-xl font-medium transition-colors mb-6 hover:bg-sky-50 active:scale-95"
                style={{ border: '1px solid #4FB2E5', color: '#4FB2E5' }}
            >
                Send Message
            </button>

            {/* Info List */}
            <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                    <Clock className="mt-0.5" size={18} style={{ color: '#4FB2E5' }} />
                    <div>
                        <span className="font-semibold text-slate-900 block">Availability</span>
                        <span>Mon - Fri, 09:00 - 17:00</span>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CreditCard className="mt-0.5" size={18} style={{ color: '#F5A146' }} />
                    <div>
                        <span className="font-semibold text-slate-900 block">Payment</span>
                        <span>Cash, Card, Insurance</span>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5" size={18} style={{ color: '#FF90BC' }} />
                    <div>
                        <span className="font-semibold text-slate-900 block">Verified Provider</span>
                        <span>License #1234456</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingWidget;
