# 商談シミュレーション シナリオ自動生成ガイド

---

## 使い方ガイド（非エンジニア向け）

### このツールでできること
実際の商談録音・文字起こしから、練習用の分岐型シミュレーションゲームを自動生成します。

### 必要なもの
1. **商談の文字起こし**（音声→テキスト変換済み）
2. **商談の目的**（例：次回アポ獲得、見積もり依頼獲得）
3. **商材情報**（何を売る商談か）
4. **顧客情報**（部署名、役職など）

### 作業の流れ

```
① 文字起こし準備
      ↓
② AIに指示（Step 1-7を順番に実行）
      ↓
③ 出力されたコードを確認
      ↓
④ 動作確認・微調整
      ↓
⑤ デプロイ
```

### 所要時間の目安
- 文字起こし30分の商談 → 約2-3時間
- 文字起こし1時間の商談 → 約3-5時間

---

## Step 0: 事前準備

### 0-1. 文字起こしの品質チェック

以下を確認してください：

| チェック項目 | OK基準 |
|-------------|-------|
| 話者の区別 | 「営業:」「顧客:」など明確に区別されている |
| 句読点 | 文の区切りがわかる |
| 聞き取れない部分 | [不明]などでマーク済み |
| 固有名詞 | 会社名・商品名が正確 |

### 0-2. 目的の明確化

以下を埋めてください：

```
【商材名】
例：仕事と介護の両立支援サービス

【商談フェーズ】
例：初回商談、2回目商談、クロージング

【商談のゴール（最高の結果）】
例：上司同席の次回アポイント獲得

【顧客情報】
- 部署名：例）ダイバーシティ推進室
- 役職：例）担当者、課長、部長
- 業界：例）製造業、IT、金融

【この商談で学んでほしいこと】
例：課題を深掘りしてから提案に入る重要性
```

---

## Step 1: 文字起こし分析

### AIへの指示（そのままコピペ可）

```
あなたは営業研修の専門家です。
以下の商談文字起こしを分析し、シミュレーション教材を作成するための情報を抽出してください。

【分析してほしいこと】

1. 商談の流れを時系列で整理
   - 各発言を「顧客」「営業」で区別
   - 重要な転換点にマーク

2. 顧客の感情変化を追跡
   各発言時の感情を以下から選択：
   - neutral（普通）
   - thinking（考え中）
   - curious（興味あり）
   - worried（心配・困惑）
   - positive（前向き）
   - surprised（驚き）
   - hesitant（迷い）
   - cold（冷淡）
   - disappointed（がっかり）

3. 営業の発言を評価
   各発言を以下に分類：
   - 【良い】顧客の課題を深掘り/共感を示した/適切なタイミングで提案
   - 【悪い】早すぎる提案/顧客の話を遮った/押し売り感
   - 【普通】無難だが印象に残らない

4. 分岐ポイントの特定
   「ここで違う対応をしていたら結果が変わった」と思われる場面をすべてリストアップ

5. 商談の結果分析
   - 実際の結果
   - 最高の場合どうなり得たか
   - 最悪の場合どうなり得たか

【文字起こし】
---ここに貼り付け---
```

### 出力の確認ポイント
- [ ] 顧客の発言が10-20個程度に分割されているか
- [ ] 感情ラベルが適切か
- [ ] 分岐ポイントが3つ以上見つかっているか

---

## Step 2: シナリオ構造設計（固定テンプレート方式）

### 概要
分岐構造は以下の固定テンプレートを使用。AIは各シーンの「セリフ」と「mood」を文字起こしから埋めるだけ。

### 固定分岐構造（48シーン + 4エンディング = 52ノード）

