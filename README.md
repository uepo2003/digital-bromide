# 電子ブロマイド配布システム

クラウドファンディングの返礼品として配る電子ブロマイドを管理・配布するシステムです。

![Electric Bromide System](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ 機能

- 📸 **ブロマイド作成**: 画像アップロードで簡単に電子ブロマイドを作成
- 👥 **ユーザー管理**: ユーザーの作成・管理
- 🔗 **リンク生成**: ユーザーごとに受け取り専用リンクを発行
- 🔒 **パスワード保護**: セキュアなパスワード認証
- 🎨 **おしゃれなUI**: モダンで使いやすいデザイン
- 📱 **レスポンシブ**: スマホ・タブレット・PCに対応
- ⚡ **高速**: Next.js 16とSupabaseによる高速なパフォーマンス

## 🚀 クイックスタート

詳細なセットアップ手順は [SETUP.md](./SETUP.md) をご覧ください。

### 1. 依存パッケージのインストール
```bash
npm install
```

### 2. 環境変数の設定
```bash
# .env.localファイルを作成し、Supabaseの情報を設定
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. データベースのセットアップ
Supabaseのダッシュボードで`supabase/schema.sql`を実行

### 4. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションが `http://localhost:3000` で起動します。

## 📋 使い方

### 管理画面
- **ブロマイド管理**: `/admin` - ブロマイドの作成・編集・削除
- **ユーザー管理**: `/admin/users` - ユーザーの作成とブロマイドの割り当て

### ユーザー向け画面
- **受け取り画面**: `/receive/[token]` - パスワード認証後にブロマイドを受け取り

## 🗄️ データベース構造

### bromides テーブル
電子ブロマイドの情報を管理
- `id`: UUID (主キー)
- `title`: タイトル
- `description`: 説明
- `image_url`: 画像URL
- `serial_number`: シリアルナンバー

### users テーブル
ブロマイド受取ユーザーの情報を管理
- `id`: UUID (主キー)
- `name`: 名前
- `email`: メールアドレス
- `password_hash`: パスワードハッシュ

### user_bromides テーブル
ユーザーとブロマイドの紐付けを管理
- `id`: UUID (主キー)
- `user_id`: ユーザーID
- `bromide_id`: ブロマイドID
- `access_token`: アクセストークン
- `is_accessed`: アクセス済みフラグ
- `accessed_at`: アクセス日時

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React
- **データベース**: Supabase (PostgreSQL)
- **認証**: bcryptjs
- **言語**: TypeScript

## 📦 デプロイ

### Vercelへのデプロイ（推奨）

1. GitHubにリポジトリをプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

詳細は [SETUP.md](./SETUP.md) の「本番環境へのデプロイ」セクションをご覧ください。

## 🎨 デザインの特徴

- **グラデーション**: 紫からピンクへの美しいグラデーション
- **アニメーション**: Framer Motionによる滑らかなアニメーション
- **レスポンシブ**: 全デバイスで最適な表示
- **アクセシビリティ**: キーボード操作とスクリーンリーダーに対応

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。
