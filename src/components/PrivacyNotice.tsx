import React from 'react';
import { ShieldCheck, Lock, FileCheck, CheckCircle } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-slate-50/70 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          {/* Pillar 1 */}
          <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">
                Zero Permanent Database Storage
              </h4>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                No account required. Uploaded resumes and job descriptions are processed in volatile memory only and never stored in a persistent database.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">
                Strict Factual Integrity
              </h4>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                ResumeTailor AI treats your source resume as ground truth. It will never invent unearned skills, companies, degrees, or phony metrics.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">
                ATS-Compliant Standards
              </h4>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Single-column semantic layouts, selectable text PDFs without unparsable tables or complex vector graphics that break ATS parsers.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} ResumeTailor AI • Built with Google Gemini 3.8 & React</p>
          <p>
            Notice: AI processing uses Google Gemini. Clearing your browser session resets all application state.
          </p>
        </div>
      </div>
    </footer>
  );
};
