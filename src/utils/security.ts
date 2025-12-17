/**
 * Security utilities for sanitization and validation
 */

/**
 * Sanitize HTML by removing dangerous elements and attributes
 * Only allows safe HTML tags commonly used in Prismic content (tables, basic formatting)
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  let sanitized = html;

  // Remove script tags and content
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, "");
  sanitized = sanitized.replace(/<script[^>]*>/gi, "");

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/data:text\/html/gi, "");

  // Remove style tags that could contain malicious CSS
  sanitized = sanitized.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Remove iframe tags (handled separately for embeds)
  sanitized = sanitized.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");

  // Remove object and embed tags
  sanitized = sanitized.replace(/<object[\s\S]*?<\/object>/gi, "");
  sanitized = sanitized.replace(/<embed[\s\S]*?>/gi, "");

  // Remove form elements
  sanitized = sanitized.replace(/<form[\s\S]*?<\/form>/gi, "");
  sanitized = sanitized.replace(/<input[^>]*>/gi, "");
  sanitized = sanitized.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, "");

  // Remove link tags with javascript: or dangerous protocols
  sanitized = sanitized.replace(
    /<a[^>]*href\s*=\s*["']javascript:/gi,
    '<a href="#"'
  );
  sanitized = sanitized.replace(/<a[^>]*href\s*=\s*["']data:/gi, '<a href="#"');

  // Clean up HTML comments (already done in renderRichText, but double-check)
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, "");

  return sanitized;
}

/**
 * Validate image URL to prevent SSRF and XSS
 * Only allows HTTP/HTTPS URLs from trusted domains
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  try {
    const urlObj = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // Allow Prismic domains and the site's own domain
    const allowedDomains = [
      "prismic.io",
      "images.prismic.io",
      "cdn.prismic.io",
      "dekalb-experience.com",
      "www.dekalb-experience.com",
    ];

    const hostname = urlObj.hostname.toLowerCase();
    const isAllowed = allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith("." + domain)
    );

    return isAllowed;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Validate embed URL to prevent XSS via iframes
 * Only allows trusted video/embed platforms
 */
export function isValidEmbedUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  try {
    const urlObj = new URL(url);

    // Only allow https protocol for embeds
    if (urlObj.protocol !== "https:") {
      return false;
    }

    // Allow only trusted embed platforms
    const allowedDomains = [
      "youtube.com",
      "www.youtube.com",
      "youtu.be",
      "vimeo.com",
      "player.vimeo.com",
      "dailymotion.com",
      "www.dailymotion.com",
    ];

    const hostname = urlObj.hostname.toLowerCase();
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith("." + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Escape HTML to prevent XSS
 * This is a basic escape function - use for simple text content
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== "string") return "";

  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
