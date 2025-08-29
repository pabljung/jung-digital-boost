import { useEffect } from 'react';
import { getCSPHeader } from '@/utils/security';

/**
 * Component to inject security headers via meta tags
 * This helps prevent XSS, clickjacking, and other attacks
 */
export function SecurityHeaders() {
  useEffect(() => {
    // Set Content Security Policy
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = getCSPHeader();
    document.head.appendChild(cspMeta);

    // Prevent clickjacking
    const frameOptionsMeta = document.createElement('meta');
    frameOptionsMeta.httpEquiv = 'X-Frame-Options';
    frameOptionsMeta.content = 'DENY';
    document.head.appendChild(frameOptionsMeta);

    // Prevent MIME type sniffing
    const contentTypeMeta = document.createElement('meta');
    contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
    contentTypeMeta.content = 'nosniff';
    document.head.appendChild(contentTypeMeta);

    // Enable XSS filtering
    const xssProtectionMeta = document.createElement('meta');
    xssProtectionMeta.httpEquiv = 'X-XSS-Protection';
    xssProtectionMeta.content = '1; mode=block';
    document.head.appendChild(xssProtectionMeta);

    // Prevent referrer leakage
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerMeta);

    // Cleanup function
    return () => {
      document.head.removeChild(cspMeta);
      document.head.removeChild(frameOptionsMeta);
      document.head.removeChild(contentTypeMeta);
      document.head.removeChild(xssProtectionMeta);
      document.head.removeChild(referrerMeta);
    };
  }, []);

  return null;
}