import React, { useState } from 'react';
import { KeyRound, X, CheckCircle2, AlertTriangle, RefreshCw, Shield, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
  onRefreshStatus: () => Promise<void>;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  hasApiKey,
  onRefreshStatus,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheck = async () => {
    setIsChecking(true);
    setCheckResult(null);
    try {
      await onRefreshStatus();
      setCheckResult('Server configuration re-checked.');
    } catch (e) {
      setCheckResult('Failed to reach server health endpoint.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                hasApiKey
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Server Gemini API Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Secure server-side API integration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Box */}
        <div
          className={`p-4 rounded-xl border text-xs space-y-2 ${
            hasApiKey
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold">
            {hasApiKey ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gemini API Key is Active & Configured</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>GEMINI_API_KEY Not Detected</span>
              </>
            )}
          </div>
          <p className="leading-relaxed text-[11px] opacity-90">
            {hasApiKey
              ? 'Your server has access to GEMINI_API_KEY. All resume analysis and tailoring requests will be processed securely using gemini-3.8-flash.'
              : 'The server requires GEMINI_API_KEY to call the Gemini API. In Google AI Studio, ensure your API key is attached in Settings > Secrets or in the environment variables.'}
          </p>
        </div>

        {/* Security Assurance */}
        <div className="flex items-start space-x-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
          <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Zero Client Exposure:</strong> The Gemini API key is strictly stored and executed on the backend server. It is never included in browser bundles, network requests to the client, or client-side storage.
          </p>
        </div>

        {checkResult && (
          <p className="text-xs text-center font-medium text-slate-600">
            {checkResult}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCheck}
            disabled={isChecking}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Check Status Again</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
