/**
 * Security utility functions for content sanitization
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes while preserving safe formatting
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags and their content
  const withoutScripts = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  const withoutDangerousAttrs = withoutScripts.replace(
    /\s(on\w+|javascript:|data:)[\s]*=[\s]*["'][^"']*["']/gi, 
    ''
  );
  
  // Remove dangerous tags but keep content
  const withoutDangerousTags = withoutDangerousAttrs.replace(
    /<(iframe|object|embed|form|input|script|style|link|meta)[^>]*>/gi,
    ''
  );
  
  return withoutDangerousTags;
}

/**
 * Escapes special characters for safe display in HTML
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Safely sets innerHTML with sanitization
 */
export function setSafeInnerHTML(element: HTMLElement, html: string): void {
  const sanitized = sanitizeHtml(html);
  element.innerHTML = sanitized;
}

/**
 * Creates a safe text node (no HTML parsing)
 */
export function createSafeTextNode(content: string): Text {
  return document.createTextNode(content);
}

/**
 * Validates and sanitizes URL to prevent javascript: and data: schemes
 */
export function sanitizeUrl(url: string): string {
  // Remove dangerous protocols
  if (url.match(/^(javascript:|data:|vbscript:)/i)) {
    return '#';
  }
  
  // Allow relative URLs, http, https, mailto, tel
  if (url.match(/^(https?:|mailto:|tel:|\/|#)/i)) {
    return url;
  }
  
  // Default to safe URL for unknown protocols
  return '#';
}
