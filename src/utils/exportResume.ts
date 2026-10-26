import { jsPDF } from 'jspdf';
import { ResumeData } from '../types/resume';

/**
 * Converts ResumeData into clean ATS-formatted plain text
 */
export function generateResumeText(resume: ResumeData): string {
  const lines: string[] = [];

  // Candidate Name
  if (resume.name) {
    lines.push(resume.name.toUpperCase());
  }

  // Contact info
  if (resume.contact && resume.contact.length > 0) {
    lines.push(resume.contact.filter(Boolean).join(' | '));
  }
  lines.push('');

  // Professional Summary
  if (resume.professional_summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('----------------------------------------');
    lines.push(resume.professional_summary);
    lines.push('');
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    lines.push('SKILLS');
    lines.push('----------------------------------------');
    resume.skills.forEach((cat) => {
      const items = Array.isArray(cat.items) ? cat.items.filter(Boolean).join(', ') : '';
      if (cat.category) {
        lines.push(`${cat.category}: ${items}`);
      } else if (items) {
        lines.push(items);
      }
    });
    lines.push('');
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    lines.push('PROFESSIONAL EXPERIENCE');
    lines.push('----------------------------------------');
    resume.experience.forEach((exp) => {
      const headerParts = [exp.role, exp.employer].filter(Boolean).join(' - ');
      const subParts = [exp.location, exp.dates].filter(Boolean).join(' | ');
      lines.push(headerParts);
      if (subParts) lines.push(subParts);

      if (Array.isArray(exp.bullets)) {
        exp.bullets.forEach((b) => {
          if (b && b.trim()) lines.push(`• ${b.trim()}`);
        });
      }
      lines.push('');
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    lines.push('KEY PROJECTS');
    lines.push('----------------------------------------');
    resume.projects.forEach((proj) => {
      const titleParts = [proj.title, proj.subtitle].filter(Boolean).join(' | ');
      const rightParts = [proj.link, proj.dates].filter(Boolean).join(' | ');
      lines.push(titleParts);
      if (rightParts) lines.push(rightParts);

      if (Array.isArray(proj.bullets)) {
        proj.bullets.forEach((b) => {
          if (b && b.trim()) lines.push(`• ${b.trim()}`);
        });
      }
      lines.push('');
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('----------------------------------------');
    resume.education.forEach((edu) => {
      lines.push(`${edu.degree} - ${edu.school}`);
      if (edu.dates || edu.details) {
        lines.push([edu.dates, edu.details].filter(Boolean).join(' | '));
      }
      lines.push('');
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    const certs = resume.certifications.filter(Boolean);
    if (certs.length > 0) {
      lines.push('CERTIFICATIONS');
      lines.push('----------------------------------------');
      certs.forEach((c) => lines.push(`• ${c}`));
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Downloads plain text version of resume
 */
export function downloadResumeTxt(resume: ResumeData, filename = 'resume.txt'): void {
  const content = generateResumeText(resume);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an ATS-compliant, selectable text PDF document using jsPDF
 */
export function downloadResumePdf(resume: ResumeData, filename = 'resume.pdf'): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
    orientation: 'portrait',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - margin - 20;

  let y = margin;

  function checkPageBreak(requiredSpace = 20) {
    if (y + requiredSpace > bottomThreshold) {
      doc.addPage();
      y = margin;
    }
  }

  function addSectionHeader(title: string) {
    checkPageBreak(30);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.setLineWidth(0.75);
    doc.line(margin, y, margin + contentWidth, y);
    y += 12;
  }

  // --- Header: Candidate Name ---
  if (resume.name) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // Navy 900
    doc.text(resume.name, margin, y);
    y += 18;
  }

  // --- Header: Contact Info ---
  if (resume.contact && resume.contact.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105); // Slate 600
    const contactLine = resume.contact.filter(Boolean).join('  •  ');
    const contactLines = doc.splitTextToSize(contactLine, contentWidth);
    doc.text(contactLines, margin, y);
    y += contactLines.length * 12 + 6;
  }

  // --- Professional Summary ---
  if (resume.professional_summary) {
    addSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85); // Slate 700
    const summaryLines = doc.splitTextToSize(resume.professional_summary, contentWidth);
    summaryLines.forEach((line: string) => {
      checkPageBreak(13);
      doc.text(line, margin, y);
      y += 13;
    });
  }

  // --- Skills ---
  if (resume.skills && resume.skills.length > 0) {
    addSectionHeader('Technical & Professional Skills');
    resume.skills.forEach((skillGroup) => {
      checkPageBreak(14);
      const categoryPrefix = skillGroup.category ? `${skillGroup.category}: ` : '';
      const itemsText = Array.isArray(skillGroup.items) ? skillGroup.items.filter(Boolean).join(', ') : '';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      if (skillGroup.category) {
        doc.text(categoryPrefix, margin, y);
        const prefixWidth = doc.getTextWidth(categoryPrefix);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const wrappedItems = doc.splitTextToSize(itemsText, contentWidth - prefixWidth);

        if (wrappedItems.length > 0) {
          doc.text(wrappedItems[0], margin + prefixWidth, y);
          y += 13;
          for (let i = 1; i < wrappedItems.length; i++) {
            checkPageBreak(13);
            doc.text(wrappedItems[i], margin + prefixWidth, y);
            y += 13;
          }
        } else {
          y += 13;
        }
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const wrapped = doc.splitTextToSize(itemsText, contentWidth);
        wrapped.forEach((w: string) => {
          checkPageBreak(13);
          doc.text(w, margin, y);
          y += 13;
        });
      }
    });
  }

  // --- Experience ---
  if (resume.experience && resume.experience.length > 0) {
    addSectionHeader('Work Experience');
    resume.experience.forEach((exp) => {
      checkPageBreak(30);

      // Role and Employer
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const roleText = exp.role || '';
      doc.text(roleText, margin, y);

      // Employer & Location
      const employerText = [exp.employer, exp.location].filter(Boolean).join(' | ');
      if (employerText) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const employerX = margin + doc.getTextWidth(roleText) + (roleText ? 8 : 0);
        doc.text(`— ${employerText}`, employerX, y);
      }

      // Dates on the right
      if (exp.dates) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        const dateWidth = doc.getTextWidth(exp.dates);
        doc.text(exp.dates, margin + contentWidth - dateWidth, y);
      }
      y += 14;

      // Bullets
      if (Array.isArray(exp.bullets)) {
        exp.bullets.forEach((bullet) => {
          if (!bullet || !bullet.trim()) return;
          checkPageBreak(14);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);

          // Hanging bullet
          const bulletIndent = 12;
          doc.text('•', margin, y);

          const wrappedBullet = doc.splitTextToSize(bullet.trim(), contentWidth - bulletIndent);
          wrappedBullet.forEach((bLine: string, idx: number) => {
            if (idx > 0) checkPageBreak(13);
            doc.text(bLine, margin + bulletIndent, y);
            y += 13;
          });
        });
      }
      y += 6;
    });
  }

  // --- Projects ---
  if (resume.projects && resume.projects.length > 0) {
    addSectionHeader('Projects');
    resume.projects.forEach((proj) => {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(proj.title || '', margin, y);

      if (proj.subtitle || proj.link) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const sub = [proj.subtitle, proj.link].filter(Boolean).join(' | ');
        const subX = margin + doc.getTextWidth(proj.title || '') + 8;
        doc.text(sub, subX, y);
      }

      if (proj.dates) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        const dWidth = doc.getTextWidth(proj.dates);
        doc.text(proj.dates, margin + contentWidth - dWidth, y);
      }
      y += 13;

      if (Array.isArray(proj.bullets)) {
        proj.bullets.forEach((bullet) => {
          if (!bullet || !bullet.trim()) return;
          checkPageBreak(13);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          const bulletIndent = 12;
          doc.text('•', margin, y);
          const wrapped = doc.splitTextToSize(bullet.trim(), contentWidth - bulletIndent);
          wrapped.forEach((line: string, idx: number) => {
            if (idx > 0) checkPageBreak(13);
            doc.text(line, margin + bulletIndent, y);
            y += 13;
          });
        });
      }
      y += 4;
    });
  }

  // --- Education ---
  if (resume.education && resume.education.length > 0) {
    addSectionHeader('Education');
    resume.education.forEach((edu) => {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(edu.degree || '', margin, y);

      if (edu.school) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const schoolX = margin + doc.getTextWidth(edu.degree || '') + 8;
        doc.text(`— ${edu.school}`, schoolX, y);
      }

      if (edu.dates) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        const dWidth = doc.getTextWidth(edu.dates);
        doc.text(edu.dates, margin + contentWidth - dWidth, y);
      }
      y += 13;

      if (edu.details) {
        checkPageBreak(12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        const wrapped = doc.splitTextToSize(edu.details, contentWidth);
        wrapped.forEach((line: string) => {
          doc.text(line, margin, y);
          y += 12;
        });
      }
      y += 4;
    });
  }

  // --- Certifications ---
  if (resume.certifications && resume.certifications.length > 0) {
    const certs = resume.certifications.filter(Boolean);
    if (certs.length > 0) {
      addSectionHeader('Certifications & Licenses');
      certs.forEach((cert) => {
        checkPageBreak(13);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`•  ${cert}`, margin, y);
        y += 13;
      });
    }
  }

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
