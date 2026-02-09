import React from 'react';
import type { BookingFormData } from '../types';

interface Step2PersonalDetailsProps {
    formData: BookingFormData;
    onFormChange: (field: string, value: string) => void;
}

const Step2PersonalDetails: React.FC<Step2PersonalDetailsProps> = ({
    formData,
    onFormChange,
}) => {
    const cities = [
        'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
        'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Kairouan',
        'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia', 'Sfax',
        'Gafsa', 'Tozeur', 'Kébili', 'Gabès', 'Médenine', 'Tataouine'
    ];

    const InputField = ({ label, field, type = "text", placeholder, required = true }: any) => (
        <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2 ml-1">
                {label} {required && <span className="text-[#FF90BC]">*</span>}
            </label>
            <input
                type={type}
                value={(formData as any)[field]}
                onChange={(e) => onFormChange(field, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4FB2E5] focus:ring-4 focus:ring-[#4FB2E5]/10 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder={placeholder}
                required={required}
            />
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Your Information</h2>
                <p className="text-gray-500">Please provide your personal details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="First Name"
                    field="prenom"
                    placeholder="Enter your first name"
                />
                <InputField
                    label="Last Name"
                    field="nom"
                    placeholder="Enter your last name"
                />
                <InputField
                    label="Email Address"
                    field="email"
                    type="email"
                    placeholder="email@example.com"
                />
                <InputField
                    label="Phone Number"
                    field="phone"
                    type="tel"
                    placeholder="+216 00 000 000"
                />

                <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2 ml-1">
                        City <span className="text-[#FF90BC]">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={formData.ville}
                            onChange={(e) => onFormChange('ville', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4FB2E5] focus:ring-4 focus:ring-[#4FB2E5]/10 outline-none transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                            required
                        >
                            <option value="">Select your city</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2PersonalDetails;
