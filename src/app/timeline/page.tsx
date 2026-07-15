import FrontLayout from "@/components/front-layout";
import { createClient } from "@/lib/supabase";
import type { TimelineEntry } from "@/lib/types";

async function getTimeline(): Promise<TimelineEntry[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("timeline")
      .select("*")
      .order("date", { ascending: false })
      .order("sort_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

const TYPE_CONFIG: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  education: {
    label: "教育",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: "🎓",
  },
  work: {
    label: "工作",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: "💼",
  },
  project: {
    label: "项目",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: "🚀",
  },
  other: {
    label: "其他",
    color: "bg-muted/20 text-muted border-muted/30",
    icon: "📌",
  },
};

export default async function TimelinePage() {
  const entries = await getTimeline();

  return (
    <FrontLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">时间线</h1>
          <p className="text-muted">我的学习与成长历程</p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">暂无记录</p>
            <p className="text-muted/60 text-sm mt-2">
              精彩故事即将开始
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* 竖线 */}
            <div className="absolute left-5 top-2 bottom-2 w-px bg-card-border" />

            <div className="space-y-8">
              {entries.map((entry) => {
                const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.other;
                return (
                  <div key={entry.id} className="relative pl-14">
                    {/* 节点 */}
                    <div
                      className={`absolute left-2.5 top-1 w-6 h-6 rounded-full border-2 bg-background
                                  flex items-center justify-center text-xs ${config.color}`}
                    >
                      <span className="leading-none">
                        {entry.icon || config.icon}
                      </span>
                    </div>

                    {/* 内容 */}
                    <div className="p-5 rounded-xl border border-card-border bg-card-bg">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{entry.title}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-md border ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <time className="text-sm text-primary-light mb-2 block">
                        {new Date(entry.date).toLocaleDateString("zh-CN", {
                          year: "numeric",
                          month: "long",
                        })}
                      </time>
                      <p className="text-sm text-muted leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </FrontLayout>
  );
}
