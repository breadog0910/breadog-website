import FrontLayout from "@/components/front-layout";
import LetterGlitch from "@/components/LetterGlitch";
import CursorGrid from "@/components/CursorGrid";
import ContactForm from "@/components/contact-form";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profile")
      .select("*")
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const profile = await getProfile();

  return (
    <>
      {/* 上半屏：LetterGlitch 字母矩阵 */}
      <div className="fixed top-0 left-0 w-full h-[50vh] z-0 pointer-events-none">
        <LetterGlitch
          glitchColors={["#6366f1", "#818cf8", "#22d3ee"]}
          glitchSpeed={45}
          smooth
          mouseRadius={150}
          falloff="smooth"
          holdTime={300}
          fadeDuration={800}
          clickPulse
          pulseSpeed={700}
        />
      </div>

      {/* 下半屏：CursorGrid 网格 */}
      <div className="fixed top-[50vh] left-0 w-full h-[50vh] z-0 pointer-events-none">
        <CursorGrid
          cellSize={70}
          color="#6366f1"
          radius={140}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={1}
          fillOpacity={0}
          gridOpacity={0.04}
          cellRadius={0}
          clickPulse
          pulseSpeed={600}
        />
      </div>

      <FrontLayout>
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-16">
          {/* 头像 */}
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-2 border-card-border"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-card-bg border-2 border-card-border flex items-center justify-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-muted"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>

          {/* 基本信息 */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {profile?.name || "Breadog"}
            </h1>
            <p className="text-lg text-primary-light mb-3">
              {profile?.title || "软件工程学生 · 技术爱好者"}
            </p>
            <p className="text-muted leading-relaxed max-w-lg">
              {profile?.bio || "个人简介尚未填写，请通过后台管理添加..."}
            </p>
          </div>
        </div>

        {/* 技能标签 */}
        {profile?.skills && profile.skills.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-4">技能</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-sm rounded-full bg-card-bg border border-card-border
                             text-muted hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 社交链接 */}
        {profile?.social_links && (
          <section>
            <h2 className="text-xl font-semibold mb-4">联系</h2>
            <div className="flex flex-wrap gap-4">
              {profile.social_links.github && (
                <a
                  href={profile.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card-bg border border-card-border
                             text-muted hover:text-foreground hover:border-primary/30 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {profile.social_links.email && (
                <a
                  href={`mailto:${profile.social_links.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card-bg border border-card-border
                             text-muted hover:text-foreground hover:border-primary/30 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email
                </a>
              )}
              {profile.social_links.linkedin && (
                <a
                  href={profile.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card-bg border border-card-border
                             text-muted hover:text-foreground hover:border-primary/30 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </section>
        )}

        {/* 联系表单 */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">给我留言</h2>
          <ContactForm />
        </section>
        </div>
    </FrontLayout>
    </>
  );
}
