# CLAUDE.md · 本仓库操作约定

> 这份文件放在**仓库根目录**，是给在本仓库工作的 agent（Claude Code / OpenClaw）的常驻说明。
> 最重要的用途：把站主在小红书等平台发布的内容，**同步成本站的一篇博客文章**。

---

## 项目速览

- 静态个人网站，**Astro** 框架，纯静态输出。
- 多页面结构：`首页 / 关于 / 项目 / 文章 / 联系`。文章板块是博客，带分页。
- 文章内容以 **Markdown** 存在 `src/content/posts/`，图片存在 `public/images/posts/`。
- 源码在 GitHub，push 后由 GitHub Actions 自动构建部署（详见 `DEPLOY.md`）。
- 完整背景见 `HANDOFF.md`。

---

## 目录约定

```
src/
  content/
    config.ts              # content collection 的 schema 定义
    posts/
      2026-02-14-my-post.md   # 一篇文章 = 一个 md 文件
  pages/
  layouts/
  components/
public/
  images/
    posts/
      2026-02-14-my-post/     # 每篇文章的图片放自己的文件夹
        cover.jpg
        01.jpg
```

- **文件名 / slug 规则**：`YYYY-MM-DD-英文或拼音短标题`，全小写，用连字符。例：`2026-02-14-ai-community-notes`。
- 一篇文章的所有图片，放在 `public/images/posts/<slug>/` 这个专属文件夹里。封面固定叫 `cover.jpg`。

---

## 文章 frontmatter schema

每篇 `.md` 顶部的 frontmatter 必须符合下面结构（`src/content/config.ts` 里用 zod 强校验，字段对不上构建会报错）：

```yaml
---
title: "文章标题"
date: 2026-02-14              # 发布日期 YYYY-MM-DD
summary: "一两句话的摘要，用于列表页和 SEO"
cover: "/images/posts/2026-02-14-my-post/cover.jpg"   # 封面图路径，没有可留空 ""
tags: ["AI", "求职"]          # 标签，0 个或多个
source: "小红书"              # 原发布平台；纯原创写 "原创"
originalUrl: "https://..."    # 原帖链接；没有留空 ""
lang: "zh"                    # 目前统一 zh
draft: true                  # 草稿关卡：新文章一律先 true，见下方工作流
---
```

对应的 `src/content/config.ts`（供搭建时参考，Claude Code 按需调整）：

```ts
import { defineCollection, z } from 'astro:content';

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
```

列表页和文章页在生产构建里要**过滤掉 `draft: true` 的文章**（`import.meta.env.PROD` 时排除），这样草稿本地能预览、但不会出现在线上。

---

## 核心工作流：同步一篇平台内容

当站主给你一篇内容（通常是：标题 + 正文 + 封面图，可能还有配图、原帖链接、标签），按以下步骤做：

1. **确认素材齐不齐**。缺封面、缺原帖链接就问她，别自己编。
2. **定 slug**：`日期-拼音或英文短标题`。日期用她指定的发布日，没指定就用今天。
3. **存图**：把封面存成 `public/images/posts/<slug>/cover.jpg`；其他配图按 `01.jpg`、`02.jpg` 存进同一文件夹。
4. **建文章文件** `src/content/posts/<slug>.md`：
   - 按上面的 schema 填 frontmatter，**`draft` 一律先设 `true`**。
   - 把正文整理成适合博客阅读的 Markdown：小红书那种短句 + emoji + 话题标签的形态，要转成通顺的博客正文。**保留她的语气和观点，只做排版和语句梳理，不改写立场、不加她没说的内容、不编事实。**
5. **走草稿关卡**（二选一，跟站主确认过用哪种；默认用 A）：
   - **A. draft 标记**：保持 `draft: true` 提交，告诉她本地 `npm run dev` 预览确认；她说 OK 后，把 `draft` 改成 `false`，再 commit + push，Actions 构建上线。
   - **B. 分支/PR**：新开分支 `post/<slug>`，提交后开 PR，她 review 合并后才上线。
6. **提交信息**用清楚的中文，例如 `新增文章：<标题>（草稿）`。

---

## 写作 / 文案硬规则

- ⚠️ 涉及站主研究对象时，一律写「以东亚语言为母语的学习者 / East Asian language-background learners」，**绝不写「中文/普通话母语者」「Chinese/Mandarin speakers」**。
- 项目相关文案强调「用 AI 自主开发」，不是「AI 帮我做的」。
- 口吻：直接、不煽情、有观点。不堆形容词，不写简历腔。
- 拿不准她想不想公开某段信息时，先问。个人网站是对外的，宁可保守。

---

## 别做的事

- 不要在没被要求时改动**其他已有文章**——加一篇就只碰这一篇的文件和它的图片文件夹。
- 不要为了凑内容而扩写或虚构事实。
- 不要跳过草稿关卡直接把新文章推上线。
- 不要热链小红书的图片（会被挡）——图片一律由站主提供、存进仓库。
- 大的改动（改配色、改结构、加新板块、上火山引擎）不要自作主张，这些是站主回网页版跟 Claude 讨论后定的方向，你负责落地、不负责决策。
