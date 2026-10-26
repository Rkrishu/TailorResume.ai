import React, { useState } from 'react';
import {
  Sparkles,
  Paperclip,
  Trash2,
  ArrowRight,
  Loader2,
  PlusCircle,
  HelpCircle,
  XCircle,
  Check,
} from 'lucide-react';
import { JobDetails, UploadedFileState } from '../types/resume';
import { JobDetailsPanel } from './JobDetailsPanel';

interface PromptWorkspaceProps {
  promptText: string;
  onPromptChange: (text: string) => void;
  jobDetails: JobDetails;
  onJobDetailsChange: (details: JobDetails) => void;
  fileState: UploadedFileState | null;
  onTriggerUploadClick: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  loadingStage: string;
  onCancelRequest?: () => void;
  onReset: () => void;
}

const PRESET_INSTRUCTIONS = [
  'Tailor my resume for a Python Developer.',
  'Highlight relevant automation and Selenium projects.',
  'Improve my professional summary.',
  'Make the writing more concise.',
  'Keep the formatting professional and ATS-conscious.',
];

export const PromptWorkspace: React.FC<PromptWorkspaceProps> = ({
  promptText,
  onPromptChange,
  jobDetails,
  onJobDetailsChange,
  fileState,
  onTriggerUploadClick,
  onSubmit,
  isLoading,
  loadingStage,
  onCancelRequest,
  onReset,
}) => {
  const [isJobPanelOpen, setIsJobPanelOpen] = useState(false);

  const handleAddPreset = (preset: string) => {
    if (!promptText.trim()) {
      onPromptChange(preset);
    } else if (!promptText.includes(preset)) {
      onPromptChange(`${promptText.trim()} ${preset}`);
    }
  };

  const isSubmitDisabled = isLoading || !fileState?.text;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>2. Gemini AI Prompt Workspace</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe your target role and customize how you want your resume tailored.
          </p>
        </div>

        {/* Clear prompt button */}
        {promptText && !isLoading && (
          <button
            type="button"
            onClick={() => onPromptChange('')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center space-x-1 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Prompt</span>
          </button>
        )}
      </div>

      {/* Main Prompt Box */}
      <div className="relative rounded-2xl border-2 border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all bg-slate-50/40">
        <textarea
          rows={4}
          value={promptText}
          onChange={(e) => onPromptChange(e.target.value)}
          disabled={isLoading}
          placeholder="Tell us what role you're targeting and how you'd like to improve your resume..."
          className="w-full p-4 text-sm bg-transparent border-0 focus:outline-none resize-y text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed min-h-[110px]"
        />

        {/* Quick Suggestion Chips */}
        <div className="px-3 pb-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center">
            Suggested prompts:
          </span>
          {PRESET_INSTRUCTIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleAddPreset(preset)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors shadow-2xs font-medium"
            >
              + {preset}
            </button>
          ))}
        </div>

        {/* Workspace Toolbar Bottom */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={onTriggerUploadClick}
              disabled={isLoading}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                fileState?.text
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {fileState?.text
                  ? `Attached: ${fileState.name.slice(0, 18)}...`
                  : 'Attach Resume Document'}
              </span>
            </button>

            {/* Toggle Job Description Panel */}
            <button
              type="button"
              onClick={() => setIsJobPanelOpen(!isJobPanelOpen)}
              disabled={isLoading}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                jobDetails.jobDescription.trim().length > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>
                {jobDetails.jobDescription.trim().length > 0
                  ? 'Job Description Added'
                  : 'Add Job Description'}
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Cancel option when loading */}
            {isLoading && onCancelRequest && (
              <button
                type="button"
                onClick={onCancelRequest}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}

            {/* Tailor My Resume Main Action Button */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all ${
                isSubmitDisabled
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Tailoring Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-100" />
                  <span>Tailor My Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Progress State Indicator */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 space-y-2 animate-pulse">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-900">{loadingStage}</p>
              <p className="text-[11px] text-blue-700">
                Gemini is optimizing wording, structuring ATS categories, and verifying factual integrity...
              </p>
            </div>
          </div>
          <div className="w-full bg-blue-200/70 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-2/3 animate-[progress_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Missing Resume Warning if tried to submit without resume */}
      {!fileState?.text && (
        <p className="text-xs text-slate-500 italic">
          * Please upload a resume above or click "Try Sample Resume" before tailoring.
        </p>
      )}

      {/* Job Details Expandable Panel */}
      <JobDetailsPanel
        jobDetails={jobDetails}
        onChange={onJobDetailsChange}
        isOpen={isJobPanelOpen}
        onToggle={() => setIsJobPanelOpen(!isJobPanelOpen)}
        disabled={isLoading}
      />
    </div>
  );
};
