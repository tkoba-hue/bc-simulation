'use client';

/**
 * ============================================
 * 商談シミュレーション シナリオ自動生成テンプレート
 * ============================================
 *
 * このファイルは、新しいシナリオを作成する際のテンプレートです。
 * BCSimulation.jsx からコンポーネント部分をコピーし、
 * データ部分（SCALED_SCORES, CHOICE_REASONS, GAME_DATA）のみ差し替えてください。
 *
 * 【使い方】
 * 1. このファイルを新しいシナリオ名でコピー
 * 2. SCALED_SCORES, CHOICE_REASONS, GAME_DATA を文字起こしから生成したデータで差し替え
 * 3. コンポーネント部分はそのまま使用
 */

import React, { useState, useEffect } from 'react';

// ============================================
// 固定シナリオ構造（48シーン + 4エンディング = 52ノード）
// ============================================
//
// この構造は変更不可。AIは各シーンの「セリフ」と「mood」を埋めるだけ。
//
// 【全体遷移図】
//
//                                     opening
//                                        │
//                  ┌─────────────────────┼─────────────────────┐
//                  │[good]               │[neutral]            │[bad]
//                  ▼                     ▼                     ▼
//             A1_deep                A2_aware              B1_premature
//                  │                     │                     │
//         ┌────────┼────────┐    ┌───────┼───────┐            │
//         │[g]     │[n]     │[b] │[g]    │[n]    │[b]         │[どれでも]
//         ▼        ▼        ▼    ▼       ▼       ▼            ▼
//     A1a_survey A1b_emp  A1c_x  A2a_emp A2b_sys A2c_x    B2_recovery
//         │        │        │      │       │       │           │
//         ▼        ▼        ▼      ▼       ▼       ▼           │
//     A1a2_...  A1b2_... ──┴──→ A2a2_.. A2b2_.. ──┴──→        │
//         │        │              │       │                    │
//         └────┬───┘              └───┬───┘                    │
//              ▼                      ▼                        │
//         ===合流点M1===          ===合流点M2===               │
//              │                      │                        │
//              └──────────┬───────────┘                        │
//                         ▼                                    │
//                    ===合流点P===◄────────────────────────────┘
//                         │
//          ┌──────────────┼──────────────┐
//          │[good]        │[neutral]     │[bad]
//          ▼              ▼              ▼
//      C1_package     C2_general     C3_weak
//          │              │              │
//     ┌────┼────┐    ┌────┼────┐         │
//     │[g] │[n] │[b] │[g] │[n] │[b]      │[どれでも]
//     ▼    ▼    ▼    ▼    ▼    ▼         ▼
//    C1a  C1b  C1c  C2a  C2b  C2c    C3_recovery
//     │    │    │    │    │    │         │
//     ▼    ▼    ▼    ▼    ▼    ▼         │
//    ...  ...  ...  ...  ...  ...        │
//     │    │    │    │    │    │         │
//     └────┴────┴────┴────┴────┴─────────┘
//                         │
//                    ===合流点Q===
//                         │
//          ┌──────────────┼──────────────┐
//          │[good]        │[neutral]     │[bad]
//          ▼              ▼              ▼
//      D1_closing     D2_soft        D3_miss
//          │              │              │
//     ┌────┼────┐    ┌────┼────┐         │
//     │[g] │[n] │[b] │[g] │[n] │[b]      │
//     ▼    ▼    ▼    ▼    ▼    ▼         ▼
//    D1a  D1b──┴──→ D2a  D2b──┴──→   ending_bad
//     │    │         │    │
//     ▼    ▼         ▼    ▼
//    D1a2 D1b2      D2a2 D2b2
//     │    │         │    │
//     ▼    ▼         ▼    ▼
//  great  good    good  neutral
//

