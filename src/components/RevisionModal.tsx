import React, { useState } from 'react';
import { Sparkles, X, Loader2, ArrowRight, Lightbulb } from 'lucide-react';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRevision: (instructions: string) => Promise<void>;
  isLoading: boolean;
}

const REVISION_SUGGESTIONS = [
  'Make all experience bullets more achievement-driven with action verbs.',
  'Condense the professional summary to 2 punchy sentences.',
  'Highlight Python, automated pipelines, and cloud scalability.',
  'Make the writing more concise to fit strictly on 1 page.',
  'Clarify technical leadership and mentoring experience.',
];

export const RevisionModal: React.FC<RevisionModalProps> = ({
  isOpen,
  onClose,
  onSubmitRevision,
  isLoading,
}) => {
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructions.trim() || isLoading) return;
    await onSubmitRevision(instructions.trim());
    setInstructions('');
  };

  const handlePickPreset = (preset: string) => {
    setInstructions(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Revise Resume with AI
              </h3>
              <p className="text-xs text-slate-500">
                Provide custom instructions to refine your current tailored resume.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Revision Instructions:
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. Focus bullet points more on automation and quantifiable latency reductions..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 leading-relaxed font-sans"
            />
          </div>

          {/* Quick Ideas */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1 mb-1.5">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Quick revision ideas:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {REVISION_SUGGESTIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handlePickPreset(preset)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!instructions.trim() || isLoading}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                !instructions.trim() || isLoading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Revising Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply AI Revision</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
