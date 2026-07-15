# Breadog 个人网站

## 项目概述

集个人名片、作品展示、技术博客、时间线为一体的个人全栈网站。前台公开访问，后台登录后可在线编辑管理所有内容。

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 (App Router) + TypeScript |
| 样式 | Tailwind CSS 4 |
| 动画 | Framer Motion |
| 数据库/认证/存储 | Supabase |
| 部署 | Vercel + 阿里云自定义域名 |
| Markdown | react-markdown + remark-gfm |

## 本地开发

```bash
npm install

# 1. 注册 Supabase (https://supabase.com), 创建项目
# 2. 在 Supabase SQL Editor 中执行 supabase-schema.sql
# 3. 编辑 .env.local，填入真实 Supabase 凭据:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY

npm run dev
```

## 项目结构

```
src/
├── app/
│   ├── page.tsx                    # 炫酷开场页
│   ├── layout.tsx                  # 前台根布局
│   ├── globals.css                 # 全局样式 + 设计 token
│   ├── home/page.tsx               # 关于我
│   ├── projects/
│   │   ├── page.tsx                # 作品集列表
│   │   └── [id]/page.tsx           # 作品详情
│   ├── blog/
│   │   ├── page.tsx                # 博客列表
│   │   └── [slug]/page.tsx         # 文章详情 (Markdown 渲染)
│   ├── timeline/page.tsx           # 时间线
│   ├── admin/
│   │   ├── layout.tsx              # 后台布局 + AuthProvider
│   │   ├── admin-shell.tsx         # 侧边栏 + 认证守卫
│   │   ├── page.tsx                # 仪表盘
│   │   ├── login/page.tsx          # 登录页
│   │   ├── profile/page.tsx        # 编辑个人名片
│   │   ├── projects/              # 作品管理 CRUD
│   │   ├── posts/                 # 博客管理 CRUD
│   │   └── timeline/              # 时间线管理 CRUD
│   └── api/                        # REST API 路由 (GET/POST/PUT/DELETE)
├── components/
│   ├── navbar.tsx                  # 前台导航栏 + 移动端菜单
│   ├── footer.tsx                  # 前台底部
│   └── front-layout.tsx            # Navbar + Main + Footer 包装
├── lib/
│   ├── types.ts                    # 全局 TypeScript 类型
│   ├── supabase.ts                 # 服务端 Supabase 客户端 (cookie-based)
│   ├── supabase-client.ts          # 浏览器端 Supabase 客户端
│   └── auth-context.tsx            # React Auth Context Provider
└── supabase-schema.sql             # 建表 + RLS + 索引
```

## 数据库表

- **profile** — 个人名片 (单条记录)
- **projects** — 作品集
- **posts** — 博客文章
- **timeline** — 时间线

## 权限

- 前台全部公开、后台 /admin/* 需登录
- Supabase Auth (邮箱+密码)
- RLS: 公开可读、认证用户可写
- API 写入需验证 token

## 设计

- 暗色主题, Indigo + Cyan 主色调
- 渐变开场页 (待用户提供具体效果提示词)
- 卡片布局, Framer Motion 动效

## 部署

1. `git push` 到 GitHub
2. Vercel 导入项目 → 配置 env vars
3. 阿里云 DNS CNAME → Vercel 域名

## 后续可扩展

- [ ] 深色/浅色模式
- [ ] 评论系统
- [ ] RSS
- [ ] 全文搜索
- [ ] 图片直接上传 (Supabase Storage)