```
【全体遷移図】

                                    opening
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 │[good]               │[neutral]            │[bad]
                 ▼                     ▼                     ▼
            A1_deep                A2_aware              B1_premature
                 │                     │                     │
        ┌────────┼────────┐    ┌───────┼───────┐            │
        │[g]     │[n]     │[b] │[g]    │[n]    │[b]         │[どれでも]
        ▼        ▼        ▼    ▼       ▼       ▼            ▼
    A1a_survey A1b_emp  A1c_x  A2a_emp A2b_sys A2c_x    B2_recovery
        │        │        │      │       │       │           │
        ▼        ▼        ▼      ▼       ▼       ▼           │
    A1a2_...  A1b2_... ──┴──→ A2a2_.. A2b2_.. ──┴──→        │
        │        │              │       │                    │
        └────┬───┘              └───┬───┘                    │
             ▼                      ▼                        │
        ===合流点M1===          ===合流点M2===               │
             │                      │                        │
             └──────────┬───────────┘                        │
                        ▼                                    │
                   ===合流点P===◄────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │[good]        │[neutral]     │[bad]
         ▼              ▼              ▼
     C1_package     C2_general     C3_weak
         │              │              │
    ┌────┼────┐    ┌────┼────┐         │
    │[g] │[n] │[b] │[g] │[n] │[b]      │[どれでも]
    ▼    ▼    ▼    ▼    ▼    ▼         ▼
   C1a  C1b  C1c  C2a  C2b  C2c    C3_recovery
    │    │    │    │    │    │         │
    ▼    ▼    ▼    ▼    ▼    ▼         │
   ...  ...  ...  ...  ...  ...        │
    │    │    │    │    │    │         │
    └────┴────┴────┴────┴────┴─────────┘
                        │
                   ===合流点Q===
                        │
         ┌──────────────┼──────────────┐
         │[good]        │[neutral]     │[bad]
         ▼              ▼              ▼
     D1_closing     D2_soft        D3_miss
         │              │              │
    ┌────┼────┐    ┌────┼────┐         │
    │[g] │[n] │[b] │[g] │[n] │[b]      │
    ▼    ▼    ▼    ▼    ▼    ▼         ▼
   D1a  D1b──┴──→ D2a  D2b──┴──→   ending_bad
    │    │         │    │
    ▼    ▼         ▼    ▼
   D1a2 D1b2      D2a2 D2b2
    │    │         │    │
    ▼    ▼         ▼    ▼
 great  good    good  neutral
```

### シーンID一覧と役割説明

| Phase | シーンID | 役割 |
|-------|----------|------|
| 1 | opening | 商談開始。顧客が現状を簡潔に説明 |
| 2A | A1_deep | 顧客が現在の取り組みを詳しく話す |
| 2A | A1a_survey | 調査・アンケートについて話す |
| 2A | A1a2_hidden | 隠れた課題が見えてくる |
| 2A | A1a3_impact | 課題のインパクトを認識 |
| 2A | A1b_empathy | 課題への共感を受けて話す |
| 2A | A1b2_concept | 解決の方向性が見える |
| 2A | A1c_miss | 話が噛み合わない反応 |
| 2B | A2_aware | 認知・周知について話す |
| 2B | A2a_empathy | 共感されて詳しく話す |
| 2B | A2a2_hidden | 隠れた課題に気づく |
| 2B | A2b_system | 制度・仕組みについて話す |
| 2B | A2b2_action | 具体的なアクションを考える |
| 2B | A2c_miss | 話が噛み合わない |
| 2C | B1_premature | 早すぎる提案への拒否反応 |
| 2C | B2_recovery | 仕切り直しのチャンス |
| 2C | B3_back | 軌道修正成功 |
| 2C | B3_weak | 弱い軌道修正 |
| 合流 | M1_merge, M2_merge | Phase 2内の小合流 |
| 合流 | P_merge | Phase 2→3の大合流（提案フェーズへ） |
| 合流 | Q_merge | Phase 3→4の大合流（クロージングへ） |
| 3 | C1_package | パッケージ提案への反応 |
| 3 | C1a_tailored | カスタマイズ提案への反応 |
| 3 | C1a2_roadmap | ロードマップ提示への反応 |
| 3 | C2_general | 一般的な提案への反応 |
| 3 | C3_weak | 弱い提案への反応 |
| 4 | D1_closing | 具体的クロージングへの反応 |
| 4 | D1a_concrete | 日程調整への反応 |
| 4 | D1a2_confirm | 確定への反応 |
| 4 | D2_soft | 柔らかいクロージングへの反応 |
| 4 | D3_miss | クロージング失敗 |

