import { createClient, createServiceClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// POST /api/contact — 提交联系表单（公开，无需登录）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 服务端校验
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "请输入姓名" },
        { status: 400 }
      );
    }
    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "请输入联系方式" },
        { status: 400 }
      );
    }
    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "请输入留言内容" },
        { status: 400 }
      );
    }

    const serviceClient = await createServiceClient();
    const { data, error } = await serviceClient
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
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

// GET /api/contact — 获取所有留言（需登录）
export async function GET() {
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

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
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
