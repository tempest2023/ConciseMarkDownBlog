/**
 * @file Local Access Check Utility
 * @description Determines if the current request is from a local/development environment
 */

/**
 * Checks if the application is running on localhost
 * @returns {boolean} True if running on localhost or 127.0.0.1
 */
export function isLocalEnvironment () {
  // Check window.location for browser environment
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    return hostname === 'localhost' ||
           hostname === '127.0.0.1' ||
           hostname === '::1' ||
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.') ||
           // Check for common dev server ports on any interface
           window.location.port === '3000';
  }
  return false;
}

/**
 * Checks if the current user should have admin/config access
 * Combines local environment check with other potential auth methods
 * @returns {boolean} True if user should have config access
 */
export function hasConfigAccess () {
  // Primary check: must be local environment
  if (!isLocalEnvironment()) {
    return false;
  }

  // Could add additional checks here in the future:
  // - Check for dev mode
  // - Check for specific URL parameters
  // - Check session storage flags

  return true;
}
