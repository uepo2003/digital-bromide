"use client";

import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {value ? (
        <div className="relative group">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gray-200">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={() => onChange("")}
            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative w-full aspect-[3/4] rounded-2xl border-2 border-dashed transition-all duration-200",
            "flex flex-col items-center justify-center cursor-pointer",
            "hover:border-slate-400 hover:bg-slate-50/50",
            isDragging
              ? "border-slate-600 bg-slate-50"
              : "border-gray-300 bg-gray-50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="p-6 rounded-full bg-slate-100">
              {isDragging ? (
                <ImageIcon className="w-12 h-12 text-slate-600" />
              ) : (
                <Upload className="w-12 h-12 text-slate-600" />
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">
                {isDragging ? "ここにドロップ" : "画像をアップロード"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                クリックまたはドラッグ&ドロップ
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

