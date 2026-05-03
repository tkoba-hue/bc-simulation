/**
 * シナリオデータ検証ユーティリティ
 *
 * 使用方法:
 * import { validateScenario, SCENE_STRUCTURE } from './scenarioValidator';
 * const result = validateScenario(GAME_DATA, SCALED_SCORES, CHOICE_REASONS);
 */

// ============================================
// 固定シナリオ構造
// ============================================
export const SCENE_STRUCTURE = {
  // Phase 1: オープニング
  opening: {
    phase: 1,
    hasChoices: true,
    choices: [
      { next: 'A1_deep', tag: 'good' },
      { next: 'A2_aware', tag: 'neutral' },
      { next: 'B1_premature', tag: 'bad' }
    ]
  },

  // Phase 2A: メインルート
  A1_deep: {
    phase: '2A',
    hasChoices: true,
    choices: [
      { next: 'A1a_survey', tag: 'good' },
      { next: 'A1b_empathy', tag: 'neutral' },
      { next: 'A1c_miss', tag: 'bad' }
    ]
  },
  A1a_survey: {
    phase: '2A',
    hasChoices: true,
    choices: [
      { next: 'A1a2_hidden', tag: 'good' },
      { next: 'A1a2_detail', tag: 'neutral' },
      { next: 'A1a2_skip', tag: 'bad' }
    ]
  },
  A1a2_hidden: {
    phase: '2A',
    hasChoices: true,
    choices: [
      { next: 'A1a3_impact', tag: 'good' },
      { next: 'A1a3_ack', tag: 'neutral' },
      { next: 'M1_merge', tag: 'bad' }
    ]
  },
  A1a3_impact: { phase: '2A', hasChoices: false, next: 'M1_merge' },
  A1a3_ack: { phase: '2A', hasChoices: false, next: 'M1_merge' },
  A1a2_detail: { phase: '2A', hasChoices: false, next: 'M1_merge' },
  A1a2_skip: { phase: '2A', hasChoices: false, next: 'M1_merge' },

  A1b_empathy: {
    phase: '2A',
    hasChoices: true,
    choices: [
      { next: 'A1b2_concept', tag: 'good' },
      { next: 'A1b2_ack', tag: 'neutral' },
      { next: 'M1_merge', tag: 'bad' }
    ]
  },
  A1b2_concept: { phase: '2A', hasChoices: false, next: 'M1_merge' },
  A1b2_ack: { phase: '2A', hasChoices: false, next: 'M1_merge' },

  A1c_miss: {
    phase: '2A',
    hasChoices: true,
    choices: [
      { next: 'A1b_empathy', tag: 'good' },
      { next: 'M1_merge', tag: 'neutral' },
      { next: 'B2_recovery', tag: 'bad' }
    ]
  },

  // Phase 2B: サブルート
  A2_aware: {
    phase: '2B',
    hasChoices: true,
    choices: [
      { next: 'A2a_empathy', tag: 'good' },
      { next: 'A2b_system', tag: 'neutral' },
      { next: 'A2c_miss', tag: 'bad' }
    ]
  },
  A2a_empathy: {
    phase: '2B',
    hasChoices: true,
    choices: [
      { next: 'A2a2_hidden', tag: 'good' },
      { next: 'A2a2_ack', tag: 'neutral' },
      { next: 'M2_merge', tag: 'bad' }
    ]
  },
  A2a2_hidden: { phase: '2B', hasChoices: false, next: 'M2_merge' },
  A2a2_ack: { phase: '2B', hasChoices: false, next: 'M2_merge' },

  A2b_system: {
    phase: '2B',
    hasChoices: true,
    choices: [
      { next: 'A2b2_action', tag: 'good' },
      { next: 'A2b2_ack', tag: 'neutral' },
      { next: 'M2_merge', tag: 'bad' }
    ]
  },
  A2b2_action: { phase: '2B', hasChoices: false, next: 'M2_merge' },
  A2b2_ack: { phase: '2B', hasChoices: false, next: 'M2_merge' },

  A2c_miss: {
    phase: '2B',
    hasChoices: true,
    choices: [
      { next: 'A2a_empathy', tag: 'good' },
      { next: 'M2_merge', tag: 'neutral' },
      { next: 'B2_recovery', tag: 'bad' }
    ]
  },

  // Phase 2C: リカバリー
  B1_premature: {
    phase: '2C',
    hasChoices: true,
    choices: [
      { next: 'B2_recovery', tag: 'good' },
      { next: 'B2_recovery', tag: 'neutral' },
      { next: 'B2_recovery', tag: 'bad' }
    ]
  },
  B2_recovery: {
    phase: '2C',
    hasChoices: true,
    choices: [
      { next: 'B3_back', tag: 'good' },
      { next: 'B3_weak', tag: 'neutral' },
      { next: 'ending_bad', tag: 'bad' }
    ]
  },
  B3_back: { phase: '2C', hasChoices: false, next: 'P_merge' },
  B3_weak: { phase: '2C', hasChoices: false, next: 'P_merge' },

  // 合流点
  M1_merge: { phase: 'merge', hasChoices: false, next: 'P_merge' },
  M2_merge: { phase: 'merge', hasChoices: false, next: 'P_merge' },

  P_merge: {
    phase: 'merge',
    hasChoices: true,
    choices: [
      { next: 'C1_package', tag: 'good' },
      { next: 'C2_general', tag: 'neutral' },
      { next: 'C3_weak', tag: 'bad' }
    ]
  },

  // Phase 3: 提案
  C1_package: {
    phase: 3,
    hasChoices: true,
    choices: [
      { next: 'C1a_tailored', tag: 'good' },
      { next: 'C1b_standard', tag: 'neutral' },
      { next: 'C1c_push', tag: 'bad' }
    ]
  },
  C1a_tailored: {
    phase: 3,
    hasChoices: true,
    choices: [
      { next: 'C1a2_roadmap', tag: 'good' },
      { next: 'C1a2_ack', tag: 'neutral' },
      { next: 'Q_merge', tag: 'bad' }
    ]
  },
  C1a2_roadmap: { phase: 3, hasChoices: false, next: 'Q_merge' },
  C1a2_ack: { phase: 3, hasChoices: false, next: 'Q_merge' },

  C1b_standard: {
    phase: 3,
    hasChoices: true,
    choices: [
      { next: 'C1b2_customize', tag: 'good' },
      { next: 'Q_merge', tag: 'neutral' },
      { next: 'Q_merge', tag: 'bad' }
    ]
  },
  C1b2_customize: { phase: 3, hasChoices: false, next: 'Q_merge' },

  C1c_push: { phase: 3, hasChoices: false, next: 'Q_merge' },

  C2_general: {
    phase: 3,
    hasChoices: true,
    choices: [
      { next: 'C2a_focus', tag: 'good' },
      { next: 'C2b_ack', tag: 'neutral' },
      { next: 'Q_merge', tag: 'bad' }
    ]
  },
  C2a_focus: { phase: 3, hasChoices: false, next: 'Q_merge' },
  C2b_ack: { phase: 3, hasChoices: false, next: 'Q_merge' },

  C3_weak: {
    phase: 3,
    hasChoices: true,
    choices: [
      { next: 'C3a_recover', tag: 'good' },
      { next: 'Q_merge', tag: 'neutral' },
      { next: 'Q_merge', tag: 'bad' }
    ]
  },
  C3a_recover: { phase: 3, hasChoices: false, next: 'Q_merge' },

  // Phase 4: クロージング
  Q_merge: {
    phase: 'merge',
    hasChoices: true,
    choices: [
      { next: 'D1_closing', tag: 'good' },
      { next: 'D2_soft', tag: 'neutral' },
      { next: 'D3_miss', tag: 'bad' }
    ]
  },

  D1_closing: {
    phase: 4,
    hasChoices: true,
    choices: [
      { next: 'D1a_concrete', tag: 'good' },
      { next: 'D1b_delay', tag: 'neutral' },
      { next: 'D2_soft', tag: 'bad' }
    ]
  },
  D1a_concrete: {
    phase: 4,
    hasChoices: true,
    choices: [
      { next: 'D1a2_confirm', tag: 'good' },
      { next: 'D1a2_tentative', tag: 'neutral' },
      { next: 'ending_good', tag: 'bad' }
    ]
  },
  D1a2_confirm: { phase: 4, hasChoices: false, next: 'ending_great' },
  D1a2_tentative: { phase: 4, hasChoices: false, next: 'ending_good' },

  D1b_delay: {
    phase: 4,
    hasChoices: true,
    choices: [
      { next: 'D1b2_push', tag: 'good' },
      { next: 'ending_good', tag: 'neutral' },
      { next: 'ending_neutral', tag: 'bad' }
    ]
  },
  D1b2_push: { phase: 4, hasChoices: false, next: 'ending_good' },

  D2_soft: {
    phase: 4,
    hasChoices: true,
    choices: [
      { next: 'D2a_try', tag: 'good' },
      { next: 'D2b_material', tag: 'neutral' },
      { next: 'ending_neutral', tag: 'bad' }
    ]
  },
  D2a_try: { phase: 4, hasChoices: false, next: 'ending_good' },
  D2b_material: { phase: 4, hasChoices: false, next: 'ending_neutral' },

  D3_miss: { phase: 4, hasChoices: false, next: 'ending_bad' },

  // エンディング
  ending_great: { phase: 'ending', result: 'great' },
  ending_good: { phase: 'ending', result: 'good' },
  ending_neutral: { phase: 'ending', result: 'neutral' },
  ending_bad: { phase: 'ending', result: 'bad' },
};

