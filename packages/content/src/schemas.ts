import { z } from 'zod';

export const localeSchema = z.enum(['en', 'id']);
export const publishStatusSchema = z.enum(['draft', 'review', 'published', 'archived']);

export const mediaSchema = z.object({
  src: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const seoFieldsSchema = z.object({
  title: z.string().max(120).optional(),
  description: z.string().max(300).optional(),
  canonical: z.string().url().optional(),
  ogImage: mediaSchema.optional(),
  noindex: z.boolean().optional(),
});

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase ASCII hyphen-separated');

export const articleReferenceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  accessedAt: z.string().optional(),
});

export const articleSchema = z.object({
  id: z.string().uuid(),
  locale: localeSchema,
  translationGroupId: z.string().uuid(),
  slug: slugSchema,
  title: z.string().min(1).max(200),
  dek: z.string().min(1).max(400),
  status: publishStatusSchema,
  categorySlug: slugSchema,
  tagSlugs: z.array(slugSchema).optional(),
  authorId: z.string().uuid(),
  reviewerId: z.string().uuid().optional(),
  heroImage: mediaSchema.optional(),
  content: z.unknown(),
  references: z.array(articleReferenceSchema).optional(),
  relatedServices: z.array(slugSchema).optional(),
  relatedProjects: z.array(slugSchema).optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime({ offset: true }).optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
  seo: seoFieldsSchema.optional(),
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  description: z.string().trim().min(10).max(4000),
  services: z.array(slugSchema).max(6).optional(),
  company: z.string().trim().max(160).optional(),
  budgetRange: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
  consent: z.boolean().optional(),
});

export type Media = z.infer<typeof mediaSchema>;
export type SeoFields = z.infer<typeof seoFieldsSchema>;
export type ArticleRecord = z.infer<typeof articleSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
