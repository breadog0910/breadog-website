-- =====================================================
-- Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件
-- =====================================================

-- 1. Profile 表（个人名片）
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  skills JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  contact_email TEXT DEFAULT '',
  splash_subtitle TEXT DEFAULT '',
  splash_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects 表（作品集）
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  tech_stack JSONB DEFAULT '[]'::jsonb,
  link TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Posts 表（博客文章）
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Timeline 表（时间线）— 已废弃，保留兼容
CREATE TABLE IF NOT EXISTS timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date DATE NOT NULL DEFAULT now(),
  type TEXT DEFAULT 'other' CHECK (type IN ('education', 'work', 'project', 'other')),
  icon TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Hobbies 表（个人爱好展示）
CREATE TABLE hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('photography', 'music', 'skills', 'gaming', 'reading', 'other')),
  cover_url TEXT DEFAULT '',
  link TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. RLS (Row Level Security) 策略
-- =====================================================

-- 启用所有表的 RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profile: 公开可读，仅认证用户可写
CREATE POLICY "Profile is public readable" ON profile
  FOR SELECT USING (true);

CREATE POLICY "Profile is writable by authenticated users" ON profile
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Projects: 公开可读已发布，认证用户可管理所有
CREATE POLICY "Projects public readable" ON projects
  FOR SELECT USING (is_published = true);

CREATE POLICY "Projects manageable by authenticated users" ON projects
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Posts: 公开可读已发布，认证用户可管理所有
CREATE POLICY "Posts public readable" ON posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Posts manageable by authenticated users" ON posts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Timeline: 公开可读，认证用户可管理所有
CREATE POLICY "Timeline public readable" ON timeline
  FOR SELECT USING (true);

CREATE POLICY "Timeline manageable by authenticated users" ON timeline
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Hobbies: 公开可读，认证用户可管理所有
CREATE POLICY "Hobbies public readable" ON hobbies
  FOR SELECT USING (true);

CREATE POLICY "Hobbies manageable by authenticated users" ON hobbies
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Contact Messages: 仅认证用户可读，任意用户可插入（API 层通过 service client 执行）
CREATE POLICY "Contact messages readable by authenticated users" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Contact messages insertable by anyone" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages updatable by authenticated users" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 6. contact_messages 表（联系表单提交）
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 7. 索引
-- =====================================================

CREATE INDEX idx_projects_sort ON projects(sort_order);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_timeline_date ON timeline(date);
CREATE INDEX idx_hobbies_category ON hobbies(category);
CREATE INDEX idx_hobbies_sort ON hobbies(sort_order);
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);

-- =====================================================
-- 7. 插入默认 profile 数据
-- =====================================================

INSERT INTO profile (name, title, bio, skills, social_links, contact_email)
VALUES (
  'Breadog',
  '软件工程学生 · 技术爱好者',
  '在这里写下你的自我介绍...',
  '["JavaScript", "TypeScript", "React", "Next.js", "Python"]'::jsonb,
  '{"github": "https://github.com", "email": "contact@breadog.com"}'::jsonb,
  'contact@breadog.com'
);
