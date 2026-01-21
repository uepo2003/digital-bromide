# トラブルシューティング

## よくある問題と解決方法

### 環境変数関連

#### エラー: `supabaseUrl` is required
**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. `.env.local`ファイルが存在するか確認
2. ファイルに以下の内容が含まれているか確認：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. 開発サーバーを再起動：
```bash
npm run dev
```

### データベース関連

#### エラー: `relation "bromides" does not exist`
**原因**: データベーススキーマが実行されていない

**解決方法**:
1. Supabaseダッシュボードにログイン
2. 左サイドバーの「SQL Editor」を開く
3. `supabase/schema.sql`の内容をコピー&ペースト
4. 「Run」をクリック

#### エラー: `duplicate key value violates unique constraint`
**原因**: 既に同じメールアドレスやシリアルナンバーが存在する

**解決方法**:
- ユーザー作成時: 異なるメールアドレスを使用
- ブロマイド作成時: 異なるシリアルナンバーを使用（または空欄）

### 画像アップロード関連

#### 画像が表示されない
**原因**: Next.jsの画像最適化設定の問題

**解決方法**:
1. `next.config.ts`に以下が含まれているか確認：
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```
2. 開発サーバーを再起動

#### 画像アップロードが遅い
**原因**: Base64エンコードによるデータサイズの増加

**解決方法**:
- 本番環境ではSupabase Storageを使用
- 画像を事前に圧縮（推奨: 1MB以下）

### 認証関連

#### パスワード認証が失敗する
**原因**: パスワードの入力ミス、またはデータベースの問題

**解決方法**:
1. パスワードが正確に入力されているか確認（大文字小文字を区別）
2. ユーザーテーブルにデータが正しく保存されているか確認：
```sql
SELECT id, name, email FROM users;
```
3. 新しいユーザーを作成して再テスト

#### アクセストークンが無効
**原因**: トークンが存在しない、または削除された

**解決方法**:
1. user_bromidesテーブルを確認：
```sql
SELECT * FROM user_bromides WHERE access_token = 'your-token';
```
2. ユーザーに新しいブロマイドを割り当てる

### ビルド・デプロイ関連

#### Vercelでのビルドエラー
**原因**: 環境変数が設定されていない

**解決方法**:
1. Vercelのプロジェクト設定を開く
2. 「Settings」→「Environment Variables」
3. 以下を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 再デプロイ

#### 本番環境で画像が表示されない
**原因**: 画像URLのプロトコル、またはCORS設定

**解決方法**:
1. Base64エンコードされた画像を使用している場合は問題なし
2. 外部URLを使用している場合：
   - `next.config.ts`の`remotePatterns`を確認
   - Supabase Storageを使用する場合、バケットがPublicか確認

### パフォーマンス関連

#### ページの読み込みが遅い
**原因**: 大量のデータ、または最適化されていない画像

**解決方法**:
1. ページネーションを実装
2. 画像を圧縮
3. Supabaseのクエリを最適化：
```typescript
// 必要なフィールドのみ取得
.select('id, title, image_url')
// 制限を設定
.limit(20)
```

#### アニメーションがカクつく
**原因**: ブラウザのパフォーマンス、または大量の要素

**解決方法**:
1. アニメーションのdelayを調整
2. 一度に表示する要素を制限
3. `will-change` CSSプロパティを使用

## デバッグ方法

### ブラウザコンソールの確認
1. F12キーを押す
2. 「Console」タブを開く
3. エラーメッセージを確認

### Supabaseログの確認
1. Supabaseダッシュボードにログイン
2. 「SQL Editor」→「Logs」
3. エラーログを確認

### ネットワークリクエストの確認
1. F12キーを押す
2. 「Network」タブを開く
3. APIリクエストのステータスを確認

## サポート

上記で解決しない場合：

1. **GitHubリポジトリ**: Issuesを作成
2. **Supabaseコミュニティ**: [Discord](https://discord.supabase.com/)
3. **Next.jsドキュメント**: [公式ドキュメント](https://nextjs.org/docs)

## 診断チェックリスト

問題を報告する際は、以下を確認してください：

- [ ] `.env.local`ファイルが正しく設定されている
- [ ] データベーススキーマが実行されている
- [ ] Supabase Storageバケットが作成されている
- [ ] Node.jsのバージョン（推奨: 18以上）
- [ ] npm/yarnのバージョン
- [ ] ブラウザのコンソールエラー
- [ ] ネットワークエラー（403, 404, 500など）
- [ ] 開発環境 or 本番環境