// ============================================
// シーンID一覧と遷移先（固定値 - 変更不可）
// ============================================
const SCENE_STRUCTURE = {
  // Phase 1: オープニング（1シーン）
  opening: {
    choices: [
      { next: 'A1_deep', tag: 'good' },
      { next: 'A2_aware', tag: 'neutral' },
      { next: 'B1_premature', tag: 'bad' }
    ]
  },

  // Phase 2A: 課題ヒアリング - メインルート
  A1_deep: {
    choices: [
      { next: 'A1a_survey', tag: 'good' },
      { next: 'A1b_empathy', tag: 'neutral' },
      { next: 'A1c_miss', tag: 'bad' }
    ]
  },
  A1a_survey: {
    choices: [
      { next: 'A1a2_hidden', tag: 'good' },
      { next: 'A1a2_detail', tag: 'neutral' },
      { next: 'A1a2_skip', tag: 'bad' }
    ]
  },
  A1a2_hidden: {
    choices: [
      { next: 'A1a3_impact', tag: 'good' },
      { next: 'A1a3_ack', tag: 'neutral' },
      { next: 'M1_merge', tag: 'bad' }
    ]
  },
  A1a3_impact: { next: 'M1_merge' },
  A1a3_ack: { next: 'M1_merge' },
  A1a2_detail: { next: 'M1_merge' },
  A1a2_skip: { next: 'M1_merge' },

  A1b_empathy: {
    choices: [
      { next: 'A1b2_concept', tag: 'good' },
      { next: 'A1b2_ack', tag: 'neutral' },
      { next: 'M1_merge', tag: 'bad' }
    ]
  },
  A1b2_concept: { next: 'M1_merge' },
  A1b2_ack: { next: 'M1_merge' },

  A1c_miss: {
    choices: [
      { next: 'A1b_empathy', tag: 'good' },
      { next: 'M1_merge', tag: 'neutral' },
      { next: 'B2_recovery', tag: 'bad' }
    ]
  },

  // Phase 2B: 課題ヒアリング - サブルート
  A2_aware: {
    choices: [
      { next: 'A2a_empathy', tag: 'good' },
      { next: 'A2b_system', tag: 'neutral' },
      { next: 'A2c_miss', tag: 'bad' }
    ]
  },
  A2a_empathy: {
    choices: [
      { next: 'A2a2_hidden', tag: 'good' },
      { next: 'A2a2_ack', tag: 'neutral' },
      { next: 'M2_merge', tag: 'bad' }
    ]
  },
  A2a2_hidden: { next: 'M2_merge' },
  A2a2_ack: { next: 'M2_merge' },

  A2b_system: {
    choices: [
      { next: 'A2b2_action', tag: 'good' },
      { next: 'A2b2_ack', tag: 'neutral' },
      { next: 'M2_merge', tag: 'bad' }
    ]
  },
  A2b2_action: { next: 'M2_merge' },
  A2b2_ack: { next: 'M2_merge' },

  A2c_miss: {
    choices: [
      { next: 'A2a_empathy', tag: 'good' },
      { next: 'M2_merge', tag: 'neutral' },
      { next: 'B2_recovery', tag: 'bad' }
    ]
  },

  // Phase 2C: リカバリールート
  B1_premature: {
    choices: [
      { next: 'B2_recovery', tag: 'good' },
      { next: 'B2_recovery', tag: 'neutral' },
      { next: 'B2_recovery', tag: 'bad' }
    ]
  },
  B2_recovery: {
    choices: [
      { next: 'B3_back', tag: 'good' },
      { next: 'B3_weak', tag: 'neutral' },
      { next: 'ending_bad', tag: 'bad' }
    ]
  },
  B3_back: { next: 'P_merge' },
  B3_weak: { next: 'P_merge' },

  // 合流点
  M1_merge: { next: 'P_merge' },
  M2_merge: { next: 'P_merge' },

  P_merge: {
    choices: [
      { next: 'C1_package', tag: 'good' },
      { next: 'C2_general', tag: 'neutral' },
      { next: 'C3_weak', tag: 'bad' }
    ]
  },

  // Phase 3: 提案フェーズ
  C1_package: {
    choices: [
      { next: 'C1a_tailored', tag: 'good' },
      { next: 'C1b_standard', tag: 'neutral' },
      { next: 'C1c_push', tag: 'bad' }
    ]
  },
  C1a_tailored: {
    choices: [
      { next: 'C1a2_roadmap', tag: 'good' },
      { next: 'C1a2_ack', tag: 'neutral' },
      { next: 'Q_merge', tag: 'bad' }
    ]
  },
  C1a2_roadmap: { next: 'Q_merge' },
  C1a2_ack: { next: 'Q_merge' },

  C1b_standard: {
    choices: [
      { next: 'C1b2_customize', tag: 'good' },
      { next: 'Q_merge', tag: 'neutral' },
      { next: 'Q_merge', tag: 'bad' }
    ]
  },
  C1b2_customize: { next: 'Q_merge' },

  C1c_push: { next: 'Q_merge' },

  C2_general: {
    choices: [
      { next: 'C2a_focus', tag: 'good' },
      { next: 'C2b_ack', tag: 'neutral' },
      { next: 'Q_merge', tag: 'bad' }
    ]
  },
  C2a_focus: { next: 'Q_merge' },
  C2b_ack: { next: 'Q_merge' },

  C3_weak: {
    choices: [
      { next: 'C3a_recover', tag: 'good' },
      { next: 'Q_merge', tag: 'neutral' },
      { next: 'Q_merge', tag: 'bad' }
    ]
  },
  C3a_recover: { next: 'Q_merge' },

  // Phase 4: クロージング
  Q_merge: {
    choices: [
      { next: 'D1_closing', tag: 'good' },
      { next: 'D2_soft', tag: 'neutral' },
      { next: 'D3_miss', tag: 'bad' }
    ]
  },

  D1_closing: {
    choices: [
      { next: 'D1a_concrete', tag: 'good' },
      { next: 'D1b_delay', tag: 'neutral' },
      { next: 'D2_soft', tag: 'bad' }
    ]
  },
  D1a_concrete: {
    choices: [
      { next: 'D1a2_confirm', tag: 'good' },
      { next: 'D1a2_tentative', tag: 'neutral' },
      { next: 'ending_good', tag: 'bad' }
    ]
  },
  D1a2_confirm: { next: 'ending_great' },
  D1a2_tentative: { next: 'ending_good' },

  D1b_delay: {
    choices: [
      { next: 'D1b2_push', tag: 'good' },
      { next: 'ending_good', tag: 'neutral' },
      { next: 'ending_neutral', tag: 'bad' }
    ]
  },
  D1b2_push: { next: 'ending_good' },

  D2_soft: {
    choices: [
      { next: 'D2a_try', tag: 'good' },
      { next: 'D2b_material', tag: 'neutral' },
      { next: 'ending_neutral', tag: 'bad' }
    ]
  },
  D2a_try: { next: 'ending_good' },
  D2b_material: { next: 'ending_neutral' },

  D3_miss: { next: 'ending_bad' },

  // エンディング
  ending_great: { result: 'great' },
  ending_good: { result: 'good' },
  ending_neutral: { result: 'neutral' },
  ending_bad: { result: 'bad' },
};

// ============================================
// シーンIDの役割説明
// ============================================
const SCENE_DESCRIPTIONS = {
  // Phase 1
  opening: '商談開始。顧客が現状を簡潔に説明',

  // Phase 2A（メインルート）
  A1_deep: '顧客が現在の取り組みを詳しく話す',
  A1a_survey: '調査・アンケートについて話す',
  A1a2_hidden: '隠れた課題が見えてくる',
  A1a2_detail: '詳細を確認する',
  A1a2_skip: '深掘りをスキップ',
  A1a3_impact: '課題のインパクトを認識',
  A1a3_ack: '課題を認識',
  A1b_empathy: '課題への共感を受けて話す',
  A1b2_concept: '解決の方向性が見える',
  A1b2_ack: '共感への反応',
  A1c_miss: '話が噛み合わない反応',

  // Phase 2B（サブルート）
  A2_aware: '認知・周知について話す',
  A2a_empathy: '共感されて詳しく話す',
  A2a2_hidden: '隠れた課題に気づく',
  A2a2_ack: '共感への反応',
  A2b_system: '制度・仕組みについて話す',
  A2b2_action: '具体的なアクションを考える',
  A2b2_ack: '制度への反応',
  A2c_miss: '話が噛み合わない',

  // Phase 2C（リカバリー）
  B1_premature: '早すぎる提案への拒否反応',
  B2_recovery: '仕切り直しのチャンス',
  B3_back: '軌道修正成功',
  B3_weak: '弱い軌道修正',

  // 合流点
  M1_merge: 'Phase 2A内の小合流',
  M2_merge: 'Phase 2B内の小合流',
  P_merge: 'Phase 2→3の大合流（提案フェーズへ）',
  Q_merge: 'Phase 3→4の大合流（クロージングへ）',

  // Phase 3（提案）
  C1_package: 'パッケージ提案への反応',
  C1a_tailored: 'カスタマイズ提案への反応',
  C1a2_roadmap: 'ロードマップ提示への反応',
  C1a2_ack: '提案への反応',
  C1b_standard: '標準提案への反応',
  C1b2_customize: 'カスタマイズの提案',
  C1c_push: '押し売り感への反応',
  C2_general: '一般的な提案への反応',
  C2a_focus: 'フォーカスした提案への反応',
  C2b_ack: '一般的な反応',
  C3_weak: '弱い提案への反応',
  C3a_recover: 'リカバリーの試み',

  // Phase 4（クロージング）
  D1_closing: '具体的クロージングへの反応',
  D1a_concrete: '日程調整への反応',
  D1a2_confirm: '確定への反応',
  D1a2_tentative: '仮確定への反応',
  D1b_delay: '延期への反応',
  D1b2_push: 'プッシュへの反応',
  D2_soft: '柔らかいクロージングへの反応',
  D2a_try: '試行への反応',
  D2b_material: '資料送付への反応',
  D3_miss: 'クロージング失敗',
};

