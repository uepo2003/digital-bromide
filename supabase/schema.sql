-- 電子ブロマイドテーブル
CREATE TABLE IF NOT EXISTS bromides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  serial_number VARCHAR(50) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザー・ブロマイド紐付けテーブル
CREATE TABLE IF NOT EXISTS user_bromides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bromide_id UUID REFERENCES bromides(id) ON DELETE CASCADE,
  access_token VARCHAR(255) UNIQUE NOT NULL,
  is_accessed BOOLEAN DEFAULT FALSE,
  accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bromide_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_bromides_access_token ON user_bromides(access_token);
CREATE INDEX IF NOT EXISTS idx_user_bromides_user_id ON user_bromides(user_id);
CREATE INDEX IF NOT EXISTS idx_bromides_serial_number ON bromides(serial_number);

-- RLS (Row Level Security) の有効化
ALTER TABLE bromides ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bromides ENABLE ROW LEVEL SECURITY;

-- 全てのユーザーが読み取り可能なポリシー（開発用）
CREATE POLICY "Enable read access for all users" ON bromides FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON user_bromides FOR SELECT USING (true);

-- 全てのユーザーが挿入・更新可能なポリシー（開発用）
CREATE POLICY "Enable insert for all users" ON bromides FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON bromides FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON bromides FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON users FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON user_bromides FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON user_bromides FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON user_bromides FOR DELETE USING (true);

-- ストレージバケットの作成（Supabase Storageで画像を保存）
-- これはSupabase UIで手動で作成する必要があります
-- バケット名: bromide-images
-- Public: true

