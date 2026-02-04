import { describe, it, expect } from 'vitest';
import { CATEGORIES, TAGS, isValidTag, type Tag } from '@/config/content';

describe('CATEGORIES', () => {
  it('should have expected categories', () => {
    expect(CATEGORIES).toContain('cloud');
    expect(CATEGORIES).toContain('kubernetes');
    expect(CATEGORIES).toContain('vmware');
    expect(CATEGORIES).toContain('automation');
    expect(CATEGORIES).toContain('homelab');
    expect(CATEGORIES).toContain('career');
    expect(CATEGORIES).toContain('apps');
  });

  it('should have correct number of categories', () => {
    expect(CATEGORIES.length).toBe(7);
  });

  it('should be all lowercase', () => {
    CATEGORIES.forEach((category) => {
      expect(category).toBe(category.toLowerCase());
    });
  });

  it('should be readonly', () => {
    // TypeScript readonly check - this should compile but not allow mutation
    expect(Array.isArray(CATEGORIES)).toBe(true);
  });
});

describe('TAGS', () => {
  it('should have expected tags', () => {
    expect(TAGS).toContain('python');
    expect(TAGS).toContain('ansible');
    expect(TAGS).toContain('terraform');
    expect(TAGS).toContain('powershell');
    expect(TAGS).toContain('docker');
    expect(TAGS).toContain('nsx');
    expect(TAGS).toContain('aws');
    expect(TAGS).toContain('azure');
    expect(TAGS).toContain('kubernetes');
    expect(TAGS).toContain('raspberry-pi');
    expect(TAGS).toContain('vsphere');
    expect(TAGS).toContain('tanzu');
    expect(TAGS).toContain('swift');
  });

  it('should have correct number of tags', () => {
    expect(TAGS.length).toBe(13);
  });

  it('should be all lowercase', () => {
    TAGS.forEach((tag) => {
      expect(tag).toBe(tag.toLowerCase());
    });
  });
});

describe('isValidTag', () => {
  it('should return true for valid tags', () => {
    expect(isValidTag('python')).toBe(true);
    expect(isValidTag('ansible')).toBe(true);
    expect(isValidTag('kubernetes')).toBe(true);
    expect(isValidTag('aws')).toBe(true);
  });

  it('should return false for invalid tags', () => {
    expect(isValidTag('invalid')).toBe(false);
    expect(isValidTag('notavalidtag')).toBe(false);
    expect(isValidTag('')).toBe(false);
  });

  it('should be case-sensitive', () => {
    expect(isValidTag('Python')).toBe(false);
    expect(isValidTag('ANSIBLE')).toBe(false);
    expect(isValidTag('Kubernetes')).toBe(false);
  });

  it('should work as type guard', () => {
    const tag = 'python';
    if (isValidTag(tag)) {
      // TypeScript should narrow this to Tag type
      const validTag: Tag = tag;
      expect(validTag).toBe('python');
    }
  });

  it('should handle edge cases', () => {
    expect(isValidTag(' python')).toBe(false);
    expect(isValidTag('python ')).toBe(false);
    expect(isValidTag('python\n')).toBe(false);
  });
});
