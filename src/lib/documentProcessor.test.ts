import { describe, it, expect } from 'vitest';
import { sanitizeTitle } from './documentProcessor';

describe('documentProcessor', () => {
  describe('sanitizeTitle', () => {
    it('should remove special characters', () => {
      expect(sanitizeTitle('Hello! @#$%^&* World')).toBe('Hello World');
    });

    it('should trim whitespace', () => {
      expect(sanitizeTitle('  Hello  World  ')).toBe('Hello World');
    });

    it('should limit length to 100 characters', () => {
      const longTitle = 'a'.repeat(150);
      expect(sanitizeTitle(longTitle)).toHaveLength(100);
    });

    it('should handle empty strings', () => {
      expect(sanitizeTitle('')).toBe('');
    });

    it('should preserve hyphens', () => {
      expect(sanitizeTitle('Hello-World')).toBe('Hello-World');
    });
  });
});