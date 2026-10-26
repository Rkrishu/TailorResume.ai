import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, Info, ExternalLink, ArrowRight } from 'lucide-react';
import { KeywordAnalysis } from '../types/resume';

interface KeywordAnalysisPanelProps {
  analysis: KeywordAnalysis;
}

export const KeywordAnalysisPanel: React.FC<KeywordAnalysisPanelProps> = ({ analysis }) => {
  const matchedCount = analysis.matched?.length || 0;
  const partialCount = analysis.partially_matched?.length || 0;
  const missingCount = analysis.missing?.length || 0;
  const totalKeywords = matchedCount + partialCount + missingCount;

  const matchPercentage =
    totalKeywords > 0 ? Math.round(((matchedCount + partialCount * 0.5) / totalKeywords) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stat Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Job Description Keyword Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Objective comparison between the target job posting requirements and the factual qualifications in your resume.
            </p>
          </div>

          {/* Keyword Match Distribution */}
          <div className="flex items-center space-x-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/70">
            <div className="text-center">
              <span className="block text-lg font-black text-emerald-600">
                {matchedCount}
              </span>
              <span className="text-[10px] font-semibold uppercase text-slate-500">
                Matched
              </span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div className="text-center">
              <span className="block text-lg font-black text-amber-600">
                {partialCount}
              </span>
              <span className="text-[10px] font-semibold uppercase text-slate-500">
                Partial
              </span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div className="text-center">
              <span className="block text-lg font-black text-rose-600">
                {missingCount}
              </span>
              <span className="text-[10px] font-semibold uppercase text-slate-500">
                Missing
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer Note (Section H Requirement) */}
        <div className="mt-4 flex items-start space-x-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-700">Fair Use & Factual Notice:</strong> This matrix is an objective keyword alignment breakdown, not an official ATS vendor score. Missing keywords are qualifications requested by the job description that were not substantiated in your original resume. To maintain strict factual accuracy, ResumeTailor AI does not fabricate missing qualifications into your resume.
          </p>
        </div>
      </div>

      {/* 3 Grid Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Fully Matched */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Matched Keywords ({matchedCount})
              </h4>
              <p className="text-[11px] text-emerald-700">
                Verified in your resume & aligned to role
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analysis.matched && analysis.matched.length > 0 ? (
              analysis.matched.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/90 text-xs space-y-1"
                >
                  <div className="font-bold text-emerald-950 flex items-center justify-between">
                    <span>{item.keyword}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Matched
                    </span>
                  </div>
                  {item.context && (
                    <p className="text-emerald-800/80 text-[11px] leading-relaxed">
                      {item.context}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No exact keyword matches found.</p>
            )}
          </div>
        </div>

        {/* 2. Partially Matched */}
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center space-x-2 text-amber-800">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Partially Matched ({partialCount})
              </h4>
              <p className="text-[11px] text-amber-700">
                Transferable skills or related concepts
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analysis.partially_matched && analysis.partially_matched.length > 0 ? (
              analysis.partially_matched.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-100/90 text-xs space-y-1"
                >
                  <div className="font-bold text-amber-950 flex items-center justify-between">
                    <span>{item.keyword}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Transferable
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-amber-800/80 text-[11px] leading-relaxed">
                      {item.note}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No partial matches identified.</p>
            )}
          </div>
        </div>

        {/* 3. Missing Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Missing Qualifications ({missingCount})
              </h4>
              <p className="text-[11px] text-slate-500">
                In job posting but unverified in your resume
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {analysis.missing && analysis.missing.length > 0 ? (
              analysis.missing.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{item.keyword}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Missing
                    </span>
                  </div>
                  {item.recommendation && (
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      💡 {item.recommendation}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">All key posting requirements were matched!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
