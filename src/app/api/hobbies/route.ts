import { createClient, createServiceClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/hobbies - 获取所有爱好（公开）
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hobbies")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/hobbies - 创建爱好（需认证）
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "未登录" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const serviceClient = await createServiceClient();
    const { data, error } = await serviceClient
      .from("hobbies")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
