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

export interface Hobby {
  id: string;
  title: string;
  description: string;
  category: "photography" | "music" | "skills" | "gaming" | "reading" | "other";
  cover_url: string;
  link: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const HOBBY_CATEGORIES = [
  { value: "photography", label: "摄影", icon: "📷" },
  { value: "music", label: "音乐", icon: "🎵" },
  { value: "skills", label: "技能", icon: "💡" },
  { value: "gaming", label: "游戏", icon: "🎮" },
  { value: "reading", label: "阅读", icon: "📚" },
  { value: "other", label: "其他", icon: "❤️" },
] as const;

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
