"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Send, Copy, Eye, EyeOff, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { User, Bromide, UserBromide } from "@/types";
import { generateAccessToken, hashPassword, generatePassword } from "@/lib/utils";
import { motion } from "framer-motion";

interface UserWithBromides extends User {
  user_bromides?: (UserBromide & { bromide: Bromide })[];
}

const USERS_CACHE_KEY = "admin:users:cache";
const BROMIDES_CACHE_KEY = "admin:bromides:cache";

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(key);
    return cached ? (JSON.parse(cached) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithBromides[]>(
    () => readCache<UserWithBromides[]>(USERS_CACHE_KEY) ?? []
  );
  const [bromides, setBromides] = useState<Bromide[]>(
    () => readCache<Bromide[]>(BROMIDES_CACHE_KEY) ?? []
  );
  const [isLoading, setIsLoading] = useState(
    () => !readCache<UserWithBromides[]>(USERS_CACHE_KEY)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithBromides | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedBromideId, setSelectedBromideId] = useState("");

  useEffect(() => {
    void Promise.all([fetchUsers(), fetchBromides()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        user_bromides (
          *,
          bromide:bromides (*)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      const list = (data || []) as UserWithBromides[];
      setUsers(list);
      writeCache(USERS_CACHE_KEY, list);
    }
  };

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
      writeCache(BROMIDES_CACHE_KEY, list);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hashedPassword = await hashPassword(formData.password);

    const { error } = await supabase.from("users").insert([
      {
        name: formData.name,
        email: formData.email,
        password_hash: hashedPassword,
      },
    ]);

    if (error) {
      console.error("Error creating user:", error);
      alert("ユーザーの作成に失敗しました: " + error.message);
    } else {
      fetchUsers();
      closeModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このユーザーを削除してもよろしいですか？")) return;

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
    } else {
      fetchUsers();
    }
  };

  const handleAssignBromide = async () => {
    if (!selectedUser || !selectedBromideId) return;

    const accessToken = generateAccessToken();

    const { error } = await supabase.from("user_bromides").insert([
      {
        user_id: selectedUser.id,
        bromide_id: selectedBromideId,
        access_token: accessToken,
      },
    ]);

    if (error) {
      console.error("Error assigning bromide:", error);
      alert("ブロマイドの割り当てに失敗しました: " + error.message);
    } else {
      fetchUsers();
      setIsAssignModalOpen(false);
      setSelectedBromideId("");
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData({ ...formData, password: newPassword });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("コピーしました！");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const openModal = () => {
    setFormData({
      name: "",
      email: "",
      password: generatePassword(),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    setShowPassword(false);
  };

  const openAssignModal = (user: UserWithBromides) => {
    setSelectedUser(user);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            ユーザー管理
          </h1>
          <p className="text-gray-600">ユーザーの作成とブロマイドの配布</p>
        </div>
        <Button onClick={openModal} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          新規ユーザー
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading && users.length === 0 &&
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </CardContent>
            </Card>
          ))}

        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    割り当てられたブロマイド ({user.user_bromides?.length || 0})
                  </p>
                  {user.user_bromides && user.user_bromides.length > 0 ? (
                    <div className="space-y-2">
                      {user.user_bromides.map((ub) => (
                        <div
                          key={ub.id}
                          className="bg-gray-50 rounded-lg p-3 space-y-2"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {ub.bromide.title}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Input
                                value={`${window.location.origin}/receive/${ub.access_token}`}
                                readOnly
                                className="text-xs h-8"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    `${window.location.origin}/receive/${ub.access_token}`
                                  )
                                }
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            {ub.is_accessed && (
                              <p className="text-xs text-green-600">
                                ✓ アクセス済み
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      まだ割り当てられていません
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAssignModal(user)}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    ブロマイド割当
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {!isLoading && users.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-medium">ユーザーがまだいません</p>
              <p className="text-sm mt-2">
                「新規ユーザー」ボタンから最初のユーザーを作成しましょう
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ユーザー作成モーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="新しいユーザーを作成"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名前
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ユーザーの名前"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="パスワード"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGeneratePassword}
                >
                  <Key className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                このパスワードをユーザーに送信してください
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" className="flex-1">
              作成
            </Button>
          </div>
        </form>
      </Modal>

      {/* ブロマイド割り当てモーダル */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="ブロマイドを割り当て"
      >
        <div className="space-y-6">
          {selectedUser && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">割り当て先ユーザー</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedUser.name}
              </p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ブロマイドを選択
            </label>
            <select
              value={selectedBromideId}
              onChange={(e) => setSelectedBromideId(e.target.value)}
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-base focus:border-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-100"
            >
              <option value="">ブロマイドを選択してください</option>
              {bromides.map((bromide) => (
                <option key={bromide.id} value={bromide.id}>
                  {bromide.title}
                  {bromide.serial_number && ` (No. ${bromide.serial_number})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAssignModalOpen(false)}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleAssignBromide}
              disabled={!selectedBromideId}
              className="flex-1"
            >
              割り当て
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

