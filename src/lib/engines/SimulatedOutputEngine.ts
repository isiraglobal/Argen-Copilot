export interface SimulatedOutput {
  intent: string;
  output: string;
  tokens_used: number;
}

const TOPICS_CACHE: Record<string, string[]> = {};

function extractTopics(text: string): string[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'is', 'are', 'be', 'by', 'from', 'up', 'about', 'into', 'through',
    'during', 'as', 'if', 'than', 'that', 'this', 'it', 'was', 'been', 'were',
  ]);

  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3 && !stopwords.has(word))
    .slice(0, 5);
}

function generateListOutput(prompt: string): string {
  const topics = extractTopics(prompt);
  const items = topics.length > 0 ? topics : ['Item 1', 'Item 2', 'Item 3'];

  return `Generated List:\n${items.map((item, i) => `${i + 1}. ${item}`).join('\n')}`;
}

function generateSummaryOutput(prompt: string): string {
  const sentences = prompt.split(/[.!?]+/).filter((s) => s.trim());
  const summary = sentences.length > 0 ? sentences.slice(0, 3) : [prompt];

  return `Summary:\n${summary.map((s) => `• ${s.trim()}`).join('\n')}`;
}

function generateEmailOutput(prompt: string): string {
  const subject = extractTopics(prompt)[0] || 'Update';
  return `Subject: ${subject}\n\nDear [Recipient],\n\n${prompt}\n\nBest regards,\n[Your Name]`;
}

function generateAnalysisOutput(prompt: string): string {
  const keywords = extractTopics(prompt);
  const analysis = keywords.length > 0 ? keywords.join(', ') : 'key topics';

  return `Analysis:\n\nKey Points:\n${keywords.map((k) => `- ${k}`).join('\n')}\n\nConclusion: Based on the provided input, the main focus areas are: ${analysis}.`;
}

function generatePlanOutput(prompt: string): string {
  return `Project Plan:\n\n1. Understand Requirements\n   - Analyze objectives\n   - Identify constraints\n\n2. Define Scope\n   - Set goals\n   - Establish timeline\n\n3. Execute\n   - Implement steps\n   - Monitor progress\n\n4. Review & Refine\n   - Evaluate results\n   - Make adjustments`;
}

function generateExplainOutput(prompt: string): string {
  const topics = extractTopics(prompt);
  const topicText = topics.length > 0 ? `about ${topics.join(', ')}` : 'this topic';

  return `Explanation:\n\nThis is an explanation ${topicText}:\n\n${prompt}\n\nKey takeaway: Understand the fundamental concepts and how they relate to each other.`;
}

function generateMarketingOutput(prompt: string): string {
  const topics = extractTopics(prompt);
  const pitch = topics.length > 0 ? `Our ${topics[0]} solution` : 'Our solution';

  return `Marketing Copy:\n\n${pitch}:\n${prompt}\n\nBenefits:\n• Improved efficiency\n• Better results\n• Cost savings\n\nCall to Action: Get started today!`;
}

function generateCodingOutput(prompt: string): string {
  const lang = /python|java|javascript|cpp|c#/i.test(prompt) ? 'javascript' : 'javascript';

  return `// Generated code\nfunction solution() {\n  // Based on: ${prompt.substring(0, 50)}...\n  \n  // TODO: Implement logic\n  return result;\n}\n\n// Test case\nconsole.log(solution());`;
}

function generateCreativeOutput(prompt: string): string {
  return `Creative Output:\n\n${prompt}\n\nExpanded Narrative:\nLet your imagination run wild with vivid imagery, engaging dialogue, and compelling storytelling. Transform the concept into an immersive experience that captivates the audience.`;
}

function generateDocumentOutput(prompt: string): string {
  return `DOCUMENT\n\nTitle: ${extractTopics(prompt)[0] || 'Untitled'}\n\nContent:\n${prompt}\n\nConclusion:\nThis document summarizes the key points and provides a framework for understanding the subject matter.\n\n---\nEnd of Document`;
}

function generateGeneralOutput(prompt: string): string {
  return `Response:\n\n${prompt}\n\nThis simulated response demonstrates how an AI might respond to your prompt. The actual response would be generated based on advanced language models and contextual understanding.`;
}

export function generateSimulatedOutput(prompt: string, intent: string = 'general'): SimulatedOutput {
  const templates: Record<string, (p: string) => string> = {
    list: generateListOutput,
    summary: generateSummaryOutput,
    email: generateEmailOutput,
    analysis: generateAnalysisOutput,
    plan: generatePlanOutput,
    explain: generateExplainOutput,
    marketing: generateMarketingOutput,
    coding: generateCodingOutput,
    creative: generateCreativeOutput,
    document: generateDocumentOutput,
    general: generateGeneralOutput,
  };

  const generator = templates[intent] || templates.general;
  const output = generator(prompt);
  const estimatedTokens = Math.ceil((prompt.length + output.length) / 4);

  return {
    intent,
    output,
    tokens_used: estimatedTokens,
  };
}

export function detectIntent(prompt: string): string {
  const lowercase = prompt.toLowerCase();

  if (/^(create|make|write|generate).*(list|bullet|numbered)/i.test(lowercase))
    return 'list';
  if (/summarize|summary|tldr|brief/i.test(lowercase)) return 'summary';
  if (/email|mail|send|correspondence/i.test(lowercase)) return 'email';
  if (/analyz|analysis|evaluate|assess/i.test(lowercase)) return 'analysis';
  if (/plan|roadmap|timeline|steps|process/i.test(lowercase)) return 'plan';
  if (/explain|understand|how does|why|what is/i.test(lowercase)) return 'explain';
  if (/market|sell|promote|advertis|campaign/i.test(lowercase)) return 'marketing';
  if (/code|program|function|script|implement/i.test(lowercase)) return 'coding';
  if (/story|poem|creative|write|fiction|imagine/i.test(lowercase)) return 'creative';
  if (/document|report|paper|article|write/i.test(lowercase)) return 'document';

  return 'general';
}