// ============================================
// 検証関数
// ============================================

/**
 * シナリオデータの整合性をチェック
 * @param {Object} gameData - GAME_DATAオブジェクト
 * @param {Object} scaledScores - SCALED_SCORESオブジェクト
 * @param {Object} choiceReasons - CHOICE_REASONSオブジェクト
 * @returns {Object} { errors: string[], warnings: string[], isValid: boolean }
 */
export function validateScenario(gameData, scaledScores, choiceReasons) {
  const errors = [];
  const warnings = [];

  // 1. GAME_DATAの基本構造チェック
  if (!gameData.title) errors.push('GAME_DATA.title が未設定');
  if (!gameData.subtitle) errors.push('GAME_DATA.subtitle が未設定');
  if (!gameData.mission) errors.push('GAME_DATA.mission が未設定');
  if (!gameData.scenes) errors.push('GAME_DATA.scenes が未設定');
  if (!gameData.endings) errors.push('GAME_DATA.endings が未設定');
  if (!gameData.dimensions) errors.push('GAME_DATA.dimensions が未設定');
  if (!gameData.customer) errors.push('GAME_DATA.customer が未設定');

  if (errors.length > 0) {
    return { errors, warnings, isValid: false };
  }

  // 2. シーンIDチェック
  const sceneIds = Object.keys(gameData.scenes);
  const endingIds = Object.keys(gameData.endings);
  const allIds = [...sceneIds, ...endingIds];

  // 2a. 重複チェック
  const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`重複するシーンID: ${duplicates.join(', ')}`);
  }

  // 2b. 固定構造との比較
  const expectedSceneIds = Object.keys(SCENE_STRUCTURE).filter(id => !id.startsWith('ending_'));
  const expectedEndingIds = Object.keys(SCENE_STRUCTURE).filter(id => id.startsWith('ending_'));

  const missingScenes = expectedSceneIds.filter(id => !sceneIds.includes(id));
  const extraScenes = sceneIds.filter(id => !expectedSceneIds.includes(id));
  const missingEndings = expectedEndingIds.filter(id => !endingIds.includes(id));

  if (missingScenes.length > 0) {
    errors.push(`不足しているシーン: ${missingScenes.join(', ')}`);
  }
  if (extraScenes.length > 0) {
    warnings.push(`追加のシーン（固定構造にない）: ${extraScenes.join(', ')}`);
  }
  if (missingEndings.length > 0) {
    errors.push(`不足しているエンディング: ${missingEndings.join(', ')}`);
  }

  // 3. 各シーンの内容チェック
  sceneIds.forEach(sceneId => {
    const scene = gameData.scenes[sceneId];
    const structure = SCENE_STRUCTURE[sceneId];

    // 必須フィールドチェック
    if (!scene.id) errors.push(`${sceneId}: id が未設定`);
    if (!scene.text) errors.push(`${sceneId}: text が未設定`);
    if (!scene.mood) warnings.push(`${sceneId}: mood が未設定（デフォルト neutral）`);

    // 選択肢/遷移チェック
    if (structure && structure.hasChoices) {
      if (!scene.choices || scene.choices.length === 0) {
        errors.push(`${sceneId}: choices が必要ですが未設定`);
      } else if (scene.choices.length !== 3) {
        warnings.push(`${sceneId}: choices が ${scene.choices.length} 個（推奨: 3個）`);
      } else {
        // 遷移先チェック
        scene.choices.forEach((choice, index) => {
          if (!allIds.includes(choice.next)) {
            errors.push(`${sceneId}: choices[${index}].next "${choice.next}" が存在しません`);
          }
          // 固定構造との遷移先比較
          if (structure.choices[index] && choice.next !== structure.choices[index].next) {
            warnings.push(`${sceneId}: choices[${index}].next が固定値 "${structure.choices[index].next}" と異なります: "${choice.next}"`);
          }
          // タグチェック
          if (!['good', 'neutral', 'bad', 'recovery'].includes(choice.tag)) {
            errors.push(`${sceneId}: choices[${index}].tag が不正: "${choice.tag}"`);
          }
        });
      }
    } else if (structure && !structure.hasChoices) {
      if (!scene.next) {
        errors.push(`${sceneId}: next が必要ですが未設定`);
      } else if (!allIds.includes(scene.next)) {
        errors.push(`${sceneId}: next "${scene.next}" が存在しません`);
      }
    }
  });

  // 4. スコアデータチェック
  sceneIds.forEach(sceneId => {
    const scene = gameData.scenes[sceneId];
    const scoreEntries = scaledScores[sceneId];

    if (scene.choices) {
      if (!scoreEntries) {
        warnings.push(`SCALED_SCORES["${sceneId}"] が未設定`);
      } else if (scoreEntries.length !== scene.choices.length) {
        errors.push(`${sceneId}: choices数(${scene.choices.length})とSCALED_SCORES数(${scoreEntries.length})が不一致`);
      } else {
        // スコア値の範囲チェック
        scoreEntries.forEach((entry, index) => {
          ['structure', 'specificity', 'trust', 'timing'].forEach(dim => {
            const score = entry.scores[dim];
            if (score === undefined) {
              warnings.push(`SCALED_SCORES["${sceneId}"][${index}].scores.${dim} が未設定`);
            } else if (score < -5 || score > 5) {
              warnings.push(`SCALED_SCORES["${sceneId}"][${index}].scores.${dim} = ${score} は通常範囲外（-5〜+5）`);
            }
          });
        });
      }
    }
  });

  // 5. 理由データチェック
  sceneIds.forEach(sceneId => {
    const scene = gameData.scenes[sceneId];
    const reasonEntries = choiceReasons[sceneId];

    if (scene.choices) {
      if (!reasonEntries) {
        warnings.push(`CHOICE_REASONS["${sceneId}"] が未設定`);
      } else if (reasonEntries.length !== scene.choices.length) {
        errors.push(`${sceneId}: choices数(${scene.choices.length})とCHOICE_REASONS数(${reasonEntries.length})が不一致`);
      } else {
        reasonEntries.forEach((entry, index) => {
          if (!entry.reason) {
            warnings.push(`CHOICE_REASONS["${sceneId}"][${index}].reason が空`);
          } else if (entry.reason.length > 25) {
            warnings.push(`CHOICE_REASONS["${sceneId}"][${index}].reason が長すぎます（${entry.reason.length}文字 > 25文字）`);
          }
        });
      }
    }
  });

  // 6. エンディングチェック
  endingIds.forEach(endingId => {
    const ending = gameData.endings[endingId];
    if (!ending.title) errors.push(`${endingId}: title が未設定`);
    if (!ending.description) warnings.push(`${endingId}: description が未設定`);
    if (!ending.feedback) warnings.push(`${endingId}: feedback が未設定`);
    if (!ending.result) errors.push(`${endingId}: result が未設定`);
    if (!ending.color) warnings.push(`${endingId}: color が未設定`);
  });

  return {
    errors,
    warnings,
    isValid: errors.length === 0
  };
}

