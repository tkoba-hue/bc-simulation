# kaigo-sales-simulation.jsx シナリオ検証結果

**検証日**: 2026-02-11
**対象ファイル**: `/mnt/c/Users/CWGCo/Downloads/kaigo-sales-simulation.jsx`

---

## 概要

このレポートは、介護営業シミュレーションゲームのシナリオデータに対する構造検証結果です。

### 検証サマリー

| 項目 | 状態 | 詳細 |
|------|------|------|
| 未定義のnext参照 | **問題あり** | 11件の未定義シーンへの参照 |
| 孤立シーン | **問題あり** | 9件のシーンがどこからも参照されない |
| エンディング到達性 | **条件付きOK** | 未定義nextを修正すれば全ルート到達可能 |
| 無限ループ | **許容範囲** | 1つの循環が存在するが脱出可能 |

---

## 1. 未定義のnext参照（重大な問題）

以下の`next`値は存在しないシーンIDを参照しており、ゲーム進行が停止する可能性があります。

| 未定義のシーンID | 参照元ファイル行 | 推奨される修正先 |
|-----------------|----------------|----------------|
| `seminar_action` | 198行目 | `seminar_concept` または `action_oriented` |
| `tool_intro` | 222行目 | `lcat_intro` または `consultation_intro` |
| `package_detail` | 232行目 | `package_approach` または `tailored_proposal` |
| `budget_first` | 234行目 | `ask_budget` または `budget_discussion` |
| `timing_discussion` | 245行目 | `timing_confirmation` |
| `send_material` | 246行目 | `ending_neutral` |
| `scheduling` | 269行目 | `timing_confirmation` |
| `pricing` | 270行目 | `budget_discussion` |
| `defer_pricing` | 282行目 | `ending_neutral` |
| `quote_offer` | 294行目 | `ending_good` または `ending_neutral` |
| `care_day` | 333行目 | `timing_options` |

### 修正例

```javascript
// 198行目: seminar_action -> seminar_concept に変更
{ text: 'そこで弊社のセミナーでは、具体的なアクションまでお伝えしています。',
  next: 'seminar_concept',  // 修正: seminar_action -> seminar_concept
  scores: { structure: 10, trust: 5, specificity: 10, timing: 0 }, tag: 'neutral' },
```

---

## 2. 重複シーンID（重大な問題）

JavaScriptオブジェクトでは、同じキーが複数定義されている場合、**最後の定義のみが有効**になります。
以下のシーンIDが重複定義されており、先に定義された内容は上書きされて無効になっています。

### 重複しているシーンID（12件）

| シーンID | 問題 |
|---------|------|
| `seminar_results` | 2回定義（250行目と884行目付近） |
| `premature_pitch` | 2回定義（351行目と1220行目付近） |
| `miss_opportunity` | 2回定義（363行目と1212行目付近） |
| `just_empathy` | 2回定義（415行目と940行目付近） |
| `ask_demographics` | 2回定義（452行目と1036行目付近） |
| `parent_age` | 2回定義（464行目と1048行目付近） |
| `next_action` | 2回定義（536行目と964行目付近） |
| `ask_data` | 2回定義（548行目と1012行目付近） |
| `just_acknowledge` | 2回定義（560行目と928行目付近） |
| `lcat_intro` | 2回定義（620行目と1132行目付近） |
| `lcat_detail` | 2回定義（644行目と1144行目付近） |
| `both_seminars` | 2回定義（692行目と860行目付近） |

### 修正方針

#### 方針A: 重複を削除して1つに統一
- 最も安全な方法
- どちらの内容が正しいか確認し、不要な方を削除

#### 方針B: 別のIDにリネーム
- 両方のシーンを活かしたい場合
- 例: `seminar_results` と `seminar_results_detailed` のように区別
- 参照元も合わせて更新が必要

---

## 3. 孤立シーン（どこからも参照されない）

以下のシーンは定義されているが、どのシーンからも参照されていません。
これは主に「重複定義により参照元が上書きされた」ことが原因です。

| 孤立シーンID | 原因 |
|-------------|------|
| `satisfaction_detail` | 参照元 `seminar_results` が上書きされた |
| `push_pitch` | 参照元 `premature_pitch` が上書きされた |
| `weak_proposal` | 参照元 `miss_opportunity` が上書きされた |
| `recovery_challenge` | 参照元が上書きされた |
| `vague_question` | 参照元 `premature_pitch` が上書きされた |
| `ask_cause` | 参照元が上書きされた |
| `awareness_check` | 参照元 `parent_age` が上書きされた |
| `general_proposal` | 参照元 `ask_data` が上書きされた |
| `general_acknowledge` | 参照元が上書きされた |

### 対処法
重複シーンIDの問題を解決すれば、これらの孤立シーンも自動的に到達可能になります。

---

## 4. エンディング到達性

### 結論: 条件付きで問題なし

- 未定義の`next`参照を修正すれば、**全ルートはエンディングに到達可能**です
- 有効なエンディングID:
  - `ending_great` - 大成功
  - `ending_good` - 成功
  - `ending_neutral` - 様子見
  - `ending_bad` - 失注

### 現状の問題
未定義の`next`を選択した場合、ゲームがクラッシュまたは停止します。

---

## 5. 無限ループの可能性

### 検出されたループパス

```
deepdive_current -> premature_pitch -> recovery_question -> deepdive_current
```

### 評価: 許容範囲

- このループは**強制ループではない**
- 各シーンには他の選択肢があり、ループから脱出可能
- プレイヤーの選択次第でループに入る可能性があるが、ゲームとしては意図的な設計の可能性あり

### 対策（任意）

ループを完全に防ぎたい場合:

```javascript
// recovery_question の選択肢を変更
// deepdive_current に戻らず、別のシーンへ誘導
{ text: '実効性がない、というのは具体的にはどのあたりですか？',
  next: 'ask_survey',  // deepdive_current ではなく ask_survey へ
  scores: { structure: 10, trust: 10, specificity: 5, timing: 5 }, tag: 'good' },
```

---

## 修正作業チェックリスト

### 優先度: 高（ゲームが動作しなくなる問題）

- [ ] 未定義の`next`参照11件を修正
- [ ] 重複シーンID 12件を整理

### 優先度: 中（ゲームは動作するがコンテンツが無駄になる問題）

- [ ] 孤立シーン9件の到達性を確保（重複ID修正で解決される見込み）

### 優先度: 低（任意の改善）

- [ ] ループパスの検討（意図的な設計か確認）

---

## 推奨される修正手順

### ステップ1: 重複シーンIDの解決

各重複について、どちらの定義を採用するか決定し、不要な方を削除または別IDにリネーム。

### ステップ2: 未定義nextの修正

上記の推奨修正先を参考に、11件の未定義参照を有効なシーンIDまたはエンディングIDに変更。

### ステップ3: 検証の再実行

修正後、以下のコマンドで再検証を推奨:

```bash
# Node.jsで簡易検証スクリプトを実行
node -e "
const fs = require('fs');
const text = fs.readFileSync('/path/to/kaigo-sales-simulation.jsx','utf8');
// ... 検証ロジック
"
```

---

## 補足: シナリオ構造の統計

| 項目 | 数値 |
|------|------|
| 定義されたシーン数 | 108個（重複含む） |
| ユニークなシーンID | 96個 |
| エンディング数 | 4個 |
| 選択肢の総数 | 約200個 |

---

*このレポートはCodex CLI (gpt-5.2-codex) による自動分析に基づいて作成されました。*
