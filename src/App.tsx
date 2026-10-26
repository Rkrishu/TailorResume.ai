/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  AlertCircle,
  FileText,
  Shield,
  ArrowDown,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Layers,
  FileCheck2,
} from 'lucide-react';
import {
  UploadedFileState,
  JobDetails,
  TailoredResponse,
  ResumeData,
} from './types/resume';
import { Header } from './components/Header';
import { ResumeUpload } from './components/ResumeUpload';
import { PromptWorkspace } from './components/PromptWorkspace';
import { ResultsWorkspace } from './components/ResultsWorkspace';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PrivacyNotice } from './components/PrivacyNotice';
import {
  SAMPLE_RESUME_TEXT,
  SAMPLE_JOB_DESCRIPTION,
  SAMPLE_PROMPT_INSTRUCTION,
} from './data/sampleResume';

export default function App() {
  // Session State
  const [fileState, setFileState] = useState<UploadedFileState | null>(null);
  const [promptText, setPromptText] = useState('');
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    targetJobTitle: '',
    companyName: '',
    experienceLevel: 'Senior',
    desiredLength: '1-2 Pages',
    jobDescription: '',
  });

  // Processing & AI Results
  const [tailoredResult, setTailoredResult] = useState<TailoredResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [globalError, setGlobalError] = useState<{
    message: string;
    code?: string;
    isApiKeyMissing?: boolean;
  } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Initial Health Check
  const checkServerHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHasApiKey(data.hasApiKey);
        if (!data.hasApiKey) {
          setGlobalError({
            message:
              'Gemini API key is not configured on the server. Please add your GEMINI_API_KEY in Settings > Secrets or the server environment to generate tailored resumes.',
            code: 'MISSING_API_KEY',
            isApiKeyMissing: true,
          });
        } else {
          setGlobalError((prev) => (prev?.isApiKeyMissing ? null : prev));
        }
      }
    } catch (err) {
      console.warn('Health check fetch failed:', err);
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, []);

  // Quick Sample Loader
  const handleLoadSample = () => {
    setFileState({
      name: 'Alexander_Rivera_Software_Engineer_Resume.pdf',
      size: 142850,
      type: 'PDF',
      text: SAMPLE_RESUME_TEXT,
      wordCount: SAMPLE_RESUME_TEXT.split(/\s+/).length,
      pageCount: 1,
      status: 'ready',
    });
    setJobDetails({
      targetJobTitle: 'Staff / Senior Python Developer',
      companyName: 'Datastream Technologies',
      experienceLevel: 'Senior / Lead',
      desiredLength: '1-2 Pages',
      jobDescription: SAMPLE_JOB_DESCRIPTION,
    });
    setPromptText(SAMPLE_PROMPT_INSTRUCTION);
    setGlobalError(null);
  };

  const handleClearFile = () => {
    setFileState(null);
    setGlobalError(null);
  };

  const handleStartOver = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFileState(null);
    setPromptText('');
    setJobDetails({
      targetJobTitle: '',
      companyName: '',
      experienceLevel: 'Senior',
      desiredLength: '1-2 Pages',
      jobDescription: '',
    });
    setTailoredResult(null);
    setIsLoading(false);
    setIsRevising(false);
    setGlobalError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Main Tailor Resume Action
  const handleTailorResume = async () => {
    if (!fileState?.text) {
      setGlobalError({
        message: 'Please upload a PDF or DOCX resume before tailoring.',
      });
      return;
    }

    setGlobalError(null);
    setIsLoading(true);
    setLoadingStage('1. Extracting candidate qualifications & locking source of truth...');

    abortControllerRef.current = new AbortController();

    try {
      // Progress simulation stages for reassuring user experience
      const stageTimer1 = setTimeout(() => {
        setLoadingStage('2. Analyzing target role requirements with Gemini 3.8...');
      }, 1200);

      const stageTimer2 = setTimeout(() => {
        setLoadingStage('3. Optimizing ATS phrasing, metrics & strong action verbs...');
      }, 3000);

      const stageTimer3 = setTimeout(() => {
        setLoadingStage('4. Constructing keyword alignment matrix & verifying facts...');
      }, 5000);

      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: fileState.text,
          jobTitle: jobDetails.targetJobTitle,
          company: jobDetails.companyName,
          experienceLevel: jobDetails.experienceLevel,
          desiredLength: jobDetails.desiredLength,
          jobDescription: jobDetails.jobDescription,
          userInstructions: promptText,
          isRevision: false,
        }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      const result = await response.json();

      if (!response.ok) {
        if (result.code === 'MISSING_API_KEY') {
          setHasApiKey(false);
          setGlobalError({
            message:
              result.error || 'Server is missing GEMINI_API_KEY. Please configure it in Settings > Secrets.',
            code: 'MISSING_API_KEY',
            isApiKeyMissing: true,
          });
          return;
        }
        if (result.code === 'INVALID_API_KEY') {
          setGlobalError({
            message:
              result.error || 'The configured GEMINI_API_KEY was rejected by Google Gemini API.',
            code: 'INVALID_API_KEY',
            isApiKeyMissing: false,
          });
          return;
        }
        throw new Error(result.error || 'Failed to tailor resume with Gemini.');
      }

      if (!result.data || !result.data.resume) {
        throw new Error('Received unexpected response format from Gemini.');
      }

      setTailoredResult(result.data);

      // Smooth scroll to results
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Resume tailoring request cancelled by user.');
        return;
      }
      console.error('Tailor resume execution error:', err);
      setGlobalError({
        message: err.message || 'An error occurred while generating the tailored resume.',
        code: err.code || 'TAILOR_FAILED',
        isApiKeyMissing: false,
      });
    } finally {
      setIsLoading(false);
      setLoadingStage('');
      abortControllerRef.current = null;
    }
  };

  // AI Revision Action
  const handleReviseWithAi = async (instructions: string) => {
    if (!tailoredResult?.resume) return;

    setIsRevising(true);
    setGlobalError(null);

    try {
      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: fileState?.text || '',
          currentResume: tailoredResult.resume,
          jobTitle: jobDetails.targetJobTitle,
          company: jobDetails.companyName,
          experienceLevel: jobDetails.experienceLevel,
          desiredLength: jobDetails.desiredLength,
          jobDescription: jobDetails.jobDescription,
          userInstructions: instructions,
          isRevision: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Revision request failed.');
      }

      if (!result.data || !result.data.resume) {
        throw new Error('Invalid revision response format.');
      }

      setTailoredResult(result.data);
    } catch (err: any) {
      console.error('Revision error:', err);
      setGlobalError({
        message: `Revision failed: ${err.message || 'Please try again.'}`,
      });
    } finally {
      setIsRevising(false);
    }
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const handleUpdateResume = (updated: ResumeData) => {
    if (!tailoredResult) return;
    setTailoredResult({
      ...tailoredResult,
      resume: updated,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        hasApiKey={hasApiKey}
        canReset={!!fileState || !!tailoredResult}
        onStartOver={handleStartOver}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Global Error Banner */}
        {globalError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">
                  {globalError.isApiKeyMissing
                    ? 'Gemini API Key Required'
                    : globalError.code === 'INVALID_API_KEY'
                    ? 'Invalid Gemini API Key'
                    : 'Action Required'}
                </p>
                <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                  {globalError.message}
                </p>
                {globalError.isApiKeyMissing && (
                  <button
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                  >
                    View Setup Instructions
                  </button>
                )}
                {globalError.code === 'INVALID_API_KEY' && (
                  <button
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                  >
                    Check Configuration
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="text-rose-400 hover:text-rose-700 p-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Hero Banner (when no tailored results yet) */}
        {!tailoredResult && (
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailor for Recruiter Screening & ATS Systems</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
              Tailor Your Resume with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                Factual AI Precision
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload your PDF or DOCX resume, paste target job details, customize your prompt with Gemini, and download an ATS-compliant, recruiter-ready PDF.
            </p>
          </div>
        )}

        {/* Two-Step Workflow Grid (Step 1 & Step 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Step 1: Resume Upload */}
          <div
            ref={uploadSectionRef}
            className={`transition-all ${
              tailoredResult ? 'lg:col-span-4' : 'lg:col-span-5'
            }`}
          >
            <ResumeUpload
              fileState={fileState}
              onFileProcessed={setFileState}
              onClearFile={handleClearFile}
              onLoadSample={handleLoadSample}
              disabled={isLoading}
            />
          </div>

          {/* Step 2: Gemini Prompt Workspace */}
          <div
            className={`transition-all ${
              tailoredResult ? 'lg:col-span-8' : 'lg:col-span-7'
            }`}
          >
            <PromptWorkspace
              promptText={promptText}
              onPromptChange={setPromptText}
              jobDetails={jobDetails}
              onJobDetailsChange={setJobDetails}
              fileState={fileState}
              onTriggerUploadClick={() =>
                uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
              onSubmit={handleTailorResume}
              isLoading={isLoading}
              loadingStage={loadingStage}
              onCancelRequest={handleCancelRequest}
              onReset={handleStartOver}
            />
          </div>
        </div>

        {/* Step 3: Results Workspace (Rendered after successful generation) */}
        {tailoredResult && (
          <div ref={resultsSectionRef} className="pt-6 border-t border-slate-200/80">
            <ResultsWorkspace
              resume={tailoredResult.resume}
              onChangeResume={handleUpdateResume}
              keywordAnalysis={tailoredResult.keyword_analysis}
              changeSummary={tailoredResult.change_summary}
              suggestedAdditions={tailoredResult.suggested_additions}
              originalFileState={fileState}
              onRevise={handleReviseWithAi}
              isRevising={isRevising}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </main>

      {/* Privacy Notice & Footer */}
      <PrivacyNotice />

      {/* Api Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        hasApiKey={hasApiKey}
        onRefreshStatus={checkServerHealth}
      />
    </div>
  );
}
