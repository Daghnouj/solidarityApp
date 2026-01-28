import React from 'react';
import type { Professional } from '../../Professionals/types';

interface BioSectionProps {
  professional: Professional;
}

const BioSection: React.FC<BioSectionProps> = ({ professional }) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">About Me</h3>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <p className="mb-4">
          {professional.bio ||
            `As a dedicated ${professional.specialite}, I focus on creating a supportive and non-judgmental environment. My approach combines evidence-based techniques with genuine empathy to help you navigate life's challenges. I believe in the power of collaborative therapy to foster growth and resilience.`}
        </p>
        {!professional.bio && (
          <p>
            I have experience working with diverse populations and specialize in anxiety, depression, and stress management. My goal is to empower you with the tools needed for long-term well-being.
          </p>
        )}
      </div>
    </div>);
};

export default React.memo(BioSection);