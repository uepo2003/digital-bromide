# セットアップガイド

このガイドでは、電子ブロマイド配布システムのセットアップ手順を説明します。

## 1. Supabaseプロジェクトの作成

### 1.1 Supabaseアカウントの作成
1. [Supabase](https://supabase.com)にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ

### 1.2 新しいプロジェクトの作成
1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：
   - Project name: `digital-bromide`（任意の名前）
   - Database Password: 強力なパスワードを設定（保存しておいてください）
   - Region: `Northeast Asia (Tokyo)`を選択
3. 「Create new project」をクリック
4. プロジェクトの準備が完了するまで待機（約2分）

### 1.3 APIキーの取得
1. 左サイドバーの「Project Settings」（歯車アイコン）をクリック
2. 「API」セクションを選択
3. 以下をコピー：
   - `Project URL`
   - `anon public` key

## 2. データベースのセットアップ

### 2.1 SQLエディタでスキーマを実行
1. 左サイドバーの「SQL Editor」をクリック
2. 「New Query」をクリック
3. `supabase/schema.sql`ファイルの内容をコピー&ペースト
4. 「Run」をクリックして実行

### 2.2 Storageバケットの作成
1. 左サイドバーの「Storage」をクリック
2. 「Create a new bucket」をクリック
3. Bucket name: `bromide-images`
4. 「Public bucket」をONにする
5. 「Create bucket」をクリック

## 3. 環境変数の設定

1. プロジェクトルートで`.env.local`ファイルを作成：
```bash
cp .env.example .env.local
```

2. `.env.local`を編集して、SupabaseのURLとキーを設定：
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**重要**: 上記の値を、手順1.3で取得した実際の値に置き換えてください。

## 4. アプリケーションの起動

### 4.1 依存パッケージのインストール
```bash
npm install
```

### 4.2 開発サーバーの起動
```bash
npm run dev
```

### 4.3 アプリケーションにアクセス
ブラウザで `http://localhost:3000` を開く

## 5. 使い方

### 5.1 ブロマイドの作成
1. `http://localhost:3000/admin`にアクセス
2. 「新規作成」ボタンをクリック
3. 画像をアップロード（ドラッグ&ドロップまたはクリック）
4. タイトル、シリアルナンバー、説明を入力
5. 「作成」ボタンをクリック

### 5.2 ユーザーの作成
1. `http://localhost:3000/admin/users`にアクセス
2. 「新規ユーザー」ボタンをクリック
3. 名前とメールアドレスを入力
4. パスワードが自動生成されます（鍵アイコンで再生成可能）
5. 「作成」ボタンをクリック
6. **重要**: 生成されたパスワードをメモして、ユーザーに送信してください

### 5.3 ブロマイドの割り当て
1. ユーザー管理画面で、対象ユーザーの「ブロマイド割当」ボタンをクリック
2. 割り当てるブロマイドを選択
3. 「割り当て」ボタンをクリック
4. 生成されたアクセスリンクをコピーして、ユーザーに送信

### 5.4 ユーザーがブロマイドを受け取る
1. ユーザーにアクセスリンクとパスワードを送信
2. ユーザーがリンクにアクセス
3. パスワードを入力
4. ブロマイドが表示され、ダウンロード可能になります

## 6. 本番環境へのデプロイ

### Vercelでのデプロイ（推奨）

1. [Vercel](https://vercel.com)にアクセスしてサインアップ
2. 「New Project」をクリック
3. GitHubリポジトリを接続
4. Environment Variablesに以下を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 「Deploy」をクリック

## トラブルシューティング

### データベース接続エラー
- `.env.local`ファイルが正しく設定されているか確認
- Supabaseプロジェクトが正常に起動しているか確認

### 画像がアップロードできない
- Supabase Storageの`bromide-images`バケットが作成されているか確認
- バケットがPublicに設定されているか確認

### パスワード認証が失敗する
- ユーザー作成時に生成されたパスワードをそのまま使用しているか確認
- 大文字小文字を正確に入力しているか確認

## サポート

問題が解決しない場合は、以下を確認してください：
- Supabaseのログ（SQL Editor > Logs）
- ブラウザのコンソール（F12キー）
- Next.jsのターミナル出力

