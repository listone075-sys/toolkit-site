"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  generateResumeMarkdown,
  generateEmptyResume,
  type ResumeData,
  type ExperienceEntry,
  type EducationEntry,
} from "@/lib/tools/markdown/resume-builder";
import { markdownToPdfBlob } from "@/lib/tools/markdown/md-to-pdf";
import { markdownToHtml } from "@/lib/tools/markdown/md-to-html";
import { downloadFile } from "@/lib/utils/file";
import { useClipboard } from "@/hooks/use-clipboard";
import {
  FileDown,
  Copy,
  Loader2,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";

function SectionHeader({
  label,
  collapsed,
  onToggle,
  onAdd,
  addLabel,
}: {
  label: string;
  collapsed: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-zinc-900"
      >
        {collapsed ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
        {label}
      </button>
      {onAdd && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="text-xs h-6 px-2 ml-auto"
        >
          <Plus className="h-3 w-3 mr-1" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}

/** Reusable section for a list of string items (skills, languages, certifications). */
function StringListSection({
  label,
  items,
  placeholder,
  addLabel,
  collapsed,
  onToggle,
  onAdd,
  onChange,
  onRemove,
}: {
  label: string;
  items: string[];
  placeholder: (i: number) => string;
  addLabel: string;
  collapsed: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onChange: (i: number, value: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <>
      <SectionHeader
        label={label}
        collapsed={collapsed}
        onToggle={onToggle}
        onAdd={onAdd}
        addLabel={addLabel}
      />
      {!collapsed && (
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={`${label}-${i}`} className="flex items-center gap-1">
              <Input
                placeholder={placeholder(i)}
                value={item}
                onChange={(e) => onChange(i, e.target.value)}
                className="text-sm"
              />
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(i)}
                  className="text-xs h-6 px-1 text-zinc-400 shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function ResumeBuilder() {
  const t = useTranslations("components");
  const [resume, setResume] = useState<ResumeData>(generateEmptyResume);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const pdfLoadingRef = useRef(false);
  const { copied, copy } = useClipboard();

  const markdown = useMemo(() => generateResumeMarkdown(resume), [resume]);

  const update = useCallback(<K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setResume((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleCollapse = useCallback((key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ── Experience helpers ──
  const addExp = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", bullets: [""] },
      ],
    }));
  }, []);

  const removeExp = useCallback((i: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== i),
    }));
  }, []);

  const updateExp = useCallback(
    (i: number, field: keyof ExperienceEntry, value: string) => {
      setResume((prev) => {
        const next = [...prev.experience];
        next[i] = { ...next[i], [field]: value };
        return { ...prev, experience: next };
      });
    },
    [],
  );

  const updateBullet = useCallback(
    (expIdx: number, bulletIdx: number, value: string) => {
      setResume((prev) => {
        const next = [...prev.experience];
        const bullets = [...next[expIdx].bullets];
        bullets[bulletIdx] = value;
        next[expIdx] = { ...next[expIdx], bullets };
        return { ...prev, experience: next };
      });
    },
    [],
  );

  const addBullet = useCallback((expIdx: number) => {
    setResume((prev) => {
      const next = [...prev.experience];
      next[expIdx] = {
        ...next[expIdx],
        bullets: [...next[expIdx].bullets, ""],
      };
      return { ...prev, experience: next };
    });
  }, []);

  const removeBullet = useCallback((expIdx: number, bulletIdx: number) => {
    setResume((prev) => {
      const next = [...prev.experience];
      next[expIdx] = {
        ...next[expIdx],
        bullets: next[expIdx].bullets.filter((_, idx) => idx !== bulletIdx),
      };
      return { ...prev, experience: next };
    });
  }, []);

  // ── Education helpers ──
  const addEdu = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: crypto.randomUUID(), school: "", degree: "", field: "", startYear: "", endYear: "" },
      ],
    }));
  }, []);

  const removeEdu = useCallback((i: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== i),
    }));
  }, []);

  const updateEdu = useCallback(
    (i: number, field: keyof EducationEntry, value: string) => {
      setResume((prev) => {
        const next = [...prev.education];
        next[i] = { ...next[i], [field]: value };
        return { ...prev, education: next };
      });
    },
    [],
  );

  // ── List helpers ──
  const updateListItem = useCallback(
    (key: "skills" | "languages" | "certifications", i: number, value: string) => {
      setResume((prev) => {
        const next = [...prev[key]];
        next[i] = value;
        return { ...prev, [key]: next };
      });
    },
    [],
  );

  const addListItem = useCallback(
    (key: "skills" | "languages" | "certifications") => {
      setResume((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
    },
    [],
  );

  const removeListItem = useCallback(
    (key: "skills" | "languages" | "certifications", i: number) => {
      setResume((prev) => ({
        ...prev,
        [key]: prev[key].filter((_: string, idx: number) => idx !== i),
      }));
    },
    [],
  );

  // ── Actions ──
  const handleDownloadMd = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const name = resume.name.trim() || "resume";
    downloadFile(blob, `${name.replace(/\s+/g, "_")}.md`, "text/markdown");
  }, [markdown, resume.name]);

  const handleDownloadPdf = useCallback(async () => {
    if (pdfLoadingRef.current) return;
    pdfLoadingRef.current = true;
    setPdfLoading(true);
    setPdfError(null);
    try {
      const blob = await markdownToPdfBlob(
        markdown,
        resume.name.trim() || "Resume",
      );
      const name = resume.name.trim() || "resume";
      downloadFile(blob, `${name.replace(/\s+/g, "_")}.pdf`, "application/pdf");
    } catch {
      setPdfError(t("resumeBuilder.pdfError"));
    } finally {
      setPdfLoading(false);
      pdfLoadingRef.current = false;
    }
  }, [markdown, resume.name, t]);

  return (
    <div className="space-y-4">
      {/* Top actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="lg"
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
        >
          {pdfLoading ? (
            <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> {t("resumeBuilder.generatingPdf")}</>
          ) : (
            <><FileDown className="h-4 w-4 mr-1" /> {t("resumeBuilder.downloadPdf")}</>
          )}
        </Button>
        <Button variant="outline" onClick={handleDownloadMd}>
          <FileText className="h-4 w-4 mr-1" /> {t("resumeBuilder.downloadMd")}
        </Button>
        <Button variant="outline" onClick={() => copy(markdown)}>
          <Copy className="h-4 w-4 mr-1" />
          {copied ? t("resumeBuilder.copied") : t("resumeBuilder.copyMd")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <><EyeOff className="h-4 w-4 mr-1" /> {t("resumeBuilder.hidePreview")}</>
          ) : (
            <><Eye className="h-4 w-4 mr-1" /> {t("resumeBuilder.showPreview")}</>
          )}
        </Button>
      </div>

      {pdfError && (
        <p className="text-sm text-amber-600 text-center">{pdfError}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Form ── */}
        <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2">
          {/* Personal Info */}
          <SectionHeader
            label={t("resumeBuilder.personalInfo")}
            collapsed={!!collapsed["personal"]}
            onToggle={() => toggleCollapse("personal")}
          />
          {!collapsed["personal"] && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder={t("resumeBuilder.name")}
                value={resume.name}
                onChange={(e) => update("name", e.target.value)}
              />
              <Input
                placeholder={t("resumeBuilder.title")}
                value={resume.title}
                onChange={(e) => update("title", e.target.value)}
              />
              <Input
                type="email"
                placeholder={t("resumeBuilder.email")}
                value={resume.email}
                onChange={(e) => update("email", e.target.value)}
              />
              <Input
                placeholder={t("resumeBuilder.phone")}
                value={resume.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <Input
                placeholder={t("resumeBuilder.location")}
                value={resume.location}
                onChange={(e) => update("location", e.target.value)}
              />
              <Input
                placeholder={t("resumeBuilder.website")}
                value={resume.website}
                onChange={(e) => update("website", e.target.value)}
              />
              <Input
                placeholder={t("resumeBuilder.linkedin")}
                value={resume.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          )}

          {/* Summary */}
          <SectionHeader
            label={t("resumeBuilder.summary")}
            collapsed={!!collapsed["summary"]}
            onToggle={() => toggleCollapse("summary")}
          />
          {!collapsed["summary"] && (
            <textarea
              className="w-full h-24 text-sm resize-y bg-zinc-50 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder={t("resumeBuilder.summaryPlaceholder")}
              value={resume.summary}
              onChange={(e) => update("summary", e.target.value)}
            />
          )}

          {/* Experience */}
          <SectionHeader
            label={t("resumeBuilder.experience")}
            collapsed={!!collapsed["experience"]}
            onToggle={() => toggleCollapse("experience")}
            onAdd={addExp}
            addLabel={t("resumeBuilder.addExperience")}
          />
          {!collapsed["experience"] && (
            <div className="space-y-4">
              {resume.experience.map((exp, i) => (
                <div
                  key={exp.id}
                  className="border rounded-lg p-3 space-y-2 bg-zinc-50/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">
                      {t("resumeBuilder.entryCount", { n: i + 1 })}
                    </span>
                    {resume.experience.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExp(i)}
                        className="text-xs h-6 px-1 text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder={t("resumeBuilder.role")}
                      value={exp.role}
                      onChange={(e) => updateExp(i, "role", e.target.value)}
                    />
                    <Input
                      placeholder={t("resumeBuilder.company")}
                      value={exp.company}
                      onChange={(e) => updateExp(i, "company", e.target.value)}
                    />
                    <Input
                      placeholder={t("resumeBuilder.startDate")}
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExp(i, "startDate", e.target.value)
                      }
                    />
                    <Input
                      placeholder={t("resumeBuilder.endDate")}
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExp(i, "endDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    {exp.bullets.map((bullet, bi) => (
                      <div key={`${exp.id}-bullet-${bi}`} className="flex items-center gap-1">
                        <span className="text-xs text-zinc-400 w-4 text-right shrink-0">
                          &bull;
                        </span>
                        <Input
                          placeholder={`${t("resumeBuilder.bullet")} ${bi + 1}`}
                          value={bullet}
                          onChange={(e) =>
                            updateBullet(i, bi, e.target.value)
                          }
                          className="text-sm"
                        />
                        {exp.bullets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBullet(i, bi)}
                            className="text-xs h-6 px-1 text-zinc-400 shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addBullet(i)}
                      className="text-xs h-6 px-2"
                    >
                      <Plus className="h-3 w-3 mr-1" /> {t("resumeBuilder.addBullet")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          <SectionHeader
            label={t("resumeBuilder.education")}
            collapsed={!!collapsed["education"]}
            onToggle={() => toggleCollapse("education")}
            onAdd={addEdu}
            addLabel={t("resumeBuilder.addEducation")}
          />
          {!collapsed["education"] && (
            <div className="space-y-3">
              {resume.education.map((edu, i) => (
                <div
                  key={edu.id}
                  className="border rounded-lg p-3 space-y-2 bg-zinc-50/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">
                      {t("resumeBuilder.entryCount", { n: i + 1 })}
                    </span>
                    {resume.education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEdu(i)}
                        className="text-xs h-6 px-1 text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder={t("resumeBuilder.school")}
                      value={edu.school}
                      onChange={(e) => updateEdu(i, "school", e.target.value)}
                      className="sm:col-span-2"
                    />
                    <Input
                      placeholder={t("resumeBuilder.degree")}
                      value={edu.degree}
                      onChange={(e) => updateEdu(i, "degree", e.target.value)}
                    />
                    <Input
                      placeholder={t("resumeBuilder.field")}
                      value={edu.field}
                      onChange={(e) => updateEdu(i, "field", e.target.value)}
                    />
                    <Input
                      placeholder={t("resumeBuilder.startYear")}
                      value={edu.startYear}
                      onChange={(e) =>
                        updateEdu(i, "startYear", e.target.value)
                      }
                    />
                    <Input
                      placeholder={t("resumeBuilder.endYear")}
                      value={edu.endYear}
                      onChange={(e) =>
                        updateEdu(i, "endYear", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          <StringListSection
            label={t("resumeBuilder.skills")}
            items={resume.skills}
            placeholder={(i) => `${t("resumeBuilder.skill")} ${i + 1}`}
            addLabel={t("resumeBuilder.addSkill")}
            collapsed={!!collapsed["skills"]}
            onToggle={() => toggleCollapse("skills")}
            onAdd={() => addListItem("skills")}
            onChange={(i, v) => updateListItem("skills", i, v)}
            onRemove={(i) => removeListItem("skills", i)}
          />

          {/* Languages */}
          <StringListSection
            label={t("resumeBuilder.languages")}
            items={resume.languages}
            placeholder={() => t("resumeBuilder.languagePlaceholder")}
            addLabel={t("resumeBuilder.addLanguage")}
            collapsed={!!collapsed["languages"]}
            onToggle={() => toggleCollapse("languages")}
            onAdd={() => addListItem("languages")}
            onChange={(i, v) => updateListItem("languages", i, v)}
            onRemove={(i) => removeListItem("languages", i)}
          />

          {/* Certifications */}
          <StringListSection
            label={t("resumeBuilder.certifications")}
            items={resume.certifications}
            placeholder={() => t("resumeBuilder.certificationPlaceholder")}
            addLabel={t("resumeBuilder.addCertification")}
            collapsed={!!collapsed["certifications"]}
            onToggle={() => toggleCollapse("certifications")}
            onAdd={() => addListItem("certifications")}
            onChange={(i, v) => updateListItem("certifications", i, v)}
            onRemove={(i) => removeListItem("certifications", i)}
          />
        </div>

        {/* ── Preview Panel ── */}
        {showPreview && (
          <div className="border rounded-lg p-6 bg-white max-h-[700px] overflow-y-auto prose prose-sm prose-zinc max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(markdown),
              }}
            />
          </div>
        )}

        {!showPreview && (
          <div className="border rounded-lg p-6 bg-zinc-50 max-h-[700px] overflow-y-auto hidden lg:flex items-center justify-center">
            <p className="text-sm text-zinc-400">
              {t("resumeBuilder.clickPreview")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
