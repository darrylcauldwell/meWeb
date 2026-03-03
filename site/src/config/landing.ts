/**
 * Landing page card definitions for www.dreamfold.dev
 */

export interface LandingCard {
  title: string;
  description: string;
  href: string;
  accentColor: string;
  badge?: string;
  external?: boolean;
  icon: string; // SVG path data for the card icon
  appStoreUrl?: string; // iOS App Store link
  appSubdomain?: string; // Web app subdomain (e.g. 'planespotter') — URL derived from current hostname
  blogPost?: string; // Blog post path (e.g. '/post/liverail/')
  primarySubdomain?: string; // Subdomain for the primary card link (e.g. 'blog') — resolved via JS
  externalUrl?: string; // External URL rendered as a "Visit" action button
}

export interface LandingSection {
  title: string;
  cards: LandingCard[];
}

// SVG icon paths (24x24 viewBox)
const icons = {
  horse: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57',
  utensils: 'M3 2v7c0 1.1.9 2 2 2h2v11h2V11h2c1.1 0 2-.9 2-2V2H3zm4 7H5V4h2v5zm14-7v20h-2v-8h-4V4c0-1.1.9-2 2-2h4zm-2 2h-2v8h2V4z',
  train: 'M12 2c-4 0-8 1-8 5v9.5C4 18.43 5.57 20 7.5 20L6 21.5v.5h2.23l2-2h3.54l2 2H18v-.5L16.5 20c1.93 0 3.5-1.57 3.5-3.5V7c0-4-4-5-8-5zm-4 13c-.83 0-1.5-.67-1.5-1.5S7.17 12 8 12s1.5.67 1.5 1.5S8.83 15 8 15zm8 0c-.83 0-1.5-.67-1.5-1.5S15.17 12 16 12s1.5.67 1.5 1.5S16.83 15 16 15zm2-5H6V7h12v3z',
  fuel: 'M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z',
  camera: 'M12 10.8c-1.77 0-3.2 1.43-3.2 3.2s1.43 3.2 3.2 3.2 3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2zM22 8h-3.17L17 6H7L5.17 8H2v14h20V8zm-6 6c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z',
  hotdog: 'M7.5 6C5.01 6 3 8.01 3 10.5S5.01 15 7.5 15h9c2.49 0 4.5-2.01 4.5-4.5S19 6 16.5 6h-9zm0 7c-1.38 0-2.5-1.12-2.5-2.5S6.12 8 7.5 8h9c1.38 0 2.5 1.12 2.5 2.5S17.88 13 16.5 13h-9z',
  calendar: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z',
  building: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
  plane: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  blog: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
  presentation: 'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z',
  cv: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-3h8v2H8v-2z',
  person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  github: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z',
  linkedin: 'M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
  leaf: 'M17.12 2.12c-3.4 0-6.56 1.1-9.12 2.96C5.44 3.08 2.28 2.12 2 2.12v2c.16 0 2.28.52 4.32 2.08C4.2 8.76 3 12.12 3 15.62v.5h2v-.5c0-3.14 1.12-6.08 3.08-8.36C10.16 9.56 12 12.56 12 15.62v.5h2v-.5c0-3.06-1.16-5.88-3.08-8.08C12.68 5.64 14.76 4.12 17.12 4.12h.5v-2h-.5z',
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
};

