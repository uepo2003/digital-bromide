"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Lock, Download, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { verifyPassword } from "@/lib/utils";
import { Bromide, User, UserBromide } from "@/types";
import Image from "next/image";
import { motion } from "framer-motion";

interface BromideData {
  user_bromide: UserBromide;
  bromide: Bromide;
  user: User;
}

export default function ReceiveBromidePage() {
  const params = useParams();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bromideData, setBromideData] = useState<BromideData | null>(null);

  useEffect(() => {
    fetchBromideData();
  }, [token]);

  const fetchBromideData = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from("user_bromides")
      .select(`
        *,
        bromide:bromides (*),
        user:users (*)
      `)
      .eq("access_token", token)
      .single();

    if (error || !data) {
      setError("無効なリンクです");
      setIsLoading(false);
      return;
    }

    setBromideData({
      user_bromide: data as any,
      bromide: (data as any).bromide,
      user: (data as any).user,
    });
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bromideData) return;

    const isValid = await verifyPassword(password, bromideData.user.password_hash);

    if (isValid) {
      setIsAuthenticated(true);
      
      // アクセス記録を更新
      if (!bromideData.user_bromide.is_accessed) {
        await supabase
          .from("user_bromides")
          .update({
            is_accessed: true,
            accessed_at: new Date().toISOString(),
          })
          .eq("id", bromideData.user_bromide.id);
      }
    } else {
      setError("パスワードが正しくありません");
    }
  };

  const handleDownload = () => {
    if (!bromideData) return;

    const link = document.createElement("a");
    link.href = bromideData.bromide.image_url;
    link.download = `${bromideData.bromide.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bromideData) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-4 bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-slate-700" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">電子ブロマイド</CardTitle>
                <CardDescription className="text-base">
                  {bromideData.user.name} 様
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">あなた専用のブロマイド</p>
                  <p className="text-xl font-bold text-gray-900">
                    {bromideData.bromide.title}
                  </p>
                  {bromideData.bromide.serial_number && (
                    <p className="text-sm text-gray-600 mt-1">
                      No. {bromideData.bromide.serial_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="パスワードを入力してください"
                      className="pl-12"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mt-2">{error}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  ブロマイドを受け取る
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-4"
          >
            <Check className="w-6 h-6" />
            <span className="font-semibold">認証成功！</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            {bromideData.bromide.title}
          </h1>
          <p className="text-gray-600 text-lg">{bromideData.user.name} 様専用</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden shadow-2xl">
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image
                  src={bromideData.bromide.image_url}
                  alt={bromideData.bromide.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>ブロマイド詳細</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bromideData.bromide.serial_number && (
                  <div>
                    <p className="text-sm text-gray-600">シリアルナンバー</p>
                    <p className="text-2xl font-bold text-slate-700">
                      No. {bromideData.bromide.serial_number}
                    </p>
                  </div>
                )}

                {bromideData.bromide.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">説明</p>
                    <p className="text-gray-900">{bromideData.bromide.description}</p>
                  </div>
                )}

                <div className="pt-4">
                  <Button onClick={handleDownload} size="lg" className="w-full">
                    <Download className="w-5 h-5 mr-2" />
                    画像をダウンロード
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">
                      ご支援ありがとうございます！
                    </p>
                    <p className="text-sm text-gray-700">
                      この電子ブロマイドは、ご購入いただいた商品として
                      {bromideData.user.name}様専用に発行されました。
                      ご支援いただいた方は、2026年6月6日の「みらい世界アート展」に
                      当日入場無料でご参加いただけます。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

