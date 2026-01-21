#!/usr/bin/env node

/**
 * 環境変数チェックスクリプト
 * 開発を始める前に必要な環境変数が設定されているか確認します
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '..', '.env.local');
const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

console.log('🔍 環境変数をチェック中...\n');

// .env.localファイルが存在するかチェック
if (!fs.existsSync(ENV_FILE)) {
  console.error('❌ .env.localファイルが見つかりません');
  console.log('\n次のコマンドを実行してファイルを作成してください:');
  console.log('  cp .env.example .env.local\n');
  console.log('その後、ファイルを編集してSupabaseの情報を設定してください。');
  console.log('詳細はSETUP.mdを参照してください。\n');
  process.exit(1);
}

// .env.localファイルを読み込み
const envContent = fs.readFileSync(ENV_FILE, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.+)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

// 必須の環境変数をチェック
let allValid = true;

REQUIRED_VARS.forEach(varName => {
  const value = envVars[varName];
  
  if (!value || value === `your-${varName.toLowerCase().replace('next_public_supabase_', '')}`) {
    console.error(`❌ ${varName} が設定されていません`);
    allValid = false;
  } else {
    console.log(`✅ ${varName} が設定されています`);
  }
});

console.log('');

if (!allValid) {
  console.error('❌ 環境変数の設定が不完全です\n');
  console.log('次の手順で設定してください:');
  console.log('1. Supabaseでプロジェクトを作成');
  console.log('2. Project Settings > API から以下を取得:');
  console.log('   - Project URL');
  console.log('   - anon public key');
  console.log('3. .env.localファイルに設定\n');
  console.log('詳細はSETUP.mdを参照してください。\n');
  process.exit(1);
} else {
  console.log('✅ すべての環境変数が設定されています！');
  console.log('\n次のコマンドで開発サーバーを起動できます:');
  console.log('  npm run dev\n');
  process.exit(0);
}

