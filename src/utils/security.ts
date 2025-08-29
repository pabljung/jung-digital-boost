// Security utilities to prevent XSS, injection attacks, and other vulnerabilities

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes dangerous HTML tags and JavaScript
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potentially dangerous content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .replace(/data:text\/html/gi, '') // Remove data URLs
    .replace(/vbscript:/gi, '') // Remove vbscript
    .trim();
}

/**
 * Validates email format to prevent injection
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates URL to prevent malicious redirects
 */
export function validateURL(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitizes HTML content for safe display
 * Use this before displaying user-generated content
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Validates file upload to prevent malicious files
 */
export function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  if (!file) return { isValid: false, error: 'No file provided' };
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large' };
  }
  
  // Check file type - only allow safe file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'application/pdf'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  return { isValid: true };
}

/**
 * Rate limiting helper
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing attempts for this key
    const existing = this.attempts.get(key) || [];
    
    // Filter out old attempts
    const recentAttempts = existing.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Content Security Policy helpers
 */
export function getCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://rivttlezosjsivoozbfr.supabase.co wss://rivttlezosjsivoozbfr.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
}

/**
 * Validates admin authentication state
 */
export function validateAdminAccess(userEmail: string | null | undefined): boolean {
  if (!userEmail || typeof userEmail !== 'string') return false;
  return userEmail === 'admin@jungcria.com';
}