'use client';

import React, { useState, useEffect, useCallback } from 'react';

const GAME_DATA = {
  title: '仕事と介護の両立支援',
  subtitle: '初回商談シミュレーション',
  mission: '会社紹介を終えた初回商談。顧客の課題を引き出し、次回商談につなげよ。',
  
  // 評価次元
  dimensions: {
    structure: { name: '構成力', description: '適切な順序で話を進めたか', icon: '📐' },
    specificity: { name: '具体性', description: '数字や事例を使ったか', icon: '📊' },
    trust: { name: '信頼度', description: '共感・傾聴ができたか', icon: '🤝' },
    timing: { name: '時間感覚', description: '適切なペースで進めたか', icon: '⏱️' },
  },
  
  // 顧客ペルソナ
  customer: {
    name: '担当者',
    title: 'ダイバーシティ推進室',
    avatar: '👤',
    initialMood: 'neutral',
  },
  
  // シーンデータ
  scenes: {
    // === オープニング ===
    opening: {
      id: 'opening',
      speaker: 'customer',
      text: 'はい、ありがとうございます。当社も今年4月の法改正に合わせて、一通り対応は済ませているんですけれども…正直、その先どうしていくかというところで。',
      mood: 'neutral',
      choices: [
        {
          text: 'なるほど、法対応はお済みなんですね。ちなみに、今どんな取り組みをされていますか？',
          next: 'deepdive_current',
          scores: { structure: 15, trust: 10, timing: 5 },
          tag: 'good',
        },
        {
          text: 'そうなんですね。弊社ではLCATという実態把握ツールがありまして…',
          next: 'premature_lcat',
          scores: { structure: -10, trust: -5, timing: 0 },
          tag: 'bad',
        },
        {
          text: '法改正の内容について、社員の方々への周知はできていますか？',
          next: 'ask_awareness',
          scores: { structure: 10, trust: 5, timing: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    // === 深掘りルート ===
    deepdive_current: {
      id: 'deepdive_current',
      speaker: 'customer',
      text: 'えっと、一応イントラに制度のガイドブックは載せてまして。あとは労働局の動画を全社に案内したんですけど…正直、どのくらい見てもらえているか。',
      mood: 'thinking',
      choices: [
        {
          text: 'アンケートや実態調査などは実施されましたか？',
          next: 'ask_survey',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '見てもらえているか分からない、というのは悩ましいですよね。',
          next: 'empathy_awareness',
          scores: { structure: 5, trust: 15, timing: 5 },
          tag: 'good',
        },
        {
          text: 'では弊社のセミナーで周知を図るのはいかがでしょうか？',
          next: 'premature_seminar',
          scores: { structure: -5, trust: -5, timing: -5 },
          tag: 'bad',
        },
      ],
    },
    
    ask_awareness: {
      id: 'ask_awareness',
      speaker: 'customer',
      text: 'えー、そこが正直課題でして。制度があることは伝えたんですけど、内容まで理解しているかというと…介護保険制度のことを聞かれても、こちらも答えられなくて。',
      mood: 'worried',
      choices: [
        {
          text: 'なるほど、そこは多くの企業様が悩まれるところです。実態把握はされていますか？',
          next: 'ask_survey',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: 'そうですよね、介護保険制度は複雑ですからね。',
          next: 'empathy_system',
          scores: { structure: 5, trust: 10, timing: 5 },
          tag: 'neutral',
        },
        {
          text: '弊社のセミナーでは、介護保険の基礎から説明できます。',
          next: 'explain_seminar_basic',
          scores: { structure: 0, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    // === 実態調査の話 ===
    ask_survey: {
      id: 'ask_survey',
      speaker: 'customer',
      text: '実は10月にアンケートを取りまして。2,300人くらい回答があったんですけど…「困っていない」という回答が多くて。でも本当にそうなのかな、と。',
      mood: 'thinking',
      choices: [
        {
          text: 'そこが実は多くの企業様で課題になっていまして。「隠れ介護」と呼ばれる現象があります。',
          next: 'hidden_care',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '2,300名の回答は多いですね。具体的にはどんな項目を聞かれましたか？',
          next: 'survey_detail',
          scores: { structure: 10, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '困っていないなら、当面は大丈夫かもしれませんね。',
          next: 'miss_opportunity',
          scores: { structure: -15, trust: -10, timing: -10 },
          tag: 'bad',
        },
      ],
    },
    
    // === 共感ルート ===
    empathy_awareness: {
      id: 'empathy_awareness',
      speaker: 'customer',
      text: 'そうなんです。制度を作っても使われなければ意味がないですし、そもそも社員がどのくらい介護を抱えているのかも見えていなくて。',
      mood: 'worried',
      choices: [
        {
          text: 'まさにそこが課題ですよね。実態が見えないと手の打ちようがない。実態調査などはされましたか？',
          next: 'ask_survey',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '介護は「隠れる」性質があるんです。実は多くの企業で同じ課題が出ています。',
          next: 'hidden_care',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '当社のサービスで可視化できますよ。',
          next: 'premature_service',
          scores: { structure: -5, trust: -10, timing: 0 },
          tag: 'bad',
        },
      ],
    },
    
    empathy_system: {
      id: 'empathy_system',
      speaker: 'customer',
      text: 'そうなんですよ。ケアマネージャーって何？要介護度って？と聞かれても、私たちも詳しくないので…',
      mood: 'worried',
      choices: [
        {
          text: '実は、細かい制度を覚える必要はあまりないんです。重要なのは「どこに相談すればいいか」を知ること。',
          next: 'concept_shift',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '弊社のセミナーでは介護保険制度について詳しく解説します。',
          next: 'explain_system_detail',
          scores: { structure: 0, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
        {
          text: '分かります。介護は本当に複雑ですよね。',
          next: 'just_empathy',
          scores: { structure: 0, trust: 10, timing: -5 },
          tag: 'neutral',
        },
      ],
    },
    
    // === 隠れ介護ルート ===
    hidden_care: {
      id: 'hidden_care',
      speaker: 'customer',
      text: '隠れ介護…ですか？',
      mood: 'curious',
      choices: [
        {
          text: 'はい。介護は突然始まり、キャリアへの影響を恐れて言い出せない方が多いんです。特に40〜50代の中核社員に多く見られます。',
          next: 'hidden_care_detail',
          scores: { structure: 10, trust: 5, specificity: 15 },
          tag: 'good',
        },
        {
          text: '「困っていない」と答えた方の中に、実は介護を抱えている方がいる可能性があります。',
          next: 'hidden_care_risk',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'そうです。弊社のLCATで可視化できます。',
          next: 'lcat_intro',
          scores: { structure: 5, trust: 0, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    hidden_care_detail: {
      id: 'hidden_care_detail',
      speaker: 'customer',
      text: 'たしかに、うちも平均年齢が上がってきていて…特に管理職層は50代が多いです。',
      mood: 'thinking',
      choices: [
        {
          text: 'まさにそこがリスクです。経産省の試算では、2030年には約9兆円の経済損失が見込まれていて、その多くが管理職層のパフォーマンス低下です。',
          next: 'economic_impact',
          scores: { structure: 10, trust: 5, specificity: 15 },
          tag: 'good',
        },
        {
          text: '御社の40代・50代の比率はどのくらいですか？',
          next: 'ask_demographics',
          scores: { structure: 5, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: 'では管理職向けのセミナーがおすすめです。',
          next: 'manager_seminar_intro',
          scores: { structure: 5, trust: 0, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    hidden_care_risk: {
      id: 'hidden_care_risk',
      speaker: 'customer',
      text: 'そうですか…アンケートでは「現在介護していない」が多かったんですが、5年以内に可能性がある人は結構いたんですよ。',
      mood: 'thinking',
      choices: [
        {
          text: 'そこが重要です。「予備軍」の方々に今から準備してもらうことで、いざという時の離職やパフォーマンス低下を防げます。',
          next: 'prevention_concept',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '5年以内というのは、親御さんの年齢層も上がってきているということですね。',
          next: 'parent_age',
          scores: { structure: 5, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: 'では今のうちにセミナーで意識づけをするのが良いですね。',
          next: 'seminar_timing',
          scores: { structure: 10, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    // === 調査詳細ルート ===
    survey_detail: {
      id: 'survey_detail',
      speaker: 'customer',
      text: '介護の有無、今後の可能性、社内制度の認知度、介護保険の理解度…といった感じです。',
      mood: 'neutral',
      choices: [
        {
          text: 'しっかり設計されていますね。認知度と理解度のところ、差はありましたか？',
          next: 'gap_analysis',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'なるほど。その結果を踏まえて、次のアクションは何か考えていらっしゃいますか？',
          next: 'next_action',
          scores: { structure: 15, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: 'その調査結果を拝見することは可能ですか？',
          next: 'ask_data',
          scores: { structure: 5, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    gap_analysis: {
      id: 'gap_analysis',
      speaker: 'customer',
      text: 'まさにそこなんです。「制度があることは知っている」が8割なのに、「内容を理解している」は2割くらいで…',
      mood: 'worried',
      choices: [
        {
          text: 'その差が「実効性の壁」です。制度があっても使えなければ意味がない。そこを埋めるのが次のステップですね。',
          next: 'effectiveness_wall',
          scores: { structure: 15, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'なるほど。周知と理解にギャップがあるということですね。',
          next: 'just_acknowledge',
          scores: { structure: 5, trust: 10, specificity: 5 },
          tag: 'neutral',
        },
        {
          text: 'では弊社のセミナーで理解度を高めましょう。',
          next: 'seminar_proposal',
          scores: { structure: 10, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    // === 経済インパクト ===
    economic_impact: {
      id: 'economic_impact',
      speaker: 'customer',
      text: '9兆円…そんなに影響があるんですか。',
      mood: 'surprised',
      choices: [
        {
          text: 'はい。離職だけでなく、「隠れ介護」による生産性低下が大きいんです。御社でも、見えないところで影響が出ている可能性があります。',
          next: 'productivity_impact',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'ですので、早めの対策が重要です。御社のように法対応を終えた企業が次に取り組むべきは「実効性」です。',
          next: 'effectiveness_intro',
          scores: { structure: 15, trust: 5, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'そうなんです。では対策として弊社のサービスをご紹介しますね。',
          next: 'service_intro',
          scores: { structure: 5, trust: -5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    // === 実効性の壁 ===
    effectiveness_wall: {
      id: 'effectiveness_wall',
      speaker: 'customer',
      text: 'まさに…制度を作って終わりじゃないんですよね。でも、具体的に何をすればいいのか。',
      mood: 'thinking',
      choices: [
        {
          text: '私たちは「教育・相談・実態把握」の3つを軸にした支援パッケージをご用意しています。御社の状況だと…',
          next: 'package_intro',
          scores: { structure: 15, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'そこで弊社がお手伝いできます。まずは実態把握から始めるのが一般的です。',
          next: 'lcat_intro_good',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'good',
        },
        {
          text: '多くの企業様がセミナーから始められています。',
          next: 'seminar_intro',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    // === コンセプト転換 ===
    concept_shift: {
      id: 'concept_shift',
      speaker: 'customer',
      text: 'そうなんですか？制度を詳しく知らないとダメだと思っていました。',
      mood: 'curious',
      choices: [
        {
          text: 'いえ、実務的には「地域包括支援センターに連絡する」という一歩が最重要です。制度はケアマネさんが教えてくれます。',
          next: 'action_focus',
          scores: { structure: 10, trust: 15, specificity: 15 },
          tag: 'good',
        },
        {
          text: '弊社のセミナーでは制度の説明よりも「考え方」を重視しています。満足度が高いのはそのためです。',
          next: 'seminar_concept',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'そうですね、ポイントを絞ってお伝えすることが大事です。',
          next: 'general_response',
          scores: { structure: 5, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    action_focus: {
      id: 'action_focus',
      speaker: 'customer',
      text: 'なるほど…確かに、社員にも「何かあったらここに連絡」と伝えた方が分かりやすいですね。',
      mood: 'positive',
      choices: [
        {
          text: 'まさにそうです。そして社内でも相談できる体制があると、社員の心理的安全性が高まります。',
          next: 'consultation_intro',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'はい。加えて、管理職が部下の変化に気づけるよう、マネジメント層への教育も効果的です。',
          next: 'manager_education',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'そこで弊社のセミナーでは、具体的なアクションまでお伝えしています。',
          next: 'seminar_action',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    // === 予防概念 ===
    prevention_concept: {
      id: 'prevention_concept',
      speaker: 'customer',
      text: '事前準備が大事ということですね。でも、介護が始まっていない人に危機感を持ってもらうのは難しいですよね…',
      mood: 'thinking',
      choices: [
        {
          text: 'そこがポイントです。「親の介護」ではなく「自分のキャリア」の問題として捉えてもらう。そうすると関心が変わります。',
          next: 'career_framing',
          scores: { structure: 15, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '弊社のセミナーでは、実際に両立されている方の事例をお伝えしています。リアリティが違うと好評です。',
          next: 'case_study',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '確かに難しいですね。強制的に受講させる企業もあります。',
          next: 'mandatory_approach',
          scores: { structure: 0, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    career_framing: {
      id: 'career_framing',
      speaker: 'customer',
      text: 'キャリアの問題…確かに、そう言われると自分事になりますね。',
      mood: 'positive',
      choices: [
        {
          text: 'はい。弊社のセミナーでは「仕事と介護の両立」という切り口で、15万人以上に受講いただいています。',
          next: 'seminar_results',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '例えば、管理職の方には「部下がいつ介護を始めてもおかしくない」という視点で研修しています。',
          next: 'manager_perspective',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'そういった意識づけのためのツールもご用意しています。',
          next: 'tool_intro',
          scores: { structure: 5, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    // === パッケージ紹介 ===
    package_intro: {
      id: 'package_intro',
      speaker: 'customer',
      text: '教育・相談・実態把握…具体的にはどんな内容ですか？',
      mood: 'curious',
      choices: [
        {
          text: 'まず教育では、90分のオンラインセミナーで意識改革を。相談は介護の専門家による外部窓口。実態把握はLCATという診断ツールです。',
          next: 'package_detail',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '御社の場合、すでに実態調査をされているので、次は「教育」から入るのが効果的です。',
          next: 'tailored_proposal',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'いろいろありますが、予算に応じて組み合わせできます。',
          next: 'budget_first',
          scores: { structure: 0, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    tailored_proposal: {
      id: 'tailored_proposal',
      speaker: 'customer',
      text: 'そうですね、調査はしたので次のアクションを考えたいと思っていたところです。',
      mood: 'positive',
      choices: [
        {
          text: '多くの企業様が「全社向けセミナー → テーマ別セミナー → 継続フォロー」というステップで進めています。御社の場合も…',
          next: 'roadmap',
          scores: { structure: 15, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'では、来期の計画に入れていただく形ですね。時期としてはいつ頃がよろしいですか？',
          next: 'timing_discussion',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '一度、詳しい資料をお送りしましょうか？',
          next: 'send_material',
          scores: { structure: 5, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    // === セミナー紹介系 ===
    seminar_results: {
      id: 'seminar_results',
      speaker: 'customer',
      text: '15万人…かなり実績があるんですね。満足度はどのくらいですか？',
      mood: 'curious',
      choices: [
        {
          text: '平均で96.5%以上です。制度の説明より「考え方」を重視しているのが特徴で、「自分事として考えられた」という声が多いです。',
          next: 'satisfaction_detail',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '非常に高いです。例えば先日の某製造業様では、終了後に「すぐ親と話してみる」という声が多く上がりました。',
          next: 'example_company',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '高いです。資料に詳細がありますのでお送りします。',
          next: 'defer_detail',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    satisfaction_detail: {
      id: 'satisfaction_detail',
      speaker: 'customer',
      text: '「自分事として考えられた」…それが大事ですよね。うちの社員にもそう思ってもらいたい。',
      mood: 'positive',
      choices: [
        {
          text: 'ありがとうございます。御社の場合、まず全社向けセミナーで意識づけをして、その後テーマ別で深掘りという流れがおすすめです。',
          next: 'roadmap',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '来期のスケジュールはもう決まっていますか？早めに日程を押さえていただければ、講師の調整も可能です。',
          next: 'scheduling',
          scores: { structure: 10, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
        {
          text: '費用感としては、90分のセミナーで約50〜60万円です。',
          next: 'pricing',
          scores: { structure: 5, trust: 0, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    // === ロードマップ ===
    roadmap: {
      id: 'roadmap',
      speaker: 'customer',
      text: 'ステップを踏んで進めていくということですね。年間でどのくらいの予算感になりますか？',
      mood: 'curious',
      choices: [
        {
          text: '全社セミナーが50〜60万円、テーマ別が追加で同程度です。ただ、単発で終わらせず継続することで効果が出ます。',
          next: 'budget_discussion',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '御社の課題に合わせてカスタマイズできますので、まずは来期どこまでやりたいか、一緒に整理しましょうか。',
          next: 'planning_together',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '資料に価格表がありますので、後ほどお送りします。',
          next: 'defer_pricing',
          scores: { structure: 0, trust: -5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    planning_together: {
      id: 'planning_together',
      speaker: 'customer',
      text: 'そうですね…まずは全社向けのセミナーをやって、反応を見たいというのはあります。',
      mood: 'positive',
      choices: [
        {
          text: '承知しました。では、来期の早いタイミングで全社セミナーを実施し、アンケートで次の課題を見つける、というステップはいかがでしょう？',
          next: 'concrete_plan',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '良い進め方ですね。時期としてはいつ頃をお考えですか？',
          next: 'timing_confirmation',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: 'では全社セミナーのお見積もりをお出ししますね。',
          next: 'quote_offer',
          scores: { structure: 5, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    concrete_plan: {
      id: 'concrete_plan',
      speaker: 'customer',
      text: '5月か6月くらいが社内的には落ち着いていていいかなと思います。アンケートを取ったのが10月なので、間が空きすぎない方がいいですし。',
      mood: 'positive',
      choices: [
        {
          text: 'そうですね。5〜6月であれば講師の調整も可能です。一度、具体的な日程候補と内容をご提案させていただけますか？',
          next: 'next_meeting',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '承知しました。では改めて、御社向けのプランと見積もりをまとめて、来週あたりにお時間いただけますか？',
          next: 'next_meeting_alt',
          scores: { structure: 15, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '5〜6月ですね、資料をお送りします。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    // === クロージング系 ===
    next_meeting: {
      id: 'next_meeting',
      speaker: 'customer',
      text: 'はい、ぜひお願いします。あと、上司にも同席してもらった方がいいかもしれないので、その調整もしておきますね。',
      mood: 'positive',
      next: 'ending_great',
    },
    
    next_meeting_alt: {
      id: 'next_meeting_alt',
      speaker: 'customer',
      text: 'ありがとうございます。来週の後半でしたら調整できると思います。',
      mood: 'positive',
      next: 'ending_great',
    },
    
    timing_confirmation: {
      id: 'timing_confirmation',
      speaker: 'customer',
      text: '上期中…5月から7月くらいでしょうか。あ、でも介護の日が11月にあるんでしたっけ？そこに合わせるのもありかな。',
      mood: 'thinking',
      choices: [
        {
          text: 'どちらもありです。上期は「早めの意識づけ」、秋は「介護の日に合わせて注目度を上げる」という狙いがあります。御社はどちらが合いそうですか？',
          next: 'timing_options',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '介護の日に合わせる企業様も増えています。社内広報としても打ち出しやすいですよね。',
          next: 'care_day',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '日程が決まったらご連絡ください。',
          next: 'ending_neutral',
          scores: { structure: -5, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    timing_options: {
      id: 'timing_options',
      speaker: 'customer',
      text: 'アンケートを取ったのが10月なので、間を空けすぎない方がいいかな…やっぱり上期ですかね。',
      mood: 'positive',
      choices: [
        {
          text: '良い判断だと思います。では来期の計画に入れていただく形で、改めて詳細をご提案させてください。',
          next: 'ending_good',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '承知しました。1月中に予算取りに必要な資料をお送りできますので、スケジュール感を教えてください。',
          next: 'ending_good',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'では資料をお送りします。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    // === バッドルート ===
    premature_lcat: {
      id: 'premature_lcat',
      speaker: 'customer',
      text: 'あ、はい…えっと、まだそこまで具体的に考えているわけではないんですが。',
      mood: 'hesitant',
      choices: [
        {
          text: '失礼しました。まずは御社の状況をお聞かせいただけますか？今、どのような取り組みをされていますか？',
          next: 'recovery_current',
          scores: { structure: 10, trust: 10, timing: 5 },
          tag: 'recovery',
        },
        {
          text: 'LCATは実態把握に非常に有効でして…',
          next: 'push_lcat',
          scores: { structure: -10, trust: -10, timing: -5 },
          tag: 'bad',
        },
        {
          text: 'そうですか。では何かお困りのことはありますか？',
          next: 'vague_question',
          scores: { structure: 0, trust: 5, timing: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    premature_seminar: {
      id: 'premature_seminar',
      speaker: 'customer',
      text: 'えーと…そうですね、まだ予算も確保できていないので、すぐにというのは難しいかもしれません。',
      mood: 'hesitant',
      choices: [
        {
          text: '承知しました。予算のことはいったん置いて、御社として今後どうしていきたいか、お聞かせいただけますか？',
          next: 'recovery_vision',
          scores: { structure: 10, trust: 10, timing: 5 },
          tag: 'recovery',
        },
        {
          text: '予算感としては50万円くらいからできますが…',
          next: 'push_budget',
          scores: { structure: -5, trust: -10, timing: -5 },
          tag: 'bad',
        },
        {
          text: 'そうですか…では検討されたらご連絡ください。',
          next: 'ending_bad',
          scores: { structure: -15, trust: -10, timing: -10 },
          tag: 'bad',
        },
      ],
    },
    
    premature_service: {
      id: 'premature_service',
      speaker: 'customer',
      text: 'そうなんですか…まあ、興味はありますが。',
      mood: 'hesitant',
      choices: [
        {
          text: 'ただ、その前にもう少し御社の状況を教えていただけますか？実態調査などはされましたか？',
          next: 'ask_survey',
          scores: { structure: 10, trust: 10, timing: 5 },
          tag: 'recovery',
        },
        {
          text: '弊社のサービスは多くの企業様にご利用いただいていまして…',
          next: 'push_service',
          scores: { structure: -10, trust: -10, timing: -5 },
          tag: 'bad',
        },
        {
          text: 'まずは資料をお送りしましょうか？',
          next: 'ending_neutral',
          scores: { structure: 0, trust: 0, timing: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    miss_opportunity: {
      id: 'miss_opportunity',
      speaker: 'customer',
      text: 'そうですかね…でも、法対応はしたので、何かやらないといけないとは思っているんですが。',
      mood: 'disappointed',
      choices: [
        {
          text: '失礼しました。そうですよね、法対応の「その先」が大事ですよね。どのあたりに課題を感じていらっしゃいますか？',
          next: 'recovery_challenge',
          scores: { structure: 10, trust: 10, timing: 5 },
          tag: 'recovery',
        },
        {
          text: '何かあればご連絡ください。',
          next: 'ending_bad',
          scores: { structure: -15, trust: -10, timing: -10 },
          tag: 'bad',
        },
        {
          text: '弊社のサービスがお役に立てるかもしれません。',
          next: 'weak_proposal',
          scores: { structure: -5, trust: -5, timing: 0 },
          tag: 'bad',
        },
      ],
    },
    
    push_lcat: {
      id: 'push_lcat',
      speaker: 'customer',
      text: 'はあ…まあ、検討はしてみますが、今日のところは情報収集ということで。',
      mood: 'cold',
      next: 'ending_bad',
    },
    
    push_budget: {
      id: 'push_budget',
      speaker: 'customer',
      text: '…そうですか。ちょっと社内で検討してみます。',
      mood: 'cold',
      next: 'ending_bad',
    },
    
    push_service: {
      id: 'push_service',
      speaker: 'customer',
      text: 'わかりました…資料があればいただけますか。',
      mood: 'cold',
      next: 'ending_neutral',
    },
    
    weak_proposal: {
      id: 'weak_proposal',
      speaker: 'customer',
      text: 'そうですか…まあ、資料だけいただけますか。',
      mood: 'cold',
      next: 'ending_neutral',
    },
    
    // === リカバリールート ===
    recovery_current: {
      id: 'recovery_current',
      speaker: 'customer',
      text: 'そうですね…一応、イントラに制度の案内は載せたんですけど、それだけで終わっちゃっていて。',
      mood: 'neutral',
      choices: [
        {
          text: 'なるほど。案内を載せただけでは、なかなか見てもらえないですよね。実態調査などはされましたか？',
          next: 'ask_survey',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '制度を作っても使われないと意味がないですよね。そこが課題だと感じていらっしゃる？',
          next: 'empathy_awareness',
          scores: { structure: 10, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '弊社のセミナーで周知を図るのはいかがでしょうか？',
          next: 'premature_seminar',
          scores: { structure: -5, trust: -5, timing: -5 },
          tag: 'bad',
        },
      ],
    },
    
    recovery_vision: {
      id: 'recovery_vision',
      speaker: 'customer',
      text: 'そうですね…まずは社員に「介護と仕事は両立できる」ということを知ってもらいたいんです。',
      mood: 'neutral',
      choices: [
        {
          text: '素晴らしいお考えです。そのメッセージを届けるために、弊社のセミナーでは「両立の考え方」を重視してお伝えしています。',
          next: 'seminar_concept',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'それは大事ですね。今、社員の方々はどのくらい「両立できる」と思っていらっしゃるんでしょう？',
          next: 'current_awareness',
          scores: { structure: 10, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: 'では弊社のサービスをご紹介しますね。',
          next: 'service_intro',
          scores: { structure: 0, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    recovery_challenge: {
      id: 'recovery_challenge',
      speaker: 'customer',
      text: 'やっぱり、制度を作っただけでは使われないですし、そもそも社員がどのくらい介護を抱えているかも分からなくて。',
      mood: 'neutral',
      choices: [
        {
          text: 'まさにそこが多くの企業様の課題です。「隠れ介護」と呼ばれる現象があって、見えないところで影響が出ていることがあります。',
          next: 'hidden_care',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '実態把握が難しいですよね。アンケートなどは取られましたか？',
          next: 'ask_survey',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '分かります。制度の周知と実態把握、両方が必要ですよね。',
          next: 'general_acknowledge',
          scores: { structure: 5, trust: 10, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    // === その他シーン ===
    current_awareness: {
      id: 'current_awareness',
      speaker: 'customer',
      text: '正直、分からないです。アンケートを取ったら「困っていない」という回答が多かったんですが、本当にそうなのか…',
      mood: 'thinking',
      choices: [
        {
          text: 'その「困っていない」の中に、実は課題を抱えている方がいる可能性があります。これが「隠れ介護」です。',
          next: 'hidden_care',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'アンケートを取られたんですね。具体的にどんな項目を聞かれましたか？',
          next: 'survey_detail',
          scores: { structure: 10, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '困っていないなら安心ですね。',
          next: 'miss_opportunity',
          scores: { structure: -15, trust: -10, timing: -10 },
          tag: 'bad',
        },
      ],
    },
    
    seminar_concept: {
      id: 'seminar_concept',
      speaker: 'customer',
      text: '「両立の考え方」というのは、具体的にどういうことですか？',
      mood: 'curious',
      choices: [
        {
          text: '介護保険制度の詳細ではなく、「いざという時にどう動くか」「誰に相談するか」という行動指針を伝えます。覚えるのではなく、動けるようになることが目的です。',
          next: 'action_focus',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '例えば、「介護は突然始まる」「一人で抱え込まない」「プロに任せる」といった心構えです。',
          next: 'mindset_intro',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '詳しくはセミナーでお伝えしています。',
          next: 'defer_detail',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    mindset_intro: {
      id: 'mindset_intro',
      speaker: 'customer',
      text: 'なるほど…確かに、そういう心構えがあるだけで違いますよね。',
      mood: 'positive',
      choices: [
        {
          text: 'はい。弊社のセミナーは満足度96.5%で、「自分事として考えられた」という声が多いです。御社でも効果が期待できると思います。',
          next: 'seminar_results',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '御社の場合、まず全社向けセミナーで意識づけをして、その後必要に応じてテーマ別セミナーを追加するのがおすすめです。',
          next: 'roadmap',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'ぜひセミナーをご検討ください。',
          next: 'weak_close',
          scores: { structure: 5, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    general_acknowledge: {
      id: 'general_acknowledge',
      speaker: 'customer',
      text: 'そうなんです。何から手をつけていいか…',
      mood: 'neutral',
      choices: [
        {
          text: '多くの企業様が同じ悩みを持たれています。弊社では「教育・相談・実態把握」の3つを軸に支援していますが、御社の場合は何から始めるのが良いか、一緒に考えましょうか。',
          next: 'package_intro',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずは実態把握から始めるのが王道です。',
          next: 'lcat_intro_good',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: 'まずはセミナーで意識づけをするのがおすすめです。',
          next: 'seminar_intro',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    service_intro: {
      id: 'service_intro',
      speaker: 'customer',
      text: 'まあ、ご説明いただけるなら…',
      mood: 'neutral',
      choices: [
        {
          text: 'ただ、その前に御社の状況をもう少し教えていただけますか？より適切なご提案ができると思います。',
          next: 'recovery_current',
          scores: { structure: 10, trust: 10, timing: 5 },
          tag: 'recovery',
        },
        {
          text: '弊社は「教育・相談・実態把握」の3つを軸に支援しています。御社の課題に合わせてご提案できます。',
          next: 'package_intro',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: 'まずセミナーがおすすめです。15万人以上に受講いただいています。',
          next: 'seminar_results',
          scores: { structure: 5, trust: 0, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    lcat_intro: {
      id: 'lcat_intro',
      speaker: 'customer',
      text: 'LCATというのは、どういうものですか？',
      mood: 'neutral',
      choices: [
        {
          text: '従業員向けの診断ツールで、両立の準備状況を可視化できます。ただ、御社の場合はすでにアンケートを取られているので、まずは教育から入る方が効果的かもしれません。',
          next: 'tailored_proposal',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '単なるアンケートではなく、両立の準備状況を客観的に可視化し、組織全体のリスクとして把握できるツールです。',
          next: 'lcat_detail',
          scores: { structure: 10, trust: 5, specificity: 15 },
          tag: 'neutral',
        },
        {
          text: '詳しくは資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    lcat_intro_good: {
      id: 'lcat_intro_good',
      speaker: 'customer',
      text: '実態把握…アンケートは取ったんですが、もっと詳しく見る方法があるんですか？',
      mood: 'curious',
      choices: [
        {
          text: '弊社のLCATは、単なるアンケートと違い、両立の準備状況を数値化できます。ただ、御社の場合はすでにアンケートを取られているので、その結果を活用する方が効率的かもしれません。',
          next: 'tailored_proposal',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'LCATという診断ツールがあります。両立の準備状況を客観的に可視化できます。',
          next: 'lcat_detail',
          scores: { structure: 10, trust: 5, specificity: 15 },
          tag: 'neutral',
        },
        {
          text: 'まずは教育から始めて、必要に応じて追加調査するのが良いかもしれません。',
          next: 'seminar_intro',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
      ],
    },
    
    lcat_detail: {
      id: 'lcat_detail',
      speaker: 'customer',
      text: 'なるほど…費用はどのくらいですか？',
      mood: 'neutral',
      choices: [
        {
          text: '規模によりますが、御社の場合はすでにアンケートを取られているので、まずはその結果を活用した教育から始める方がコスト効率が良いかもしれません。',
          next: 'tailored_proposal',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '詳細は改めてご提案させてください。来週あたりお時間いただけますか？',
          next: 'ending_good',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '資料に価格表がありますのでお送りします。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    seminar_intro: {
      id: 'seminar_intro',
      speaker: 'customer',
      text: 'セミナーですか。どんな内容ですか？',
      mood: 'neutral',
      choices: [
        {
          text: '90分のオンラインセミナーで、制度の説明より「考え方」を重視しています。15万人以上に受講いただき、満足度96.5%です。',
          next: 'seminar_results',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '「仕事と介護の両立」をテーマに、全社向けと管理職向けがあります。御社の場合はまず全社向けがおすすめです。',
          next: 'seminar_type',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'いろいろなパターンがあります。資料をお送りしますね。',
          next: 'defer_detail',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    seminar_type: {
      id: 'seminar_type',
      speaker: 'customer',
      text: '全社向けと管理職向け…確かに、管理職には別の伝え方が必要かもしれませんね。',
      mood: 'thinking',
      choices: [
        {
          text: 'その通りです。管理職には「部下がいつ介護を始めてもおかしくない」という視点で、マネジメントとしての対応を伝えます。',
          next: 'manager_perspective',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '1年目は全社向け、2年目にテーマ別を追加する企業様が多いです。御社もそのパターンはいかがですか？',
          next: 'roadmap',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '両方やる企業様もいらっしゃいます。',
          next: 'both_seminars',
          scores: { structure: 5, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    manager_perspective: {
      id: 'manager_perspective',
      speaker: 'customer',
      text: 'なるほど。うちも管理職は50代が多いので、自分の問題でもあり部下の問題でもある…両方の視点が必要ですね。',
      mood: 'positive',
      choices: [
        {
          text: 'まさにそうです。御社の場合、まず全社向けで意識づけをして、次年度に管理職向けを追加するのはいかがでしょう？',
          next: 'roadmap',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'そうですね。来期の計画に入れていただく形で、改めてご提案させてください。',
          next: 'ending_good',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '両方まとめてやることもできます。',
          next: 'both_seminars',
          scores: { structure: 5, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    both_seminars: {
      id: 'both_seminars',
      speaker: 'customer',
      text: 'そうですか…予算はどのくらいになりますか？',
      mood: 'neutral',
      choices: [
        {
          text: '全社向けが50〜60万円、管理職向けを追加すると合計100〜120万円程度です。ただ、まず全社向けから始めて効果を見る方が現実的かもしれません。',
          next: 'budget_discussion',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '御社の予算感に合わせてご提案できます。来期どのくらいの予算を想定されていますか？',
          next: 'ask_budget',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '資料に価格表がありますのでお送りします。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    budget_discussion: {
      id: 'budget_discussion',
      speaker: 'customer',
      text: '50〜60万円…なるほど。来期の予算取りに入れないといけないですね。',
      mood: 'thinking',
      choices: [
        {
          text: 'いつ頃までに予算申請されますか？必要な資料をお送りできます。',
          next: 'budget_timing',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '来期計画に入れていただけるよう、御社向けのプランをまとめて改めてご提案させてください。来週あたりいかがですか？',
          next: 'ending_good',
          scores: { structure: 15, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '見積もりをお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    budget_timing: {
      id: 'budget_timing',
      speaker: 'customer',
      text: '1月中には固めないといけないですね。',
      mood: 'neutral',
      choices: [
        {
          text: 'では年内に御社向けのプランと見積もりをお送りして、年明けに改めてお打ち合わせさせてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '来週あたり、もう一度お時間いただけますか？上司の方にも同席いただけると、予算取りもスムーズかと思います。',
          next: 'ending_great',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '資料をお送りしますので、ご検討ください。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    ask_budget: {
      id: 'ask_budget',
      speaker: 'customer',
      text: 'まだ具体的には…できれば100万円以内に収めたいですが。',
      mood: 'neutral',
      choices: [
        {
          text: '100万円あれば、全社向けセミナーに加えてフォローアップの施策も入れられます。具体的なプランを作成して、改めてご提案させてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'であれば、まず全社向けセミナーから始めて、効果を見ながら次を検討するのが現実的ですね。',
          next: 'realistic_proposal',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '100万円ですと、全社向けと管理職向けの両方は難しいですね…',
          next: 'budget_constraint',
          scores: { structure: 0, trust: 0, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    realistic_proposal: {
      id: 'realistic_proposal',
      speaker: 'customer',
      text: 'そうですね。まずは全社向けから始めてみます。',
      mood: 'positive',
      choices: [
        {
          text: '承知しました。では来期の早いタイミングで実施できるよう、具体的な日程とプランをご提案させてください。来週あたりいかがですか？',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'ありがとうございます。年内に資料をお送りしますので、ご検討ください。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
        {
          text: 'では見積もりをお送りします。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    budget_constraint: {
      id: 'budget_constraint',
      speaker: 'customer',
      text: 'そうですか…では、まず全社向けだけでも。',
      mood: 'neutral',
      choices: [
        {
          text: 'はい、それで十分効果は出ます。では具体的なプランをご提案させてください。',
          next: 'ending_good',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
        {
          text: 'ご検討ください。',
          next: 'ending_bad',
          scores: { structure: -5, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    // === 中途シーン ===
    vague_question: {
      id: 'vague_question',
      speaker: 'customer',
      text: 'お困りのこと…そうですね、やっぱり制度を作っても使われないことですかね。',
      mood: 'neutral',
      choices: [
        {
          text: 'そこが多くの企業様の課題です。制度の周知だけでなく、実効性のある運用が必要ですよね。',
          next: 'empathy_awareness',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '弊社のセミナーで周知を図るのはいかがでしょうか？',
          next: 'premature_seminar',
          scores: { structure: -5, trust: -5, timing: -5 },
          tag: 'bad',
        },
        {
          text: '使われない原因は何だと思いますか？',
          next: 'ask_cause',
          scores: { structure: 5, trust: 10, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    ask_cause: {
      id: 'ask_cause',
      speaker: 'customer',
      text: 'うーん…やっぱり、社員が介護のことをよく分かっていないからじゃないですかね。',
      mood: 'thinking',
      choices: [
        {
          text: 'そうですね。ただ、細かい制度を覚える必要はあまりなくて、「いざという時にどう動くか」が大事です。',
          next: 'concept_shift',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '社員への教育が必要ということですね。弊社のセミナーがお役に立てるかもしれません。',
          next: 'seminar_intro',
          scores: { structure: 10, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
        {
          text: '分かります。介護は本当に複雑ですからね。',
          next: 'just_empathy',
          scores: { structure: 0, trust: 10, timing: -5 },
          tag: 'neutral',
        },
      ],
    },
    
    just_empathy: {
      id: 'just_empathy',
      speaker: 'customer',
      text: 'そうなんですよ…で、どうすればいいんでしょう？',
      mood: 'neutral',
      choices: [
        {
          text: '弊社では「教育・相談・実態把握」の3つを軸に支援しています。御社の状況だと、まず教育から始めるのが良いかと思います。',
          next: 'package_intro',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずは全社向けのセミナーで意識づけをするのがおすすめです。',
          next: 'seminar_intro',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: '資料をお送りしますので、ご検討ください。',
          next: 'ending_neutral',
          scores: { structure: -5, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    ask_demographics: {
      id: 'ask_demographics',
      speaker: 'customer',
      text: '40代・50代が…そうですね、6割くらいでしょうか。管理職はほとんど50代ですね。',
      mood: 'neutral',
      choices: [
        {
          text: '6割は多いですね。今後5〜10年で介護に直面する可能性が高い層です。今のうちに意識づけをしておくことで、パフォーマンス低下を防げます。',
          next: 'prevention_concept',
          scores: { structure: 15, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '管理職層への対策が特に重要ですね。弊社では管理職向けのセミナーもご用意しています。',
          next: 'manager_seminar_intro',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: '多いですね。対策が必要です。',
          next: 'general_response',
          scores: { structure: 0, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    parent_age: {
      id: 'parent_age',
      speaker: 'customer',
      text: 'そうなんです。平均年齢が上がっているので、親御さんの年齢も…75歳以上が増えてきていると思います。',
      mood: 'thinking',
      choices: [
        {
          text: '75歳を超えると要介護リスクが急激に上がります。今のうちに「事前準備」の意識づけをすることが重要です。',
          next: 'prevention_concept',
          scores: { structure: 15, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'なるほど。御社の社員の方々は、その危機感を持っていらっしゃいますか？',
          next: 'awareness_check',
          scores: { structure: 10, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: 'それは大変ですね。',
          next: 'general_response',
          scores: { structure: 0, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    awareness_check: {
      id: 'awareness_check',
      speaker: 'customer',
      text: '正直、あまり持っていないと思います。「まだ大丈夫」と思っている人が多いんじゃないかな。',
      mood: 'thinking',
      choices: [
        {
          text: 'そこが課題ですね。「まだ大丈夫」と思っているうちに準備してもらうことが、いざという時のパフォーマンス維持につながります。',
          next: 'prevention_concept',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'そうですよね。弊社のセミナーでは、「突然始まる」という現実をお伝えしています。',
          next: 'seminar_concept',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'それは問題ですね。',
          next: 'general_response',
          scores: { structure: 0, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    productivity_impact: {
      id: 'productivity_impact',
      speaker: 'customer',
      text: '見えないところで…確かに、表に出てこないだけで影響はあるかもしれませんね。',
      mood: 'thinking',
      choices: [
        {
          text: 'そうなんです。だからこそ「隠れ介護」を防ぐ、つまり「言い出せる環境づくり」が重要です。御社ではそのあたり、いかがですか？',
          next: 'psychological_safety',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずは実態を把握することが第一歩です。弊社のLCATで可視化できます。',
          next: 'lcat_intro',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: '対策が必要ですね。',
          next: 'general_response',
          scores: { structure: 0, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    psychological_safety: {
      id: 'psychological_safety',
      speaker: 'customer',
      text: '言い出せる環境…正直、まだそこまでできていないですね。介護休業を取った人もいないわけではないですが、少数です。',
      mood: 'thinking',
      choices: [
        {
          text: '少数というのは、「取りづらい雰囲気」があるかもしれません。管理職の理解を深めることで、その雰囲気は変わります。',
          next: 'manager_education',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'そこを変えていくために、まず全社向けのセミナーで「両立できる」というメッセージを発信するのが効果的です。',
          next: 'seminar_concept',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '環境づくりが大事ですね。',
          next: 'general_response',
          scores: { structure: 0, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    manager_education: {
      id: 'manager_education',
      speaker: 'customer',
      text: '管理職の理解…確かに、上司が理解していないと言い出しにくいですよね。',
      mood: 'thinking',
      choices: [
        {
          text: 'その通りです。弊社では管理職向けのセミナーで「部下がいつ介護を始めてもおかしくない」という視点でお伝えしています。',
          next: 'manager_perspective',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'まず全社向けセミナーで意識づけをして、次年度に管理職向けを追加する企業様が多いです。',
          next: 'roadmap',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '管理職研修も用意しています。',
          next: 'manager_seminar_intro',
          scores: { structure: 5, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    effectiveness_intro: {
      id: 'effectiveness_intro',
      speaker: 'customer',
      text: '「実効性」というのは、具体的にどういうことですか？',
      mood: 'curious',
      choices: [
        {
          text: '制度があっても使われなければ意味がない。「知っている」から「動ける」へ変えることです。御社のアンケートでも「知っている」と「理解している」の差がありましたよね。',
          next: 'effectiveness_wall',
          scores: { structure: 15, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '社員が自律的にアクションを取れる状態を作ること。そのために「教育・相談・実態把握」の3つが軸になります。',
          next: 'package_intro',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '弊社のセミナーでは、制度説明より実践的な内容を重視しています。',
          next: 'seminar_concept',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
      ],
    },
    
    next_action: {
      id: 'next_action',
      speaker: 'customer',
      text: '次のアクション…正直、まだ具体的には。結果を踏まえて何かやらないといけないとは思っているんですが。',
      mood: 'thinking',
      choices: [
        {
          text: 'そこで弊社がお手伝いできます。多くの企業様が「全社向けセミナー → テーマ別 → 継続フォロー」というステップで進めています。',
          next: 'roadmap',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '調査で見えた課題に対して、どんな施策が効果的か、一緒に考えましょうか。',
          next: 'planning_together',
          scores: { structure: 15, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '弊社のサービスをご紹介しますね。',
          next: 'service_intro',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    ask_data: {
      id: 'ask_data',
      speaker: 'customer',
      text: 'えーと、ちょっと社内データなので、お見せするのは難しいですが…傾向としてはお伝えできます。',
      mood: 'neutral',
      choices: [
        {
          text: 'もちろんです。傾向だけでも教えていただけると、御社に合ったご提案ができます。',
          next: 'gap_analysis',
          scores: { structure: 10, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '承知しました。主な課題はどのあたりに出ていますか？',
          next: 'next_action',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: 'そうですか。では一般的なご提案になりますが…',
          next: 'general_proposal',
          scores: { structure: 0, trust: -5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    just_acknowledge: {
      id: 'just_acknowledge',
      speaker: 'customer',
      text: 'そうなんです。ギャップを埋めるには何をすればいいでしょう？',
      mood: 'neutral',
      choices: [
        {
          text: '教育です。ただ、制度を詳しく説明するのではなく、「考え方」を伝えることが重要。弊社のセミナーではそこを重視しています。',
          next: 'seminar_concept',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '弊社では「教育・相談・実態把握」の3つを軸に支援しています。御社の場合は教育から入るのが効果的です。',
          next: 'package_intro',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'セミナーをおすすめします。',
          next: 'seminar_intro',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    general_proposal: {
      id: 'general_proposal',
      speaker: 'customer',
      text: 'そうですか…まあ、ご提案いただけるなら。',
      mood: 'hesitant',
      choices: [
        {
          text: 'やはり御社の状況を踏まえた方が良いですね。一般的には「教育・相談・実態把握」の3つが軸ですが、御社の課題に合わせて優先順位を決めましょう。',
          next: 'package_intro',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'recovery',
        },
        {
          text: '多くの企業様がセミナーから始められています。15万人以上に受講いただいています。',
          next: 'seminar_results',
          scores: { structure: 5, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: '資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    general_response: {
      id: 'general_response',
      speaker: 'customer',
      text: 'そうですね…で、具体的に何をすればいいんでしょうか？',
      mood: 'neutral',
      choices: [
        {
          text: '弊社では「教育・相談・実態把握」の3つを軸に支援しています。御社の状況だと、まず教育から始めるのが効果的です。',
          next: 'package_intro',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずは全社向けのセミナーで意識づけをするのがおすすめです。15万人以上に受講いただいています。',
          next: 'seminar_results',
          scores: { structure: 10, trust: 5, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'いろいろな方法がありますので、資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: -5, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    case_study: {
      id: 'case_study',
      speaker: 'customer',
      text: '実際に両立されている方の事例…それは参考になりそうですね。',
      mood: 'curious',
      choices: [
        {
          text: 'はい。「こうすれば両立できる」という具体的なイメージを持ってもらえます。受講後に「親と話してみる」という声が多いのはそのためです。',
          next: 'seminar_results',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '弊社のセミナーでは15万人以上に受講いただき、満足度96.5%です。御社でも効果が期待できます。',
          next: 'seminar_results',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '詳しくはセミナーでお伝えしています。',
          next: 'defer_detail',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    mandatory_approach: {
      id: 'mandatory_approach',
      speaker: 'customer',
      text: '強制…そうですね、うちも40歳以上は必須にするとか、そういうやり方もあるかもしれません。',
      mood: 'thinking',
      choices: [
        {
          text: '必須にする企業様もいらっしゃいます。ただ、「やらされ感」が出ないよう、コンテンツの質が重要です。弊社は満足度96.5%です。',
          next: 'seminar_results',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '必須化と任意参加、どちらもメリット・デメリットがあります。御社の文化に合わせてご提案できます。',
          next: 'tailored_approach',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '強制した方が効果は出ますよ。',
          next: 'push_mandatory',
          scores: { structure: -5, trust: -10, specificity: 5 },
          tag: 'bad',
        },
      ],
    },
    
    tailored_approach: {
      id: 'tailored_approach',
      speaker: 'customer',
      text: 'そうですね。うちの場合はどちらが良いでしょう？',
      mood: 'curious',
      choices: [
        {
          text: '御社はアンケートで「困っていない」という回答が多かったということなので、必須にして全員に届ける方が効果的かもしれません。',
          next: 'recommend_mandatory',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずは管理職を必須、一般社員は任意というパターンも多いです。',
          next: 'hybrid_approach',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '御社の人事の方とご相談されてはいかがですか。',
          next: 'defer_decision',
          scores: { structure: 0, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    recommend_mandatory: {
      id: 'recommend_mandatory',
      speaker: 'customer',
      text: 'なるほど…確かに、任意だと「関係ない」と思っている人には届かないですよね。',
      mood: 'positive',
      choices: [
        {
          text: 'その通りです。では、来期の計画に入れていただく形で、具体的なプランをご提案させてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '40歳以上必須という企業様も多いです。御社もそのパターンはいかがですか？',
          next: 'age_targeting',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずは資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    hybrid_approach: {
      id: 'hybrid_approach',
      speaker: 'customer',
      text: '管理職必須…それはいいかもしれません。部下への対応も知っておいてほしいですし。',
      mood: 'positive',
      choices: [
        {
          text: 'そうですね。では、来期まず管理職向けセミナーから始めるプランをご提案させてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '全社向けと管理職向け、両方やる企業様もいらっしゃいます。予算に応じてご提案できます。',
          next: 'both_seminars',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '管理職向けの資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    age_targeting: {
      id: 'age_targeting',
      speaker: 'customer',
      text: '40歳以上…御社の6割くらいですね。それなら現実的かもしれません。',
      mood: 'positive',
      choices: [
        {
          text: 'はい。では具体的なプランをご提案させてください。来週あたりお時間いただけますか？',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '5〜6月の実施を想定して、1月中に予算申請に必要な資料をお送りできます。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'ご検討ください。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    push_mandatory: {
      id: 'push_mandatory',
      speaker: 'customer',
      text: 'まあ…そうかもしれませんが。',
      mood: 'hesitant',
      next: 'ending_neutral',
    },
    
    defer_decision: {
      id: 'defer_decision',
      speaker: 'customer',
      text: 'そうですね…社内で相談してみます。',
      mood: 'neutral',
      next: 'ending_neutral',
    },
    
    defer_detail: {
      id: 'defer_detail',
      speaker: 'customer',
      text: 'はい、資料をいただければ。',
      mood: 'neutral',
      next: 'ending_neutral',
    },
    
    tool_intro: {
      id: 'tool_intro',
      speaker: 'customer',
      text: 'ツールというと？',
      mood: 'neutral',
      choices: [
        {
          text: 'マイパノラマという24時間使えるWebサービスです。親御さんの状況を登録すると、必要なサービスや相談先が分かります。',
          next: 'mypanorama_intro',
          scores: { structure: 10, trust: 5, specificity: 15 },
          tag: 'neutral',
        },
        {
          text: 'すみません、まず御社の課題を整理させてください。どのあたりに一番課題を感じていらっしゃいますか？',
          next: 'recovery_challenge',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'recovery',
        },
        {
          text: '資料に詳細がありますのでお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    mypanorama_intro: {
      id: 'mypanorama_intro',
      speaker: 'customer',
      text: 'なるほど…それは良さそうですね。セミナーと組み合わせて使うんですか？',
      mood: 'neutral',
      choices: [
        {
          text: 'はい、セミナー受講者への特典として提供している企業様が多いです。継続的な行動変容を促せます。',
          next: 'combination_proposal',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '40歳以上の社員に一律付与している企業様もいらっしゃいます。',
          next: 'age_based_tool',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: '使い方はいろいろあります。資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    combination_proposal: {
      id: 'combination_proposal',
      speaker: 'customer',
      text: 'セミナーとセットで…なるほど、参加率も上がりそうですね。',
      mood: 'positive',
      choices: [
        {
          text: 'はい。では、セミナー＋マイパノラマのパッケージで具体的なプランをご提案させてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずはセミナー単体から始めて、次年度にマイパノラマを追加する企業様もいらっしゃいます。',
          next: 'phased_approach',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '予算に応じて組み合わせできます。',
          next: 'budget_discussion',
          scores: { structure: 5, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    age_based_tool: {
      id: 'age_based_tool',
      speaker: 'customer',
      text: '40歳以上に一律…費用はどのくらいですか？',
      mood: 'neutral',
      choices: [
        {
          text: '人数によりますが、御社の規模だと年間で数百万円程度です。ただ、まずはセミナーから始めて効果を見る方が現実的かもしれません。',
          next: 'realistic_proposal',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '詳細は改めてご提案させてください。',
          next: 'ending_good',
          scores: { structure: 10, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
        {
          text: '資料に価格表がありますのでお送りします。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 5 },
          tag: 'bad',
        },
      ],
    },
    
    phased_approach: {
      id: 'phased_approach',
      speaker: 'customer',
      text: '段階的にやっていく…それが現実的かもしれませんね。',
      mood: 'positive',
      choices: [
        {
          text: 'では、まず来期のセミナーから始めるプランをご提案させてください。来週あたりお時間いただけますか？',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '1年目：セミナー、2年目：テーマ別＋ツール、3年目：継続…というロードマップを一緒に作りましょうか？',
          next: 'ending_good',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずは資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    consultation_intro: {
      id: 'consultation_intro',
      speaker: 'customer',
      text: '社内でも相談できる体制…具体的にはどういうことですか？',
      mood: 'curious',
      choices: [
        {
          text: '弊社では介護専門の外部相談窓口を提供しています。社内で言いにくいことも、外部だから話せるという声が多いです。',
          next: 'consultation_detail',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '人事部門への相談ハードルを下げるために、まず外部窓口を設置する企業様が増えています。',
          next: 'external_consultation',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '相談窓口のご紹介もできます。',
          next: 'service_intro',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    consultation_detail: {
      id: 'consultation_detail',
      speaker: 'customer',
      text: '外部の相談窓口…それはいいですね。費用はどのくらいですか？',
      mood: 'curious',
      choices: [
        {
          text: '1枠30分15,000円で、6枠からのチケット制です。必要な人だけ使う形なので、コスト効率が良いです。',
          next: 'consultation_pricing',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'セミナーと組み合わせると効果的です。まずはセミナーで意識づけをして、相談窓口で個別対応という流れです。',
          next: 'combination_approach',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '詳細は資料でお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 5 },
          tag: 'bad',
        },
      ],
    },
    
    consultation_pricing: {
      id: 'consultation_pricing',
      speaker: 'customer',
      text: 'チケット制…使われなかったらもったいないですが、逆に使われすぎても困りますね。',
      mood: 'thinking',
      choices: [
        {
          text: '有効期限は1年で、追加購入も可能です。まずは6枠から始めて様子を見る企業様が多いです。',
          next: 'pilot_approach',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'セミナーで「こういう窓口がある」と周知することで、本当に必要な人に使ってもらえます。',
          next: 'combination_approach',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '利用状況を見ながら調整できます。',
          next: 'flexible_response',
          scores: { structure: 5, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    pilot_approach: {
      id: 'pilot_approach',
      speaker: 'customer',
      text: 'まず6枠から…9万円ですか。それなら試しやすいですね。',
      mood: 'positive',
      choices: [
        {
          text: 'はい。セミナーと合わせてもそこまで大きな予算にはなりません。御社向けのプランをご提案させてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずはセミナーから始めて、相談窓口は次年度でも良いかもしれません。段階的に進めましょう。',
          next: 'phased_approach',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'ぜひご検討ください。',
          next: 'weak_close',
          scores: { structure: 0, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    combination_approach: {
      id: 'combination_approach',
      speaker: 'customer',
      text: 'セミナーと相談窓口のセット…なるほど、その流れは分かりやすいですね。',
      mood: 'positive',
      choices: [
        {
          text: 'では、セミナー＋相談窓口のパッケージでご提案させてください。来週あたりお時間いただけますか？',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'まずは全社セミナーから始めて、効果を見ながら相談窓口を追加するのも良いと思います。',
          next: 'phased_approach',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '費用感をお伝えすると、合わせて60〜70万円程度です。',
          next: 'budget_discussion',
          scores: { structure: 10, trust: 5, specificity: 15 },
          tag: 'neutral',
        },
      ],
    },
    
    external_consultation: {
      id: 'external_consultation',
      speaker: 'customer',
      text: '外部だから話せる…確かに、人事には言いにくいこともありますよね。',
      mood: 'thinking',
      choices: [
        {
          text: 'その通りです。弊社の相談窓口は介護専門のプロが対応するので、制度の使い方からケアマネとの交渉まで、具体的にアドバイスできます。',
          next: 'consultation_detail',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'まずはセミナーで「相談していいんだ」という意識づけをして、窓口設置は次のステップでも良いかもしれません。',
          next: 'roadmap',
          scores: { structure: 15, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '詳しくは資料でご説明しますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    flexible_response: {
      id: 'flexible_response',
      speaker: 'customer',
      text: 'そうですか。まあ、検討してみます。',
      mood: 'neutral',
      next: 'ending_neutral',
    },
    
    weak_close: {
      id: 'weak_close',
      speaker: 'customer',
      text: 'はい…資料をいただけますか。',
      mood: 'neutral',
      next: 'ending_neutral',
    },
    
    manager_seminar_intro: {
      id: 'manager_seminar_intro',
      speaker: 'customer',
      text: '管理職向けセミナー…どんな内容ですか？',
      mood: 'curious',
      choices: [
        {
          text: '「部下がいつ介護を始めてもおかしくない」という視点で、早期発見と適切なコミュニケーションについてお伝えします。',
          next: 'manager_perspective',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'まず全社向けで意識づけをして、次年度に管理職向けを追加する企業様が多いです。',
          next: 'roadmap',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '資料に詳細がありますのでお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    package_detail: {
      id: 'package_detail',
      speaker: 'customer',
      text: 'なるほど…セミナー、相談窓口、LCATですか。全部やると費用はどのくらいですか？',
      mood: 'curious',
      choices: [
        {
          text: '御社の規模だと年間で100〜150万円程度です。ただ、一度に全部やる必要はありません。まずはセミナーから始める企業様が多いです。',
          next: 'realistic_proposal',
          scores: { structure: 15, trust: 15, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'すべてをご提案することもできますが、御社はすでにアンケートを取られているので、まず教育から入るのが効率的です。',
          next: 'tailored_proposal',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '資料に価格表がありますのでお送りします。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 5 },
          tag: 'bad',
        },
      ],
    },
    
    example_company: {
      id: 'example_company',
      speaker: 'customer',
      text: '「すぐ親と話してみる」…そういう行動に繋がるのがいいですね。',
      mood: 'positive',
      choices: [
        {
          text: 'はい。制度を覚えることより、具体的なアクションに繋がることを重視しています。御社でも同じ効果が期待できます。',
          next: 'roadmap',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'ぜひ御社でも実施させてください。来期の計画に入れていただけますか？',
          next: 'planning_together',
          scores: { structure: 15, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '他にも事例がありますので資料でお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    seminar_timing: {
      id: 'seminar_timing',
      speaker: 'customer',
      text: '意識づけですか…確かに、アンケートを取った後で何もしないのは良くないですよね。',
      mood: 'thinking',
      choices: [
        {
          text: 'その通りです。調査から時間が空くと効果が薄れます。来期の早いタイミングで実施するのがおすすめです。',
          next: 'timing_confirmation',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'アンケートで見えた課題に対して「こういう対策をしています」というメッセージを発信することが大事です。',
          next: 'message_importance',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'セミナーをおすすめします。',
          next: 'seminar_intro',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    message_importance: {
      id: 'message_importance',
      speaker: 'customer',
      text: '「対策をしています」というメッセージ…確かに、それがないと「アンケート取っただけ」になってしまいますね。',
      mood: 'positive',
      choices: [
        {
          text: 'そうなんです。では、来期の計画に入れていただく形で、御社向けのプランをご提案させてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '5〜6月の実施を想定して、1月中に予算申請用の資料をお送りできます。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'ぜひご検討ください。',
          next: 'weak_close',
          scores: { structure: 0, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    care_day: {
      id: 'care_day',
      speaker: 'customer',
      text: '介護の日に合わせる…それも一つの手ですね。社内広報的にも打ち出しやすい。',
      mood: 'positive',
      choices: [
        {
          text: 'はい。11月11日前後に実施する企業様も増えています。御社もそのタイミングはいかがですか？',
          next: 'november_plan',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'ただ、アンケートを取られたのが10月なので、上期に実施して間を空けない方が効果的かもしれません。',
          next: 'timing_options',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '日程はご都合に合わせて調整できます。',
          next: 'flexible_timing',
          scores: { structure: 5, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    november_plan: {
      id: 'november_plan',
      speaker: 'customer',
      text: '11月…ただ、アンケートを取ったのが10月なので、そこから1年も空くのは…',
      mood: 'thinking',
      choices: [
        {
          text: '確かにそうですね。では上期に全社向け、秋に介護の日に合わせてフォローアップ、という2段階はいかがですか？',
          next: 'two_stage_plan',
          scores: { structure: 15, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '上期に実施する方が効果的ですね。では5〜6月で調整しましょうか？',
          next: 'concrete_plan',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '日程はご都合に合わせます。',
          next: 'flexible_timing',
          scores: { structure: 0, trust: 5, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    two_stage_plan: {
      id: 'two_stage_plan',
      speaker: 'customer',
      text: '2段階…予算は取れますかね。でも、継続的にやった方が効果はありそうですね。',
      mood: 'positive',
      choices: [
        {
          text: '年間100万円程度あれば十分可能です。では来期計画に入れていただく形で、具体的なプランをご提案させてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: 'まずは上期の1回から始めて、効果を見て秋を追加する形でも良いと思います。',
          next: 'ending_good',
          scores: { structure: 10, trust: 15, specificity: 10 },
          tag: 'good',
        },
        {
          text: '予算に応じて調整できます。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    flexible_timing: {
      id: 'flexible_timing',
      speaker: 'customer',
      text: 'そうですか…社内で検討してみます。',
      mood: 'neutral',
      next: 'ending_neutral',
    },
    
    scheduling: {
      id: 'scheduling',
      speaker: 'customer',
      text: 'スケジュール…まだ具体的には決まっていないですが、来期の早いうちにやりたいとは思っています。',
      mood: 'neutral',
      choices: [
        {
          text: 'では、5〜6月を想定して、1月中に予算申請用の資料をお送りします。来週あたり、詳しいお打ち合わせをさせてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '来期計画に入れていただけるよう、御社向けのプランをまとめます。いつ頃予算申請されますか？',
          next: 'budget_timing',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '日程が決まったらご連絡ください。',
          next: 'ending_neutral',
          scores: { structure: -5, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    pricing: {
      id: 'pricing',
      speaker: 'customer',
      text: '50〜60万円…なるほど。予算取りに入れないといけないですね。',
      mood: 'neutral',
      choices: [
        {
          text: 'いつ頃までに予算申請されますか？必要な資料をお送りできます。',
          next: 'budget_timing',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: '来期計画に入れていただけるよう、御社向けのプランをご提案させてください。来週あたりいかがですか？',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '見積もりをお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 5 },
          tag: 'neutral',
        },
      ],
    },
    
    defer_pricing: {
      id: 'defer_pricing',
      speaker: 'customer',
      text: 'はい、資料をいただければ。',
      mood: 'neutral',
      next: 'ending_neutral',
    },
    
    send_material: {
      id: 'send_material',
      speaker: 'customer',
      text: 'はい、資料をいただければ検討します。',
      mood: 'neutral',
      next: 'ending_neutral',
    },
    
    quote_offer: {
      id: 'quote_offer',
      speaker: 'customer',
      text: 'はい、お見積もりをいただければ。',
      mood: 'neutral',
      choices: [
        {
          text: '承知しました。御社向けにカスタマイズした見積もりをお送りしますので、来週あたり改めてお打ち合わせさせてください。',
          next: 'ending_good',
          scores: { structure: 10, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '見積もりと一緒に、御社向けのプランもお送りします。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 5, specificity: 5 },
          tag: 'neutral',
        },
        {
          text: 'お送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
    
    explain_seminar_basic: {
      id: 'explain_seminar_basic',
      speaker: 'customer',
      text: '基礎から説明していただけるんですか？それは助かります。',
      mood: 'neutral',
      choices: [
        {
          text: 'ただ、実は細かい制度を覚える必要はあまりないんです。重要なのは「どこに相談すればいいか」を知ること。弊社のセミナーではそこを重視しています。',
          next: 'concept_shift',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'はい、90分のセミナーで介護の基礎から両立のポイントまでカバーしています。',
          next: 'seminar_intro',
          scores: { structure: 10, trust: 5, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: '資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 0, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    explain_system_detail: {
      id: 'explain_system_detail',
      speaker: 'customer',
      text: 'そうですか…でも、聞いてもすぐ忘れそうですけどね。',
      mood: 'neutral',
      choices: [
        {
          text: 'おっしゃる通りです。だから弊社のセミナーでは、制度の説明より「いざという時にどう動くか」を重視しています。覚えるより動けることが大事です。',
          next: 'concept_shift',
          scores: { structure: 15, trust: 10, specificity: 10 },
          tag: 'good',
        },
        {
          text: 'そうですね。だから継続的な情報提供が必要で、弊社ではフォローアップのツールも用意しています。',
          next: 'tool_intro',
          scores: { structure: 10, trust: 10, specificity: 10 },
          tag: 'neutral',
        },
        {
          text: 'まあ、何回かやれば覚えますよ。',
          next: 'weak_response',
          scores: { structure: -5, trust: -5, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    weak_response: {
      id: 'weak_response',
      speaker: 'customer',
      text: 'そうですかね…まあ、検討してみます。',
      mood: 'cold',
      next: 'ending_neutral',
    },
    
    seminar_action: {
      id: 'seminar_action',
      speaker: 'customer',
      text: '具体的なアクション…例えばどんなことですか？',
      mood: 'curious',
      choices: [
        {
          text: '「今週末、親に電話してみよう」「地域包括支援センターの場所を調べておこう」など、すぐにできる一歩です。受講後に実際に行動した人が多いです。',
          next: 'action_examples',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '「いざという時にどこに連絡するか」を明確にすることです。地域包括支援センターの存在を知るだけでも大きな一歩です。',
          next: 'action_focus',
          scores: { structure: 10, trust: 10, specificity: 15 },
          tag: 'good',
        },
        {
          text: '詳しくはセミナーで。',
          next: 'defer_detail',
          scores: { structure: -5, trust: -10, specificity: 0 },
          tag: 'bad',
        },
      ],
    },
    
    action_examples: {
      id: 'action_examples',
      speaker: 'customer',
      text: '受講後に行動した人が多い…それはいいですね。うちの社員にもそうなってほしい。',
      mood: 'positive',
      choices: [
        {
          text: 'ぜひ御社でも実施させてください。来期の計画に入れていただく形で、具体的なプランをご提案させてください。',
          next: 'ending_good',
          scores: { structure: 15, trust: 10, specificity: 5 },
          tag: 'good',
        },
        {
          text: '来週あたり、詳しいお打ち合わせをさせていただけますか？上司の方にも同席いただけると、予算取りもスムーズです。',
          next: 'ending_great',
          scores: { structure: 15, trust: 15, specificity: 5 },
          tag: 'good',
        },
        {
          text: '資料をお送りしますね。',
          next: 'ending_neutral',
          scores: { structure: 5, trust: 0, specificity: 0 },
          tag: 'neutral',
        },
      ],
    },
  },
  
  // エンディング
  endings: {
    great: {
      title: '次回商談へ',
      emoji: '📅',
      description: '上司同席で具体的な日程調整に進みました',
      feedback: '課題の深掘りから解決策の提示、具体的なクロージングまで、商談の流れが適切でした。顧客の状況に寄り添いながら、次のステップを明確にできています。',
      color: '#10b981',
    },
    good: {
      title: '検討中',
      emoji: '📋',
      description: '来期計画への組み込みが検討されます',
      feedback: '課題理解と解決策の提示はできていますが、より具体的なクロージングがあると良かったかもしれません。顧客の状況に合わせた提案ができています。',
      color: '#3b82f6',
    },
    neutral: {
      title: '様子見',
      emoji: '📝',
      description: '資料送付後、継続フォローが必要です',
      feedback: '課題の深掘りが不十分だったか、提案のタイミングが早かった可能性があります。顧客の状況をもう少し聞いてから提案に入ると良いでしょう。',
      color: '#f59e0b',
    },
    bad: {
      title: '見送り',
      emoji: '📭',
      description: '具体的な進展なく終了しました',
      feedback: '顧客の課題に寄り添う前に提案に入ってしまったか、クロージングが弱かった可能性があります。まず相手の状況を聞き、課題を整理してから解決策を提示することが重要です。',
      color: '#ef4444',
    },
  },
};

// =====================
// メインコンポーネント
// =====================
const KaigoSalesSimulation = () => {
  const [gameState, setGameState] = useState('title');
  const [currentScene, setCurrentScene] = useState(null);
  const [scores, setScores] = useState({
    structure: 0,
    specificity: 0,
    trust: 0,
    timing: 0,
  });
  const [customerMood, setCustomerMood] = useState('neutral');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [history, setHistory] = useState([]);
  const [ending, setEnding] = useState(null);
  
  // テキストアニメーション
  useEffect(() => {
    if (!currentScene || gameState !== 'playing') return;
    
    const text = GAME_DATA.scenes[currentScene].text;
    setIsTyping(true);
    setShowChoices(false);
    setDisplayedText('');
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setShowChoices(true);
        clearInterval(timer);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [currentScene, gameState]);
  
  // ゲーム開始
  const startGame = () => {
    setGameState('playing');
    setCurrentScene('opening');
    setScores({ structure: 0, specificity: 0, trust: 0, timing: 0 });
    setCustomerMood('neutral');
    setHistory([]);
    setEnding(null);
  };
  
  // 選択肢を選ぶ
  const selectChoice = (choice) => {
    // スコア更新
    const newScores = { ...scores };
    Object.entries(choice.scores).forEach(([key, value]) => {
      newScores[key] = Math.max(0, Math.min(100, newScores[key] + value));
    });
    setScores(newScores);
    
    // 履歴に追加
    setHistory([...history, { scene: currentScene, choice: choice.text, tag: choice.tag }]);
    
    // 次のシーンへ
    const nextScene = GAME_DATA.scenes[choice.next];
    if (nextScene) {
      setCustomerMood(nextScene.mood || 'neutral');
      
      // エンディングチェック
      if (nextScene.next) {
        setCurrentScene(choice.next);
        setTimeout(() => {
          if (nextScene.next.startsWith('ending_')) {
            calculateEnding(newScores, nextScene.next);
          } else {
            setCurrentScene(nextScene.next);
          }
        }, 1500);
      } else if (choice.next.startsWith('ending_')) {
        setCurrentScene(choice.next);
        setTimeout(() => {
          calculateEnding(newScores, choice.next);
        }, 1500);
      } else {
        setCurrentScene(choice.next);
      }
    }
  };
  
  // エンディング計算
  const calculateEnding = (finalScores, hint) => {
    const total = Object.values(finalScores).reduce((a, b) => a + b, 0);
    
    let endingType;
    if (hint === 'ending_great' || total >= 120) {
      endingType = 'great';
    } else if (hint === 'ending_good' || total >= 80) {
      endingType = 'good';
    } else if (hint === 'ending_bad' || total < 40) {
      endingType = 'bad';
    } else {
      endingType = 'neutral';
    }
    
    setEnding({
      ...GAME_DATA.endings[endingType],
      scores: finalScores,
      total,
    });
    setGameState('ending');
  };
  
  // テキストスキップ
  const skipText = () => {
    if (isTyping && currentScene) {
      setDisplayedText(GAME_DATA.scenes[currentScene].text);
      setIsTyping(false);
      setShowChoices(true);
    }
  };
  
  // ムード絵文字
  const getMoodEmoji = (mood) => {
    const moods = {
      neutral: '😐',
      thinking: '🤔',
      curious: '👀',
      worried: '😟',
      positive: '😊',
      surprised: '😮',
      hesitant: '😕',
      cold: '😑',
      disappointed: '😞',
    };
    return moods[mood] || '😐';
  };
  
  // タイトル画面
  if (gameState === 'title') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Zen Maru Gothic", "Hiragino Kaku Gothic ProN", sans-serif',
        padding: '20px',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
          }}>🏢</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            marginBottom: '8px',
          }}>
            {GAME_DATA.title}
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#4a5568',
            marginBottom: '32px',
          }}>
            {GAME_DATA.subtitle}
          </p>
          
          <div style={{
            background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f7fc 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#2d5a87',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              📋 ミッション
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#4a5568',
              lineHeight: '1.7',
            }}>
              {GAME_DATA.mission}
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '32px',
          }}>
            {Object.entries(GAME_DATA.dimensions).map(([key, dim]) => (
              <div key={key} style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{dim.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d5a87' }}>{dim.name}</div>
              </div>
            ))}
          </div>
          
          <button
            onClick={startGame}
            style={{
              background: 'linear-gradient(135deg, #2d5a87 0%, #1e3a5f 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '18px 48px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(30, 58, 95, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(30, 58, 95, 0.3)';
            }}
          >
            商談を開始する
          </button>
        </div>
      </div>
    );
  }
  
  // ゲーム画面
  if (gameState === 'playing' && currentScene) {
    const scene = GAME_DATA.scenes[currentScene];
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f5f7fa 0%, #e8edf2 100%)',
        fontFamily: '"Zen Maru Gothic", "Hiragino Kaku Gothic ProN", sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* ヘッダー */}
        <div style={{
          background: 'white',
          padding: '12px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>🏢</span>
            <span style={{ fontWeight: 'bold', color: '#1e3a5f' }}>初回商談</span>
          </div>
          
          {/* スコアバー */}
          <div style={{
            display: 'flex',
            gap: '16px',
          }}>
            {Object.entries(GAME_DATA.dimensions).map(([key, dim]) => (
              <div key={key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ fontSize: '14px' }}>{dim.icon}</span>
                <div style={{
                  width: '60px',
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, scores[key])}%`,
                    background: scores[key] >= 50 ? '#10b981' : scores[key] >= 25 ? '#f59e0b' : '#ef4444',
                    transition: 'all 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* メインエリア */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          padding: '24px',
        }}>
          {/* 顧客表示 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0,
            }}>
              {getMoodEmoji(customerMood)}
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '20px',
              borderTopLeftRadius: '4px',
              padding: '20px 24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              flex: 1,
              cursor: isTyping ? 'pointer' : 'default',
            }}
            onClick={skipText}
            >
              <div style={{
                fontSize: '12px',
                color: '#718096',
                marginBottom: '8px',
              }}>
                {GAME_DATA.customer.title}
              </div>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#2d3748',
                margin: 0,
              }}>
                {displayedText}
                {isTyping && (
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '18px',
                    background: '#2d5a87',
                    marginLeft: '2px',
                    animation: 'blink 0.8s infinite',
                  }} />
                )}
              </p>
            </div>
          </div>
          
          {/* 選択肢 */}
          {showChoices && scene.choices && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              animation: 'fadeIn 0.5s ease',
            }}>
              <div style={{
                fontSize: '13px',
                color: '#718096',
                textAlign: 'center',
                marginBottom: '8px',
              }}>
                あなたの返答を選んでください
              </div>
              {scene.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => selectChoice(choice)}
                  style={{
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '18px 24px',
                    textAlign: 'left',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: '#2d3748',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#2d5a87';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>{choice.text}</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: choice.tag === 'good' ? '#10b981' : choice.tag === 'bad' ? '#ef4444' : '#f59e0b',
                    marginLeft: '16px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: choice.tag === 'good' ? '#ecfdf5' : choice.tag === 'bad' ? '#fef2f2' : '#fffbeb',
                  }}>
                    {choice.tag === 'good' ? 'Good' : choice.tag === 'bad' ? 'Bad' : choice.tag === 'recovery' ? 'Recovery' : 'Neutral'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // エンディング画面
  if (gameState === 'ending' && ending) {
    const { title, emoji, description, feedback, color, scores: finalScores, total } = ending;
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Zen Maru Gothic", "Hiragino Kaku Gothic ProN", sans-serif',
        padding: '20px',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '700px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '16px',
          }}>{emoji}</div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: color,
            marginBottom: '12px',
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#4a5568',
            marginBottom: '32px',
          }}>
            {description}
          </p>
          
          <div style={{
            background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f7fc 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#2d5a87',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              💡 フィードバック
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#4a5568',
              lineHeight: '1.7',
            }}>
              {feedback}
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '32px',
          }}>
            {Object.entries(GAME_DATA.dimensions).map(([key, dim]) => (
              <div key={key} style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '20px' }}>{dim.icon}</span>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#2d5a87' }}>{dim.name}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  background: '#e2e8f0',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, finalScores[key])}%`,
                    background: finalScores[key] >= 50 ? '#10b981' : finalScores[key] >= 25 ? '#f59e0b' : '#ef4444',
                  }} />
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#718096',
                }}>{finalScores[key]}点</div>
              </div>
            ))}
          </div>
          
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            marginBottom: '32px',
          }}>
            総合スコア: {total}点
          </div>
          
          <button
            onClick={startGame}
            style={{
              background: 'linear-gradient(135deg, #2d5a87 0%, #1e3a5f 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '18px 48px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(30, 58, 95, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(30, 58, 95, 0.3)';
            }}
          >
            もう一度プレイする
          </button>
        </div>
      </div>
    );
  }
  
  return null; // Should not reach here
};

export default KaigoSalesSimulation;