### AIへの指示（穴埋め用）

```
以下の固定シナリオ構造に、文字起こしの内容を当てはめてください。
構造（シーンID、遷移先）は変更不可。各シーンの text と mood だけを埋めてください。

【ルール】
1. 各シーンIDの役割に合った顧客セリフを作成
2. 選択肢は tag に応じた営業の返答を作成
3. mood は顧客の感情状態を設定

【シーンIDの役割説明】
（上記の表を参照）

【出力形式】
各シーンを以下の形式で出力:

opening: {
  id: 'opening',
  speaker: 'customer',
  text: '（顧客のセリフ）',
  mood: 'neutral',
  choices: [
    { text: '（good選択肢の営業セリフ）', next: 'A1_deep', tag: 'good' },
    { text: '（neutral選択肢の営業セリフ）', next: 'A2_aware', tag: 'neutral' },
    { text: '（bad選択肢の営業セリフ）', next: 'B1_premature', tag: 'bad' },
  ],
},

※ next は上記の固定値を使用。変更不可。
```

### 出力の確認ポイント
- [ ] 全48シーンが揃っているか
- [ ] next の値が固定値と一致しているか（変えていないか）
- [ ] 各シーンに text と mood があるか
- [ ] 選択肢ありシーンに3つの choices があるか

---

## Step 3: メタデータ生成

### AIへの指示

```
シナリオのメタデータを以下の形式で生成してください。

【入力情報】
- 商材名：[ここに入力]
- 商談フェーズ：[ここに入力]
- 商談の目的：[ここに入力]
- 顧客部署：[ここに入力]
- 顧客役職：[ここに入力]

【出力形式】
const GAME_DATA = {
  title: '商材名またはテーマ',
  subtitle: '○○シミュレーション',
  mission: '1文で商談の目的を説明',
  situationExplanation: '商談開始時点の状況を1-2文で説明',

  dimensions: {
    structure: { name: '構成力', description: '適切な順序で話を進めたか', icon: '📐' },
    specificity: { name: '具体性', description: '数字や事例を使ったか', icon: '📊' },
    trust: { name: '信頼度', description: '共感・傾聴ができたか', icon: '🤝' },
    timing: { name: '緩急', description: '適切なペースで進めたか', icon: '⏱️' },
  },

  customer: {
    name: '役職名',
    title: '部署名',
    avatar: '👤',
    initialMood: 'neutral',
  },
};

【注意】
- dimensions は固定（変更不要）
- mission は「〜せよ。」で終わる命令形
- situationExplanation は「〜ところです」で終わる
```

---

## Step 4: scenes生成（最重要・最大工程）

### AIへの指示

```
Step 2の構造をもとに、全シーンのデータを生成してください。

【1シーンの形式】

通常シーン（選択肢あり）:
scene_id: {
  id: 'scene_id',
  speaker: 'customer',
  text: '顧客のセリフ。自然な日本語の口語体で。',
  mood: 'neutral',
  choices: [
    { text: '営業の返答（good）', next: 'next_scene_good', tag: 'good' },
    { text: '営業の返答（neutral）', next: 'next_scene_neutral', tag: 'neutral' },
    { text: '営業の返答（bad）', next: 'next_scene_bad', tag: 'bad' },
  ],
},

自動遷移シーン（選択肢なし）:
scene_id: {
  id: 'scene_id',
  speaker: 'customer',
  text: '顧客のセリフ',
  mood: 'positive',
  next: 'ending_great',
},

【セリフ作成のルール】

顧客のセリフ:
- 「です・ます」調
- 「えっと」「うーん」「そうですね」など自然な言い淀み
- 1発言は50-150文字程度
- 専門用語は避ける

営業の選択肢:
- 「です・ます」調
- 1選択肢は30-80文字程度
- goodは「質問」「共感+深掘り」「具体的提案」
- badは「早すぎる提案」「押し売り」「話を遮る」
- neutralは「無難だが印象に残らない」

【moodの使い分け】
- neutral: 普通の状態、話し始め
- thinking: 考え込んでいる、悩んでいる
- curious: 興味を持った、もっと聞きたい
- worried: 不安、困っている
- positive: 前向き、納得している
- surprised: 驚いている、意外に思っている
- hesitant: 迷っている、決めかねている
- cold: 冷めている、興味を失った
- disappointed: がっかり、期待外れ

【出力】
scenes: {
  // ここに全シーンを出力
}

※シーン数が多い場合は分割して出力してください
```

