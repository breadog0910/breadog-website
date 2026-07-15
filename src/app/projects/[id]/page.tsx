import FrontLayout from "@/components/front-layout";
import { createClient } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { notFound } from "next/navigation";

async function getProject(id: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  return (
    <FrontLayout>
      <article className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {/* 封面 */}
        {project.cover_url && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-card-bg">
            <img
              src={project.cover_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 标题和标签 */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
        {project.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm rounded-full bg-card-bg border border-card-border text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* 链接 */}
        <div className="flex flex-wrap gap-3 mb-8">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white
                         hover:bg-primary-dark transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              访问项目
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card-bg border border-card-border
                         text-muted hover:text-foreground hover:border-primary/30 transition-all text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              源代码
            </a>
          )}
        </div>

        {/* 描述 */}
        <div className="prose text-foreground/90">
          <p className="text-muted leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      </article>
    </FrontLayout>
  );
}
