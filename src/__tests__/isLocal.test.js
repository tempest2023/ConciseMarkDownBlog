/**
 * @file Unit tests for isLocal utility
 * @description Tests for local environment detection
 */

import { isLocalEnvironment, hasConfigAccess } from '../util/isLocal';

describe('isLocal', () => {
  describe('isLocalEnvironment', () => {
    const originalWindow = global.window;

    beforeEach(() => {
      // Reset window.location mock
      delete global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('should return true for localhost', () => {
      global.window = {
        location: {
          hostname: 'localhost',
          port: '3000'
        }
      };
      expect(isLocalEnvironment()).toBe(true);
    });

    it('should return true for 127.0.0.1', () => {
      global.window = {
        location: {
          hostname: '127.0.0.1',
          port: '3000'
        }
      };
      expect(isLocalEnvironment()).toBe(true);
    });

    it('should return true for ::1 (IPv6 loopback)', () => {
      global.window = {
        location: {
          hostname: '::1',
          port: '3000'
        }
      };
      expect(isLocalEnvironment()).toBe(true);
    });

    it('should return true for 192.168.x.x (private network)', () => {
      global.window = {
        location: {
          hostname: '192.168.1.100',
          port: '3000'
        }
      };
      expect(isLocalEnvironment()).toBe(true);
    });

    it('should return true for 10.x.x.x (private network)', () => {
      global.window = {
        location: {
          hostname: '10.0.0.5',
          port: '3000'
        }
      };
      expect(isLocalEnvironment()).toBe(true);
    });

    it('should return false for external domain', () => {
      global.window = {
        location: {
          hostname: 'example.com',
          port: '80'
        }
      };
      expect(isLocalEnvironment()).toBe(false);
    });

    it('should return false for github.io domain', () => {
      global.window = {
        location: {
          hostname: 'username.github.io',
          port: '443'
        }
      };
      expect(isLocalEnvironment()).toBe(false);
    });

    it('should return false when window is undefined', () => {
      global.window = undefined;
      expect(isLocalEnvironment()).toBe(false);
    });

    it('should return false when window.location is undefined', () => {
      global.window = {};
      expect(isLocalEnvironment()).toBe(false);
    });
  });

  describe('hasConfigAccess', () => {
    const originalWindow = global.window;

    beforeEach(() => {
      delete global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('should return true for local environment', () => {
      global.window = {
        location: {
          hostname: 'localhost',
          port: '3000'
        }
      };
      expect(hasConfigAccess()).toBe(true);
    });

    it('should return false for external domain', () => {
      global.window = {
        location: {
          hostname: 'example.com',
          port: '80'
        }
      };
      expect(hasConfigAccess()).toBe(false);
    });

    it('should return false when not in browser environment', () => {
      global.window = undefined;
      expect(hasConfigAccess()).toBe(false);
    });
  });
});
