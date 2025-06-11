#!/bin/bash

# AmazonQ Typing Game Deployment Script
# このスクリプトでCloudFormationスタックをデプロイし、ファイルをS3にアップロードします

set -e

# 設定
STACK_NAME="amazonq-typing-game"
TEMPLATE_FILE="cloudformation.yaml"
REGION="ap-northeast-1"
ENVIRONMENT="dev"

# 色付きの出力用関数
print_info() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

# AWS CLIの確認
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI がインストールされていません"
    exit 1
fi

# AWS認証情報の確認
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS認証情報が設定されていません"
    exit 1
fi

print_info "🚀 AmazonQ Typing Game のデプロイを開始します..."

# CloudFormationスタックのデプロイ
print_info "📦 CloudFormationスタックをデプロイ中..."

aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --parameter-overrides Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

if [ $? -eq 0 ]; then
    print_success "CloudFormationスタックのデプロイが完了しました"
else
    print_error "CloudFormationスタックのデプロイに失敗しました"
    exit 1
fi

# スタック出力の取得
print_info "📋 スタック情報を取得中..."

BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
    --output text)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

GAME_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`GameURL`].OutputValue' \
    --output text)

print_info "S3バケット: $BUCKET_NAME"
print_info "CloudFront Distribution ID: $DISTRIBUTION_ID"

# ファイルをS3にアップロード
print_info "📤 ゲームファイルをS3にアップロード中..."

# HTMLファイル
aws s3 cp index.html s3://$BUCKET_NAME/ \
    --content-type "text/html" \
    --cache-control "max-age=300" \
    --region $REGION

# CSSファイル
aws s3 cp style.css s3://$BUCKET_NAME/ \
    --content-type "text/css" \
    --cache-control "max-age=86400" \
    --region $REGION

# JavaScriptファイル
aws s3 cp script.js s3://$BUCKET_NAME/ \
    --content-type "application/javascript" \
    --cache-control "max-age=86400" \
    --region $REGION

if [ $? -eq 0 ]; then
    print_success "ファイルのアップロードが完了しました"
else
    print_error "ファイルのアップロードに失敗しました"
    exit 1
fi

# CloudFrontキャッシュの無効化
print_info "🔄 CloudFrontキャッシュを無効化中..."

aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --region $REGION > /dev/null

if [ $? -eq 0 ]; then
    print_success "CloudFrontキャッシュの無効化が完了しました"
else
    print_warning "CloudFrontキャッシュの無効化に失敗しました（手動で実行してください）"
fi

# 完了メッセージ
print_success "🎉 デプロイが完了しました！"
print_info "ゲームURL: $GAME_URL"
print_info "数分後にアクセス可能になります（CloudFrontの配信開始まで時間がかかります）"

# ログに記録
echo "$(date): Deployment completed successfully. Game URL: $GAME_URL" >> deploy.log