// ============================================
// スコアリングガイドライン
// ============================================
const SCORING_GUIDELINES = {
  initial: { structure: 12, specificity: 12, trust: 12, timing: 12 }, // 合計48点スタート
  range: { min: 0, max: 25 }, // 各軸0-25点（合計0-100点）

  good: {
    structure: { min: 2, max: 4, description: '話の順序が適切、論理的な展開' },
    specificity: { min: 1, max: 4, description: '数字や事例を使用' },
    trust: { min: 2, max: 4, description: '共感・傾聴ができている' },
    timing: { min: 1, max: 3, description: '適切なペース' },
    // 合計: +6〜+12程度
  },

  neutral: {
    structure: { min: -1, max: 2, description: '無難だが印象に残らない' },
    specificity: { min: -1, max: 2, description: '具体性不足' },
    trust: { min: -1, max: 2, description: '共感が弱い' },
    timing: { min: -1, max: 2, description: 'タイミングが微妙' },
    // 合計: -2〜+4程度
  },

  bad: {
    structure: { min: -4, max: -2, description: '話の順序が不適切' },
    specificity: { min: -2, max: -1, description: '曖昧な表現' },
    trust: { min: -4, max: -2, description: '押し売り感、共感不足' },
    timing: { min: -4, max: -2, description: '提案が早すぎる、焦りすぎ' },
    // 合計: -6〜-12程度
  },

  dimensions: {
    structure: {
      name: '構成力',
      description: '適切な順序で話を進めたか',
      icon: '📐',
      evaluation: [
        '話の順序が適切か',
        '論理的な展開か',
        '顧客の状況把握→課題特定→解決策提示の流れ'
      ]
    },
    specificity: {
      name: '具体性',
      description: '数字や事例を使ったか',
      icon: '📊',
      evaluation: [
        '数字を使っているか',
        '事例を出しているか',
        '曖昧な表現を避けているか'
      ]
    },
    trust: {
      name: '信頼度',
      description: '共感・傾聴ができたか',
      icon: '🤝',
      evaluation: [
        '顧客の話を聞いているか',
        '共感を示しているか',
        '押し売り感がないか'
      ]
    },
    timing: {
      name: '緩急',
      description: '適切なペースで進めたか',
      icon: '⏱️',
      evaluation: [
        '提案のタイミングが適切か',
        '焦りすぎていないか',
        '引くべき時に引けているか'
      ]
    }
  }
};

// ============================================
// ムード一覧
// ============================================
const MOODS = {
  neutral: { emoji: '😐', description: '普通の状態、話し始め' },
  thinking: { emoji: '🤔', description: '考え込んでいる、悩んでいる' },
  curious: { emoji: '👀', description: '興味を持った、もっと聞きたい' },
  worried: { emoji: '😟', description: '不安、困っている' },
  positive: { emoji: '😊', description: '前向き、納得している' },
  surprised: { emoji: '😮', description: '驚いている、意外に思っている' },
  hesitant: { emoji: '😕', description: '迷っている、決めかねている' },
  cold: { emoji: '😑', description: '冷めている、興味を失った' },
  disappointed: { emoji: '😞', description: 'がっかり、期待外れ' },
  skeptical: { emoji: '🤨', description: '疑っている、懐疑的' },
  negative: { emoji: '😠', description: '不満、怒り' },
};

// ============================================
// サンプルスコアデータ（これを差し替える）
// ============================================
const SCALED_SCORES = {
  "opening": [
    { "index": 0, "scores": { "structure": 4, "specificity": 0, "trust": 3, "timing": 1 } },
    { "index": 1, "scores": { "structure": 3, "specificity": 0, "trust": 1, "timing": 1 } },
    { "index": 2, "scores": { "structure": -3, "specificity": 0, "trust": -1, "timing": -4 } }
  ],
  // ... 他のシーンのスコアをここに追加
};

// ============================================
// サンプル理由データ（これを差し替える）
// ============================================
const CHOICE_REASONS = {
  "opening": [
    { "index": 0, "reason": "相手の課題を聞き提案につなげる" },
    { "index": 1, "reason": "当たり障りなく深いニーズ探求不足" },
    { "index": 2, "reason": "顧客ニーズ無視の唐突な売り込み" }
  ],
  // ... 他のシーンの理由をここに追加
};

