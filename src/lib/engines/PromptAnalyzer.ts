export interface AnalysisResult {
  readiness_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'are', 'be', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'as',
]);

export function analyzePrompt(prompt: string): AnalysisResult {
  let score = 40; // Base score
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (!prompt.trim()) {
    return {
      readiness_score: 0,
      strengths: [],
      weaknesses: ['Prompt is empty'],
      suggestions: ['Enter a prompt to analyze'],
    };
  }

  // Word count scoring
  const wordCount = prompt.trim().split(/\s+/).length;
  if (wordCount >= 20) {
    score += 15;
    strengths.push('Comprehensive prompt length');
  } else if (wordCount >= 10) {
    score += 8;
    weaknesses.push('Could be more detailed');
    suggestions.push('Expand to 20+ words for better results');
  } else {
    score = Math.min(30, score);
    weaknesses.push('Prompt too short');
    suggestions.push('Expand to at least 10 words');
  }

  // Role checking (you are, act as, role, persona)
  if (/\b(you are|act as|role|persona|be a|imagine you|suppose you)\b/i.test(prompt)) {
    score += 12;
    strengths.push('Clear role definition');
  } else {
    weaknesses.push('Missing role definition');
    suggestions.push('Add "You are..." or "Act as..." to define a role');
  }

  // Format specification
  if (/\b(format|structure|output|return|provide|in.*form|as.*list|as.*table|as.*json|as.*code)\b/i.test(prompt)) {
    score += 10;
    strengths.push('Output format specified');
  } else {
    weaknesses.push('No output format specified');
    suggestions.push('Specify desired output format (list, JSON, code, etc.)');
  }

  // Tone checking
  if (/\b(tone|style|voice|professional|casual|formal|friendly|academic|technical)\b/i.test(prompt)) {
    score += 8;
    strengths.push('Tone specified');
  } else {
    weaknesses.push('Tone not specified');
    suggestions.push('Specify desired tone (professional, casual, etc.)');
  }

  // Context checking
  if (/\b(given|based on|using|from|background|context|situation|scenario|assuming)\b/i.test(prompt)) {
    score += 8;
    strengths.push('Context provided');
  } else {
    weaknesses.push('Limited context');
    suggestions.push('Provide more background context');
  }

  // Constraints checking
  if (/\b(limit|max|minimum|must|should not|avoid|constraint|rule|cannot|only)\b/i.test(prompt)) {
    score += 7;
    strengths.push('Constraints defined');
  } else {
    weaknesses.push('No constraints specified');
    suggestions.push('Add constraints or requirements');
  }

  // Cap and floor
  score = Math.max(10, Math.min(100, score));

  return {
    readiness_score: score,
    strengths: strengths.length > 0 ? strengths : ['Prompt has basic structure'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Could provide more detail'],
    suggestions: suggestions.length > 0 ? suggestions : ['Add more specificity'],
  };
}

export function getReadinessColor(score: number): string {
  if (score >= 70) return '#2D5F4F'; // green
  if (score >= 50) return '#FFA500'; // orange
  return '#D32F2F'; // red
}