export const landingSections: LandingSection[] = [
  {
    title: 'Apps',
    cards: [
      {
        title: 'TrackRide',
        description: 'GPS tracking & gait detection for equestrians',
        href: '/apps/tetratrack/',
        accentColor: '#5AC8FA',
        badge: 'iOS',
        icon: icons.horse,
        appStoreUrl: 'https://apps.apple.com/gb/app/tetratrack/id6759033691',
        blogPost: '/post/horse-gait-analysis/',
      },
      {
        title: 'TableTogether',
        description: 'Weekly meal planning for families',
        href: '/apps/tabletogether/',
        accentColor: '#FF9500',
        badge: 'iOS',
        icon: icons.utensils,
        appStoreUrl: 'https://apps.apple.com/us/app/tabletogether/id6758763074',
        blogPost: '/post/table-together-vs-saas/',
      },
      {
        title: 'LiveRail',
        description: 'Real-time UK train departures',
        href: '/apps/liverail/',
        accentColor: '#30D158',
        badge: 'iOS',
        icon: icons.train,
        appStoreUrl: 'https://apps.apple.com/us/app/liverail/id6759165875',
        blogPost: '/post/liverail/',
      },
      {
        title: 'FuelRoute',
        description: 'Find the cheapest fuel on your route',
        href: '/apps/fuelfinder/',
        accentColor: '#FF2D55',
        badge: 'iOS',
        icon: icons.fuel,
        appStoreUrl: 'https://apps.apple.com/us/app/fuelroute/id6759122117',
      },
      {
        title: 'SeeFood',
        description: 'AI food identification & nutrition',
        href: '/apps/seefood/',
        accentColor: '#BF5AF2',
        badge: 'iOS',
        icon: icons.camera,
        appStoreUrl: 'https://apps.apple.com/us/app/seefood-by-aviato/id6759822190',
      },
      {
        title: 'Equestrian Venue Manager',
        description: 'Arena booking & livery management',
        href: '/apps/evm/',
        accentColor: '#007AFF',
        badge: 'Web',
        icon: icons.building,
        appSubdomain: 'evm',
        blogPost: '/post/evm-production/',
      },
      {
        title: 'EquiCalendar',
        description: 'Equestrian competition tracker',
        href: '/apps/equicalendar/',
        accentColor: '#F59E0B',
        badge: 'Web',
        icon: icons.calendar,
        appSubdomain: 'equicalendar',
      },
      {
        title: 'Planespotter',
        description: 'Live aircraft tracking dashboard',
        href: '/apps/planespotter/',
        accentColor: '#5AC8FA',
        badge: 'Web',
        icon: icons.plane,
        appSubdomain: 'planespotter',
        blogPost: '/post/planespotter-revival/',
      },
    ],
  },
  {
    title: 'Operations',
    cards: [
      {
        title: 'GreenScope',
        description: 'Software carbon intensity scoring',
        href: '/apps/greenscope/',
        accentColor: '#30D158',
        icon: icons.leaf,
        appSubdomain: 'sci',
      },
      {
        title: 'Observability',
        description: 'Grafana dashboards & metrics',
        href: '/observability/',
        accentColor: '#F59E0B',
        icon: icons.dashboard,
      },
    ],
  },
  {
    title: 'Darryl',
    cards: [
      {
        title: 'Blog',
        description: 'Cloud, Kubernetes & DevOps writing',
        href: '/',
        accentColor: '#007AFF',
        icon: icons.blog,
        primarySubdomain: 'blog',
      },
      {
        title: 'Presentations',
        description: 'Conference talks & slide decks',
        href: '/presentations/',
        accentColor: '#30D158',
        icon: icons.presentation,
      },
      {
        title: 'CV',
        description: 'Experience & qualifications',
        href: '/cv/',
        accentColor: '#FF2D55',
        icon: icons.cv,
      },
      {
        title: 'Bio',
        description: 'About me',
        href: '/bio/',
        accentColor: '#BF5AF2',
        icon: icons.person,
      },
      {
        title: 'GitHub',
        description: 'Open source projects & contributions',
        href: 'https://github.com/darrylcauldwell',
        accentColor: '#6e7681',
        icon: icons.github,
        externalUrl: 'https://github.com/darrylcauldwell',
      },
      {
        title: 'LinkedIn',
        description: 'Professional profile & network',
        href: 'https://www.linkedin.com/in/darryl-cauldwell-82156333/',
        accentColor: '#0A66C2',
        icon: icons.linkedin,
        externalUrl: 'https://www.linkedin.com/in/darryl-cauldwell-82156333/',
      },
    ],
  },
];
