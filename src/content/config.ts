import { defineCollection, z } from 'astro:content';

// 文章 frontmatter schema —— 与 CLAUDE.md 里约定的一致。
// 字段对不上，构建会直接报错，防止同步 agent 把格式写歪。
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().default(''),
    cover: z.string().default(''),
    tags: z.array(z.string()).default([]),
    source: z.string().default('原创'),
    originalUrl: z.string().default(''),
    lang: z.string().default('zh'),
    draft: z.boolean().default(true),
  }),
});

export const collections = { posts };
