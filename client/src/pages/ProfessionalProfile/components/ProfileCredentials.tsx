import React from 'react';
import { GraduationCap, Award, BookOpen } from 'lucide-react';
import type { Professional } from '../../Professionals/types';

interface ProfileCredentialsProps {
    professional: Professional;
}

const ProfileCredentials: React.FC<ProfileCredentialsProps> = ({ professional }) => {
    // Use mock data if education is not populated yet
    // In a real scenario, this comes from professional.education
    interface Education {
        degree: string;
        school: string;
        year: string;
    }

    // Use professional education if available (casted as any for now since it might be missing in type definition)
    const education: Education[] = (professional as any).education?.length ? (professional as any).education : [
        { degree: "Master in Clinical Psychology", school: "University of Tunis", year: "2018" },
        { degree: "Bachelor in Psychology", school: "University of Sousse", year: "2015" }
    ];

    const certifications = [
        "Certified CBT Therapist",
        "Mindfulness Based Stress Reduction (MBSR)"
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award size={24} style={{ color: '#4FB2E5' }} />
                Credentials & Education
            </h3>

            <div className="space-y-6">
                {/* Education */}
                <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <GraduationCap size={16} />
                        Education
                    </h4>
                    <div className="space-y-4">
                        {education.map((edu, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4FB2E5' }}></div>
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">{edu.degree}</div>
                                    <div className="text-slate-500 text-sm">{edu.school} • {edu.year}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Separator */}
                <div className="border-t border-slate-100"></div>

                {/* Certifications */}
                <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BookOpen size={16} />
                        Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {certifications.map((cert, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                style={{ backgroundColor: '#F5A14620', color: '#F5A146' }}
                            >
                                {cert}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCredentials;
