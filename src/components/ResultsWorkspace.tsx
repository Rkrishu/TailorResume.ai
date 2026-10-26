import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  FileText,
  Layers,
  FileCheck2,
  Columns,
  Lightbulb,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ResumeData, KeywordAnalysis, SuggestedAddition, UploadedFileState } from '../types/resume';
import { downloadResumePdf, downloadResumeTxt, generateResumeText } from '../utils/exportResume';
import { ResumeEditor } from './ResumeEditor';
import { KeywordAnalysisPanel } from './KeywordAnalysisPanel';
import { ComparisonView } from './ComparisonView';
import { RevisionModal } from './RevisionModal';

interface ResultsWorkspaceProps {
  resume: ResumeData;
  onChangeResume: (updated: ResumeData) => void;
  keywordAnalysis: KeywordAnalysis;
  changeSummary: string[];
  suggestedAdditions?: SuggestedAddition[];
  originalFileState: UploadedFileState | null;
  onRevise: (instructions: string) => Promise<void>;
  isRevising: boolean;
  onStartOver: () => void;
}

export const ResultsWorkspace: React.FC<ResultsWorkspaceProps> = ({
  resume,
  onChangeResume,
  keywordAnalysis,
  changeSummary,
  suggestedAdditions,
  originalFileState,
  onRevise,
  isRevising,
  onStartOver,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'keywords' | 'comparison' | 'suggestions'>('editor');
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  const cleanFilename = (resume.name || 'resume')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');

  const handleCopyText = async () => {
    try {
      const text = generateResumeText(resume);
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error('Failed to copy resume text:', err);
    }
  };

  const handleDownloadTxt = () => {
    try {
      downloadResumeTxt(resume, `${cleanFilename}_tailored.txt`);
      setDownloadSuccess('TXT downloaded');
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch (err) {
      console.error('Download TXT error:', err);
    }
  };

  const handleDownloadPdf = () => {
    try {
      downloadResumePdf(resume, `${cleanFilename}_tailored.pdf`);
      setDownloadSuccess('PDF generated & downloaded');
      setTimeout(() => setDownloadSuccess(null), 2500);
    } catch (err) {
      console.error('Download PDF error:', err);
    }
  };

  const handleApplyRevision = async (instructions: string) => {
    await onRevise(instructions);
    setIsRevisionModalOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Main Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900">
              Tailored ATS Resume Ready
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Live Editable
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Factual achievements aligned with target role. Download as standard selectable PDF or TXT.
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
          {/* Copy Plain Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Copy entire formatted resume text to clipboard"
          >
            {copySuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          {/* Download TXT */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Download plain text ATS resume"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Download TXT</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all"
            title="Download selectable-text ATS compliant PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Revise with AI */}
          <button
            type="button"
            onClick={() => setIsRevisionModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            title="Make iterative refinements using AI prompt"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Revise with AI</span>
          </button>

          {/* Start Over */}
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Start over with a new resume"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start Over</span>
          </button>
        </div>
      </div>

      {/* Download or Copy Success Toast */}
      {downloadSuccess && (
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}! File saved to your downloads.</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'editor'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>ATS Resume & Editor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('keywords')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'keywords'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Keyword Matrix</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
            {keywordAnalysis.matched?.length || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'comparison'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Columns className="w-4 h-4" />
          <span>Side-by-Side Comparison</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('suggestions')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'suggestions'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Enhancements & Suggestions</span>
          {suggestedAdditions && suggestedAdditions.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
              {suggestedAdditions.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'editor' && (
        <ResumeEditor resume={resume} onChange={onChangeResume} />
      )}

      {activeTab === 'keywords' && (
        <KeywordAnalysisPanel analysis={keywordAnalysis} />
      )}

      {activeTab === 'comparison' && (
        <ComparisonView
          originalText={originalFileState?.text || ''}
          tailoredResume={resume}
          changeSummary={changeSummary}
        />
      )}

      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          {/* Change Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Summary of Optimizations Performed:</span>
            </h3>
            <div className="space-y-2">
              {changeSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Confirmation Additions (Factual Accuracy Section F) */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Suggested Additions (Requiring Candidate Confirmation)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  In strict compliance with factual accuracy rules, ResumeTailor AI has <strong>not</strong> inserted these into your resume automatically. If you have done these or possess these metrics, you can add them using the Live Field Editor.
                </p>
              </div>
            </div>

            {suggestedAdditions && suggestedAdditions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {suggestedAdditions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                        {item.section}
                      </span>
                      <span className="text-[10px] text-amber-700 font-medium">
                        Confirm if true
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900">{item.suggestion}</p>
                    <p className="text-[11px] text-slate-600">{item.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No additional unconfirmed claims suggested. All tailored statements are directly rooted in your original experience.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Revision Modal */}
      <RevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onSubmitRevision={handleApplyRevision}
        isLoading={isRevising}
      />
    </div>
  );
};
