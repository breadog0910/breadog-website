import { createClient, createServiceClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/profile - 获取个人信息（公开）
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
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

// PUT /api/profile - 更新个人信息（需认证）
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 验证用户是否登录
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

    // 使用 service client 写入（绕过 RLS）
    const serviceClient = await createServiceClient();
    const { data: profile } = await serviceClient
      .from("profile")
      .select("id")
      .single();

    const { data, error } = await serviceClient
      .from("profile")
      .upsert({
        id: profile?.id,
        ...body,
        updated_at: new Date().toISOString(),
      })
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
