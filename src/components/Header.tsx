import React from 'react';
import { Sparkles, Shield, RotateCcw, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  onStartOver: () => void;
  canReset: boolean;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  onStartOver,
  canReset,
  onOpenApiKeyModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                TailorResume<span className="text-blue-600">.ai</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Factual ATS Resume Tailoring • No Account Needed
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Guest Privacy Indicator */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/80">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private Session (No DB Storage)</span>
          </div>

          {/* API Key Status Pill */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              hasApiKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
            title={hasApiKey ? 'Gemini API configured on server' : 'Configure Gemini API Key'}
          >
            {hasApiKey ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Gemini 3.8 Ready</span>
                <span className="sm:hidden">Ready</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Configure Key</span>
              </>
            )}
          </button>

          {/* Start Over Button */}
          {canReset && (
            <button
              onClick={onStartOver}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Clear current session and start over"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
