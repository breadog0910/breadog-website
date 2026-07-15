"use client";

import { useAuth } from "@/lib/auth-context";
import { useCallback, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "上传图片",
  bucket = "images",
}: Props) {
  const { supabase } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("请选择图片文件");
        return;
      }

      setUploading(true);
      const ext = file.name.split(".").pop() || "png";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (error) {
        alert("上传失败: " + error.message);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      onChange(publicUrl);
      setUploading(false);
    },
    [supabase, bucket, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) uploadFile(file);
          break;
        }
      }
    },
    [uploadFile]
  );

  return (
    <div>
      {label && (
        <label className="block text-sm text-muted mb-1.5">{label}</label>
      )}

      {/* 拖拽上传区 */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
          ${dragOver ? "border-primary bg-primary/5" : "border-card-border hover:border-primary/30"}
          ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted">上传中...</span>
          </div>
        ) : value ? (
          <div className="relative group">
            <img
              src={value}
              alt="预览"
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">点击或拖拽替换图片</span>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <div className="text-3xl mb-2">📷</div>
            <p className="text-sm text-muted">
              点击选择、拖拽图片、或 Ctrl+V 粘贴
            </p>
            <p className="text-xs text-muted/50 mt-1">
              支持 JPG、PNG、GIF、WebP
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
      </div>

      {/* URL 输入（兜底） */}
      {value && (
        <div className="mt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="或直接粘贴图片 URL"
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-card-border
                       text-foreground text-xs focus:outline-none focus:border-primary/50 font-mono"
          />
        </div>
      )}
    </div>
  );
}
