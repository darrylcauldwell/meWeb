import { describe, it, expect } from 'vitest';
import {
  categoryColors,
  defaultAccent,
  getCategoryColor,
  categoryLabels,
  navCategories,
} from '@/config/colors';

describe('categoryColors', () => {
  it('should have all expected categories', () => {
    expect(categoryColors).toHaveProperty('cloud');
    expect(categoryColors).toHaveProperty('kubernetes');
    expect(categoryColors).toHaveProperty('vmware');
    expect(categoryColors).toHaveProperty('automation');
    expect(categoryColors).toHaveProperty('homelab');
    expect(categoryColors).toHaveProperty('career');
  });

  it('should have valid hex color values', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    Object.values(categoryColors).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });
});

describe('getCategoryColor', () => {
  it('should return correct color for known categories', () => {
    expect(getCategoryColor('cloud')).toBe('#007AFF');
    expect(getCategoryColor('kubernetes')).toBe('#BF5AF2');
    expect(getCategoryColor('vmware')).toBe('#5AC8FA');
    expect(getCategoryColor('automation')).toBe('#F59E0B');
    expect(getCategoryColor('homelab')).toBe('#30D158');
    expect(getCategoryColor('career')).toBe('#FF2D55');
  });

  it('should return default accent for unknown category', () => {
    expect(getCategoryColor('unknown')).toBe(defaultAccent);
    expect(getCategoryColor('')).toBe(defaultAccent);
    expect(getCategoryColor('random')).toBe(defaultAccent);
  });

  it('should be case-sensitive (lowercase categories)', () => {
    expect(getCategoryColor('Cloud')).toBe(defaultAccent);
    expect(getCategoryColor('KUBERNETES')).toBe(defaultAccent);
  });
});

describe('categoryLabels', () => {
  it('should have labels for all categories', () => {
    expect(categoryLabels.cloud).toBe('Cloud');
    expect(categoryLabels.kubernetes).toBe('Kubernetes');
    expect(categoryLabels.vmware).toBe('VMware');
    expect(categoryLabels.automation).toBe('Automation');
    expect(categoryLabels.homelab).toBe('Homelab');
    expect(categoryLabels.career).toBe('Career');
  });

  it('should have same keys as categoryColors', () => {
    const colorKeys = Object.keys(categoryColors).sort();
    const labelKeys = Object.keys(categoryLabels).sort();
    expect(colorKeys).toEqual(labelKeys);
  });
});

describe('navCategories', () => {
  it('should have All Posts as first item', () => {
    expect(navCategories[0].label).toBe('All Posts');
    expect(navCategories[0].href).toBe('/');
  });

  it('should have correct number of navigation items', () => {
    expect(navCategories.length).toBe(8); // All Posts + 7 categories
  });

  it('should have valid hrefs ending with slash', () => {
    navCategories.forEach((item) => {
      expect(item.href).toMatch(/\/$/);
    });
  });
});

describe('defaultAccent', () => {
  it('should be a valid hex color', () => {
    expect(defaultAccent).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should match cloud color (Electric Blue)', () => {
    expect(defaultAccent).toBe('#007AFF');
  });
});