/**
 * スコアシミュレーション
 * 全ルートを探索して最終スコアの範囲を計算
 */
export function simulateScores(gameData, scaledScores) {
  const results = {
    paths: [],
    minScore: 100,
    maxScore: 0,
    endings: {
      great: 0,
      good: 0,
      neutral: 0,
      bad: 0
    }
  };

  function traverse(sceneId, scores, path) {
    const scene = gameData.scenes[sceneId];
    const ending = gameData.endings[sceneId];

    if (ending) {
      const total = scores.structure + scores.specificity + scores.trust + scores.timing;
      results.paths.push({ path, scores: { ...scores }, total, ending: ending.result });
      results.minScore = Math.min(results.minScore, total);
      results.maxScore = Math.max(results.maxScore, total);
      results.endings[ending.result]++;
      return;
    }

    if (!scene) return;

    if (scene.choices) {
      scene.choices.forEach((choice, index) => {
        const scoreEntry = scaledScores[sceneId]?.find(e => e.index === index);
        const newScores = {
          structure: Math.max(0, Math.min(25, scores.structure + (scoreEntry?.scores?.structure || 0))),
          specificity: Math.max(0, Math.min(25, scores.specificity + (scoreEntry?.scores?.specificity || 0))),
          trust: Math.max(0, Math.min(25, scores.trust + (scoreEntry?.scores?.trust || 0))),
          timing: Math.max(0, Math.min(25, scores.timing + (scoreEntry?.scores?.timing || 0))),
        };
        traverse(choice.next, newScores, [...path, { scene: sceneId, choice: index, tag: choice.tag }]);
      });
    } else if (scene.next) {
      traverse(scene.next, scores, [...path, { scene: sceneId, auto: true }]);
    }
  }

  traverse('opening', { structure: 12, specificity: 12, trust: 12, timing: 12 }, []);

  return results;
}

