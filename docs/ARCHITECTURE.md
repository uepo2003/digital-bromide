# システムアーキテクチャ

## 概要

電子ブロマイド配布システムは、Next.js 16のApp Routerを使用したフルスタックアプリケーションです。

## ディレクトリ構造

```
digital-bromide/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理画面
│   │   ├── page.tsx       # ブロマイド管理
│   │   └── users/         
│   │       └── page.tsx   # ユーザー管理
│   ├── receive/           # ユーザー向け画面
│   │   └── [token]/
│   │       └── page.tsx   # ブロマイド受け取り
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ（リダイレクト）
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── ui/               # UIコンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── modal.tsx
│   │   └── image-upload.tsx
│   └── layout/           # レイアウトコンポーネント
│       └── navbar.tsx
├── lib/                  # ユーティリティ関数
│   ├── supabase.ts       # Supabaseクライアント
│   └── utils.ts          # ヘルパー関数
├── types/                # TypeScript型定義
│   └── index.ts
├── supabase/             # データベーススキーマ
│   └── schema.sql
└── docs/                 # ドキュメント
    └── ARCHITECTURE.md
```

## データフロー

### ブロマイド作成フロー
1. 管理者が画像をアップロード
2. Base64エンコードされた画像データをフォームに保存
3. Supabaseのbromidesテーブルに保存
4. 一覧画面に表示

### ユーザー作成・割り当てフロー
1. 管理者がユーザー情報を入力
2. パスワードが自動生成される
3. bcryptjsでパスワードをハッシュ化
4. Supabaseのusersテーブルに保存
5. ブロマイドを割り当てる際、ランダムなアクセストークンを生成
6. user_bromidesテーブルに関連付けを保存
7. アクセスリンクをコピーしてユーザーに送信

### ブロマイド受け取りフロー
1. ユーザーがアクセスリンクを開く
2. トークンからuser_bromides、bromides、usersを取得
3. パスワード入力画面を表示
4. 入力されたパスワードをbcryptjsで検証
5. 認証成功後、ブロマイドを表示
6. is_accessedフラグとaccessed_atを更新
7. ダウンロードボタンで画像を保存

## セキュリティ

### パスワード管理
- bcryptjsを使用したハッシュ化（salt rounds: 10）
- 平文パスワードは保存されない
- ユーザー作成時にランダムパスワードを生成

### アクセス制御
- 各ブロマイドに一意のアクセストークン（32文字）
- トークンとパスワードの両方が必要
- アクセス履歴を記録

### データベースセキュリティ
- Supabase Row Level Security (RLS)有効
- 開発環境では全アクセス許可（本番環境では調整が必要）

## パフォーマンス最適化

### 画像処理
- Next.js Image コンポーネントで自動最適化
- Base64エンコードでプレビュー表示
- 本番環境ではSupabase Storageの使用を推奨

### データ取得
- Supabaseクライアントサイドクエリ
- 必要なデータのみを取得
- リレーションデータを一度に取得

### UI/UX
- Framer Motionで滑らかなアニメーション
- レスポンシブデザインでモバイル対応
- ローディング状態の適切な表示

## 拡張性

### 将来の機能追加
- 管理者認証システム
- メール送信機能（リンクとパスワードの自動送信）
- 統計ダッシュボード
- バッチ処理（複数ユーザーへの一括割り当て）
- QRコード生成
- 有効期限設定

### スケーラビリティ
- Supabaseは自動スケーリング
- VercelでのCDN配信
- 静的生成の活用可能

## 技術スタック詳細

### フロントエンド
- **Next.js 16**: React フレームワーク
- **TypeScript**: 型安全性
- **Tailwind CSS**: ユーティリティファーストCSS
- **Framer Motion**: アニメーションライブラリ
- **Lucide React**: アイコンライブラリ

### バックエンド
- **Supabase**: BaaS（Backend as a Service）
  - PostgreSQL データベース
  - リアルタイムサブスクリプション
  - ストレージ
  - 認証（将来的に使用可能）

### セキュリティ
- **bcryptjs**: パスワードハッシュ化

### ユーティリティ
- **clsx + tailwind-merge**: クラス名の結合

