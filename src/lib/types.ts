// ==================== 数据库类型 ====================

export interface Profile {
  id: string;
  name: string;
  title: string;
  avatar_url: string;
  bio: string;
  skills: string[];
  social_links: SocialLinks;
  contact_email: string;
  splash_subtitle: string;
  splash_description: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  tech_stack: string[];
  link?: string;
  github_url?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_url?: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "education" | "work" | "project" | "other";
  icon?: string;
  sort_order: number;
  created_at: string;
}

// ==================== API 类型 ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==================== 后台表单类型 ====================

export interface ProfileFormData {
  name: string;
  title: string;
  avatar_url: string;
  bio: string;
  skills: string;
  social_links: string;
  contact_email: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  cover_url: string;
  tech_stack: string;
  link: string;
  github_url: string;
  is_published: boolean;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_url: string;
  tags: string;
  is_published: boolean;
}

export interface TimelineFormData {
  title: string;
  description: string;
  date: string;
  type: "education" | "work" | "project" | "other";
  icon: string;
}
