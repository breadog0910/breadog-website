import FrontLayout from "@/components/front-layout";
import { createClient } from "@/lib/supabase";
import type { Hobby } from "@/lib/types";
import { HOBBY_CATEGORIES } from "@/lib/types";
import HobbyClient from "./hobby-client";

async function getHobbies(): Promise<Hobby[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("hobbies")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

function groupByCategory(hobbies: Hobby[]) {
  const map: Record<string, Hobby[]> = {};
  for (const h of hobbies) {
    if (!map[h.category]) map[h.category] = [];
    map[h.category].push(h);
  }
  return map;
}

export default async function HobbiesPage() {
  const hobbies = await getHobbies();
  const grouped = groupByCategory(hobbies);

  return (
    <FrontLayout>
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">个人爱好</h1>
          <p className="text-muted">工作之外，我热爱的事物</p>
        </div>

        {hobbies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">暂无内容</p>
            <p className="text-muted/60 text-sm mt-2">敬请期待</p>
          </div>
        ) : (
          <div className="space-y-16">
            {HOBBY_CATEGORIES.map((cat) => {
              const items = grouped[cat.value];
              if (!items || items.length === 0) return null;
              return (
                <section key={cat.value}>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl">{cat.icon}</span>
                    <h2 className="text-xl font-semibold">{cat.label}</h2>
                    <span className="text-xs text-muted ml-2">
                      {items.length}
                    </span>
                  </div>
                  <HobbyClient category={cat.value} items={items} />
                </section>
              );
            })}
          </div>
        )}
      </div>
    </FrontLayout>
  );
}
