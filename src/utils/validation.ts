const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}
