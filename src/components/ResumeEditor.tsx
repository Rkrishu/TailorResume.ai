import React, { useState } from 'react';
import {
  Edit3,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Sparkles,
  Eye,
} from 'lucide-react';
import { ResumeData, ExperienceItem, ProjectItem, EducationItem, SkillCategory } from '../types/resume';

interface ResumeEditorProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ resume, onChange }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Field update helpers
  const handleNameChange = (name: string) => {
    onChange({ ...resume, name });
  };

  const handleSummaryChange = (summary: string) => {
    onChange({ ...resume, professional_summary: summary });
  };

  const handleContactChange = (index: number, val: string) => {
    const updated = [...resume.contact];
    updated[index] = val;
    onChange({ ...resume, contact: updated });
  };

  const handleAddContact = () => {
    onChange({ ...resume, contact: [...resume.contact, ''] });
  };

  const handleRemoveContact = (index: number) => {
    const updated = resume.contact.filter((_, i) => i !== index);
    onChange({ ...resume, contact: updated });
  };

  // Skills
  const handleSkillCategoryChange = (index: number, category: string) => {
    const updated = [...resume.skills];
    updated[index] = { ...updated[index], category };
    onChange({ ...resume, skills: updated });
  };

  const handleSkillItemsChange = (index: number, commaSeparated: string) => {
    const updated = [...resume.skills];
    updated[index] = {
      ...updated[index],
      items: commaSeparated.split(',').map((s) => s.trim()).filter(Boolean),
    };
    onChange({ ...resume, skills: updated });
  };

  const handleAddSkillCategory = () => {
    onChange({
      ...resume,
      skills: [...resume.skills, { category: 'Tools & Technologies', items: ['New Skill'] }],
    });
  };

  const handleRemoveSkillCategory = (index: number) => {
    const updated = resume.skills.filter((_, i) => i !== index);
    onChange({ ...resume, skills: updated });
  };

  // Experience
  const handleExpChange = (index: number, field: keyof ExperienceItem, val: any) => {
    const updated = [...resume.experience];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...resume, experience: updated });
  };

  const handleBulletChange = (expIdx: number, bulletIdx: number, val: string) => {
    const updated = [...resume.experience];
    const newBullets = [...updated[expIdx].bullets];
    newBullets[bulletIdx] = val;
    updated[expIdx] = { ...updated[expIdx], bullets: newBullets };
    onChange({ ...resume, experience: updated });
  };

  const handleAddBullet = (expIdx: number) => {
    const updated = [...resume.experience];
    updated[expIdx] = {
      ...updated[expIdx],
      bullets: [...updated[expIdx].bullets, 'Engineered high-impact feature resulting in measurable performance gain.'],
    };
    onChange({ ...resume, experience: updated });
  };

  const handleRemoveBullet = (expIdx: number, bulletIdx: number) => {
    const updated = [...resume.experience];
    updated[expIdx] = {
      ...updated[expIdx],
      bullets: updated[expIdx].bullets.filter((_, i) => i !== bulletIdx),
    };
    onChange({ ...resume, experience: updated });
  };

  // Projects
  const handleProjBulletChange = (projIdx: number, bulletIdx: number, val: string) => {
    const updated = [...resume.projects];
    const newBullets = [...updated[projIdx].bullets];
    newBullets[bulletIdx] = val;
    updated[projIdx] = { ...updated[projIdx], bullets: newBullets };
    onChange({ ...resume, projects: updated });
  };

  const handleAddProjBullet = (projIdx: number) => {
    const updated = [...resume.projects];
    updated[projIdx] = {
      ...updated[projIdx],
      bullets: [...updated[projIdx].bullets, 'Implemented architecture and released open-source project.'],
    };
    onChange({ ...resume, projects: updated });
  };

  const handleRemoveProjBullet = (projIdx: number, bulletIdx: number) => {
    const updated = [...resume.projects];
    updated[projIdx] = {
      ...updated[projIdx],
      bullets: updated[projIdx].bullets.filter((_, i) => i !== bulletIdx),
    };
    onChange({ ...resume, projects: updated });
  };

  // Education
  const handleEduChange = (index: number, field: keyof EducationItem, val: string) => {
    const updated = [...resume.education];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...resume, education: updated });
  };

  // Certifications
  const handleCertChange = (index: number, val: string) => {
    const updated = [...resume.certifications];
    updated[index] = val;
    onChange({ ...resume, certifications: updated });
  };

  const handleAddCert = () => {
    onChange({
      ...resume,
      certifications: [...resume.certifications, 'New Certification or Credential'],
    });
  };

  const handleRemoveCert = (index: number) => {
    const updated = resume.certifications.filter((_, i) => i !== index);
    onChange({ ...resume, certifications: updated });
  };

  return (
    <div className="space-y-4">
      {/* View / Edit Mode Switcher */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Mode:
          </span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                !isEditMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ATS Clean Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                isEditMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Live Field Editor</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 hidden sm:block">
          {isEditMode
            ? 'Any text edits immediately sync to your PDF and TXT exports.'
            : 'Single-column ATS format with clean semantic typography.'}
        </p>
      </div>

      {/* The Printable / ATS Resume Paper Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 sm:p-10 font-sans text-slate-900 leading-relaxed max-w-4xl mx-auto">
        {/* ================= HEADER: NAME & CONTACT ================= */}
        <div className="text-center pb-6 border-b border-slate-200">
          {isEditMode ? (
            <div className="space-y-3">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                Candidate Full Name
              </label>
              <input
                type="text"
                value={resume.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full text-center text-xl font-extrabold text-slate-900 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />

              <label className="block text-[11px] font-semibold text-slate-500 uppercase mt-2">
                Contact Information Items
              </label>
              <div className="flex flex-wrap justify-center gap-2">
                {resume.contact.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContactChange(idx, e.target.value)}
                      className="text-xs bg-transparent focus:outline-none text-slate-700 min-w-[140px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveContact(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center space-x-1 border border-blue-200 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Contact</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
                {resume.name || 'Candidate Name'}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
                {resume.contact.filter(Boolean).map((contactItem, idx) => (
                  <React.Fragment key={idx}>
                    <span>{contactItem}</span>
                    {idx < resume.contact.length - 1 && (
                      <span className="text-slate-300 select-none">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= PROFESSIONAL SUMMARY ================= */}
        <div className="pt-6 pb-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-2 border-blue-600 pl-2">
              Professional Summary
            </h2>
          </div>
          {isEditMode ? (
            <textarea
              rows={4}
              value={resume.professional_summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed text-slate-800"
            />
          ) : (
            <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
              {resume.professional_summary}
            </p>
          )}
        </div>

        {/* ================= SKILLS ================= */}
        <div className="pt-6 pb-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-2 border-blue-600 pl-2">
              Technical & Professional Skills
            </h2>
            {isEditMode && (
              <button
                type="button"
                onClick={handleAddSkillCategory}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill Group</span>
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs sm:text-[13px]">
            {resume.skills.map((group, gIdx) => (
              <div key={gIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                {isEditMode ? (
                  <div className="w-full flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 mb-1">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={group.category}
                      onChange={(e) => handleSkillCategoryChange(gIdx, e.target.value)}
                      className="w-1/3 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Comma-separated items (e.g. Python, Docker, AWS)"
                      value={Array.isArray(group.items) ? group.items.join(', ') : ''}
                      onChange={(e) => handleSkillItemsChange(gIdx, e.target.value)}
                      className="flex-1 text-xs text-slate-700 bg-white border border-slate-300 rounded px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillCategory(gIdx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-slate-900 shrink-0 min-w-[140px]">
                      {group.category ? `${group.category}:` : ''}
                    </span>
                    <span className="text-slate-700">
                      {Array.isArray(group.items) ? group.items.filter(Boolean).join(', ') : ''}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= WORK EXPERIENCE ================= */}
        <div className="pt-6 pb-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-2 border-blue-600 pl-2">
              Work Experience
            </h2>
          </div>

          <div className="space-y-6">
            {resume.experience.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="space-y-2">
                {isEditMode ? (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.role}
                        onChange={(e) => handleExpChange(expIdx, 'role', e.target.value)}
                        className="text-xs font-bold border border-slate-300 rounded p-1.5 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.employer}
                        onChange={(e) => handleExpChange(expIdx, 'employer', e.target.value)}
                        className="text-xs border border-slate-300 rounded p-1.5 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Location (e.g. San Francisco, CA)"
                        value={exp.location || ''}
                        onChange={(e) => handleExpChange(expIdx, 'location', e.target.value)}
                        className="text-xs border border-slate-300 rounded p-1.5 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Dates (e.g. 2022 - Present)"
                        value={exp.dates}
                        onChange={(e) => handleExpChange(expIdx, 'dates', e.target.value)}
                        className="text-xs border border-slate-300 rounded p-1.5 bg-white font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase">
                        Achievement Bullet Points
                      </label>
                      {exp.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start space-x-2">
                          <span className="text-slate-400 mt-1">•</span>
                          <textarea
                            rows={2}
                            value={b}
                            onChange={(e) => handleBulletChange(expIdx, bIdx, e.target.value)}
                            className="flex-1 text-xs border border-slate-300 rounded p-1.5 bg-white leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet(expIdx, bIdx)}
                            className="text-slate-400 hover:text-rose-600 mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddBullet(expIdx)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-bold text-slate-950">
                          {exp.role}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          — {exp.employer}
                          {exp.location ? ` | ${exp.location}` : ''}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 font-semibold shrink-0">
                        {exp.dates}
                      </span>
                    </div>

                    <ul className="mt-2 space-y-1.5 text-xs sm:text-[13px] text-slate-700 leading-relaxed list-disc list-outside pl-4">
                      {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                        <li key={bIdx} className="pl-0.5">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= PROJECTS (IF PRESENT) ================= */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="pt-6 pb-5 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-2 border-blue-600 pl-2 mb-4">
              Key Projects
            </h2>

            <div className="space-y-4">
              {resume.projects.map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="space-y-1.5">
                  {isEditMode ? (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[pIdx] = { ...updated[pIdx], title: e.target.value };
                            onChange({ ...resume, projects: updated });
                          }}
                          className="text-xs font-bold border border-slate-300 rounded p-1.5 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Tech Stack / Subtitle"
                          value={proj.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[pIdx] = { ...updated[pIdx], subtitle: e.target.value };
                            onChange({ ...resume, projects: updated });
                          }}
                          className="text-xs border border-slate-300 rounded p-1.5 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Dates or Link"
                          value={proj.dates || ''}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[pIdx] = { ...updated[pIdx], dates: e.target.value };
                            onChange({ ...resume, projects: updated });
                          }}
                          className="text-xs border border-slate-300 rounded p-1.5 bg-white"
                        />
                      </div>

                      {proj.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start space-x-2">
                          <span className="text-slate-400 mt-1">•</span>
                          <textarea
                            rows={2}
                            value={b}
                            onChange={(e) => handleProjBulletChange(pIdx, bIdx, e.target.value)}
                            className="flex-1 text-xs border border-slate-300 rounded p-1.5 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveProjBullet(pIdx, bIdx)}
                            className="text-slate-400 hover:text-rose-600 mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddProjBullet(pIdx)}
                        className="text-xs text-blue-600 font-semibold flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Project Bullet</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-sm font-bold text-slate-950">
                            {proj.title}
                          </span>
                          {proj.subtitle && (
                            <span className="text-xs text-slate-600 italic">
                              | {proj.subtitle}
                            </span>
                          )}
                        </div>
                        {proj.dates && (
                          <span className="text-xs text-slate-600 font-medium">
                            {proj.dates}
                          </span>
                        )}
                      </div>

                      <ul className="mt-1 space-y-1 text-xs sm:text-[13px] text-slate-700 leading-relaxed list-disc list-outside pl-4">
                        {proj.bullets.filter(Boolean).map((bullet, bIdx) => (
                          <li key={bIdx} className="pl-0.5">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= EDUCATION ================= */}
        <div className="pt-6 pb-5 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-2 border-blue-600 pl-2 mb-3">
            Education
          </h2>

          <div className="space-y-3">
            {resume.education.map((edu, eduIdx) => (
              <div key={edu.id || eduIdx}>
                {isEditMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleEduChange(eduIdx, 'degree', e.target.value)}
                      className="text-xs font-bold border border-slate-300 rounded p-1.5 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Institution / School"
                      value={edu.school}
                      onChange={(e) => handleEduChange(eduIdx, 'school', e.target.value)}
                      className="text-xs border border-slate-300 rounded p-1.5 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Dates (e.g. 2016 - 2020)"
                      value={edu.dates || ''}
                      onChange={(e) => handleEduChange(eduIdx, 'dates', e.target.value)}
                      className="text-xs border border-slate-300 rounded p-1.5 bg-white"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-[13px]">
                    <div>
                      <span className="font-bold text-slate-950">{edu.degree}</span>
                      <span className="text-slate-600 font-medium"> — {edu.school}</span>
                      {edu.details && (
                        <p className="text-xs text-slate-500 mt-0.5">{edu.details}</p>
                      )}
                    </div>
                    {edu.dates && (
                      <span className="text-xs text-slate-600 font-medium shrink-0">
                        {edu.dates}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= CERTIFICATIONS ================= */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-2 border-blue-600 pl-2">
                Certifications & Credentials
              </h2>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="text-xs text-blue-600 font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              )}
            </div>

            <ul className="space-y-1 text-xs sm:text-[13px] text-slate-700">
              {resume.certifications.map((cert, cIdx) => (
                <li key={cIdx} className="flex items-center space-x-2">
                  {isEditMode ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleCertChange(cIdx, e.target.value)}
                        className="flex-1 text-xs border border-slate-300 rounded p-1.5 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(cIdx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <span className="text-slate-400">•</span>
                      <span>{cert}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