// ============================================
// サンプルゲームデータ（これを差し替える）
// ============================================
const GAME_DATA = {
  title: 'サンプル商材名',
  subtitle: '初回商談シミュレーション',
  mission: '初回商談で顧客の課題を引き出し、次のステップにつなげよ。',
  situationExplanation: '初回商談で会社紹介を終え、顧客の状況をヒアリングし始めたところです',

  dimensions: {
    structure: { name: '構成力', description: '適切な順序で話を進めたか', icon: '📐' },
    specificity: { name: '具体性', description: '数字や事例を使ったか', icon: '📊' },
    trust: { name: '信頼度', description: '共感・傾聴ができたか', icon: '🤝' },
    timing: { name: '緩急', description: '適切なペースで進めたか', icon: '⏱️' },
  },

  customer: {
    name: '担当者',
    title: '○○部',
    avatar: '👤',
    initialMood: 'neutral',
  },

  scenes: {
    // ============================================
    // Phase 1: オープニング
    // ============================================
    opening: {
      id: 'opening',
      speaker: 'customer',
      text: '（顧客のセリフを文字起こしから挿入）',
      mood: 'neutral',
      choices: [
        { text: '（good選択肢の営業セリフ）', next: 'A1_deep', tag: 'good' },
        { text: '（neutral選択肢の営業セリフ）', next: 'A2_aware', tag: 'neutral' },
        { text: '（bad選択肢の営業セリフ）', next: 'B1_premature', tag: 'bad' },
      ],
    },

    // ============================================
    // Phase 2A: 課題ヒアリング - メインルート
    // ============================================
    A1_deep: {
      id: 'A1_deep',
      speaker: 'customer',
      text: '（顧客が現在の取り組みを詳しく話す）',
      mood: 'thinking',
      choices: [
        { text: '（調査・アンケートについて聞く）', next: 'A1a_survey', tag: 'good' },
        { text: '（共感を示す）', next: 'A1b_empathy', tag: 'neutral' },
        { text: '（話が噛み合わない返答）', next: 'A1c_miss', tag: 'bad' },
      ],
    },

    A1a_survey: {
      id: 'A1a_survey',
      speaker: 'customer',
      text: '（調査・アンケートについて話す）',
      mood: 'neutral',
      choices: [
        { text: '（隠れた課題を指摘）', next: 'A1a2_hidden', tag: 'good' },
        { text: '（詳細を確認）', next: 'A1a2_detail', tag: 'neutral' },
        { text: '（深掘りをスキップ）', next: 'A1a2_skip', tag: 'bad' },
      ],
    },

    A1a2_hidden: {
      id: 'A1a2_hidden',
      speaker: 'customer',
      text: '（隠れた課題が見えてくる）',
      mood: 'curious',
      choices: [
        { text: '（インパクトを提示）', next: 'A1a3_impact', tag: 'good' },
        { text: '（認識を確認）', next: 'A1a3_ack', tag: 'neutral' },
        { text: '（次に進む）', next: 'M1_merge', tag: 'bad' },
      ],
    },

    A1a3_impact: {
      id: 'A1a3_impact',
      speaker: 'customer',
      text: '（課題のインパクトを認識）',
      mood: 'surprised',
      next: 'M1_merge',
    },

    A1a3_ack: {
      id: 'A1a3_ack',
      speaker: 'customer',
      text: '（課題を認識）',
      mood: 'thinking',
      next: 'M1_merge',
    },

    A1a2_detail: {
      id: 'A1a2_detail',
      speaker: 'customer',
      text: '（詳細を説明）',
      mood: 'neutral',
      next: 'M1_merge',
    },

    A1a2_skip: {
      id: 'A1a2_skip',
      speaker: 'customer',
      text: '（スキップへの反応）',
      mood: 'neutral',
      next: 'M1_merge',
    },

    A1b_empathy: {
      id: 'A1b_empathy',
      speaker: 'customer',
      text: '（共感を受けて話す）',
      mood: 'positive',
      choices: [
        { text: '（解決の方向性を提示）', next: 'A1b2_concept', tag: 'good' },
        { text: '（さらに共感）', next: 'A1b2_ack', tag: 'neutral' },
        { text: '（次に進む）', next: 'M1_merge', tag: 'bad' },
      ],
    },

    A1b2_concept: {
      id: 'A1b2_concept',
      speaker: 'customer',
      text: '（解決の方向性が見える）',
      mood: 'positive',
      next: 'M1_merge',
    },

    A1b2_ack: {
      id: 'A1b2_ack',
      speaker: 'customer',
      text: '（共感への反応）',
      mood: 'neutral',
      next: 'M1_merge',
    },

    A1c_miss: {
      id: 'A1c_miss',
      speaker: 'customer',
      text: '（話が噛み合わない反応）',
      mood: 'cold',
      choices: [
        { text: '（軌道修正して共感）', next: 'A1b_empathy', tag: 'good' },
        { text: '（そのまま進む）', next: 'M1_merge', tag: 'neutral' },
        { text: '（さらに悪化）', next: 'B2_recovery', tag: 'bad' },
      ],
    },

    // ============================================
    // Phase 2B: 課題ヒアリング - サブルート
    // ============================================
    A2_aware: {
      id: 'A2_aware',
      speaker: 'customer',
      text: '（認知・周知について話す）',
      mood: 'thinking',
      choices: [
        { text: '（共感を示す）', next: 'A2a_empathy', tag: 'good' },
        { text: '（制度について聞く）', next: 'A2b_system', tag: 'neutral' },
        { text: '（話が噛み合わない）', next: 'A2c_miss', tag: 'bad' },
      ],
    },

    A2a_empathy: {
      id: 'A2a_empathy',
      speaker: 'customer',
      text: '（共感されて詳しく話す）',
      mood: 'positive',
      choices: [
        { text: '（隠れた課題を指摘）', next: 'A2a2_hidden', tag: 'good' },
        { text: '（さらに共感）', next: 'A2a2_ack', tag: 'neutral' },
        { text: '（次に進む）', next: 'M2_merge', tag: 'bad' },
      ],
    },

    A2a2_hidden: {
      id: 'A2a2_hidden',
      speaker: 'customer',
      text: '（隠れた課題に気づく）',
      mood: 'curious',
      next: 'M2_merge',
    },

    A2a2_ack: {
      id: 'A2a2_ack',
      speaker: 'customer',
      text: '（共感への反応）',
      mood: 'neutral',
      next: 'M2_merge',
    },

    A2b_system: {
      id: 'A2b_system',
      speaker: 'customer',
      text: '（制度について話す）',
      mood: 'neutral',
      choices: [
        { text: '（アクションを促す）', next: 'A2b2_action', tag: 'good' },
        { text: '（制度への反応）', next: 'A2b2_ack', tag: 'neutral' },
        { text: '（次に進む）', next: 'M2_merge', tag: 'bad' },
      ],
    },

    A2b2_action: {
      id: 'A2b2_action',
      speaker: 'customer',
      text: '（アクションを考える）',
      mood: 'positive',
      next: 'M2_merge',
    },

    A2b2_ack: {
      id: 'A2b2_ack',
      speaker: 'customer',
      text: '（制度への反応）',
      mood: 'neutral',
      next: 'M2_merge',
    },

    A2c_miss: {
      id: 'A2c_miss',
      speaker: 'customer',
      text: '（話が噛み合わない）',
      mood: 'cold',
      choices: [
        { text: '（軌道修正）', next: 'A2a_empathy', tag: 'good' },
        { text: '（そのまま進む）', next: 'M2_merge', tag: 'neutral' },
        { text: '（さらに悪化）', next: 'B2_recovery', tag: 'bad' },
      ],
    },

    // ============================================
    // Phase 2C: リカバリールート
    // ============================================
    B1_premature: {
      id: 'B1_premature',
      speaker: 'customer',
      text: '（早すぎる提案への拒否反応）',
      mood: 'skeptical',
      choices: [
        { text: '（謝罪してヒアリングに戻る）', next: 'B2_recovery', tag: 'good' },
        { text: '（説明を続ける）', next: 'B2_recovery', tag: 'neutral' },
        { text: '（さらに提案を押す）', next: 'B2_recovery', tag: 'bad' },
      ],
    },

    B2_recovery: {
      id: 'B2_recovery',
      speaker: 'customer',
      text: '（仕切り直しのチャンス）',
      mood: 'neutral',
      choices: [
        { text: '（課題に戻る）', next: 'B3_back', tag: 'good' },
        { text: '（弱い軌道修正）', next: 'B3_weak', tag: 'neutral' },
        { text: '（あきらめる）', next: 'ending_bad', tag: 'bad' },
      ],
    },

    B3_back: {
      id: 'B3_back',
      speaker: 'customer',
      text: '（軌道修正成功）',
      mood: 'neutral',
      next: 'P_merge',
    },

    B3_weak: {
      id: 'B3_weak',
      speaker: 'customer',
      text: '（弱い軌道修正）',
      mood: 'hesitant',
      next: 'P_merge',
    },

    // ============================================
    // 合流点
    // ============================================
    M1_merge: {
      id: 'M1_merge',
      speaker: 'customer',
      text: '（Phase 2Aからの合流）',
      mood: 'thinking',
      next: 'P_merge',
    },

    M2_merge: {
      id: 'M2_merge',
      speaker: 'customer',
      text: '（Phase 2Bからの合流）',
      mood: 'thinking',
      next: 'P_merge',
    },

    P_merge: {
      id: 'P_merge',
      speaker: 'customer',
      text: '（提案フェーズへの移行）で、御社としてはどういうサポートができるんですか？',
      mood: 'curious',
      choices: [
        { text: '（パッケージ提案）', next: 'C1_package', tag: 'good' },
        { text: '（一般的な提案）', next: 'C2_general', tag: 'neutral' },
        { text: '（弱い提案）', next: 'C3_weak', tag: 'bad' },
      ],
    },

    // ============================================
    // Phase 3: 提案フェーズ
    // ============================================
    C1_package: {
      id: 'C1_package',
      speaker: 'customer',
      text: '（パッケージ提案への反応）',
      mood: 'curious',
      choices: [
        { text: '（カスタマイズ提案）', next: 'C1a_tailored', tag: 'good' },
        { text: '（標準提案）', next: 'C1b_standard', tag: 'neutral' },
        { text: '（押し売り）', next: 'C1c_push', tag: 'bad' },
      ],
    },

    C1a_tailored: {
      id: 'C1a_tailored',
      speaker: 'customer',
      text: '（カスタマイズ提案への反応）',
      mood: 'positive',
      choices: [
        { text: '（ロードマップ提示）', next: 'C1a2_roadmap', tag: 'good' },
        { text: '（確認）', next: 'C1a2_ack', tag: 'neutral' },
        { text: '（次に進む）', next: 'Q_merge', tag: 'bad' },
      ],
    },

    C1a2_roadmap: {
      id: 'C1a2_roadmap',
      speaker: 'customer',
      text: '（ロードマップへの反応）',
      mood: 'positive',
      next: 'Q_merge',
    },

    C1a2_ack: {
      id: 'C1a2_ack',
      speaker: 'customer',
      text: '（提案への反応）',
      mood: 'neutral',
      next: 'Q_merge',
    },

    C1b_standard: {
      id: 'C1b_standard',
      speaker: 'customer',
      text: '（標準提案への反応）',
      mood: 'neutral',
      choices: [
        { text: '（カスタマイズを提案）', next: 'C1b2_customize', tag: 'good' },
        { text: '（そのまま進む）', next: 'Q_merge', tag: 'neutral' },
        { text: '（弱い対応）', next: 'Q_merge', tag: 'bad' },
      ],
    },

    C1b2_customize: {
      id: 'C1b2_customize',
      speaker: 'customer',
      text: '（カスタマイズへの反応）',
      mood: 'positive',
      next: 'Q_merge',
    },

    C1c_push: {
      id: 'C1c_push',
      speaker: 'customer',
      text: '（押し売りへの反応）',
      mood: 'cold',
      next: 'Q_merge',
    },

    C2_general: {
      id: 'C2_general',
      speaker: 'customer',
      text: '（一般的な提案への反応）',
      mood: 'neutral',
      choices: [
        { text: '（フォーカスした提案）', next: 'C2a_focus', tag: 'good' },
        { text: '（確認）', next: 'C2b_ack', tag: 'neutral' },
        { text: '（弱い対応）', next: 'Q_merge', tag: 'bad' },
      ],
    },

    C2a_focus: {
      id: 'C2a_focus',
      speaker: 'customer',
      text: '（フォーカスした提案への反応）',
      mood: 'positive',
      next: 'Q_merge',
    },

    C2b_ack: {
      id: 'C2b_ack',
      speaker: 'customer',
      text: '（一般的な反応）',
      mood: 'neutral',
      next: 'Q_merge',
    },

    C3_weak: {
      id: 'C3_weak',
      speaker: 'customer',
      text: '（弱い提案への反応）',
      mood: 'hesitant',
      choices: [
        { text: '（リカバリー）', next: 'C3a_recover', tag: 'good' },
        { text: '（そのまま進む）', next: 'Q_merge', tag: 'neutral' },
        { text: '（あきらめる）', next: 'Q_merge', tag: 'bad' },
      ],
    },

    C3a_recover: {
      id: 'C3a_recover',
      speaker: 'customer',
      text: '（リカバリーへの反応）',
      mood: 'neutral',
      next: 'Q_merge',
    },

    // ============================================
    // Phase 4: クロージング
    // ============================================
    Q_merge: {
      id: 'Q_merge',
      speaker: 'customer',
      text: '（クロージングフェーズへ）なるほど。前向きに検討したいと思います。',
      mood: 'positive',
      choices: [
        { text: '（具体的クロージング）', next: 'D1_closing', tag: 'good' },
        { text: '（柔らかいクロージング）', next: 'D2_soft', tag: 'neutral' },
        { text: '（クロージング失敗）', next: 'D3_miss', tag: 'bad' },
      ],
    },

    D1_closing: {
      id: 'D1_closing',
      speaker: 'customer',
      text: '（具体的クロージングへの反応）',
      mood: 'positive',
      choices: [
        { text: '（日程調整）', next: 'D1a_concrete', tag: 'good' },
        { text: '（延期）', next: 'D1b_delay', tag: 'neutral' },
        { text: '（弱い対応）', next: 'D2_soft', tag: 'bad' },
      ],
    },

    D1a_concrete: {
      id: 'D1a_concrete',
      speaker: 'customer',
      text: '（日程調整への反応）',
      mood: 'positive',
      choices: [
        { text: '（確定）', next: 'D1a2_confirm', tag: 'good' },
        { text: '（仮確定）', next: 'D1a2_tentative', tag: 'neutral' },
        { text: '（弱い対応）', next: 'ending_good', tag: 'bad' },
      ],
    },

    D1a2_confirm: {
      id: 'D1a2_confirm',
      speaker: 'customer',
      text: 'はい、ぜひお願いします。上司にも同席してもらいますね。',
      mood: 'positive',
      next: 'ending_great',
    },

    D1a2_tentative: {
      id: 'D1a2_tentative',
      speaker: 'customer',
      text: 'ありがとうございます。来週あたりで調整してみます。',
      mood: 'positive',
      next: 'ending_good',
    },

    D1b_delay: {
      id: 'D1b_delay',
      speaker: 'customer',
      text: '（延期への反応）',
      mood: 'thinking',
      choices: [
        { text: '（プッシュ）', next: 'D1b2_push', tag: 'good' },
        { text: '（了承）', next: 'ending_good', tag: 'neutral' },
        { text: '（弱い対応）', next: 'ending_neutral', tag: 'bad' },
      ],
    },

    D1b2_push: {
      id: 'D1b2_push',
      speaker: 'customer',
      text: '（プッシュへの反応）',
      mood: 'positive',
      next: 'ending_good',
    },

    D2_soft: {
      id: 'D2_soft',
      speaker: 'customer',
      text: '（柔らかいクロージングへの反応）',
      mood: 'neutral',
      choices: [
        { text: '（試行を提案）', next: 'D2a_try', tag: 'good' },
        { text: '（資料送付）', next: 'D2b_material', tag: 'neutral' },
        { text: '（弱い対応）', next: 'ending_neutral', tag: 'bad' },
      ],
    },

    D2a_try: {
      id: 'D2a_try',
      speaker: 'customer',
      text: '（試行への反応）',
      mood: 'positive',
      next: 'ending_good',
    },

    D2b_material: {
      id: 'D2b_material',
      speaker: 'customer',
      text: 'では資料を拝見して、また連絡しますね。',
      mood: 'neutral',
      next: 'ending_neutral',
    },

    D3_miss: {
      id: 'D3_miss',
      speaker: 'customer',
      text: 'うーん、ちょっとまだ検討段階ではないので…またの機会に。',
      mood: 'cold',
      next: 'ending_bad',
    },
  },

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
};

