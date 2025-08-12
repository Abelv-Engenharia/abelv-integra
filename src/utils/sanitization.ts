
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};

/**
 * Sanitizes text content by escaping HTML entities
 */
export const sanitizeText = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Creates a safe HTML element with sanitized content
 */
export const createSafeElement = (tagName: string, content: string, className?: string): HTMLElement => {
  const element = document.createElement(tagName);
  element.textContent = content; // Use textContent instead of innerHTML
  if (className) {
    element.className = className;
  }
  return element;
};

/**
 * Safely sets innerHTML with sanitization
 */
export const setSafeInnerHTML = (element: HTMLElement, html: string): void => {
  element.innerHTML = sanitizeHtml(html);
};
