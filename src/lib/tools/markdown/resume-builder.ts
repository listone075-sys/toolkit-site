export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  languages: string[];
  certifications: string[];
}

export function generateEmptyResume(): ResumeData {
  return {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
    experience: [{ id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", bullets: [""] }],
    education: [{ id: crypto.randomUUID(), school: "", degree: "", field: "", startYear: "", endYear: "" }],
    skills: [],
    languages: [],
    certifications: [],
  };
}

function buildContactLine(data: ResumeData): string {
  const esc = escapeMarkdownText;
  const parts: string[] = [];
  if (data.email) parts.push(`**Email:** ${esc(data.email)}`);
  if (data.phone) parts.push(`**Phone:** ${esc(data.phone)}`);
  if (data.location) parts.push(`**Location:** ${esc(data.location)}`);
  if (data.website) parts.push(`**Website:** ${esc(data.website)}`);
  if (data.linkedin) parts.push(`**LinkedIn:** ${esc(data.linkedin)}`);
  return parts.join(" | ");
}

/**
 * Escape Markdown metacharacters in user-provided text so they
 * render as literal characters rather than accidental formatting.
 */
function escapeMarkdownText(text: string): string {
  return text.replace(/([*_`#[\]])/g, "\\$1");
}

/**
 * Generate a professional, well-formatted Markdown resume from structured data.
 */
export function generateResumeMarkdown(data: ResumeData): string {
  const lines: string[] = [];
  const esc = escapeMarkdownText;

  // Header
  if (data.name) {
    lines.push(`# ${esc(data.name)}`);
  }
  if (data.title) {
    lines.push(`### ${esc(data.title)}`);
  }
  const contactLine = buildContactLine(data);
  if (contactLine) {
    lines.push("");
    lines.push(contactLine);
  }

  // Divider
  lines.push("");
  lines.push("---");
  lines.push("");

  // Summary
  if (data.summary.trim()) {
    lines.push("## Professional Summary");
    lines.push("");
    lines.push(esc(data.summary.trim()));
    lines.push("");
  }

  // Experience
  const hasExperience = data.experience.some(
    (e) => e.company.trim() || e.role.trim() || e.bullets.some((b) => b.trim()),
  );
  if (hasExperience) {
    lines.push("## Experience");
    lines.push("");
    for (const exp of data.experience) {
      const company = esc(exp.company.trim());
      const role = esc(exp.role.trim());
      if (!company && !role) continue;

      const header =
        [role, company].filter(Boolean).join(" — ");
      const dates =
        [exp.startDate.trim(), exp.endDate.trim()].filter(Boolean).join("–");
      const heading = dates ? `${header} (${dates})` : header;

      lines.push(`### ${heading}`);
      lines.push("");

      for (const bullet of exp.bullets) {
        const trimmed = bullet.trim();
        if (trimmed) {
          lines.push(`- ${esc(trimmed)}`);
        }
      }
      lines.push("");
    }
  }

  // Education
  const hasEducation = data.education.some(
    (e) => e.school.trim() || e.degree.trim(),
  );
  if (hasEducation) {
    lines.push("## Education");
    lines.push("");
    for (const edu of data.education) {
      const school = edu.school.trim();
      const degree = esc(edu.degree.trim());
      const field = esc(edu.field.trim());
      if (!school && !degree) continue;

      const title = degree
        ? `**${degree}**${field ? ` in ${field}` : ""}`
        : "";
      const dates =
        [edu.startYear.trim(), edu.endYear.trim()].filter(Boolean).join("–");

      lines.push(`### ${esc(school)}`);
      lines.push("");
      if (title) {
        lines.push(dates ? `${title} (${dates})` : title);
      }
      lines.push("");
    }
  }

  // Skills
  const filteredSkills = data.skills.filter((s) => s.trim());
  if (filteredSkills.length > 0) {
    lines.push("## Skills");
    lines.push("");
    lines.push(filteredSkills.map((s) => esc(s.trim())).join(" | "));
    lines.push("");
  }

  // Languages
  const filteredLanguages = data.languages.filter((l) => l.trim());
  if (filteredLanguages.length > 0) {
    lines.push("## Languages");
    lines.push("");
    for (const lang of filteredLanguages) {
      const trimmed = lang.trim();
      if (trimmed) lines.push(`- ${esc(trimmed)}`);
    }
    lines.push("");
  }

  // Certifications
  const filteredCerts = data.certifications.filter((c) => c.trim());
  if (filteredCerts.length > 0) {
    lines.push("## Certifications");
    lines.push("");
    for (const cert of filteredCerts) {
      const trimmed = cert.trim();
      if (trimmed) lines.push(`- ${esc(trimmed)}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}
