import FrontLayout from "@/components/front-layout";
import { createClient } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import Link from "next/link";

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <FrontLayout>
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">作品集</h1>
          <p className="text-muted">我做过的一些项目和作品</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">暂无作品展示</p>
            <p className="text-muted/60 text-sm mt-2">
              精彩内容即将上线，敬请期待
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block rounded-xl border border-card-border bg-card-bg
                           hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
                           transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 封面图 */}
                <div className="aspect-video overflow-hidden bg-card-bg">
                  {project.cover_url ? (
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted/30">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 信息 */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  {project.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs rounded-md bg-background border border-card-border text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="px-2 py-0.5 text-xs text-muted/50">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </FrontLayout>
  );
}
