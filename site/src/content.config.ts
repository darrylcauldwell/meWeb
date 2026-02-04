import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES, TAGS, isValidTag } from './config/content';

// Re-export for backward compatibility
export { CATEGORIES, TAGS, isValidTag } from './config/content';
export type { Tag, Category } from './config/content';

// Helper to coerce string "true"/"false" to boolean
const coercedBoolean = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') return val;
    return val.toLowerCase() === 'true';
  })
  .optional()
  .default(false);

const post = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/post" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    category: z.enum(CATEGORIES).optional().default('automation'),
    tags: z.array(z.string()).optional().default([]),
    categories: z.array(z.string()).optional().default([]), // legacy, will migrate
    thumbnail: z.string().optional(),
    featured: coercedBoolean,
    draft: coercedBoolean,
  }),
});

export const collections = { post };