// ============================================
// ヘルパー関数
// ============================================

// スコアを取得する関数
const getScaledScores = (sceneId, choiceIndex) => {
  const sceneScores = SCALED_SCORES[sceneId];
  if (!sceneScores) return { structure: 0, specificity: 0, trust: 0, timing: 0 };
  const choice = sceneScores.find(c => c.index === choiceIndex);
  return choice ? choice.scores : { structure: 0, specificity: 0, trust: 0, timing: 0 };
};

// 理由を取得する関数
const getReason = (sceneId, choiceIndex) => {
  const sceneReasons = CHOICE_REASONS[sceneId];
  if (!sceneReasons) return '';
  const choice = sceneReasons.find(c => c.index === choiceIndex);
  return choice ? choice.reason : '';
};

// タグの表示スタイル
const getTagStyle = (tag) => {
  switch (tag) {
    case 'good':
      return { backgroundColor: '#10B981', color: 'white', label: 'Good' };
    case 'bad':
      return { backgroundColor: '#EF4444', color: 'white', label: 'Bad' };
    case 'neutral':
      return { backgroundColor: '#6B7280', color: 'white', label: 'Neutral' };
    case 'recovery':
      return { backgroundColor: '#F59E0B', color: 'white', label: 'Recovery' };
    default:
      return { backgroundColor: '#6B7280', color: 'white', label: '' };
  }
};