/**
 * 到達可能性チェック
 * 全エンディングに到達可能かチェック
 */
export function checkReachability(gameData) {
  const reachable = new Set();
  const queue = ['opening'];

  while (queue.length > 0) {
    const sceneId = queue.shift();
    if (reachable.has(sceneId)) continue;
    reachable.add(sceneId);

    const scene = gameData.scenes[sceneId];
    const ending = gameData.endings[sceneId];

    if (ending) continue;
    if (!scene) continue;

    if (scene.choices) {
      scene.choices.forEach(choice => {
        if (!reachable.has(choice.next)) {
          queue.push(choice.next);
        }
      });
    } else if (scene.next) {
      if (!reachable.has(scene.next)) {
        queue.push(scene.next);
      }
    }
  }

  const allSceneIds = [...Object.keys(gameData.scenes), ...Object.keys(gameData.endings)];
  const unreachable = allSceneIds.filter(id => !reachable.has(id));

  const endingIds = Object.keys(gameData.endings);
  const reachableEndings = endingIds.filter(id => reachable.has(id));
  const unreachableEndings = endingIds.filter(id => !reachable.has(id));

  return {
    reachableCount: reachable.size,
    totalCount: allSceneIds.length,
    unreachableScenes: unreachable,
    reachableEndings,
    unreachableEndings,
    allEndingsReachable: unreachableEndings.length === 0
  };
}

export default {
  SCENE_STRUCTURE,
  validateScenario,
  simulateScores,
  checkReachability
};
