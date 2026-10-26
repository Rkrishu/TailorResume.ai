import React from 'react';
import { ArrowRight, CheckCircle2, FileText, Sparkles, ShieldCheck } from 'lucide-react';
import { ResumeData } from '../types/resume';
import { generateResumeText } from '../utils/exportResume';

interface ComparisonViewProps {
  originalText: string;
  tailoredResume: ResumeData;
  changeSummary: string[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalText,
  tailoredResume,
  changeSummary,
}) => {
  const tailoredText = generateResumeText(tailoredResume);

  const originalWords = originalText.trim().split(/\s+/).filter(Boolean).length;
  const tailoredWords = tailoredText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Factual Integrity & Diff Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                Original vs. Tailored Resume Comparison
              </h3>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Factually Verified</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Inspect how your original employment facts were sharpened into recruiter-friendly action verbs, quantified achievements, and structured ATS headers.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/70">
            <div>
              <span className="block text-xs font-bold text-slate-500 uppercase">
                Original Length
              </span>
              <span className="text-sm font-black text-slate-800">
                {originalWords.toLocaleString()} words
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div>
              <span className="block text-xs font-bold text-blue-600 uppercase">
                Tailored Length
              </span>
              <span className="text-sm font-black text-blue-700">
                {tailoredWords.toLocaleString()} words
              </span>
            </div>
          </div>
        </div>

        {/* Change Summary Highlights */}
        {changeSummary && changeSummary.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Enhancements Made:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {changeSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 text-xs text-slate-700 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/70"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Dual Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Text */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Original Uploaded Resume
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Source of truth
            </span>
          </div>
          <div className="p-5 flex-1 overflow-y-auto max-h-[600px] text-xs font-mono text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/40">
            {originalText || '(No original text available)'}
          </div>
        </div>

        {/* Right: Tailored Resume Text */}
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-blue-50/80 border-b border-blue-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Tailored ATS Version
              </span>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Optimized
            </span>
          </div>
          <div className="p-5 flex-1 overflow-y-auto max-h-[600px] text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap bg-white">
            {tailoredText}
          </div>
        </div>
      </div>
    </div>
  );
};
