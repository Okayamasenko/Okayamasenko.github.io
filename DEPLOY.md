# DEPLOY.md · 部署方案

> 这份讲网站怎么从 GitHub 上的源码变成线上能访问的页面。搭建时按第一阶段做，火山引擎那段先不用碰。

---

## 整条流水线长这样

```
agent 把文章推进 GitHub 仓库
        │
        ▼
GitHub Actions 自动跑 `npm run build`（把 Astro 源码 + Markdown 编译成 dist/ 静态成品）
        │
        ▼
第一阶段：部署到 GitHub Pages → 域名直接访问到成品
（以后可选）同一份 dist/ 再推一份到火山引擎 TOS，覆盖国内受众
```

GitHub 仓库存的是**源**（`.astro` + `.md`），不是能直接访问的网站。中间必须有「构建」这一步把它变成 HTML/CSS/JS，再放到一个对外提供访问的地方。第一阶段这个「地方」就是 GitHub Pages。

---

## 第一阶段：GitHub Pages（现在就做这个）

**为什么先用它**：免费、免 ICP 备案、当天能上线。日本和海外访问没问题。**唯一短板**是中国大陆访问 GitHub Pages 不稳，站主的国内社群/朋友可能慢或打不开——这个短板等以后加火山引擎第二出口解决，现在先不管。

**要点**：

1. Astro 配置里设好站点信息。如果用 `用户名.github.io` 这种仓库名，站点在根路径，`base` 不用设；如果是别的仓库名走 Pages，需要设 `base: '/仓库名'`——**建议直接用 `Okayamasenko.github.io` 仓库名，省掉 base 的麻烦**，以后绑自定义域名也顺。
2. 仓库 Settings → Pages → Source 选 "GitHub Actions"。
3. 加一个 workflow（`.github/workflows/deploy.yml`），push 到主分支就构建 + 部署。Astro 官方有现成的 GitHub Pages Action，直接用，别手写复杂脚本。
4. 跑通验收标准：**改一个字 → `git push` → 一两分钟后线上自动更新**。这条闭环通了，第一阶段就完成了。

**验证草稿关卡**：确认生产构建里 `draft: true` 的文章不会出现在线上（`src/content/config.ts` + 列表/文章页在 `import.meta.env.PROD` 时过滤掉草稿）。本地 `npm run dev` 能看到草稿，线上看不到，才算对。

---

## 第二阶段（以后再说）：火山引擎 TOS 第二出口

等站主要认真覆盖国内受众、也愿意走备案了，再加这一段。**加它不用改任何现有代码或 agent 工作流**，只是在 workflow 末尾多一步「把同一份 `dist/` 也推到火山引擎 TOS」。

届时需要：

- 域名 + **ICP 备案**（2–4 周，要身份证 + 域名实名，域名得在国内注册商）。
- 火山引擎 TOS bucket 开静态网站托管 + CDN + HTTPS 证书。
- workflow 里加一步，用 `tosutil` 或火山引擎的 Action 同步 `dist/` 到 bucket，并刷新 CDN 缓存。凭据用 GitHub Secrets 存，别写进代码。

结果是**一套源码、两个门面**：GitHub Pages 给海外/日本，火山引擎给国内。

---

## 给 agent 推送权限（那把「只有我能操作」的钥匙）

同步文章的 agent（Claude Code / OpenClaw）需要能 push 到这个仓库。这就是站主说的「只有我自己能操作的入口」——门 = 仓库写权限，钥匙 = 给 agent 的凭据。

- Claude Code 在站主自己电脑上跑，用她本地已登录的 Git 凭据即可，通常不用额外配。
- OpenClaw（小龙虾）在 VPS 上跑，给它一个**权限最小化的 GitHub token**（只对这一个仓库有写权限的 fine-grained PAT），存在 VPS 上它读得到的地方，别放进仓库、别硬编码。
- token 万一泄露就去 GitHub 撤销重发，几秒的事。

---

## 一句话总结给 Claude Code

第一阶段目标：**Astro 站 + GitHub Actions + GitHub Pages，跑通「push 即自动上线」，草稿不上线。** 火山引擎、翻译、订阅这些都是以后的事，现在不要碰。每完成一步给站主过一眼再往下。