// ムード絵文字
const getMoodEmoji = (mood) => {
  return MOODS[mood]?.emoji || '😐';
};

// ============================================
// データ検証関数
// ============================================

// シナリオデータの整合性チェック
const validateScenarioData = (gameData, scaledScores, choiceReasons) => {
  const errors = [];
  const warnings = [];

  // 1. 全シーンIDがユニークかチェック
  const sceneIds = Object.keys(gameData.scenes);
  const endingIds = Object.keys(gameData.endings);
  const allIds = [...sceneIds, ...endingIds];
  const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`重複するシーンID: ${duplicates.join(', ')}`);
  }

  // 2. 全てのnext参照先が存在するかチェック
  sceneIds.forEach(sceneId => {
    const scene = gameData.scenes[sceneId];
    if (scene.choices) {
      scene.choices.forEach((choice, index) => {
        if (!allIds.includes(choice.next)) {
          errors.push(`${sceneId}のchoices[${index}].next "${choice.next}" が存在しません`);
        }
      });
    } else if (scene.next) {
      if (!allIds.includes(scene.next)) {
        errors.push(`${sceneId}のnext "${scene.next}" が存在しません`);
      }
    }
  });

  // 3. SCALED_SCORESのキーがscenesのキーと一致するかチェック
  Object.keys(scaledScores).forEach(key => {
    if (!sceneIds.includes(key)) {
      warnings.push(`SCALED_SCORES["${key}"] に対応するシーンがありません`);
    }
  });

  // 4. CHOICE_REASONSのキーがscenesのキーと一致するかチェック
  Object.keys(choiceReasons).forEach(key => {
    if (!sceneIds.includes(key)) {
      warnings.push(`CHOICE_REASONS["${key}"] に対応するシーンがありません`);
    }
  });

  // 5. 各シーンのchoices数とSCALED_SCORES/CHOICE_REASONSの配列長が一致するかチェック
  sceneIds.forEach(sceneId => {
    const scene = gameData.scenes[sceneId];
    if (scene.choices) {
      const choiceCount = scene.choices.length;
      const scoreEntries = scaledScores[sceneId];
      const reasonEntries = choiceReasons[sceneId];

      if (scoreEntries && scoreEntries.length !== choiceCount) {
        errors.push(`${sceneId}: choices数(${choiceCount})とSCALED_SCORES数(${scoreEntries.length})が不一致`);
      }
      if (reasonEntries && reasonEntries.length !== choiceCount) {
        errors.push(`${sceneId}: choices数(${choiceCount})とCHOICE_REASONS数(${reasonEntries.length})が不一致`);
      }
    }
  });

  // 6. スコアが0-25の範囲に収まるかシミュレーション
  // （省略：実行時にチェック）

  return { errors, warnings, isValid: errors.length === 0 };
};