### 品質チェックリスト
- [ ] 全シーンにidがある
- [ ] 全シーンにmoodがある
- [ ] 選択肢ありシーンは必ずchoicesがある
- [ ] 選択肢なしシーンは必ずnextがある
- [ ] nextの参照先が実在する
- [ ] タグがgood/neutral/badのいずれか

---

## Step 5: endings生成

### AIへの指示

```
4種類のエンディングを生成してください。

【ルール】
- title: 2-6文字で結果を端的に
- description: 何が達成されたか1文で
- feedback: 2-3文で学習ポイント。前向きな表現で

【心が折れない表現のコツ】
- badでも「〜できませんでした」より「〜すると良いでしょう」
- 「失敗」という言葉は使わない
- 次への改善点を必ず示す

【出力形式】
endings: {
  ending_great: {
    id: 'ending_great',
    title: '次回商談へ',
    emoji: '📅',
    description: '上司同席で具体的な日程調整に進みました',
    feedback: '課題の深掘りから解決策の提示、具体的なクロージングまで、商談の流れが適切でした。顧客の状況に寄り添いながら、次のステップを明確にできています。',
    color: '#10b981',
    result: 'great',
  },
  ending_good: {
    id: 'ending_good',
    title: '検討中',
    emoji: '📋',
    description: '来期計画への組み込みが検討されます',
    feedback: '課題理解と解決策の提示はできていますが、より具体的なクロージングがあると良かったかもしれません。顧客の状況に合わせた提案ができています。',
    color: '#3b82f6',
    result: 'good',
  },
  ending_neutral: {
    id: 'ending_neutral',
    title: '様子見',
    emoji: '📝',
    description: '資料送付後、継続フォローが必要です',
    feedback: '課題の深掘りが不十分だったか、提案のタイミングが早かった可能性があります。顧客の状況をもう少し聞いてから提案に入ると良いでしょう。',
    color: '#f59e0b',
    result: 'neutral',
  },
  ending_bad: {
    id: 'ending_bad',
    title: '見送り',
    emoji: '📭',
    description: '具体的な進展なく終了しました',
    feedback: '顧客の課題に寄り添う前に提案に入ってしまったか、クロージングが弱かった可能性があります。まず相手の状況を聞き、課題を整理してから解決策を提示することが重要です。',
    color: '#ef4444',
    result: 'bad',
  },
},
```

---

## Step 6: スコアデータ生成

### AIへの指示

```
各シーンの各選択肢にスコアを設定してください。

【スコアリングルール】

初期値: 各軸12点（合計48点スタート）
範囲: 各軸0-25点（合計0-100点）

good選択肢:
- structure: +2〜+4
- specificity: +1〜+4
- trust: +2〜+4
- timing: +1〜+3
- 合計: +6〜+12程度

neutral選択肢:
- 各軸: -1〜+2
- 合計: -2〜+4程度

bad選択肢:
- structure: -2〜-4
- specificity: -1〜-2
- trust: -2〜-4
- timing: -2〜-4
- 合計: -6〜-12程度

【各軸の評価観点】

structure（構成力）:
- 話の順序が適切か
- 論理的な展開か
- 顧客の状況把握→課題特定→解決策提示の流れ

specificity（具体性）:
- 数字を使っているか
- 事例を出しているか
- 曖昧な表現を避けているか

trust（信頼度）:
- 顧客の話を聞いているか
- 共感を示しているか
- 押し売り感がないか

timing（緩急）:
- 提案のタイミングが適切か
- 焦りすぎていないか
- 引くべき時に引けているか

【出力形式】
const SCALED_SCORES = {
  "opening": [
    { "index": 0, "scores": { "structure": 4, "specificity": 0, "trust": 3, "timing": 1 } },
    { "index": 1, "scores": { "structure": 3, "specificity": 0, "trust": 1, "timing": 1 } },
    { "index": 2, "scores": { "structure": -3, "specificity": 0, "trust": -1, "timing": -4 } }
  ],
  "A1_deep": [
    ...
  ],
  ...
};

※ index は choices配列の順番（0始まり）
```

