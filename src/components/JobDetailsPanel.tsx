import React from 'react';
import { Briefcase, Building2, ChevronDown, ChevronUp, Layers, FileSpreadsheet, Sparkles } from 'lucide-react';
import { JobDetails } from '../types/resume';
import { SAMPLE_JOB_DESCRIPTION } from '../data/sampleResume';

interface JobDetailsPanelProps {
  jobDetails: JobDetails;
  onChange: (details: JobDetails) => void;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const JobDetailsPanel: React.FC<JobDetailsPanelProps> = ({
  jobDetails,
  onChange,
  isOpen,
  onToggle,
  disabled = false,
}) => {
  const handleFieldChange = (field: keyof JobDetails, value: string) => {
    onChange({
      ...jobDetails,
      [field]: value,
    });
  };

  const handleFillSample = () => {
    onChange({
      targetJobTitle: 'Staff / Senior Python Developer',
      companyName: 'Datastream Technologies',
      experienceLevel: 'Senior / Lead',
      desiredLength: '1-2 Pages',
      jobDescription: SAMPLE_JOB_DESCRIPTION,
    });
  };

  const hasContent =
    jobDetails.targetJobTitle ||
    jobDetails.companyName ||
    jobDetails.jobDescription.trim().length > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs">
      {/* Toggle Header Button */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-900">
                Target Role & Job Description
              </span>
              <span className="text-xs text-slate-500 font-normal">
                (Highly Recommended)
              </span>
              {hasContent && (
                <span className="w-2 h-2 rounded-full bg-blue-600" title="Configured" />
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Paste the target job posting to optimize keyword coverage and ATS score.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {/* Expanded Form Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Target Job Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Job Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Python Developer"
                  value={jobDetails.targetJobTitle}
                  onChange={(e) => handleFieldChange('targetJobTitle', e.target.value)}
                  disabled={disabled}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Stripe, Acme Corp"
                value={jobDetails.companyName}
                onChange={(e) => handleFieldChange('companyName', e.target.value)}
                disabled={disabled}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Level
              </label>
              <select
                value={jobDetails.experienceLevel}
                onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
                disabled={disabled}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              >
                <option value="Entry-Level">Entry-Level (0-2 years)</option>
                <option value="Mid-Level">Mid-Level (3-5 years)</option>
                <option value="Senior">Senior (5-8 years)</option>
                <option value="Staff / Lead">Staff / Principal / Lead</option>
                <option value="Executive / Director">Executive / Management</option>
              </select>
            </div>

            {/* Desired Resume Length */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Desired Resume Length
              </label>
              <select
                value={jobDetails.desiredLength}
                onChange={(e) => handleFieldChange('desiredLength', e.target.value)}
                disabled={disabled}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              >
                <option value="1 Page (Concise)">1 Page (High density, concise)</option>
                <option value="1-2 Pages">1-2 Pages (Standard ATS balance)</option>
                <option value="2 Pages (Comprehensive)">2 Pages (Detailed projects & roles)</option>
              </select>
            </div>
          </div>

          {/* Job Description Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Target Job Description
              </label>
              <button
                type="button"
                onClick={handleFillSample}
                disabled={disabled}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill Sample Job Description</span>
              </button>
            </div>
            <textarea
              rows={5}
              placeholder="Paste the full job description or requirements here. Gemini will analyze required keywords, technical qualifications, and responsibilities..."
              value={jobDetails.jobDescription}
              onChange={(e) => handleFieldChange('jobDescription', e.target.value)}
              disabled={disabled}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 leading-relaxed font-sans"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Tip: You can proceed without a job description, but providing one ensures accurate keyword matching and tailored impact.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
