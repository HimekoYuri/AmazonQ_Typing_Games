class TypingGame {
    constructor() {
        this.score = 100;
        this.timeLeft = 60;
        this.mistakes = 0;
        this.completedWords = 0;
        this.isGameActive = false;
        this.currentTextIndex = 0;
        this.timer = null;
        this.lastCheckedLength = 0; // 最後にチェックした文字数を追跡
        this.isComposing = false; // 日本語入力中フラグ
        this.lastTextIndex = -1; // 前回のワードのインデックスを記録
        
        // タイピング用のテキスト配列（大幅に追加！）
        this.texts = [
            // 基本的な挨拶・日常
            "こんにちは", "おはよう", "こんばんは", "ありがとう", "すみません",
            "おつかれさま", "よろしく", "がんばって", "おめでとう", "さようなら",
            
            // 技術・プログラミング関連
            "プログラミング", "JavaScript", "Python", "HTML", "CSS",
            "データベース", "アルゴリズム", "フレームワーク", "ライブラリ", "デバッグ",
            "コンパイル", "インターフェース", "オブジェクト", "クラス", "メソッド",
            
            // AWS・クラウド関連
            "Amazon", "クラウド", "サーバー", "ストレージ", "データベース",
            "セキュリティ", "ネットワーク", "インフラ", "デプロイ", "スケーリング",
            "モニタリング", "バックアップ", "レプリケーション", "ロードバランサー",
            
            // コンピュータ・IT関連
            "コンピュータ", "キーボード", "マウス", "モニター", "プロセッサ",
            "メモリ", "ハードディスク", "ソフトウェア", "ハードウェア", "オペレーティング",
            "ブラウザ", "インターネット", "ウェブサイト", "アプリケーション",
            
            // ゲーム・エンターテイメント
            "タイピング", "ゲーム", "スピード", "正確性", "練習",
            "上達", "集中", "チャレンジ", "レベルアップ", "スコア",
            "ランキング", "コンボ", "パーフェクト", "クリア",
            
            // 学習・教育関連
            "勉強", "学習", "教育", "知識", "スキル",
            "成長", "向上", "習得", "理解", "記憶",
            "復習", "予習", "試験", "資格", "認定",
            
            // ビジネス・仕事関連
            "ビジネス", "プロジェクト", "チーム", "会議", "プレゼンテーション",
            "マネジメント", "リーダーシップ", "コミュニケーション", "効率", "生産性",
            "品質", "改善", "イノベーション", "戦略", "計画",
            
            // 日本の文化・季節
            "春", "夏", "秋", "冬", "桜", "紅葉", "雪", "祭り",
            "文化", "伝統", "歴史", "芸術", "音楽", "映画",
            
            // 食べ物・料理
            "料理", "レシピ", "食材", "調味料", "美味しい",
            "栄養", "健康", "バランス", "食事", "グルメ",
            
            // 自然・環境
            "自然", "環境", "地球", "海", "山", "森",
            "動物", "植物", "花", "鳥", "魚", "昆虫",
            
            // 感情・気持ち
            "嬉しい", "楽しい", "悲しい", "怒り", "驚き",
            "感動", "興奮", "リラックス", "安心", "満足"
        ];
        
        this.lastTextIndex = -1; // 前回のワードのインデックスを記録
        
        this.currentText = "";
        this.userInput = "";
        
        // 難易度別のワード分類
        this.easyTexts = [
            "こんにちは", "おはよう", "ありがとう", "すみません", "がんばって",
            "春", "夏", "秋", "冬", "桜", "雪", "海", "山", "花", "鳥",
            "嬉しい", "楽しい", "美味しい", "元気", "笑顔"
        ];
        
        this.mediumTexts = [
            "プログラミング", "JavaScript", "タイピング", "ゲーム", "コンピュータ",
            "キーボード", "スピード", "正確性", "練習", "上達", "集中",
            "料理", "レシピ", "音楽", "映画", "読書", "旅行", "写真"
        ];
        
        this.hardTexts = [
            "アルゴリズム", "フレームワーク", "ライブラリ", "インターフェース", "オブジェクト",
            "データベース", "セキュリティ", "ネットワーク", "インフラ", "デプロイ",
            "スケーリング", "モニタリング", "レプリケーション", "ロードバランサー",
            "プレゼンテーション", "マネジメント", "コミュニケーション", "イノベーション"
        ];
        
        this.initializeElements();
        this.bindEvents();
        this.loadRandomText();
    }
    
    initializeElements() {
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.mistakesElement = document.getElementById('mistakes');
        this.textDisplayElement = document.getElementById('textDisplay');
        this.currentTextElement = document.getElementById('currentText');
        this.textInputElement = document.getElementById('textInput');
        this.startBtnElement = document.getElementById('startBtn');
        this.resetBtnElement = document.getElementById('resetBtn');
        this.resultsElement = document.getElementById('results');
        this.finalScoreElement = document.getElementById('finalScore');
        this.completedWordsElement = document.getElementById('completedWords');
        this.totalMistakesElement = document.getElementById('totalMistakes');
        this.playAgainBtnElement = document.getElementById('playAgainBtn');
    }
    
    bindEvents() {
        this.startBtnElement.addEventListener('click', () => this.startGame());
        this.resetBtnElement.addEventListener('click', () => this.resetGame());
        this.playAgainBtnElement.addEventListener('click', () => this.resetGame());
        this.textInputElement.addEventListener('input', (e) => this.handleInput(e));
        this.textInputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // 日本語入力対応
        this.textInputElement.addEventListener('compositionstart', () => {
            this.isComposing = true;
        });
        
        this.textInputElement.addEventListener('compositionend', () => {
            this.isComposing = false;
            // 変換確定後に再度チェック
            setTimeout(() => {
                if (this.isGameActive) {
                    this.checkForMistakes(this.textInputElement.value);
                    this.updateTextDisplay();
                }
            }, 0);
        });
    }
    
    loadRandomText() {
        // 現在選択されている難易度に応じてワードリストを選択
        let currentTexts = this.texts; // デフォルトは全ワード
        
        // 難易度選択要素があれば、それに応じてワードを選択
        const difficultySelect = document.getElementById('difficulty');
        if (difficultySelect) {
            const difficulty = difficultySelect.value;
            switch(difficulty) {
                case 'easy':
                    currentTexts = this.easyTexts;
                    break;
                case 'medium':
                    currentTexts = this.mediumTexts;
                    break;
                case 'hard':
                    currentTexts = this.hardTexts;
                    break;
                default:
                    // ランダムに全ワードから選択（ミックスモード）
                    const allTexts = [...this.easyTexts, ...this.mediumTexts, ...this.hardTexts];
                    currentTexts = allTexts;
            }
        }
        
        let randomIndex;
        let attempts = 0;
        const maxAttempts = 10; // 無限ループ防止
        
        // 前回と同じワードが出ないようにする
        do {
            randomIndex = Math.floor(Math.random() * currentTexts.length);
            attempts++;
        } while (randomIndex === this.lastTextIndex && attempts < maxAttempts && currentTexts.length > 1);
        
        // さらにランダム性を高めるため、連続する3つのワードも避ける
        if (this.recentTexts && this.recentTexts.length >= 2 && currentTexts.length > 3) {
            let currentWord = currentTexts[randomIndex];
            let isRecent = this.recentTexts.includes(currentWord);
            let retryCount = 0;
            
            while (isRecent && retryCount < 20) {
                randomIndex = Math.floor(Math.random() * currentTexts.length);
                currentWord = currentTexts[randomIndex];
                isRecent = this.recentTexts.includes(currentWord);
                retryCount++;
            }
        }
        
        // 最近使ったワードを記録（最大3つまで）
        if (!this.recentTexts) {
            this.recentTexts = [];
        }
        
        const selectedWord = currentTexts[randomIndex];
        this.recentTexts.push(selectedWord);
        if (this.recentTexts.length > 3) {
            this.recentTexts.shift(); // 古いものを削除
        }
        
        this.lastTextIndex = randomIndex;
        this.currentText = selectedWord;
        this.lastCheckedLength = 0; // 新しい文字が表示されるときにリセット
        this.updateTextDisplay();
    }
    
    updateTextDisplay() {
        if (!this.isGameActive) {
            this.currentTextElement.textContent = this.currentText;
            return;
        }
        
        let displayHTML = '';
        const userInput = this.textInputElement.value;
        
        for (let i = 0; i < this.currentText.length; i++) {
            const char = this.currentText[i];
            
            if (i < userInput.length) {
                if (userInput[i] === char) {
                    displayHTML += `<span class="correct">${char}</span>`;
                } else {
                    displayHTML += `<span class="incorrect">${char}</span>`;
                }
            } else if (i === userInput.length) {
                displayHTML += `<span class="current">${char}</span>`;
            } else {
                displayHTML += char;
            }
        }
        
        this.currentTextElement.innerHTML = displayHTML;
    }
    
    handleInput(e) {
        if (!this.isGameActive) return;
        
        // 日本語入力中は処理をスキップ
        if (this.isComposing) return;
        
        const userInput = e.target.value;
        
        // 文字が完了した場合（自動で次へ）
        if (userInput === this.currentText) {
            this.score += 50;
            this.completedWords++;
            this.updateScore();
            
            // 完了時の視覚効果
            this.textDisplayElement.classList.add('completed');
            
            // 少し遅延を入れてから次の問題へ（視覚的フィードバック）
            setTimeout(() => {
                this.textDisplayElement.classList.remove('completed');
                this.loadRandomText();
                this.textInputElement.value = '';
                this.textInputElement.focus(); // フォーカスを維持
            }, 300);
            return;
        }
        
        // 入力が長すぎる場合は制限
        if (userInput.length > this.currentText.length) {
            e.target.value = userInput.slice(0, this.currentText.length);
            return;
        }
        
        // ミスチェック（確定した文字のみ）
        this.checkForMistakes(userInput);
        this.updateTextDisplay();
    }
    
    checkForMistakes(userInput) {
        // 前回の入力と比較して、新しく確定した文字のみをチェック
        if (userInput.length > this.lastCheckedLength) {
            for (let i = this.lastCheckedLength; i < userInput.length; i++) {
                if (userInput[i] !== this.currentText[i]) {
                    this.mistakes++;
                    this.score = Math.max(0, this.score - 10);
                    this.updateScore();
                    this.updateMistakes();
                }
            }
        }
        this.lastCheckedLength = userInput.length;
    }
    
    handleKeyDown(e) {
        if (!this.isGameActive) return;
        
        // IME入力中は処理しない（日本語変換中）
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        
        // エンターキーが押された場合の処理
        if (e.key === 'Enter') {
            const userInput = this.textInputElement.value;
            
            // 入力が正解と一致する場合、次の問題へ
            if (userInput === this.currentText) {
                this.score += 50;
                this.completedWords++;
                this.updateScore();
                
                // 完了時の視覚効果
                this.textDisplayElement.classList.add('completed');
                
                setTimeout(() => {
                    this.textDisplayElement.classList.remove('completed');
                    this.loadRandomText();
                    this.textInputElement.value = '';
                    this.textInputElement.focus();
                }, 300);
                
                e.preventDefault(); // デフォルトのエンター動作を防ぐ
                return;
            }
            
            // 不正解の場合はミス扱い
            if (userInput.length > 0) {
                this.mistakes++;
                this.score = Math.max(0, this.score - 10);
                this.updateScore();
                this.updateMistakes();
                // 入力をクリアして次の問題へ
                this.loadRandomText();
                this.textInputElement.value = '';
                e.preventDefault();
                return;
            }
        }
        
        // バックスペースの場合は処理しない
        if (e.key === 'Backspace') {
            // バックスペース時は最後にチェックした長さを調整
            const userInput = this.textInputElement.value;
            this.lastCheckedLength = Math.min(this.lastCheckedLength, userInput.length);
            return;
        }
    }
    
    startGame() {
        this.isGameActive = true;
        this.textInputElement.disabled = false;
        this.textInputElement.focus();
        this.startBtnElement.disabled = true;
        this.resultsElement.style.display = 'none';
        
        this.loadRandomText();
        this.startTimer();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    endGame() {
        this.isGameActive = false;
        this.textInputElement.disabled = true;
        this.startBtnElement.disabled = false;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.showResults();
    }
    
    showResults() {
        this.finalScoreElement.textContent = this.score;
        this.completedWordsElement.textContent = this.completedWords;
        this.totalMistakesElement.textContent = this.mistakes;
        this.resultsElement.style.display = 'block';
        
        // 結果に応じたメッセージ
        const resultTitle = this.resultsElement.querySelector('h2');
        if (this.score >= 80) {
            resultTitle.textContent = '🎉 素晴らしい！';
        } else if (this.score >= 50) {
            resultTitle.textContent = '👍 よくできました！';
        } else {
            resultTitle.textContent = '💪 次回頑張りましょう！';
        }
    }
    
    resetGame() {
        this.score = 100;
        this.timeLeft = 60;
        this.mistakes = 0;
        this.completedWords = 0;
        this.isGameActive = false;
        this.lastCheckedLength = 0; // リセット時に初期化
        this.lastTextIndex = -1; // 前回のワードインデックスもリセット
        this.recentTexts = []; // 最近のワード履歴もリセット
        this.textInputElement.value = '';
        this.textInputElement.disabled = true;
        this.startBtnElement.disabled = false;
        this.resultsElement.style.display = 'none';
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.updateScore();
        this.updateTimer();
        this.updateMistakes();
        this.loadRandomText();
        
        this.currentTextElement.textContent = 'ゲームを開始してください';
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        
        // スコアに応じて色を変更
        if (this.score >= 80) {
            this.scoreElement.style.color = '#38a169';
        } else if (this.score >= 50) {
            this.scoreElement.style.color = '#d69e2e';
        } else {
            this.scoreElement.style.color = '#e53e3e';
        }
    }
    
    updateTimer() {
        this.timerElement.textContent = this.timeLeft;
        
        // 時間に応じて色を変更
        if (this.timeLeft > 30) {
            this.timerElement.style.color = '#38a169';
        } else if (this.timeLeft > 10) {
            this.timerElement.style.color = '#d69e2e';
        } else {
            this.timerElement.style.color = '#e53e3e';
        }
    }
    
    updateMistakes() {
        this.mistakesElement.textContent = this.mistakes;
    }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    new TypingGame();
});

// チャットログ保存機能
function saveToLog(message) {
    // ブラウザ環境では直接ファイル保存はできないため、
    // 実際の実装ではサーバーサイドAPIを使用する必要があります
    console.log('Log:', message);
}