---

## Step 7: 理由データ生成

### AIへの指示

```
各選択肢の評価理由を生成してください。

【ルール】
- 20文字以内
- 体言止めまたは「〜する」で終わる
- 良い点/悪い点を端的に

【例】
good: 「相手の課題を聞き提案につなげる」「共感を示し信頼関係を構築する」
neutral: 「共感はするが次のアクションがない」「当たり障りなく深いニーズ探求不足」
bad: 「顧客ニーズ無視の唐突な売り込み」「課題解決を焦り売り込みに走る」

【出力形式】
const CHOICE_REASONS = {
  "opening": [
    { "index": 0, "reason": "相手の課題を聞き提案につなげる" },
    { "index": 1, "reason": "当たり障りなく深いニーズ探求不足" },
    { "index": 2, "reason": "顧客ニーズ無視の唐突な売り込み" }
  ],
  "A1_deep": [
    ...
  ],
  ...
};
```

---

## Step 8: 組み立てと検証

### 8-1. ファイル構成

```javascript
'use client';

import React, { useState, useEffect } from 'react';

// Step 6の出力
const SCALED_SCORES = { ... };

// Step 7の出力
const CHOICE_REASONS = { ... };

// Step 3, 4, 5の出力を結合
const GAME_DATA = {
  title: '...',
  subtitle: '...',
  mission: '...',
  situationExplanation: '...',
  dimensions: { ... },
  customer: { ... },
  scenes: { ... },      // Step 4
  endings: { ... },     // Step 5
};

// 以下はテンプレートからコピー（変更不要）
const getScaledScores = (sceneId, choiceIndex) => { ... };
const getReason = (sceneId, choiceIndex) => { ... };
const getMoodEmoji = (mood) => { ... };
const BCSimulation = () => { ... };
export default BCSimulation;
```

### 8-2. 検証チェックリスト

**データ整合性**
- [ ] 全シーンIDがユニーク
- [ ] 全てのnext参照先が存在する
- [ ] SCALED_SCORESのキーがscenesのキーと一致
- [ ] CHOICE_REASONSのキーがscenesのキーと一致
- [ ] 各シーンのchoices数とSCALED_SCORES/CHOICE_REASONSの配列長が一致

**ゲームプレイ検証**
- [ ] opening から全エンディングに到達可能
- [ ] 無限ループがない
- [ ] 行き止まりがない
- [ ] スコアが0-100の範囲に収まる

**表示検証**
- [ ] 顧客のセリフが長すぎない（3行以内）
- [ ] 選択肢が長すぎない（2行以内）
- [ ] mood絵文字が適切に表示される

---

## トラブルシューティング

### よくある問題

**Q: シーン数が多すぎて出力が途中で切れる**
A: Step 4を「シーン1-20」「シーン21-40」のように分割して実行

**Q: 参照エラーが出る**
A: シーンIDのタイポを確認。全てのnextが実在するシーンIDか確認

**Q: スコアが極端に高い/低い**
A: 各選択肢のスコア合計を見直し。good=+8前後、bad=-8前後が目安

**Q: エンディングに到達しない**
A: シーン遷移図を描いて、全ルートがendingに繋がっているか確認

---

## 付録A: 固定シーンID一覧と遷移先

