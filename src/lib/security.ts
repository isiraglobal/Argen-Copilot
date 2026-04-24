/**
 * Security & Input Sanitization Utilities
 * Protects against common web vulnerabilities
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  if (!/[@$!%*?&]/.test(password)) return false;
  return true;
}

/**
 * Validate URL to prevent open redirect attacks
 */
export function isValidRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    // Only allow same-origin redirects
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Check for prompt injection in user input
 * Looks for common injection patterns
 */
export function detectPromptInjection(input: string): boolean {
  const injectionPatterns = [
    /ignore.*previous.*instruction/i,
    /forget.*previous.*prompt/i,
    /pretend.*you.*are/i,
    /respond.*as.*if/i,
    /roleplay.*as/i,
    /act.*as.*if.*you.*are/i,
  ];

  return injectionPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate API key format
 */
export function isValidApiKey(key: string): boolean {
  // API key should be 32+ characters, alphanumeric + underscore
  return /^[a-zA-Z0-9_]{32,}$/.test(key);
}

/**
 * Hash sensitive data (client-side, for display purposes only)
 * Note: Use server-side hashing for actual security
 */
export function hashForDisplay(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 8);
}

/**
 * Validate JSON to prevent parsing attacks
 */
export function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Remove potentially dangerous HTML/JS
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Validate challenge submission to prevent manipulation
 */
export function validateSubmission(submission: {
  challengeId: string;
  prompt: string;
  score: number;
}): boolean {
  // Validate challenge ID format
  if (!/^[a-zA-Z0-9_-]+$/.test(submission.challengeId)) {
    return false;
  }

  // Validate prompt length (reasonable bounds)
  if (submission.prompt.length < 1 || submission.prompt.length > 10000) {
    return false;
  }

  // Validate score range
  if (submission.score < 0 || submission.score > 100) {
    return false;
  }

  // Check for suspicious patterns
  if (detectPromptInjection(submission.prompt)) {
    return false;
  }

  return true;
}

/**
 * Rate limit checker (client-side)
 * Should ALWAYS be verified server-side
 */
export function checkClientRateLimit(
  action: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  const key = `ratelimit_${action}`;
  const storage = sessionStorage.getItem(key);

  if (!storage) {
    sessionStorage.setItem(key, JSON.stringify({ count: 1, timestamp: Date.now() }));
    return true;
  }

  const { count, timestamp } = JSON.parse(storage);

  if (Date.now() - timestamp > windowMs) {
    // Window expired, reset
    sessionStorage.setItem(key, JSON.stringify({ count: 1, timestamp: Date.now() }));
    return true;
  }

  if (count >= maxAttempts) {
    return false;
  }

  const updated = { count: count + 1, timestamp };
  sessionStorage.setItem(key, JSON.stringify(updated));
  return true;
}

/**
 * Sanitize file uploads
 */
export function isAllowedFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function getFileSizeInMB(file: File): number {
  return file.size / (1024 * 1024);
}

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  return getFileSizeInMB(file) <= maxSizeMB;
}

/**
 * Security headers validation
 */
export function validateSecurityHeaders(headers: Record<string, string>): boolean {
  const required = [
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
  ];

  return required.every((header) => headers[header] !== undefined);
}

/**
 * Remove all console logs for production
 */
export function setupProductionMode(): void {
  if (process.env.NODE_ENV === 'production') {
    const noop = () => {};
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    console.warn = noop;
    // Keep console.error for production error tracking
  }
}