// ============================================
// エクスポート
// ============================================

export {
  SCENE_STRUCTURE,
  SCENE_DESCRIPTIONS,
  SCORING_GUIDELINES,
  MOODS,
  SCALED_SCORES,
  CHOICE_REASONS,
  GAME_DATA,
  getScaledScores,
  getReason,
  getTagStyle,
  getMoodEmoji,
  validateScenarioData,
};

// ============================================
// メインコンポーネント
// ============================================
// 以下はBCSimulation.jsxからコピーしてください
// データ部分（SCALED_SCORES, CHOICE_REASONS, GAME_DATA）のみ差し替え

const ScenarioTemplate = () => {
  const [gameState, setGameState] = useState('title');
  const [mode, setMode] = useState('practice');
  const [currentSceneId, setCurrentSceneId] = useState('opening');
  const [scores, setScores] = useState({ structure: 12, specificity: 12, trust: 12, timing: 12 });
  const [history, setHistory] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentScene = GAME_DATA.scenes[currentSceneId] || GAME_DATA.endings[currentSceneId];
  const isEnding = GAME_DATA.endings[currentSceneId] !== undefined;

  const clampScore = (value) => Math.max(0, Math.min(25, value));

  const getTotalScore = () => {
    return scores.structure + scores.specificity + scores.trust + scores.timing;
  };

  const startGame = (selectedMode) => {
    setMode(selectedMode);
    setGameState('playing');
    setCurrentSceneId('opening');
    setScores({ structure: 12, specificity: 12, trust: 12, timing: 12 });
    setHistory([]);
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  const handleChoice = (choice, index) => {
    setHistory(prev => [...prev, { sceneId: currentSceneId, scores: { ...scores }, choiceIndex: index }]);

    const choiceScores = getScaledScores(currentSceneId, index);
    setScores(prev => ({
      structure: clampScore(prev.structure + (choiceScores.structure || 0)),
      specificity: clampScore(prev.specificity + (choiceScores.specificity || 0)),
      trust: clampScore(prev.trust + (choiceScores.trust || 0)),
      timing: clampScore(prev.timing + (choiceScores.timing || 0)),
    }));

    if (mode === 'explanation') {
      setSelectedChoice({ choice, index });
      setShowFeedback(true);
    } else {
      proceedToNext(choice);
    }
  };

  const proceedToNext = (choice) => {
    setShowFeedback(false);
    setSelectedChoice(null);

    if (choice.next && choice.next.startsWith('ending_')) {
      setCurrentSceneId(choice.next);
      setGameState('ending');
    } else if (choice.next) {
      setCurrentSceneId(choice.next);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentSceneId(lastState.sceneId);
    setScores(lastState.scores);
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  // タイトル画面
  if (gameState === 'title') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '16px' : '20px',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '24px' : '48px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}>
          <h1 style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: '8px', color: '#1F2937' }}>
            {GAME_DATA.title}
          </h1>
          <h2 style={{ fontSize: isMobile ? '16px' : '20px', color: '#6B7280', marginBottom: '20px' }}>
            {GAME_DATA.subtitle}
          </h2>

          <div style={{
            backgroundColor: '#F3F4F6',
            borderRadius: '12px',
            padding: isMobile ? '16px' : '20px',
            marginBottom: '24px',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#374151', marginBottom: '12px' }}>
              <strong>Mission:</strong> {GAME_DATA.mission}
            </p>
            <p style={{ fontSize: isMobile ? '12px' : '13px', color: '#6B7280' }}>
              {GAME_DATA.situationExplanation}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#374151', marginBottom: '16px' }}>
              モードを選択してください
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => startGame('practice')}
                style={{
                  padding: isMobile ? '16px' : '20px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                練習モード
                <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: 'normal', marginTop: '4px', opacity: 0.9 }}>
                  スコアバーのみ表示
                </div>
              </button>

              <button
                onClick={() => startGame('explanation')}
                style={{
                  padding: isMobile ? '16px' : '20px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                解説モード
                <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: 'normal', marginTop: '4px', opacity: 0.9 }}>
                  スコア数値・タグ・解説を表示
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // エンディング画面
  if (gameState === 'ending' && isEnding) {
    const ending = GAME_DATA.endings[currentSceneId];
    const totalScore = getTotalScore();

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '16px' : '20px',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '24px' : '48px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}>
          <div style={{
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '60px' : '80px',
            borderRadius: '50%',
            backgroundColor: ending.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: isMobile ? '32px' : '40px',
          }}>
            {ending.emoji}
          </div>

          <h2 style={{ fontSize: isMobile ? '24px' : '32px', color: ending.color, marginBottom: '16px' }}>
            {ending.title}
          </h2>

          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#374151', marginBottom: '32px' }}>
            {ending.description}
          </p>

          <div style={{
            backgroundColor: '#F3F4F6',
            borderRadius: '16px',
            padding: isMobile ? '20px' : '24px',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: isMobile ? '14px' : '16px', color: '#6B7280', marginBottom: '8px' }}>
              総合スコア
            </div>
            <div style={{ fontSize: isMobile ? '40px' : '48px', fontWeight: 'bold', color: '#1F2937' }}>
              {totalScore}<span style={{ fontSize: isMobile ? '20px' : '24px', color: '#6B7280' }}>/100</span>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              {Object.entries(GAME_DATA.dimensions).map(([key, dim]) => (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: isMobile ? '12px' : '13px', color: '#374151' }}>
                      {dim.icon} {dim.name}
                    </span>
                    <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: 'bold', color: '#1F2937' }}>
                      {scores[key]}/25
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: ((scores[key] / 25) * 100) + '%',
                      backgroundColor: ending.color,
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: '#F0FDF4',
            borderRadius: '12px',
            padding: isMobile ? '16px' : '20px',
            marginBottom: '24px',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>
              ポイント
            </div>
            <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#374151', lineHeight: 1.7, margin: 0 }}>
              {ending.feedback}
            </p>
          </div>

          <button
            onClick={() => setGameState('title')}
            style={{
              padding: isMobile ? '14px 28px' : '16px 32px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            タイトルに戻る
          </button>
        </div>
      </div>
    );
  }

  // ゲームプレイ画面
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F3F4F6',
      padding: isMobile ? '12px' : '20px',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* ヘッダー: スコア表示 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: isMobile ? '12px' : '16px',
          padding: isMobile ? '16px' : '20px',
          marginBottom: isMobile ? '12px' : '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleBack}
                disabled={history.length === 0}
                style={{
                  padding: isMobile ? '8px 12px' : '8px 16px',
                  backgroundColor: history.length === 0 ? '#E5E7EB' : '#6B7280',
                  color: history.length === 0 ? '#9CA3AF' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '12px' : '13px',
                  cursor: history.length === 0 ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                戻る
              </button>
              <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#6B7280' }}>
                スコア
              </span>
            </div>
            {mode === 'explanation' && (
              <span style={{
                fontSize: isMobile ? '11px' : '12px',
                backgroundColor: '#10B981',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                解説モード
              </span>
            )}
          </div>

          {mode === 'practice' ? (
            <div>
              <div style={{
                height: '12px',
                backgroundColor: '#E5E7EB',
                borderRadius: '6px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: ((getTotalScore() / 100) * 100) + '%',
                  backgroundColor: '#3B82F6',
                  borderRadius: '6px',
                }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? '8px' : '12px' }}>
              {Object.entries(GAME_DATA.dimensions).map(([key, dim]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#374151' }}>
                      {dim.icon} {dim.name}
                    </span>
                    <span style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: 'bold', color: '#1F2937' }}>
                      {scores[key]}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: ((scores[key] / 25) * 100) + '%',
                      backgroundColor: '#3B82F6',
                      borderRadius: '3px',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* シーン表示 */}
        {currentScene && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '12px' : '16px',
            padding: isMobile ? '16px' : '24px',
            marginBottom: isMobile ? '12px' : '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <div style={{
                width: isMobile ? '40px' : '48px',
                height: isMobile ? '40px' : '48px',
                borderRadius: '50%',
                backgroundColor: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '20px' : '24px',
                flexShrink: 0,
              }}>
                {getMoodEmoji(currentScene.mood)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: isMobile ? '12px' : '13px', color: '#6B7280', marginBottom: '4px' }}>
                  {GAME_DATA.customer.title} - {GAME_DATA.customer.name}
                </div>
                <p style={{
                  fontSize: isMobile ? '15px' : '16px',
                  color: '#1F2937',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {currentScene.text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 選択肢 */}
        {currentScene && currentScene.choices && !showFeedback && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '10px' : '12px',
          }}>
            {currentScene.choices.map((choice, index) => {
              const tagStyle = getTagStyle(choice.tag);
              const reason = getReason(currentSceneId, index);
              return (
                <button
                  key={index}
                  onClick={() => handleChoice(choice, index)}
                  style={{
                    padding: isMobile ? '14px 16px' : '16px 20px',
                    backgroundColor: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: isMobile ? '10px' : '12px',
                    fontSize: isMobile ? '14px' : '15px',
                    color: '#1F2937',
                    textAlign: 'left',
                    cursor: 'pointer',
                    lineHeight: 1.6,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    {mode === 'explanation' && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: tagStyle.backgroundColor,
                        color: tagStyle.color,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}>
                        {tagStyle.label}
                      </span>
                    )}
                    <div style={{ flex: 1 }}>
                      <div>{choice.text}</div>
                      {mode === 'explanation' && reason && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          marginTop: '6px',
                          paddingLeft: '8px',
                          borderLeft: '2px solid #E5E7EB',
                        }}>
                          → {reason}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* フィードバック表示（解説モードのみ） */}
        {showFeedback && selectedChoice && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '12px' : '16px',
            padding: isMobile ? '16px' : '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: 'bold',
                backgroundColor: getTagStyle(selectedChoice.choice.tag).backgroundColor,
                color: getTagStyle(selectedChoice.choice.tag).color,
                marginBottom: '12px',
              }}>
                {getTagStyle(selectedChoice.choice.tag).label}
              </div>

              <p style={{
                fontSize: isMobile ? '14px' : '15px',
                color: '#1F2937',
                lineHeight: 1.6,
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: '#F3F4F6',
                borderRadius: '8px',
              }}>
                {selectedChoice.choice.text}
              </p>

              <div style={{
                fontSize: isMobile ? '13px' : '14px',
                color: '#374151',
                padding: '12px',
                backgroundColor: '#FEF3C7',
                borderRadius: '8px',
                borderLeft: '4px solid #F59E0B',
              }}>
                <strong>解説:</strong> {getReason(currentSceneId, selectedChoice.index)}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {Object.entries(GAME_DATA.dimensions).map(([key, dim]) => {
                const scoreChange = getScaledScores(currentSceneId, selectedChoice.index)[key] || 0;
                return (
                  <div key={key} style={{
                    padding: '8px 12px',
                    backgroundColor: scoreChange > 0 ? '#ECFDF5' : scoreChange < 0 ? '#FEF2F2' : '#F3F4F6',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#374151' }}>
                      {dim.icon} {dim.name}
                    </span>
                    <span style={{
                      fontSize: isMobile ? '12px' : '13px',
                      fontWeight: 'bold',
                      color: scoreChange > 0 ? '#10B981' : scoreChange < 0 ? '#EF4444' : '#6B7280',
                    }}>
                      {scoreChange > 0 ? '+' : ''}{scoreChange}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => proceedToNext(selectedChoice.choice)}
              style={{
                width: '100%',
                padding: isMobile ? '14px' : '16px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              次へ進む
            </button>
          </div>
        )}

        {/* 自動遷移シーン（選択肢なし） */}
        {currentScene && currentScene.next && !currentScene.choices && (
          <button
            onClick={() => {
              if (currentScene.next.startsWith('ending_')) {
                setCurrentSceneId(currentScene.next);
                setGameState('ending');
              } else {
                setCurrentSceneId(currentScene.next);
              }
            }}
            style={{
              width: '100%',
              padding: isMobile ? '14px' : '16px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            次へ進む
          </button>
        )}
      </div>
    </div>
  );
};

export default ScenarioTemplate;