```javascript
// Phase 1: オープニング
opening: { choices: [A1_deep, A2_aware, B1_premature] }

// Phase 2A: メインルート
A1_deep: { choices: [A1a_survey, A1b_empathy, A1c_miss] }
A1a_survey: { choices: [A1a2_hidden, A1a2_detail, A1a2_skip] }
A1a2_hidden: { choices: [A1a3_impact, A1a3_ack, M1_merge] }
A1a3_impact: { next: M1_merge }
A1a3_ack: { next: M1_merge }
A1a2_detail: { next: M1_merge }
A1a2_skip: { next: M1_merge }
A1b_empathy: { choices: [A1b2_concept, A1b2_ack, M1_merge] }
A1b2_concept: { next: M1_merge }
A1b2_ack: { next: M1_merge }
A1c_miss: { choices: [A1b_empathy, M1_merge, B2_recovery] }

// Phase 2B: サブルート
A2_aware: { choices: [A2a_empathy, A2b_system, A2c_miss] }
A2a_empathy: { choices: [A2a2_hidden, A2a2_ack, M2_merge] }
A2a2_hidden: { next: M2_merge }
A2a2_ack: { next: M2_merge }
A2b_system: { choices: [A2b2_action, A2b2_ack, M2_merge] }
A2b2_action: { next: M2_merge }
A2b2_ack: { next: M2_merge }
A2c_miss: { choices: [A2a_empathy, M2_merge, B2_recovery] }

// Phase 2C: リカバリー
B1_premature: { choices: [B2_recovery, B2_recovery, B2_recovery] }
B2_recovery: { choices: [B3_back, B3_weak, ending_bad] }
B3_back: { next: P_merge }
B3_weak: { next: P_merge }

// 合流点
M1_merge: { next: P_merge }
M2_merge: { next: P_merge }
P_merge: { choices: [C1_package, C2_general, C3_weak] }

// Phase 3: 提案
C1_package: { choices: [C1a_tailored, C1b_standard, C1c_push] }
C1a_tailored: { choices: [C1a2_roadmap, C1a2_ack, Q_merge] }
C1a2_roadmap: { next: Q_merge }
C1a2_ack: { next: Q_merge }
C1b_standard: { choices: [C1b2_customize, Q_merge, Q_merge] }
C1b2_customize: { next: Q_merge }
C1c_push: { next: Q_merge }
C2_general: { choices: [C2a_focus, C2b_ack, Q_merge] }
C2a_focus: { next: Q_merge }
C2b_ack: { next: Q_merge }
C3_weak: { choices: [C3a_recover, Q_merge, Q_merge] }
C3a_recover: { next: Q_merge }

// Phase 4: クロージング
Q_merge: { choices: [D1_closing, D2_soft, D3_miss] }
D1_closing: { choices: [D1a_concrete, D1b_delay, D2_soft] }
D1a_concrete: { choices: [D1a2_confirm, D1a2_tentative, ending_good] }
D1a2_confirm: { next: ending_great }
D1a2_tentative: { next: ending_good }
D1b_delay: { choices: [D1b2_push, ending_good, ending_neutral] }
D1b2_push: { next: ending_good }
D2_soft: { choices: [D2a_try, D2b_material, ending_neutral] }
D2a_try: { next: ending_good }
D2b_material: { next: ending_neutral }
D3_miss: { next: ending_bad }

// エンディング
ending_great: { result: 'great' }
ending_good: { result: 'good' }
ending_neutral: { result: 'neutral' }
ending_bad: { result: 'bad' }
```

---

## 付録B: テンプレートファイル

新規シナリオ作成時は、以下からコンポーネント部分をコピー:
`/home/dev/bc-simulation/src/components/ScenarioTemplate.jsx`

データ部分（SCALED_SCORES, CHOICE_REASONS, GAME_DATA）のみ差し替え。

---

## 更新履歴

- 2024-02-11: 初版作成
- dimensions に description 追加
- endings に emoji, feedback, color 追加
- customer に avatar, initialMood 追加
- timing名を「緩急」に変更
- スコアと理由を別オブジェクトに分離
