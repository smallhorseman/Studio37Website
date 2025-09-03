export const seedBlogPosts = [
  {
    id: 'welcome-post',
    slug: 'welcome-to-studio37',
    title: 'Welcome to Studio37',
    excerpt: 'An introduction to our creative studio and what we do.',
    body: 'This is placeholder content for the Studio37 blog. Replace with real CMS data.',
    author: 'Studio37',
    created_at: '2025-01-01T00:00:00Z',
    tags: ['intro', 'studio']
  },
  {
    id: 'design-process',
    slug: 'our-design-process',
    title: 'Our Design Process',
    excerpt: 'How we approach design challenges with clarity and creativity.',
    body: 'Template article describing design phases: discovery, ideation, execution, refinement.',
    author: 'Design Team',
    created_at: '2025-01-05T00:00:00Z',
    tags: ['design', 'process']
  }
];

export const seedProjects = [
  {
    id: 'proj-1',
    name: 'Concept Brand Board',
    imageUrl: 'https://via.placeholder.com/600x800?text=Brand+Board',
    description: 'A sample branding composition showcasing typography and color.'
  },
  {
    id: 'proj-2',
    name: 'Poster Exploration',
    imageUrl: 'https://via.placeholder.com/600x800?text=Poster+Exploration',
    description: 'Exploratory poster layout with bold headline treatment.'
  },
  {
    id: 'proj-3',
    name: 'UI Wireframe',
    imageUrl: 'https://via.placeholder.com/600x800?text=UI+Wireframe',
    description: 'Low‑fidelity wireframe mockup for a sample product screen.'
  }
];

export const seedPackages = [
  {
    id: 'pkg-starter',
    name: 'Starter Package',
    description: 'Ideal for small ideas getting off the ground. Includes basic design consult.',
    price: 499
  },
  {
    id: 'pkg-growth',
    name: 'Growth Package',
    description: 'For scaling initiatives needing consistent creative support.',
    price: 1499
  },
  {
    id: 'pkg-premium',
    name: 'Premium Package',
    description: 'Full creative partnership with iterative strategy sessions.',
    price: 2999
  }
];

export const seedServices = [
  {
    id: 'svc-brand',
    name: 'Brand Identity',
    description: 'Logo systems, palettes, typography, foundational brand assets.'
  },
  {
    id: 'svc-uiux',
    name: 'UI / UX Design',
    description: 'User flows, wireframes, interfaces, prototypes with usability focus.'
  },
  {
    id: 'svc-content',
    name: 'Content & Visual',
    description: 'Creative copy, layout direction, image strategy, presentation polish.'
  }
];

// Convenience resolver
export function getSeedForPath(pathname) {
  if (/\/cms\/posts\/?$/.test(pathname)) return seedBlogPosts;
  if (/\/projects\/?$/.test(pathname)) return seedProjects;
  if (/\/packages\/?$/.test(pathname)) return seedPackages;
  if (/\/services\/?$/.test(pathname)) return seedServices;
  return null;
}
