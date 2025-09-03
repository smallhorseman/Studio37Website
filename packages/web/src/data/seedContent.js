// Blog seed
export const seedBlogPosts = [
  {
    id: 'welcome-post',
    slug: 'welcome-to-studio37',
    title: 'Welcome to Studio37',
    excerpt: 'An introduction to our creative studio and what we do.',
    body: 'Placeholder article content. Replace with CMS-managed markdown or rich text.',
    author: 'Studio37',
    created_at: '2025-01-01T00:00:00Z',
    tags: ['intro', 'studio']
  },
  {
    id: 'design-process',
    slug: 'our-design-process',
    title: 'Our Design Process',
    excerpt: 'How we approach design challenges with clarity and creativity.',
    body: 'Template explaining phases: discovery → ideation → execution → refinement.',
    author: 'Design Team',
    created_at: '2025-01-05T00:00:00Z',
    tags: ['design', 'process']
  }
];

// Portfolio / Projects seed (enriched)
export const seedProjects = [
  {
    id: 'proj-brand-system',
    slug: 'brand-system-refresh',
    name: 'Brand System Refresh',
    category: 'Brand Identity',
    tags: ['branding', 'identity', 'visual'],
    imageUrl: 'https://via.placeholder.com/800x1000?text=Brand+System',
    description: 'Exploration of typography, palette, spacing scale and iconography.',
    caseStudy: {
      challenge: 'Outdated fragmented brand visuals across channels.',
      approach: 'Audit → component inventory → iterative mood boards → system tokens.',
      outcome: 'Consistent rollout kit (logos, color tokens, typography guidelines).'
    }
  },
  {
    id: 'proj-ui-wireframe',
    slug: 'saas-dashboard-wireframe',
    name: 'SaaS Dashboard Wireframes',
    category: 'UI / UX',
    tags: ['ux', 'wireframe', 'product'],
    imageUrl: 'https://via.placeholder.com/800x1000?text=Dashboard+Wireframes',
    description: 'Low‑fidelity structural screens optimizing task efficiency.',
    caseStudy: {
      challenge: 'Users struggled to locate core metrics quickly.',
      approach: 'Workflow interviews + task mapping + iterative grayscale layouts.',
      outcome: '35% reduction in average task navigation depth.'
    }
  },
  {
    id: 'proj-marketing-campaign',
    slug: 'seasonal-campaign-assets',
    name: 'Seasonal Campaign Assets',
    category: 'Content / Visual',
    tags: ['campaign', 'social', 'content'],
    imageUrl: 'https://via.placeholder.com/800x1000?text=Campaign+Assets',
    description: 'Cross‑platform asset kit (social tiles, landing hero, email header).',
    caseStudy: {
      challenge: 'Inconsistent visual tone across campaign surfaces.',
      approach: 'Single creative direction board, adaptive layout templates.',
      outcome: 'Unified launch pack delivered in 3 days; higher engagement readiness.'
    }
  },
  {
    id: 'proj-illustration-set',
    slug: 'custom-illustration-pack',
    name: 'Custom Illustration Pack',
    category: 'Illustration',
    tags: ['illustration', 'vector', 'brand'],
    imageUrl: 'https://via.placeholder.com/800x1000?text=Illustrations',
    description: 'Scalable vector illustration style adaptable to dark/light modes.',
    caseStudy: {
      challenge: 'Stock imagery lacked cohesion with brand palette.',
      approach: 'Shape language exploration + limited accent hues + export pipeline.',
      outcome: 'Reusable library (SVG + Lottie) with consistent tone.'
    }
  }
];

// Packages seed
export const seedPackages = [
  { id: 'pkg-starter', name: 'Starter Package', description: 'Foundational guidance + light design support.', price: 499 },
  { id: 'pkg-growth', name: 'Growth Package', description: 'Expanded creative iteration & monthly refinements.', price: 1499 },
  { id: 'pkg-premium', name: 'Premium Package', description: 'Full embedded creative partner experience.', price: 2999 }
];

// Services seed
export const seedServices = [
  { id: 'svc-brand', name: 'Brand Identity', description: 'Logos, palettes, typography, core assets.' },
  { id: 'svc-uiux', name: 'UI / UX Design', description: 'Flows, wireframes, prototypes, interaction polish.' },
  { id: 'svc-content', name: 'Content & Visual', description: 'Copy direction, imagery guidelines, presentation.' }
];

// NEW: lightweight CRM & Tasks seeds (placeholder)
export const seedCrm = [
  { id: 'lead-demo-1', name: 'Acme Corp', status: 'lead', contact: 'jane@acme.com' },
  { id: 'lead-demo-2', name: 'Bright Health', status: 'prospect', contact: 'ops@bright.example' }
];

export const seedTasks = [
  { id: 'task-demo-1', title: 'Prepare proposal draft', done: false },
  { id: 'task-demo-2', title: 'Upload portfolio images', done: true }
];

// Helper for API shim path mapping
export function getSeedForPath(pathname) {
  const p = pathname.replace(/^\/api(?=\/)/, ''); // normalize /api prefix
  if (/\/cms\/posts\/?$/.test(p)) return seedBlogPosts;
  if (/\/projects\/?$/.test(p)) return seedProjects;
  if (/\/packages\/?$/.test(p)) return seedPackages;
  if (/\/services\/?$/.test(p)) return seedServices;
  if (/\/crm\/?$/.test(p)) return seedCrm;
  if (/\/tasks\/?$/.test(p)) return seedTasks;
  return null;
}

// Optional accessor for a single project by slug / id (can be used later)
export function findSeedProject(identifier) {
  return seedProjects.find(
    p => p.id === identifier || p.slug === identifier
  ) || null;
}
