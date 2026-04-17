"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { Bromide } from "@/types";
import Image from "next/image";
import { motion } from "framer-motion";

const BROMIDES_CACHE_KEY = "admin:bromides:cache";

export default function AdminBromidesPage() {
  const [bromides, setBromides] = useState<Bromide[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const cached = sessionStorage.getItem(BROMIDES_CACHE_KEY);
      return cached ? (JSON.parse(cached) as Bromide[]) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem(BROMIDES_CACHE_KEY);
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBromide, setEditingBromide] = useState<Bromide | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    serial_number: "",
  });

  useEffect(() => {
    fetchBromides();
  }, []);

  const fetchBromides = async () => {
    const { data, error } = await supabase
      .from("bromides")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bromides:", error);
    } else {
      const list = data || [];
      setBromides(list);
      try {
        sessionStorage.setItem(BROMIDES_CACHE_KEY, JSON.stringify(list));
      } catch {
        // ignore quota errors
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBromide) {
      const { error } = await supabase
        .from("bromides")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingBromide.id);

      if (error) {
        console.error("Error updating bromide:", error);
      } else {
        fetchBromides();
        closeModal();
      }
    } else {
      const { error } = await supabase.from("bromides").insert([formData]);

      if (error) {
        console.error("Error creating bromide:", error);
      } else {
        fetchBromides();
        closeModal();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このブロマイドを削除してもよろしいですか？")) return;

    const { error } = await supabase.from("bromides").delete().eq("id", id);

    if (error) {
      console.error("Error deleting bromide:", error);
    } else {
      fetchBromides();
    }
  };

  const openModal = (bromide?: Bromide) => {
    if (bromide) {
      setEditingBromide(bromide);
      setFormData({
        title: bromide.title,
        description: bromide.description || "",
        image_url: bromide.image_url,
        serial_number: bromide.serial_number || "",
      });
    } else {
      setEditingBromide(null);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        serial_number: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBromide(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      serial_number: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            ブロマイド管理
          </h1>
          <p className="text-gray-600">電子ブロマイドの作成・編集・削除</p>
        </div>
        <Button onClick={() => openModal()} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          新規作成
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && bromides.length === 0 &&
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={`skeleton-${i}`} className="overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full rounded-none" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/3 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </CardContent>
            </Card>
          ))}

        {bromides.map((bromide, index) => (
          <motion.div
            key={bromide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image
                  src={bromide.image_url}
                  alt={bromide.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{bromide.title}</CardTitle>
                {bromide.serial_number && (
                  <CardDescription>No. {bromide.serial_number}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {bromide.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {bromide.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(bromide)}
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    編集
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(bromide.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {!isLoading && bromides.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-medium">ブロマイドがまだありません</p>
              <p className="text-sm mt-2">「新規作成」ボタンから最初のブロマイドを作成しましょう</p>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBromide ? "ブロマイドを編集" : "新しいブロマイドを作成"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像
            </label>
            <ImageUpload
              value={formData.image_url}
              onChange={(value) =>
                setFormData({ ...formData, image_url: value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="電子ブロマイドのタイトル"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              シリアルナンバー
            </label>
            <Input
              value={formData.serial_number}
              onChange={(e) =>
                setFormData({ ...formData, serial_number: e.target.value })
              }
              placeholder="例: 001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="ブロマイドの説明を入力してください"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" className="flex-1" disabled={!formData.image_url || !formData.title}>
              {editingBromide ? "更新" : "作成"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

