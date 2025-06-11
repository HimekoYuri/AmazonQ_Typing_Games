# AmazonQ_Typing_Games 🎮

AmazonQが作った楽しいタイピングゲームです！

## 🎯 ゲーム仕様

- **持ち点**: 100点でスタート
- **制限時間**: 60秒
- **打鍵ミス**: 1回につき10点減点
- **文字完了**: 1つの単語を完了すると50点獲得
- **目標**: 制限時間内にできるだけ高いスコアを目指そう！

## 🚀 ローカル実行

```bash
# ブラウザでindex.htmlを開くだけ！
open index.html
```

## ☁️ AWS展開

### 前提条件
- AWS CLI がインストール済み
- AWS認証情報が設定済み
- 適切なIAM権限（S3, CloudFront, CloudFormation）

### デプロイ手順

```bash
# 1. デプロイスクリプトを実行
./deploy.sh

# 2. 数分待ってからゲームURLにアクセス
# URLはデプロイ完了時に表示されます
```

### 手動デプロイ

```bash
# CloudFormationスタックをデプロイ
aws cloudformation deploy \
    --template-file cloudformation.yaml \
    --stack-name amazonq-typing-game \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ap-northeast-1

# ファイルをS3にアップロード
aws s3 sync . s3://your-bucket-name --exclude "*.git*" --exclude "*.yaml" --exclude "*.sh"
```

## 📁 ファイル構成

```
amazonQ_game/
├── index.html          # メインHTMLファイル
├── style.css           # スタイルシート
├── script.js           # ゲームロジック
├── cloudformation.yaml # AWS インフラ定義
├── deploy.sh           # デプロイスクリプト
├── log/
│   └── q_chat.log     # チャットログ
└── README.md          # このファイル
```

## 🎨 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **インフラ**: AWS S3, CloudFront
- **デプロイ**: CloudFormation, AWS CLI

## 🎮 遊び方

1. 「ゲーム開始」ボタンをクリック
2. 表示された文字を正確にタイピング
3. 文字を完了すると新しい文字が表示される
4. 60秒間でできるだけ高いスコアを目指そう！

## 📊 スコアリング

- 開始時: 100点
- 文字完了: +50点
- 打鍵ミス: -10点
- 最終スコア = 100 + (完了数 × 50) - (ミス数 × 10)

頑張って高スコアを目指してね〜✨
