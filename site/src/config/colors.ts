/**
 * ==========================================================================
 * CENTRALIZED COLOR CONFIGURATION
 * ==========================================================================
 *
 * All category and theme colors are defined here.
 * Change values here to update the entire site consistently.
 *
 * Note: Base theme colors (backgrounds, text) are in src/styles/global.css
 * This file handles category-specific accent colors used in components.
 */

// Apple-inspired vibrant category colors
// All colors tested for WCAG AA contrast (4.5:1) with black text
export const categoryColors: Record<string, string> = {
  cloud: '#007AFF',       // Electric Blue - sky/cloud association
  kubernetes: '#BF5AF2',  // Vibrant Purple - orchestration complexity
  vmware: '#5AC8FA',      // Teal - infrastructure, enterprise
  automation: '#F59E0B',  // Amber - energy, efficiency (darkened for contrast)
  homelab: '#30D158',     // Green - growth, experimentation
  career: '#FF2D55',      // Pink/Magenta - personal brand
  apps: '#FF9500',        // Orange - mobile apps, creativity
};

// Default accent color (used when no category specified)
export const defaultAccent = '#007AFF';

// Category display labels
export const categoryLabels: Record<string, string> = {
  cloud: 'Cloud',
  kubernetes: 'Kubernetes',
  vmware: 'VMware',
  automation: 'Automation',
  homelab: 'Homelab',
  career: 'Career',
  apps: 'Apps',
};

// Helper function to get category color
export function getCategoryColor(category: string): string {
  return categoryColors[category] || defaultAccent;
}

// Navigation categories with colors
export const navCategories = [
  { label: 'All Posts', href: '/', color: defaultAccent },
  { label: 'Cloud', href: '/cloud/', color: categoryColors.cloud },
  { label: 'Kubernetes', href: '/kubernetes/', color: categoryColors.kubernetes },
  { label: 'VMware', href: '/vmware/', color: categoryColors.vmware },
  { label: 'Automation', href: '/automation/', color: categoryColors.automation },
  { label: 'Homelab', href: '/homelab/', color: categoryColors.homelab },
  { label: 'Career', href: '/career/', color: categoryColors.career },
  { label: 'Apps', href: '/apps/', color: categoryColors.apps },
];

// Me section links (uses career color for personal branding)
export const meLinks = [
  { label: 'Bio', href: '/bio/' },
  { label: 'CV', href: '/cv/' },
];
export const meAccentColor = categoryColors.career;

// Presentations section links
export const presentationLinks = [
  { label: 'GitOps For The Distributed Enterprise Edge', href: '/presentations/devops-meetup/' },
  { label: 'Sustainable Software', href: '/presentations/sustainable-software/' },
];
export const presentationsAccentColor = '#30D158'; // Green - growth, knowledge sharing

// Apps section links (external hosted applications)
export const appsLinks = [
  { label: 'Planespotter', href: 'https://planespotter.dreamfold.dev', external: true },
  { label: 'Equestrian Venue Manager', href: 'https://evm.dreamfold.dev', external: true },
];
export const appsAccentColor = '#5AC8FA'; // Teal - apps, infrastructure

// Observability accent color
export const observabilityAccentColor = '#F59E0B'; // Amber - matches automation/pipelines theme
