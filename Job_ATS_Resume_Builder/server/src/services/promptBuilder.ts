import fs from 'fs';
import path from 'path';

const PROMPT_PATH = path.join(__dirname, '..', '..', '..', 'prompts', 'resume_analysis_prompt.md');

/**
 * Build the analysis prompt by combining the template with user-provided resume text and JD.
 */
export function buildAnalysisPrompt(resumeText: string, jobDescription: string): string {
  let template: string;

  try {
    template = fs.readFileSync(PROMPT_PATH, 'utf-8');
  } catch {
    // Fallback prompt if template file is not found
    template = getDefaultPrompt();
  }

  // Replace the placeholder attachment references with actual content
  const prompt = `${template}

---

## Provided Resume Content

\`\`\`
${resumeText}
\`\`\`

---

## Provided Job Description

\`\`\`
${jobDescription}
\`\`\`

---

## Additional Instructions

Please provide your analysis in the following JSON-compatible structured format along with your detailed markdown analysis:

After your detailed markdown analysis, include a JSON block wrapped in \`\`\`json tags with this structure:
{
  "scores": {
    "overall": <number 1-10>,
    "effectivity": <number 1-10>,
    "layoutDesign": <number 1-10>,
    "contentRelevance": <number 1-10>,
    "grammarSyntax": <number 1-10>,
    "impact": <number 1-10>
  },
  "feedback": {
    "positives": ["list of positive aspects"],
    "improvements": ["list of areas for improvement"],
    "missingKeywords": ["list of missing keywords from JD"],
    "suggestions": ["list of actionable suggestions"]
  }
}
`;

  return prompt;
}

/**
 * Build the resume builder prompt to generate an improved resume.
 */
export function buildResumeBuilderPrompt(
  resumeText: string,
  jobDescription: string,
  analysisResponse: string
): string {
  return `You are an expert resume writer and career coach. Your task is to improve the following resume based on the job description and the analysis feedback provided.

## Original Resume
\`\`\`
${resumeText}
\`\`\`

## Job Description
\`\`\`
${jobDescription}
\`\`\`

## Analysis Feedback
${analysisResponse}

## Instructions

Based on the analysis above, create an improved version of the resume that adheres to these STRICT rules:

1. **STRICT FORMAT RETENTION**: You MUST maintain the EXACT SAME layout, structure, headings, section order, and formatting style of the original resume. Do NOT remove any sections. Do NOT change the overarching structure.
2. **Fill in the Gaps**: Strategically add missing keywords, skills, and experiences identified in the analysis without breaking the original format.
3. **Enhance Bullet Points**: Rewrite bullet points to include quantifiable achievements and ATS-friendly keywords from the Job Description.
4. **Authenticity**: Keep the content truthful and aligned with the original experience, just optimized for maximum impact against the Job Description.

It is critical that the updated resume structurally matches the original resume perfectly, only with optimized content. Please output the improved resume in clean markdown. 

Start your response with the improved resume content directly (no preamble).`;
}

function getDefaultPrompt(): string {
  return `# Resume Analysis Prompt

## Role
You are an analytical expert with strong research capabilities, skilled in data interpretation, pattern recognition, and delivering actionable insights.

## Task
Analyze the attached resume and the Job Description, and provide a detailed review in the following format:

1. **Overall Result:** [Score out of 10]
2. **Effectivity:** [Score out of 10] with feedback
3. **Layout and Design:** [Score out of 10] with comments
4. **Content Relevance:** [Score out of 10] with insights
5. **Grammar and Syntax:** [Score out of 10] with observations
6. **Impact:** [Score out of 10] with thoughts

Use symbols like ✅ for positive aspects and 🙈 for areas of improvement.

## Key Requirements
1. Analyze keywords and descriptions from the Job Description and cross-reference with the resume.
2. Act as an ATS (Applicant Tracking System) checking for keyword presence.
3. Follow the full scoring format provided above.`;
}

export function buildCoverLetterPrompt(resumeText: string, jobDescription: string): string {
  const promptPath = path.join(__dirname, '..', '..', '..', 'prompts', 'cover-letter-prompt.md');
  let template: string;

  try {
    template = fs.readFileSync(promptPath, 'utf-8');
  } catch {
    template = `# Cover Letter Prompt
Write a cover letter for a job application using the following details:
## Inputs
1. **Job Description:** \${jd}
2. **Resume Details:** \${resume}`;
  }

  // Replace placeholders with actual text
  return template.replace('${jd}', jobDescription).replace('${resume}', resumeText);
}

export function buildFollowUpPrompt(resumeText: string, jobDescription: string): string {
  const promptPath = path.join(__dirname, '..', '..', '..', 'prompts', 'cold-email-prompt.md');
  let template: string;

  try {
    template = fs.readFileSync(promptPath, 'utf-8');
  } catch {
    template = `# Cold Email Generation Prompt
## Inputs
1. **Job Description:** \${jd}
2. **Resume Details:** \${resume}`;
  }

  // Replace placeholders with actual text
  return template.replace('${jd}', jobDescription).replace('${resume}', resumeText);
}
