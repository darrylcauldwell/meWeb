/**
 * Content configuration constants and utilities
 * Extracted for testing - used by content.config.ts
 */

// Valid categories
export const CATEGORIES = [
  'cloud',
  'kubernetes',
  'vmware',
  'automation',
  'homelab',
  'career',
  'apps',
] as const;

// Valid tags (fixed vocabulary)
export const TAGS = [
  'python',
  'ansible',
  'terraform',
  'powershell',
  'docker',
  'nsx',
  'aws',
  'azure',
  'kubernetes',
  'raspberry-pi',
  'vsphere',
  'tanzu',
  'swift',
] as const;

// Type for valid tags
export type Tag = (typeof TAGS)[number];

// Type for valid categories
export type Category = (typeof CATEGORIES)[number];

// Type guard to check if a string is a valid tag
export function isValidTag(tag: string): tag is Tag {
  return (TAGS as readonly string[]).includes(tag);
}

// Type guard to check if a string is a valid category
export function isValidCategory(category: string): category is Category {
  return (CATEGORIES as readonly string[]).includes(category);
}
