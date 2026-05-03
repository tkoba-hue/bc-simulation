'use client';

import React, { useState, useEffect } from 'react';

// 100点制スコアデータ（scaled-scores.jsonより）
const SCALED_SCORES = {"opening":[{"index":0,"scores":{"structure":4,"specificity":0,"trust":3,"timing":1}},{"index":1,"scores":{"structure":-3,"specificity":0,"trust":-1,"timing":-4}},{"index":2,"scores":{"structure":3,"specificity":0,"trust":1,"timing":1}}],"deepdive_current":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}},{"index":1,"scores":{"structure":1,"specificity":0,"trust":4,"timing":1}},{"index":2,"scores":{"structure":-1,"specificity":0,"trust":-1,"timing":-3}}],"ask_awareness":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}},{"index":1,"scores":{"structure":1,"specificity":0,"trust":3,"timing":1}},{"index":2,"scores":{"structure":0,"specificity":1,"trust":0,"timing":0}}],"ask_survey":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":4,"timing":1}},{"index":2,"scores":{"structure":-4,"specificity":0,"trust":-3,"timing":-1}}],"empathy_awareness":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":-1,"specificity":0,"trust":-3,"timing":-3}}],"empathy_system":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":0,"specificity":1,"trust":0,"timing":0}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":3,"timing":-1}}],"hidden_care":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":1,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":3,"trust":0,"timing":-3}}],"hidden_care_detail":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":1,"timing":2}},{"index":1,"scores":{"structure":1,"specificity":1,"trust":4,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":3,"trust":0,"timing":-3}}],"hidden_care_risk":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":1,"specificity":1,"trust":4,"timing":1}},{"index":2,"scores":{"structure":3,"specificity":1,"trust":1,"timing":0}}],"survey_detail":[{"index":0,"scores":{"structure":3,"specificity":3,"trust":4,"timing":1}},{"index":1,"scores":{"structure":4,"specificity":1,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":3,"trust":1,"timing":0}}],"gap_analysis":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":3}},{"index":1,"scores":{"structure":1,"specificity":1,"trust":3,"timing":0}},{"index":2,"scores":{"structure":3,"specificity":1,"trust":1,"timing":0}}],"economic_impact":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":1,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":-1,"timing":-3}}],"effectiveness_wall":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":1,"timing":2}},{"index":2,"scores":{"structure":3,"specificity":3,"trust":1,"timing":0}}],"concept_shift":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":4,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":0,"trust":1,"timing":0}}],"action_focus":[{"index":0,"scores":{"structure":3,"specificity":3,"trust":4,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":2,"scores":{"structure":3,"specificity":3,"trust":1,"timing":0}}],"prevention_concept":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":2,"scores":{"structure":0,"specificity":1,"trust":0,"timing":0}}],"career_framing":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":4,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":1,"timing":0}}],"package_intro":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":4,"timing":3}},{"index":2,"scores":{"structure":0,"specificity":1,"trust":0,"timing":0}}],"tailored_proposal":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":0,"trust":1,"timing":-1}}],"seminar_results":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":4,"trust":3,"timing":2}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"satisfaction_detail":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":1,"timing":0}},{"index":2,"scores":{"structure":1,"specificity":3,"trust":0,"timing":0}}],"roadmap":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":4,"timing":3}},{"index":2,"scores":{"structure":0,"specificity":1,"trust":-1,"timing":-1}}],"planning_together":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":3,"trust":1,"timing":0}}],"concrete_plan":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":4}},{"index":1,"scores":{"structure":4,"specificity":1,"trust":4,"timing":4}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"timing_confirmation":[{"index":0,"scores":{"structure":3,"specificity":3,"trust":4,"timing":1}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":-1,"specificity":0,"trust":-1,"timing":-1}}],"timing_options":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":0,"timing":-1}}],"premature_pitch":[{"index":0,"scores":{"structure":3,"specificity":0,"trust":3,"timing":2}},{"index":1,"scores":{"structure":-3,"specificity":0,"trust":-3,"timing":-3}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":1,"timing":0}}],"miss_opportunity":[{"index":0,"scores":{"structure":3,"specificity":0,"trust":3,"timing":2}},{"index":1,"scores":{"structure":-4,"specificity":0,"trust":-3,"timing":-1}},{"index":2,"scores":{"structure":-1,"specificity":0,"trust":-1,"timing":0}}],"recovery_current":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":4,"timing":2}},{"index":2,"scores":{"structure":-1,"specificity":0,"trust":-1,"timing":-3}}],"recovery_challenge":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":0,"trust":3,"timing":0}}],"just_empathy":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":1,"timing":0}},{"index":2,"scores":{"structure":-1,"specificity":0,"trust":-1,"timing":-1}}],"vague_question":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}},{"index":1,"scores":{"structure":-1,"specificity":0,"trust":-1,"timing":-3}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":3,"timing":1}}],"ask_cause":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":1,"timing":0}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":3,"timing":-1}}],"ask_demographics":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":1,"timing":0}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":1,"timing":0}}],"parent_age":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":4,"timing":1}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":1,"timing":0}}],"awareness_check":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":1,"timing":0}}],"productivity_impact":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":1,"timing":-3}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":1,"timing":0}}],"psychological_safety":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":1,"timing":0}}],"manager_education":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":3,"trust":1,"timing":0}}],"effectiveness_intro":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":3,"specificity":3,"trust":1,"timing":0}}],"next_action":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":1,"trust":4,"timing":3}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-3}}],"ask_data":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":4,"timing":1}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}},{"index":2,"scores":{"structure":0,"specificity":1,"trust":-1,"timing":0}}],"just_acknowledge":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"general_proposal":[{"index":0,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":1,"specificity":3,"trust":1,"timing":0}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"general_response":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":4,"trust":1,"timing":1}},{"index":2,"scores":{"structure":-1,"specificity":0,"trust":-1,"timing":-1}}],"general_acknowledge":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":1,"timing":-3}},{"index":2,"scores":{"structure":3,"specificity":3,"trust":1,"timing":-3}}],"service_intro":[{"index":0,"scores":{"structure":3,"specificity":0,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":1,"timing":-3}},{"index":2,"scores":{"structure":1,"specificity":3,"trust":0,"timing":-3}}],"lcat_intro":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":4,"trust":1,"timing":-3}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"lcat_intro_good":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":4,"trust":1,"timing":-3}},{"index":2,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}}],"lcat_detail":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":4}},{"index":2,"scores":{"structure":0,"specificity":1,"trust":-1,"timing":-1}}],"seminar_intro":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"seminar_type":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":1,"timing":0}}],"manager_perspective":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":1,"timing":0}}],"both_seminars":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}},{"index":2,"scores":{"structure":0,"specificity":1,"trust":-1,"timing":-1}}],"budget_discussion":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":1,"trust":4,"timing":4}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"budget_timing":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":4,"timing":4}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"ask_budget":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":4,"timing":2}},{"index":2,"scores":{"structure":0,"specificity":3,"trust":0,"timing":0}}],"realistic_proposal":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":4}},{"index":1,"scores":{"structure":1,"specificity":1,"trust":1,"timing":-1}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"budget_constraint":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":3,"timing":2}},{"index":1,"scores":{"structure":1,"specificity":0,"trust":0,"timing":-1}},{"index":2,"scores":{"structure":-1,"specificity":0,"trust":-1,"timing":-1}}],"case_study":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"mandatory_approach":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":1}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":4,"timing":1}},{"index":2,"scores":{"structure":-1,"specificity":1,"trust":-3,"timing":-3}}],"tailored_approach":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":0,"timing":-1}}],"recommend_mandatory":[{"index":0,"scores":{"structure":4,"specificity":1,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":0,"trust":0,"timing":-1}}],"hybrid_approach":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":0,"trust":0,"timing":-1}}],"age_targeting":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":4}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"phased_approach":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"tailored_plan":[{"index":0,"scores":{"structure":4,"specificity":1,"trust":4,"timing":4}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"consultation_intro":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"consultation_detail":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":4,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"package_approach":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"three_pillars":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":3}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":4,"timing":4}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"flow_explanation":[{"index":0,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":4,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"flexible_approach":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"lcat_positioning":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"manager_seminar":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"manager_detail":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"seminar_timing":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":-1,"specificity":-1,"trust":0,"timing":-1}}],"recovery_question":[{"index":0,"scores":{"structure":3,"specificity":1,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":2}},{"index":2,"scores":{"structure":-3,"specificity":0,"trust":-3,"timing":-3}}],"explain_seminar":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":1,"specificity":3,"trust":1,"timing":0}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"seminar_proposal":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":3,"trust":1,"timing":0}}],"seminar_format":[{"index":0,"scores":{"structure":3,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":1,"trust":4,"timing":3}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"action_oriented":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":1,"scores":{"structure":4,"specificity":3,"trust":3,"timing":3}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":0,"timing":-1}}],"closing_proposal":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":4}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":0,"timing":-1}}],"seminar_concept":[{"index":0,"scores":{"structure":4,"specificity":4,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":4,"trust":3,"timing":1}},{"index":2,"scores":{"structure":0,"specificity":0,"trust":-1,"timing":-1}}],"gap_solution":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":3,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":1,"timing":0}}],"target_audience":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":2}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":1}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}],"budget_fit":[{"index":0,"scores":{"structure":4,"specificity":3,"trust":4,"timing":4}},{"index":1,"scores":{"structure":3,"specificity":3,"trust":3,"timing":2}},{"index":2,"scores":{"structure":1,"specificity":1,"trust":0,"timing":-1}}]};


// 選択肢の理由データ（choice-reasons.jsonより）
const CHOICE_REASONS = {"opening":[{"index":0,"reason":"相手の課題を聞き提案につなげる"},{"index":1,"reason":"顧客ニーズ無視の唐突な売り込み"},{"index":2,"reason":"当たり障りなく深いニーズ探求不足"}],"deepdive_current":[{"index":0,"reason":"具体的な取り組みを聞きニーズ明確化"},{"index":1,"reason":"共感を示し信頼関係を構築する"},{"index":2,"reason":"顧客の課題を無視した一方的提案"}],"ask_awareness":[{"index":0,"reason":"共感と課題特定で信頼感を深める"},{"index":1,"reason":"共感はするが次のアクションがない"},{"index":2,"reason":"自社サービスへの誘導が早すぎる"}],"ask_survey":[{"index":0,"reason":"共通課題を提示し共感を深める"},{"index":1,"reason":"具体的な質問で相手の状況を深掘り"},{"index":2,"reason":"顧客の課題解決を放棄する発言"}],"empathy_awareness":[{"index":0,"reason":"共感しつつ具体的な行動を促す"},{"index":1,"reason":"業界の共通課題を示し安心感を与える"},{"index":2,"reason":"課題解決を焦り売り込みに走る"}],"empathy_system":[{"index":0,"reason":"複雑さを解消し本質的な価値を提示"},{"index":1,"reason":"自社サービス紹介で顧客の共感を失う"},{"index":2,"reason":"共感のみで次のステップにつながらない"}],"hidden_care":[{"index":0,"reason":"具体的な影響を提示し課題感を高める"},{"index":1,"reason":"潜在的な課題を示唆し深掘りを促す"},{"index":2,"reason":"自社ツールへの誘導が早すぎる"}],"hidden_care_detail":[{"index":0,"reason":"経済損失という具体的なリスク提示"},{"index":1,"reason":"顧客の具体的な状況を聞き深掘りする"},{"index":2,"reason":"顧客の状況を無視した早すぎる提案"}],"hidden_care_risk":[{"index":0,"reason":"潜在リスクの具体的な対策を提示"},{"index":1,"reason":"顧客の状況から深掘りのきっかけに"},{"index":2,"reason":"具体的な課題解決への貢献が弱い"}],"survey_detail":[{"index":0,"reason":"質問で深掘りし相手の分析力を褒める"},{"index":1,"reason":"次の行動を促し提案への道筋を作る"},{"index":2,"reason":"情報開示を求めるのはまだ早い"}],"gap_analysis":[{"index":0,"reason":"課題の本質を言語化し共感と理解を深める"},{"index":1,"reason":"事実の確認のみで深い洞察がない"},{"index":2,"reason":"自社サービスへの誘導が早すぎる"}],"economic_impact":[{"index":0,"reason":"離職以外の具体的な影響を提示し危機感醸成"},{"index":1,"reason":"法対応の先に必要な実効性を提示"},{"index":2,"reason":"唐突なサービス紹介で信頼を損ねる"}],"effectiveness_wall":[{"index":0,"reason":"顧客の状況に合わせた具体的な解決策提示"},{"index":1,"reason":"課題解決の第一歩を具体的に提示"},{"index":2,"reason":"多くの企業がという曖昧な訴求"}],"concept_shift":[{"index":0,"reason":"本質的な行動を促し課題解決を簡素化"},{"index":1,"reason":"自社セミナーの本質的な価値を訴求"},{"index":2,"reason":"具体的な解決策への言及が弱い"}],"action_focus":[{"index":0,"reason":"心理的安全性を高めるメリットを提示"},{"index":1,"reason":"具体的なマネジメント層への教育を提案"},{"index":2,"reason":"自社サービスのメリットを一方的に伝える"}],"prevention_concept":[{"index":0,"reason":"視点を変え当事者意識を高める切り口"},{"index":1,"reason":"具体的な事例提示で関心と納得感を高める"},{"index":2,"reason":"顧客への提案が漠然としている"}],"career_framing":[{"index":0,"reason":"実績と具体例で信頼性と説得力を高める"},{"index":1,"reason":"管理職への具体的なアプローチを提案"},{"index":2,"reason":"ツールの存在を示すのみで具体性不足"}],"package_intro":[{"index":0,"reason":"具体的なサービス内容を分かりやすく提示"},{"index":1,"reason":"顧客の状況に合わせた的確な提案"},{"index":2,"reason":"漠然とした選択肢提示で具体性が低い"}],"tailored_proposal":[{"index":0,"reason":"成功事例に基づいた具体的な提案"},{"index":1,"reason":"次のステップと具体的な行動を促す"},{"index":2,"reason":"情報提供に留まり次につながらない"}],"seminar_results":[{"index":0,"reason":"具体的な数値と特徴で説得力を高める"},{"index":1,"reason":"具体的な顧客事例で共感と信頼を得る"},{"index":2,"reason":"詳細を資料に委ね機会を逸する"}],"satisfaction_detail":[{"index":0,"reason":"全体意識付けとテーマ別深掘りを提案"},{"index":1,"reason":"日程確認だが具体的な提案が弱い"},{"index":2,"reason":"価格提示だけで顧客への配慮不足"}],"roadmap":[{"index":0,"reason":"継続効果を強調し費用を提示"},{"index":1,"reason":"課題に合わせたカスタマイズを提案"},{"index":2,"reason":"情報提供のみで商談の主導権を失う"}],"planning_together":[{"index":0,"reason":"来期セミナー後の課題発見ステップを提案"},{"index":1,"reason":"良い進め方を確認し時期をヒアリング"},{"index":2,"reason":"見積もり作成だが次の行動が弱い"}],"concrete_plan":[{"index":0,"reason":"具体的な日程候補と内容提案を打診"},{"index":1,"reason":"プランと見積もりで来週の面会を依頼"},{"index":2,"reason":"資料送付のみで次の行動が不明確"}],"timing_confirmation":[{"index":0,"reason":"選択肢のメリットを提示し顧客に選択を促す"},{"index":1,"reason":"広報効果という付加価値を提示"},{"index":2,"reason":"顧客に丸投げし商談の主導権を失う"}],"timing_options":[{"index":0,"reason":"来期計画への詳細提案を依頼"},{"index":1,"reason":"予算取り資料のスケジュール確認"},{"index":2,"reason":"資料送付のみで具体的な行動がない"}],"premature_pitch":[{"index":0,"reason":"過ちを認め顧客への傾聴姿勢に戻る"},{"index":1,"reason":"反省なく売り込みを継続し信頼を失う"},{"index":2,"reason":"漠然とした質問でニーズを深掘りしない"}],"miss_opportunity":[{"index":0,"reason":"過ちを認め顧客の真意を深掘り"},{"index":1,"reason":"顧客の課題解決への意欲が見られない"},{"index":2,"reason":"唐突なサービス紹介で信頼を損ねる"}],"recovery_current":[{"index":0,"reason":"案内閲覧状況と実態調査の有無を確認"},{"index":1,"reason":"制度利用の課題認識を再確認"},{"index":2,"reason":"自社セミナーでの周知を逆提案"}],"recovery_challenge":[{"index":0,"reason":"隠れ介護問題と影響を指摘し共感"},{"index":1,"reason":"実態把握の難しさを問いアンケート確認"},{"index":2,"reason":"周知と実態把握の両方が必要と共感"}],"just_empathy":[{"index":0,"reason":"教育・相談・実態把握で教育から開始を提案"},{"index":1,"reason":"全社セミナーでの意識付けを推奨"},{"index":2,"reason":"資料送付のみで商談機会を逃す"}],"vague_question":[{"index":0,"reason":"制度の実効性ある運用を強調し共感"},{"index":1,"reason":"自社セミナーでの周知を逆提案"},{"index":2,"reason":"制度が使われない原因を問いかける"}],"ask_cause":[{"index":0,"reason":"細かい制度よりも行動が重要と説明"},{"index":1,"reason":"社員教育の必要性に自社セミナーを提案"},{"index":2,"reason":"介護の複雑さについて共感を示す"}],"ask_demographics":[{"index":0,"reason":"介護直面層への意識付けで能力維持"},{"index":1,"reason":"管理職向けセミナーを案内し重要性を強調"},{"index":2,"reason":"多さを認め対策の必要性を指摘のみ"}],"parent_age":[{"index":0,"reason":"75歳超の要介護リスクを指摘し事前準備促す"},{"index":1,"reason":"社員の危機意識の有無を確認"},{"index":2,"reason":"ユーザーの状況に対し共感を示すのみ"}],"awareness_check":[{"index":0,"reason":"事前準備が重要でパフォーマンス維持に繋がる"},{"index":1,"reason":"突然始まる現実をセミナーで伝える"},{"index":2,"reason":"課題認識への共感と解決必要性の指摘のみ"}],"productivity_impact":[{"index":0,"reason":"隠れ介護対策としての環境づくりを提案"},{"index":1,"reason":"実態把握の第一歩にLCAT活用を提案"},{"index":2,"reason":"対策の必要性を簡潔に伝えるのみ"}],"psychological_safety":[{"index":0,"reason":"管理職の理解が雰囲気改善に繋がると提案"},{"index":1,"reason":"全社セミナーで両立可能メッセージを発信"},{"index":2,"reason":"環境づくりの重要性について言及のみ"}],"manager_education":[{"index":0,"reason":"管理職向けセミナーで介護視点伝える"},{"index":1,"reason":"全社セミナー後に管理職向け追加を推奨"},{"index":2,"reason":"管理職研修の提供を簡潔に通知のみ"}],"effectiveness_intro":[{"index":0,"reason":"制度利用には行動変容が重要と指摘"},{"index":1,"reason":"自律的な行動と教育・相談・実態把握を強調"},{"index":2,"reason":"実践的なセミナー内容を重視している説明"}],"next_action":[{"index":0,"reason":"支援ステップを提示"},{"index":1,"reason":"調査課題に対する施策検討を提案"},{"index":2,"reason":"自社サービスの紹介を通知のみ"}],"ask_data":[{"index":0,"reason":"傾向情報でより適切な提案が可能と説明"},{"index":1,"reason":"主な課題点の確認を依頼"},{"index":2,"reason":"情報がない場合の一般的な提案を予告"}],"just_acknowledge":[{"index":0,"reason":"教育で考え方伝達を重視する説明"},{"index":1,"reason":"教育・相談・実態把握で教育開始を提案"},{"index":2,"reason":"自社セミナーでの支援を簡潔に推薦のみ"}],"general_proposal":[{"index":0,"reason":"御社の状況に応じた優先順位付けを提案"},{"index":1,"reason":"セミナーの開始と豊富な実績をアピール"},{"index":2,"reason":"関連資料の送付を簡潔に通知のみ"}],"general_response":[{"index":0,"reason":"教育・相談・実態把握の軸で教育開始提案"},{"index":1,"reason":"全社セミナーで意識付けと実績をアピール"},{"index":2,"reason":"資料送付による検討を促すのみ"}],"general_acknowledge":[{"index":0,"reason":"共通の悩みを理解し最適な支援開始点を検討"},{"index":1,"reason":"実態把握から始めるのが定石と説明"},{"index":2,"reason":"セミナーによる意識付けを推奨のみ"}],"service_intro":[{"index":0,"reason":"より適切な提案のため状況詳細を依頼"},{"index":1,"reason":"教育・相談・実態把握の軸で課題対応を説明"},{"index":2,"reason":"セミナーを推奨し実績を提示のみ"}],"lcat_intro":[{"index":0,"reason":"顧客状況に合わせた的確な提案"},{"index":1,"reason":"ツールの説明に終始し顧客への配慮不足"},{"index":2,"reason":"顧客との対話を放棄し情報提供のみ"}],"lcat_intro_good":[{"index":0,"reason":"自社ツールを売り込まず顧客を優先"},{"index":1,"reason":"具体的な情報が不足し説明が一般的"},{"index":2,"reason":"顧客の現状理解に基づいた最善策"}],"lcat_detail":[{"index":0,"reason":"顧客のコストを考慮した現実的提案"},{"index":1,"reason":"次のアクションと具体的な日程提案"},{"index":2,"reason":"顧客に合わせた提案がなく情報提供のみ"}],"seminar_intro":[{"index":0,"reason":"セミナーの強みと実績を具体的に提示"},{"index":1,"reason":"具体的な提案と顧客に合わせた推奨"},{"index":2,"reason":"情報提供に留まり個別提案がない"}],"seminar_type":[{"index":0,"reason":"管理職向けセミナーの具体的説明"},{"index":1,"reason":"他社事例を提示し具体的な導入案"},{"index":2,"reason":"一般論に終始し示唆が不足"}],"manager_perspective":[{"index":0,"reason":"顧客の意図を汲み段階的な提案"},{"index":1,"reason":"次のステップを明確化し具体的な行動"},{"index":2,"reason":"顧客への具体的なメリットや提案不足"}],"both_seminars":[{"index":0,"reason":"明確な費用提示と現実的な導入ステップ"},{"index":1,"reason":"顧客の予算感をヒアリングし柔軟な姿勢"},{"index":2,"reason":"顧客に合わせた提案がなく情報提供のみ"}],"budget_discussion":[{"index":0,"reason":"予算申請時期を考慮し必要なサポート提示"},{"index":1,"reason":"次の打ち合わせを提案し具体的な行動"},{"index":2,"reason":"顧客への具体的なヒアリングや提案不足"}],"budget_timing":[{"index":0,"reason":"次のステップと日程を明確に提案"},{"index":1,"reason":"予算獲得に向けた具体的な協力提案"},{"index":2,"reason":"積極的なアプローチやサポートが不足"}],"ask_budget":[{"index":0,"reason":"予算内で可能な追加施策を提示し具体提案"},{"index":1,"reason":"予算を尊重し段階的な導入を推奨"},{"index":2,"reason":"予算感に対し否定的な見解を示している"}],"realistic_proposal":[{"index":0,"reason":"顧客の意向を理解し具体的な日程と提案"},{"index":1,"reason":"具体的な提案や次のアクションが不足"},{"index":2,"reason":"情報提供に留まり個別提案がない"}],"budget_constraint":[{"index":0,"reason":"予算制約を受け入れ効果を保証"},{"index":1,"reason":"積極的なサポートや提案が不足"},{"index":2,"reason":"顧客との対話を放棄し検討を促すのみ"}],"case_study":[{"index":0,"reason":"セミナーの具体的な効果と行動変容を説明"},{"index":1,"reason":"実績を提示し顧客への効果をアピール"},{"index":2,"reason":"具体的な情報提供を避け対話が不足"}],"mandatory_approach":[{"index":0,"reason":"メリット・デメリット提示と自社の強み"},{"index":1,"reason":"顧客の状況に合わせた柔軟な提案姿勢"},{"index":2,"reason":"顧客の状況を考慮せず一方的な意見"}],"tailored_approach":[{"index":0,"reason":"顧客のアンケート結果を踏まえた提案"},{"index":1,"reason":"他社事例を提示し現実的な選択肢提案"},{"index":2,"reason":"積極的な提案やサポートが不足"}],"recommend_mandatory":[{"index":0,"reason":"顧客の意見を肯定し具体的な次のステップ"},{"index":1,"reason":"他社事例を提示し具体的な選択肢提案"},{"index":2,"reason":"積極的な提案やサポートが不足"}],"hybrid_approach":[{"index":0,"reason":"顧客の意向を汲み具体的な導入プラン"},{"index":1,"reason":"柔軟な提案姿勢と選択肢の提示"},{"index":2,"reason":"情報提供に留まり個別提案がない"}],"age_targeting":[{"index":0,"reason":"顧客の意向を理解し具体的な次の行動"},{"index":1,"reason":"実施時期と予算申請を考慮した提案"},{"index":2,"reason":"顧客との対話を放棄し検討を促すのみ"}],"phased_approach":[{"index":0,"reason":"顧客の意向を肯定し具体的な導入プラン"},{"index":1,"reason":"次の打ち合わせを提案し具体的なサポート"},{"index":2,"reason":"積極的な提案やサポートが不足"}],"tailored_plan":[{"index":0,"reason":"顧客の状況に合わせた個別提案を重視"},{"index":1,"reason":"具体的な情報収集を促し提案を改善"},{"index":2,"reason":"積極的な提案や情報収集が不足"}],"consultation_intro":[{"index":0,"reason":"具体的なサービス内容と利用開始時期を明確化"},{"index":1,"reason":"複数のサービスを組み合わせた効果的提案"},{"index":2,"reason":"顧客との対話を放棄し情報提供のみ"}],"consultation_detail":[{"index":0,"reason":"料金体系を明確にしパッケージを提案"},{"index":1,"reason":"予算に合わせた柔軟な提案と効果説明"},{"index":2,"reason":"顧客への具体的な提案が不足"}],"package_approach":[{"index":0,"reason":"理想的な組み合わせを提示し現状に合わせた提案"},{"index":1,"reason":"サービス連携による具体的な効果を説明"},{"index":2,"reason":"具体的な情報提供が不足し提案も弱い"}],"three_pillars":[{"index":0,"reason":"顧客の現状を理解し次のステップ提案"},{"index":1,"reason":"次の打ち合わせを提案し予算獲得サポート"},{"index":2,"reason":"積極的な提案やサポートが不足"}],"flow_explanation":[{"index":0,"reason":"サービス連携の重要性を強調し流れ説明"},{"index":1,"reason":"顧客の状況に合わせた段階的導入を提案"},{"index":2,"reason":"顧客との対話を避け情報提供のみ"}],"flexible_approach":[{"index":0,"reason":"顧客の状況に合わせた段階的導入を提案"},{"index":1,"reason":"次の打ち合わせを提案し具体的なプラン作成"},{"index":2,"reason":"積極的な提案や次のアクションが不足"}],"lcat_positioning":[{"index":0,"reason":"サービスの全体像と連携による理想的な流れ提示"},{"index":1,"reason":"顧客のアンケート結果を踏まえ潜在的課題を指摘"},{"index":2,"reason":"積極的な提案や対話が不足"}],"manager_seminar":[{"index":0,"reason":"管理職向けセミナーの具体的な内容を説明"},{"index":1,"reason":"全社向けとの違いを明確にし導入メリット"},{"index":2,"reason":"積極的な提案や情報提供が不足"}],"manager_detail":[{"index":0,"reason":"離職防止への効果を説明し導入を推奨"},{"index":1,"reason":"段階的な導入アプローチを提案し柔軟な姿勢"},{"index":2,"reason":"積極的な提案や情報提供が不足"}],"seminar_timing":[{"index":0,"reason":"具体的な実施時期と予算申請の提示"},{"index":1,"reason":"介護リスクを強調し早期実施を推奨"},{"index":2,"reason":"具体的なアドバイスや示唆がない"}],"recovery_question":[{"index":0,"reason":"顧客の課題を深く理解するための質問"},{"index":1,"reason":"顧客の現状と社員の反応をヒアリング"},{"index":2,"reason":"課題を深掘りせず自社サービスをアピール"}],"explain_seminar":[{"index":0,"reason":"セミナーの強みと具体的な実績を提示"},{"index":1,"reason":"セミナー内容の説明だが強み不足"},{"index":2,"reason":"顧客との対話を放棄し情報提供のみ"}],"seminar_proposal":[{"index":0,"reason":"セミナーの独自性と具体的な効果をアピール"},{"index":1,"reason":"顧客のニーズをヒアリングし提案に繋げる"},{"index":2,"reason":"セミナー形式の説明だが提案が弱い"}],"seminar_format":[{"index":0,"reason":"明確な費用提示とそのメリットを説明"},{"index":1,"reason":"顧客の状況に合わせた柔軟な提案姿勢"},{"index":2,"reason":"積極的な提案やヒアリングが不足"}],"action_oriented":[{"index":0,"reason":"顧客のニーズを捉え導入の重要性を強調"},{"index":1,"reason":"導入メリットをリスク回避の観点から説明"},{"index":2,"reason":"顧客への問いかけだが具体的な提案なし"}],"closing_proposal":[{"index":0,"reason":"顧客への感謝と具体的な次のアクション提案"},{"index":1,"reason":"実施時期を考慮し必要な情報提供を約束"},{"index":2,"reason":"積極的なアプローチやサポートが不足"}],"seminar_concept":[{"index":0,"reason":"セミナーのコンセプトと具体的な行動を説明"},{"index":1,"reason":"具体的な事例を用いて顧客への効果アピール"},{"index":2,"reason":"顧客との対話を放棄し情報提供のみ"}],"gap_solution":[{"index":0,"reason":"顧客の課題を明確にし自社セミナーで解決"},{"index":1,"reason":"セミナーの独自性を強調し行動変容をアピール"},{"index":2,"reason":"顧客への問いかけだが具体的な提案が弱い"}],"target_audience":[{"index":0,"reason":"顧客の意見を肯定しターゲット別目的を明確化"},{"index":1,"reason":"段階的な導入アプローチを提案し柔軟な姿勢"},{"index":2,"reason":"積極的な提案や情報提供が不足"}],"budget_fit":[{"index":0,"reason":"次の打ち合わせを提案し予算獲得サポート"},{"index":1,"reason":"実施時期を考慮し具体的なプランと見積もり提案"},{"index":2,"reason":"積極的な提案や次のアクションが不足"}]};


// ゲームデータ
const GAME_DATA = {
  title: '仕事と介護の両立支援',
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
    title: 'ダイバーシティ推進室',
    avatar: '👤',
    initialMood: 'neutral',
  },
  
  scenes: {
    opening: {
      id: 'opening',
      speaker: 'customer',
      text: 'はい、ありがとうございます。当社も今年4月の法改正に合わせて、一通り対応は済ませているんですけれども…正直、その先どうしていくかというところで。',
      mood: 'neutral',
      choices: [
        { text: 'なるほど、法対応はお済みなんですね。ちなみに、今どんな取り組みをされていますか？', next: 'deepdive_current', tag: 'good' },
        { text: 'そうなんですね。弊社ではLCATという実態把握ツールがありまして…', next: 'premature_pitch', tag: 'bad' },
        { text: '法改正の内容について、社員の方々への周知はできていますか？', next: 'ask_awareness', tag: 'neutral' },
      ],
    },
    
    deepdive_current: {
      id: 'deepdive_current',
      speaker: 'customer',
      text: 'えっと、一応イントラに制度のガイドブックは載せてまして。あとは労働局の動画を全社に案内したんですけど…正直、どのくらい見てもらえているか。',
      mood: 'thinking',
      choices: [
        { text: 'アンケートや実態調査などは実施されましたか？', next: 'ask_survey', tag: 'good' },
        { text: '見てもらえているか分からない、というのは悩ましいですよね。', next: 'empathy_awareness', tag: 'good' },
        { text: 'では弊社のセミナーで周知を図るのはいかがでしょうか？', next: 'premature_pitch', tag: 'bad' },
      ],
    },
    
    ask_awareness: {
      id: 'ask_awareness',
      speaker: 'customer',
      text: 'えー、そこが正直課題でして。制度があることは伝えたんですけど、内容まで理解しているかというと…介護保険制度のことを聞かれても、こちらも答えられなくて。',
      mood: 'worried',
      choices: [
        { text: 'なるほど、そこは多くの企業様が悩まれるところです。実態把握はされていますか？', next: 'ask_survey', tag: 'good' },
        { text: 'そうですよね、介護保険制度は複雑ですからね。', next: 'empathy_system', tag: 'neutral' },
        { text: '弊社のセミナーでは、介護保険の基礎から説明できます。', next: 'explain_seminar', tag: 'neutral' },
      ],
    },
    
    ask_survey: {
      id: 'ask_survey',
      speaker: 'customer',
      text: '実は10月にアンケートを取りまして。2,300人くらい回答があったんですけど…「困っていない」という回答が多くて。でも本当にそうなのかな、と。',
      mood: 'thinking',
      choices: [
        { text: 'そこが実は多くの企業様で課題になっていまして。「隠れ介護」と呼ばれる現象があります。', next: 'hidden_care', tag: 'good' },
        { text: '2,300名の回答は多いですね。具体的にはどんな項目を聞かれましたか？', next: 'survey_detail', tag: 'good' },
        { text: '困っていないなら、当面は大丈夫かもしれませんね。', next: 'miss_opportunity', tag: 'bad' },
      ],
    },
    
    empathy_awareness: {
      id: 'empathy_awareness',
      speaker: 'customer',
      text: 'そうなんです。制度を作っても使われなければ意味がないですし、そもそも社員がどのくらい介護を抱えているのかも見えていなくて。',
      mood: 'worried',
      choices: [
        { text: 'まさにそこが課題ですよね。実態が見えないと手の打ちようがない。実態調査などはされましたか？', next: 'ask_survey', tag: 'good' },
        { text: '介護は「隠れる」性質があるんです。実は多くの企業で同じ課題が出ています。', next: 'hidden_care', tag: 'good' },
        { text: '当社のサービスで可視化できますよ。', next: 'premature_pitch', tag: 'bad' },
      ],
    },
    
    empathy_system: {
      id: 'empathy_system',
      speaker: 'customer',
      text: 'そうなんですよ。ケアマネージャーって何？要介護度って？と聞かれても、私たちも詳しくないので…',
      mood: 'worried',
      choices: [
        { text: '実は、細かい制度を覚える必要はあまりないんです。重要なのは「どこに相談すればいいか」を知ること。', next: 'concept_shift', tag: 'good' },
        { text: '弊社のセミナーでは介護保険制度について詳しく解説します。', next: 'explain_seminar', tag: 'neutral' },
        { text: '分かります。介護は本当に複雑ですよね。', next: 'just_empathy', tag: 'neutral' },
      ],
    },
    
    hidden_care: {
      id: 'hidden_care',
      speaker: 'customer',
      text: '隠れ介護…ですか？',
      mood: 'curious',
      choices: [
        { text: 'はい。介護は突然始まり、キャリアへの影響を恐れて言い出せない方が多いんです。特に40〜50代の中核社員に多く見られます。', next: 'hidden_care_detail', tag: 'good' },
        { text: '「困っていない」と答えた方の中に、実は介護を抱えている方がいる可能性があります。', next: 'hidden_care_risk', tag: 'good' },
        { text: 'そうです。弊社のLCATで可視化できます。', next: 'lcat_intro', tag: 'neutral' },
      ],
    },
    
    hidden_care_detail: {
      id: 'hidden_care_detail',
      speaker: 'customer',
      text: 'たしかに、うちも平均年齢が上がってきていて…特に管理職層は50代が多いです。',
      mood: 'thinking',
      choices: [
        { text: 'まさにそこがリスクです。経産省の試算では、2030年には約9兆円の経済損失が見込まれていて、その多くが管理職層のパフォーマンス低下です。', next: 'economic_impact', tag: 'good' },
        { text: '御社の40代・50代の比率はどのくらいですか？', next: 'ask_demographics', tag: 'good' },
        { text: 'では管理職向けのセミナーがおすすめです。', next: 'manager_seminar', tag: 'neutral' },
      ],
    },
    
    hidden_care_risk: {
      id: 'hidden_care_risk',
      speaker: 'customer',
      text: 'そうですか…アンケートでは「現在介護していない」が多かったんですが、5年以内に可能性がある人は結構いたんですよ。',
      mood: 'thinking',
      choices: [
        { text: 'そこが重要です。「予備軍」の方々に今から準備してもらうことで、いざという時の離職やパフォーマンス低下を防げます。', next: 'prevention_concept', tag: 'good' },
        { text: '5年以内というのは、親御さんの年齢層も上がってきているということですね。', next: 'parent_age', tag: 'good' },
        { text: 'では今のうちにセミナーで意識づけをするのが良いですね。', next: 'seminar_timing', tag: 'neutral' },
      ],
    },
    
    survey_detail: {
      id: 'survey_detail',
      speaker: 'customer',
      text: '介護の有無、今後の可能性、社内制度の認知度、介護保険の理解度…といった感じです。',
      mood: 'neutral',
      choices: [
        { text: 'しっかり設計されていますね。認知度と理解度のところ、差はありましたか？', next: 'gap_analysis', tag: 'good' },
        { text: 'なるほど。その結果を踏まえて、次のアクションは何か考えていらっしゃいますか？', next: 'next_action', tag: 'good' },
        { text: 'その調査結果を拝見することは可能ですか？', next: 'ask_data', tag: 'neutral' },
      ],
    },
    
    gap_analysis: {
      id: 'gap_analysis',
      speaker: 'customer',
      text: 'まさにそこなんです。「制度があることは知っている」が8割なのに、「内容を理解している」は2割くらいで…',
      mood: 'worried',
      choices: [
        { text: 'その差が「実効性の壁」です。制度があっても使えなければ意味がない。そこを埋めるのが次のステップですね。', next: 'effectiveness_wall', tag: 'good' },
        { text: 'なるほど。周知と理解にギャップがあるということですね。', next: 'just_acknowledge', tag: 'neutral' },
        { text: 'では弊社のセミナーで理解度を高めましょう。', next: 'seminar_proposal', tag: 'neutral' },
      ],
    },
    
    economic_impact: {
      id: 'economic_impact',
      speaker: 'customer',
      text: '9兆円…そんなに影響があるんですか。',
      mood: 'surprised',
      choices: [
        { text: 'はい。離職だけでなく、「隠れ介護」による生産性低下が大きいんです。御社でも、見えないところで影響が出ている可能性があります。', next: 'productivity_impact', tag: 'good' },
        { text: 'ですので、早めの対策が重要です。御社のように法対応を終えた企業が次に取り組むべきは「実効性」です。', next: 'effectiveness_intro', tag: 'good' },
        { text: 'そうなんです。では対策として弊社のサービスをご紹介しますね。', next: 'service_intro', tag: 'neutral' },
      ],
    },
    
    effectiveness_wall: {
      id: 'effectiveness_wall',
      speaker: 'customer',
      text: 'まさに…制度を作って終わりじゃないんですよね。でも、具体的に何をすればいいのか。',
      mood: 'thinking',
      choices: [
        { text: '私たちは「教育・相談・実態把握」の3つを軸にした支援パッケージをご用意しています。御社の状況だと…', next: 'package_intro', tag: 'good' },
        { text: 'そこで弊社がお手伝いできます。まずは実態把握から始めるのが一般的です。', next: 'lcat_intro_good', tag: 'good' },
        { text: '多くの企業様がセミナーから始められています。', next: 'seminar_intro', tag: 'neutral' },
      ],
    },
    
    concept_shift: {
      id: 'concept_shift',
      speaker: 'customer',
      text: 'そうなんですか？制度を詳しく知らないとダメだと思っていました。',
      mood: 'curious',
      choices: [
        { text: 'いえ、実務的には「地域包括支援センターに連絡する」という一歩が最重要です。制度はケアマネさんが教えてくれます。', next: 'action_focus', tag: 'good' },
        { text: '弊社のセミナーでは制度の説明よりも「考え方」を重視しています。満足度が高いのはそのためです。', next: 'seminar_concept', tag: 'good' },
        { text: 'そうですね、ポイントを絞ってお伝えすることが大事です。', next: 'general_response', tag: 'neutral' },
      ],
    },
    
    action_focus: {
      id: 'action_focus',
      speaker: 'customer',
      text: 'なるほど…確かに、社員にも「何かあったらここに連絡」と伝えた方が分かりやすいですね。',
      mood: 'positive',
      choices: [
        { text: 'まさにそうです。そして社内でも相談できる体制があると、社員の心理的安全性が高まります。', next: 'consultation_intro', tag: 'good' },
        { text: 'はい。加えて、管理職が部下の変化に気づけるよう、マネジメント層への教育も効果的です。', next: 'manager_education', tag: 'good' },
        { text: 'そこで弊社のセミナーでは、具体的なアクションまでお伝えしています。', next: 'seminar_concept', tag: 'neutral' },
      ],
    },
    
    prevention_concept: {
      id: 'prevention_concept',
      speaker: 'customer',
      text: '事前準備が大事ということですね。でも、介護が始まっていない人に危機感を持ってもらうのは難しいですよね…',
      mood: 'thinking',
      choices: [
        { text: 'そこがポイントです。「親の介護」ではなく「自分のキャリア」の問題として捉えてもらう。そうすると関心が変わります。', next: 'career_framing', tag: 'good' },
        { text: '弊社のセミナーでは、実際に両立されている方の事例をお伝えしています。リアリティが違うと好評です。', next: 'case_study', tag: 'good' },
        { text: '確かに難しいですね。強制的に受講させる企業もあります。', next: 'mandatory_approach', tag: 'neutral' },
      ],
    },
    
    career_framing: {
      id: 'career_framing',
      speaker: 'customer',
      text: 'キャリアの問題…確かに、そう言われると自分事になりますね。',
      mood: 'positive',
      choices: [
        { text: 'はい。弊社のセミナーでは「仕事と介護の両立」という切り口で、15万人以上に受講いただいています。', next: 'seminar_results', tag: 'good' },
        { text: '例えば、管理職の方には「部下がいつ介護を始めてもおかしくない」という視点で研修しています。', next: 'manager_perspective', tag: 'good' },
        { text: 'そういった意識づけのためのツールもご用意しています。', next: 'lcat_intro', tag: 'neutral' },
      ],
    },
    
    package_intro: {
      id: 'package_intro',
      speaker: 'customer',
      text: '教育・相談・実態把握…具体的にはどんな内容ですか？',
      mood: 'curious',
      choices: [
        { text: 'まず教育では、90分のオンラインセミナーで意識改革を。相談は介護の専門家による外部窓口。実態把握はLCATという診断ツールです。', next: 'tailored_proposal', tag: 'good' },
        { text: '御社の場合、すでに実態調査をされているので、次は「教育」から入るのが効果的です。', next: 'tailored_proposal', tag: 'good' },
        { text: 'いろいろありますが、予算に応じて組み合わせできます。', next: 'budget_discussion', tag: 'neutral' },
      ],
    },
    
    tailored_proposal: {
      id: 'tailored_proposal',
      speaker: 'customer',
      text: 'そうですね、調査はしたので次のアクションを考えたいと思っていたところです。',
      mood: 'positive',
      choices: [
        { text: '多くの企業様が「全社向けセミナー → テーマ別セミナー → 継続フォロー」というステップで進めています。御社の場合も…', next: 'roadmap', tag: 'good' },
        { text: 'では、来期の計画に入れていただく形ですね。時期としてはいつ頃がよろしいですか？', next: 'timing_confirmation', tag: 'good' },
        { text: '一度、詳しい資料をお送りしましょうか？', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    seminar_results: {
      id: 'seminar_results',
      speaker: 'customer',
      text: '15万人受講で96.5%…それはすごいですね。具体的にはどんな内容なんですか？',
      mood: 'curious',
      choices: [
        { text: '90分のオンラインセミナーで、制度の説明ではなく「介護に直面した時の考え方とアクション」をお伝えします。受講後に「親と話してみる」という行動につなげます。', next: 'action_oriented', tag: 'good' },
        { text: '実際に介護と仕事を両立されている方の事例を中心に、「こうすれば仕事を続けられる」という具体的なイメージをお伝えします。', next: 'action_oriented', tag: 'good' },
        { text: '詳しくは資料をお送りします。', next: 'ending_neutral', tag: 'bad' },
      ],
    },
    
    satisfaction_detail: {
      id: 'satisfaction_detail',
      speaker: 'customer',
      text: '「自分事として考えられた」…それが大事ですよね。うちの社員にもそう思ってもらいたい。',
      mood: 'positive',
      choices: [
        { text: 'ありがとうございます。御社の場合、まず全社向けセミナーで意識づけをして、その後テーマ別で深掘りという流れがおすすめです。', next: 'roadmap', tag: 'good' },
        { text: '来期のスケジュールはもう決まっていますか？早めに日程を押さえていただければ、講師の調整も可能です。', next: 'timing_confirmation', tag: 'neutral' },
        { text: '費用感としては、90分のセミナーで約50〜60万円です。', next: 'budget_discussion', tag: 'neutral' },
      ],
    },
    
    roadmap: {
      id: 'roadmap',
      speaker: 'customer',
      text: 'ステップを踏んで進めていくということですね。年間でどのくらいの予算感になりますか？',
      mood: 'curious',
      choices: [
        { text: '全社セミナーが50〜60万円、テーマ別が追加で同程度です。ただ、単発で終わらせず継続することで効果が出ます。', next: 'budget_discussion', tag: 'good' },
        { text: '御社の課題に合わせてカスタマイズできますので、まずは来期どこまでやりたいか、一緒に整理しましょうか。', next: 'planning_together', tag: 'good' },
        { text: '資料に価格表がありますので、後ほどお送りします。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    planning_together: {
      id: 'planning_together',
      speaker: 'customer',
      text: 'そうですね…まずは全社向けのセミナーをやって、反応を見たいというのはあります。',
      mood: 'positive',
      choices: [
        { text: '承知しました。では、来期の早いタイミングで全社セミナーを実施し、アンケートで次の課題を見つける、というステップはいかがでしょう？', next: 'concrete_plan', tag: 'good' },
        { text: '良い進め方ですね。時期としてはいつ頃をお考えですか？', next: 'timing_confirmation', tag: 'good' },
        { text: 'では全社セミナーのお見積もりをお出ししますね。', next: 'ending_good', tag: 'neutral' },
      ],
    },
    
    concrete_plan: {
      id: 'concrete_plan',
      speaker: 'customer',
      text: '5月か6月くらいが社内的には落ち着いていていいかなと思います。アンケートを取ったのが10月なので、間が空きすぎない方がいいですし。',
      mood: 'positive',
      choices: [
        { text: 'そうですね。5〜6月であれば講師の調整も可能です。一度、具体的な日程候補と内容をご提案させていただけますか？', next: 'next_meeting', tag: 'good' },
        { text: '承知しました。では改めて、御社向けのプランと見積もりをまとめて、来週あたりにお時間いただけますか？', next: 'next_meeting_alt', tag: 'good' },
        { text: '5〜6月ですね、資料をお送りします。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
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
        { text: 'どちらもありです。上期は「早めの意識づけ」、秋は「介護の日に合わせて注目度を上げる」という狙いがあります。御社はどちらが合いそうですか？', next: 'timing_options', tag: 'good' },
        { text: '介護の日に合わせる企業様も増えています。社内広報としても打ち出しやすいですよね。', next: 'timing_options', tag: 'good' },
        { text: '日程が決まったらご連絡ください。', next: 'ending_neutral', tag: 'bad' },
      ],
    },
    
    timing_options: {
      id: 'timing_options',
      speaker: 'customer',
      text: 'アンケートを取ったのが10月なので、間を空けすぎない方がいいかな…やっぱり上期ですかね。',
      mood: 'positive',
      choices: [
        { text: '良い判断だと思います。では来期の計画に入れていただく形で、改めて詳細をご提案させてください。', next: 'ending_good', tag: 'good' },
        { text: '承知しました。1月中に予算取りに必要な資料をお送りできますので、スケジュール感を教えてください。', next: 'ending_good', tag: 'good' },
        { text: 'では資料をお送りします。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    premature_pitch: {
      id: 'premature_pitch',
      speaker: 'customer',
      text: 'あ、いきなりツールの話ですか…？まあ、聞くだけ聞きますけど。',
      mood: 'skeptical',
      choices: [
        { text: '失礼しました。まずは御社の状況をお聞かせいただけますか？今、どのような取り組みをされていますか？', next: 'recovery_current', tag: 'recovery' },
        { text: 'LCATは実態把握に非常に有効でして…', next: 'miss_opportunity', tag: 'bad' },
        { text: 'そうですか。では何かお困りのことはありますか？', next: 'vague_question', tag: 'neutral' },
      ],
    },
    
    miss_opportunity: {
      id: 'miss_opportunity',
      speaker: 'customer',
      text: 'うーん、ちょっとまだ具体的な検討段階ではないので…。またの機会に。',
      mood: 'negative',
      choices: [
        { text: '失礼しました。そうですよね、法対応の「その先」が大事ですよね。どのあたりに課題を感じていらっしゃいますか？', next: 'recovery_challenge', tag: 'recovery' },
        { text: '何かあればご連絡ください。', next: 'ending_bad', tag: 'bad' },
        { text: '弊社のサービスがお役に立てるかもしれません。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    recovery_current: {
      id: 'recovery_current',
      speaker: 'customer',
      text: 'えーと、一応イントラに制度案内は載せてます。あとは労働局の動画を全社に案内しましたけど、正直見てもらえているかどうか…',
      mood: 'neutral',
      choices: [
        { text: 'なるほど。案内を載せただけでは、なかなか見てもらえないですよね。実態調査などはされましたか？', next: 'ask_survey', tag: 'good' },
        { text: '制度を作っても使われないと意味がないですよね。そこが課題だと感じていらっしゃる？', next: 'empathy_awareness', tag: 'good' },
        { text: '弊社のセミナーで周知を図るのはいかがでしょうか？', next: 'premature_pitch', tag: 'bad' },
      ],
    },
    
    recovery_challenge: {
      id: 'recovery_challenge',
      speaker: 'customer',
      text: 'まあ、制度は作ったものの、実際どれくらい社員が介護の問題を抱えているか見えないんですよね…',
      mood: 'thinking',
      choices: [
        { text: 'まさにそこが多くの企業様の課題です。「隠れ介護」と呼ばれる現象があって、見えないところで影響が出ていることがあります。', next: 'hidden_care', tag: 'good' },
        { text: '実態把握が難しいですよね。アンケートなどは取られましたか？', next: 'ask_survey', tag: 'good' },
        { text: '分かります。制度の周知と実態把握、両方が必要ですよね。', next: 'just_empathy', tag: 'neutral' },
      ],
    },
    
    just_empathy: {
      id: 'just_empathy',
      speaker: 'customer',
      text: 'そうなんですよね。じゃあ御社としてはどういうサポートができるんですか？',
      mood: 'curious',
      choices: [
        { text: '弊社では「教育・相談・実態把握」の3つを軸に支援しています。御社の状況だと、まず教育から始めるのが良いかと思います。', next: 'package_intro', tag: 'good' },
        { text: 'まずは全社向けのセミナーで意識づけをするのがおすすめです。', next: 'seminar_intro', tag: 'neutral' },
        { text: '資料をお送りしますので、ご検討ください。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    vague_question: {
      id: 'vague_question',
      speaker: 'customer',
      text: 'うーん…困っていること、ですか。制度は整えたんですけど、あまり使われていないのが気になっているくらいで。',
      mood: 'neutral',
      choices: [
        { text: 'そこが多くの企業様の課題です。制度の周知だけでなく、実効性のある運用が必要ですよね。', next: 'empathy_awareness', tag: 'good' },
        { text: '弊社のセミナーで周知を図るのはいかがでしょうか？', next: 'premature_pitch', tag: 'bad' },
        { text: '使われない原因は何だと思いますか？', next: 'ask_cause', tag: 'neutral' },
      ],
    },
    
    ask_cause: {
      id: 'ask_cause',
      speaker: 'customer',
      text: '原因…そもそも介護って複雑じゃないですか。社員も何をどう準備すればいいか分からないんじゃないかと。',
      mood: 'thinking',
      choices: [
        { text: 'そうですね。ただ、細かい制度を覚える必要はあまりなくて、「いざという時にどう動くか」が大事です。', next: 'concept_shift', tag: 'good' },
        { text: '社員への教育が必要ということですね。弊社のセミナーがお役に立てるかもしれません。', next: 'seminar_intro', tag: 'neutral' },
        { text: '分かります。介護は本当に複雑ですからね。', next: 'empathy_system', tag: 'neutral' },
      ],
    },
    
    ask_demographics: {
      id: 'ask_demographics',
      speaker: 'customer',
      text: '40代50代が約6割ですね。管理職の多くがその年代です。',
      mood: 'neutral',
      choices: [
        { text: '6割は多いですね。今後5〜10年で介護に直面する可能性が高い層です。今のうちに意識づけをしておくことで、パフォーマンス低下を防げます。', next: 'hidden_care_risk', tag: 'good' },
        { text: '管理職層への対策が特に重要ですね。弊社では管理職向けのセミナーもご用意しています。', next: 'manager_education', tag: 'neutral' },
        { text: '多いですね。対策が必要です。', next: 'general_response', tag: 'neutral' },
      ],
    },
    
    parent_age: {
      id: 'parent_age',
      speaker: 'customer',
      text: '社員の親の年齢層まではちょっと把握できていないですが…多分70代後半から80代が多いんじゃないかと。',
      mood: 'thinking',
      choices: [
        { text: '75歳を超えると要介護リスクが急激に上がります。今のうちに「事前準備」の意識づけをすることが重要です。', next: 'hidden_care_risk', tag: 'good' },
        { text: 'なるほど。御社の社員の方々は、その危機感を持っていらっしゃいますか？', next: 'awareness_check', tag: 'good' },
        { text: 'それは大変ですね。', next: 'general_acknowledge', tag: 'neutral' },
      ],
    },
    
    awareness_check: {
      id: 'awareness_check',
      speaker: 'customer',
      text: '危機感…正直、「まだ自分は関係ない」と思っている人が大半でしょうね。アンケートでも「困っていない」という回答が多かったですし。',
      mood: 'thinking',
      choices: [
        { text: 'そこが課題ですね。「まだ大丈夫」と思っているうちに準備してもらうことが、いざという時のパフォーマンス維持につながります。', next: 'prevention_concept', tag: 'good' },
        { text: 'そうですよね。弊社のセミナーでは、「突然始まる」という現実をお伝えしています。', next: 'seminar_intro', tag: 'good' },
        { text: 'それは問題ですね。', next: 'general_response', tag: 'neutral' },
      ],
    },
    
    productivity_impact: {
      id: 'productivity_impact',
      speaker: 'customer',
      text: '離職だけじゃなくて、生産性低下もあるんですね…確かに、うちでも見えないところで影響が出ているかも。',
      mood: 'concerned',
      choices: [
        { text: 'そうなんです。だからこそ「隠れ介護」を防ぐ、つまり「言い出せる環境づくり」が重要です。御社ではそのあたり、いかがですか？', next: 'psychological_safety', tag: 'good' },
        { text: 'まずは実態を把握することが第一歩です。弊社のLCATで可視化できます。', next: 'lcat_intro', tag: 'neutral' },
        { text: '対策が必要ですね。', next: 'general_response', tag: 'neutral' },
      ],
    },
    
    psychological_safety: {
      id: 'psychological_safety',
      speaker: 'customer',
      text: '言い出せる環境…介護休業を取った人は少数ですね。まだ取りづらい雰囲気があるのかもしれません。',
      mood: 'thinking',
      choices: [
        { text: '少数というのは、「取りづらい雰囲気」があるかもしれません。管理職の理解を深めることで、その雰囲気は変わります。', next: 'manager_education', tag: 'good' },
        { text: 'そこを変えていくために、まず全社向けのセミナーで「両立できる」というメッセージを発信するのが効果的です。', next: 'seminar_intro', tag: 'good' },
        { text: '環境づくりが大事ですね。', next: 'general_acknowledge', tag: 'neutral' },
      ],
    },
    
    manager_education: {
      id: 'manager_education',
      speaker: 'customer',
      text: '管理職向けの研修ですか。確かに、上司が理解していないと部下も言い出しにくいですよね。',
      mood: 'positive',
      choices: [
        { text: 'その通りです。弊社では管理職向けのセミナーで「部下がいつ介護を始めてもおかしくない」という視点でお伝えしています。', next: 'manager_seminar', tag: 'good' },
        { text: 'まず全社向けセミナーで意識づけをして、次年度に管理職向けを追加する企業様が多いです。', next: 'both_seminars', tag: 'good' },
        { text: '管理職研修も用意しています。', next: 'seminar_intro', tag: 'neutral' },
      ],
    },
    
    effectiveness_intro: {
      id: 'effectiveness_intro',
      speaker: 'customer',
      text: '実効性を高めるって、具体的にどういうことですか？',
      mood: 'curious',
      choices: [
        { text: '制度があっても使われなければ意味がない。「知っている」から「動ける」へ変えることです。御社のアンケートでも...', next: 'gap_analysis', tag: 'good' },
        { text: '社員が自律的にアクションを取れる状態を作ること。そのために「教育・相談・実態把握」の3つが軸になります。', next: 'package_intro', tag: 'good' },
        { text: '弊社のセミナーでは、制度説明より実践的な内容を重視しています。', next: 'seminar_intro', tag: 'neutral' },
      ],
    },
    
    next_action: {
      id: 'next_action',
      speaker: 'customer',
      text: '調査で見えた課題に対して、何から手をつければいいか…ちょっと整理できていないんですよね。',
      mood: 'thinking',
      choices: [
        { text: 'そこで弊社がお手伝いできます。多くの企業様が「全社向けセミナー → テーマ別 → 継続フォロー」というステップで進めています。', next: 'tailored_proposal', tag: 'good' },
        { text: '調査で見えた課題に対して、どんな施策が効果的か、一緒に考えましょうか。', next: 'planning_together', tag: 'good' },
        { text: '弊社のサービスをご紹介しますね。', next: 'service_intro', tag: 'neutral' },
      ],
    },
    
    ask_data: {
      id: 'ask_data',
      speaker: 'customer',
      text: '調査結果ですか…社外にはあまり出してないんですが、概要くらいなら。',
      mood: 'neutral',
      choices: [
        { text: 'もちろんです。傾向だけでも教えていただけると、御社に合ったご提案ができます。', next: 'survey_detail', tag: 'good' },
        { text: '承知しました。主な課題はどのあたりに出ていますか？', next: 'gap_analysis', tag: 'good' },
        { text: 'そうですか。では一般的なご提案になりますが…', next: 'general_proposal', tag: 'neutral' },
      ],
    },
    
    just_acknowledge: {
      id: 'just_acknowledge',
      speaker: 'customer',
      text: '周知と理解のギャップか…そこを埋めるには何が効果的ですか？',
      mood: 'curious',
      choices: [
        { text: '教育です。ただ、制度を詳しく説明するのではなく、「考え方」を伝えることが重要。弊社のセミナーではそこを重視しています。', next: 'seminar_concept', tag: 'good' },
        { text: '弊社では「教育・相談・実態把握」の3つを軸に支援しています。御社の場合は教育から入るのが効果的です。', next: 'package_intro', tag: 'good' },
        { text: 'セミナーをおすすめします。', next: 'seminar_intro', tag: 'neutral' },
      ],
    },
    
    general_proposal: {
      id: 'general_proposal',
      speaker: 'customer',
      text: 'まあ、一般的な話でも参考にはなりますけど…',
      mood: 'neutral',
      choices: [
        { text: 'やはり御社の状況を踏まえた方が良いですね。一般的には「教育・相談・実態把握」の3つが軸ですが、御社の課題に合わせて優先順位を決めましょう。', next: 'package_intro', tag: 'recovery' },
        { text: '多くの企業様がセミナーから始められています。15万人以上に受講いただいています。', next: 'seminar_intro', tag: 'neutral' },
        { text: '資料をお送りしますね。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    general_response: {
      id: 'general_response',
      speaker: 'customer',
      text: 'そうですよね…で、御社としてはどういうサポートができるんですか？',
      mood: 'neutral',
      choices: [
        { text: '弊社では「教育・相談・実態把握」の3つを軸に支援しています。御社の状況だと、まず教育から始めるのが効果的です。', next: 'package_intro', tag: 'good' },
        { text: 'まずは全社向けのセミナーで意識づけをするのがおすすめです。15万人以上に受講いただいています。', next: 'seminar_intro', tag: 'good' },
        { text: 'いろいろな方法がありますので、資料をお送りしますね。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    general_acknowledge: {
      id: 'general_acknowledge',
      speaker: 'customer',
      text: 'そうなんですよね…でも何から始めればいいか。',
      mood: 'thinking',
      choices: [
        { text: '多くの企業様が同じ悩みを持たれています。弊社では「教育・相談・実態把握」の3つを軸に支援していますが、御社の場合は何から始めるのが良いか、一緒に考えましょうか。', next: 'planning_together', tag: 'good' },
        { text: 'まずは実態把握から始めるのが王道です。', next: 'lcat_intro', tag: 'neutral' },
        { text: 'まずはセミナーで意識づけをするのがおすすめです。', next: 'seminar_intro', tag: 'neutral' },
      ],
    },
    
    service_intro: {
      id: 'service_intro',
      speaker: 'customer',
      text: 'どんなサービスがあるんですか？',
      mood: 'curious',
      choices: [
        { text: 'ただ、その前に御社の状況をもう少し教えていただけますか？より適切なご提案ができると思います。', next: 'ask_survey', tag: 'recovery' },
        { text: '弊社は「教育・相談・実態把握」の3つを軸に支援しています。御社の課題に合わせてご提案できます。', next: 'package_intro', tag: 'neutral' },
        { text: 'まずセミナーがおすすめです。15万人以上に受講いただいています。', next: 'seminar_intro', tag: 'neutral' },
      ],
    },
    
    lcat_intro: {
      id: 'lcat_intro',
      speaker: 'customer',
      text: 'LCATって何ですか？',
      mood: 'curious',
      choices: [
        { text: '従業員向けの診断ツールで、両立の準備状況を可視化できます。ただ、御社の場合はすでにアンケートを取られているので、まずは教育から入る方が効果的かもしれません。', next: 'seminar_intro', tag: 'good' },
        { text: '単なるアンケートではなく、両立の準備状況を客観的に可視化し、組織全体のリスクとして把握できるツールです。', next: 'lcat_detail', tag: 'neutral' },
        { text: '詳しくは資料をお送りしますね。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    lcat_intro_good: {
      id: 'lcat_intro_good',
      speaker: 'customer',
      text: 'アンケートは取ったんですけど、もっと詳しく分析したいという気持ちはあります。',
      mood: 'curious',
      choices: [
        { text: '弊社のLCATは、単なるアンケートと違い、両立の準備状況を数値化できます。ただ、御社の場合はすでにアンケートを取られているので、その結果を活用する方が効率的かもしれません。', next: 'survey_detail', tag: 'good' },
        { text: 'LCATという診断ツールがあります。両立の準備状況を客観的に可視化できます。', next: 'lcat_detail', tag: 'neutral' },
        { text: 'まずは教育から始めて、必要に応じて追加調査するのが良いかもしれません。', next: 'seminar_intro', tag: 'good' },
      ],
    },
    
    lcat_detail: {
      id: 'lcat_detail',
      speaker: 'customer',
      text: 'なるほど。それはいくらくらいかかるんですか？',
      mood: 'curious',
      choices: [
        { text: '規模によりますが、御社の場合はすでにアンケートを取られているので、まずはその結果を活用した教育から始める方がコスト効率が良いかもしれません。', next: 'seminar_intro', tag: 'good' },
        { text: '詳細は改めてご提案させてください。来週あたりお時間いただけますか？', next: 'ending_good', tag: 'good' },
        { text: '資料に価格表がありますのでお送りします。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    seminar_intro: {
      id: 'seminar_intro',
      speaker: 'customer',
      text: 'セミナーってどんな内容なんですか？',
      mood: 'curious',
      choices: [
        { text: '90分のオンラインセミナーで、制度の説明より「考え方」を重視しています。15万人以上に受講いただき、満足度96.5%です。', next: 'seminar_results', tag: 'good' },
        { text: '「仕事と介護の両立」をテーマに、全社向けと管理職向けがあります。御社の場合はまず全社向けがおすすめです。', next: 'seminar_type', tag: 'good' },
        { text: 'いろいろなパターンがあります。資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    seminar_type: {
      id: 'seminar_type',
      speaker: 'customer',
      text: '全社向けと管理職向けがあるんですね。内容は違うんですか？',
      mood: 'curious',
      choices: [
        { text: 'その通りです。管理職には「部下がいつ介護を始めてもおかしくない」という視点で、マネジメントとしての対応を伝えます。', next: 'manager_perspective', tag: 'good' },
        { text: '1年目は全社向け、2年目にテーマ別を追加する企業様が多いです。御社もそのパターンはいかがですか？', next: 'both_seminars', tag: 'good' },
        { text: '両方やる企業様もいらっしゃいます。', next: 'both_seminars', tag: 'neutral' },
      ],
    },
    
    manager_perspective: {
      id: 'manager_perspective',
      speaker: 'customer',
      text: 'なるほど。確かに、管理職向けは別でやった方がいいかもしれないですね。',
      mood: 'positive',
      choices: [
        { text: 'まさにそうです。御社の場合、まず全社向けで意識づけをして、次年度に管理職向けを追加するのはいかがでしょう？', next: 'both_seminars', tag: 'good' },
        { text: 'そうですね。来期の計画に入れていただく形で、改めてご提案させてください。', next: 'ending_good', tag: 'good' },
        { text: '両方まとめてやることもできます。', next: 'both_seminars', tag: 'neutral' },
      ],
    },
    
    both_seminars: {
      id: 'both_seminars',
      speaker: 'customer',
      text: '全社向けと管理職向け、両方やるとしたらいくらくらいですか？',
      mood: 'curious',
      choices: [
        { text: '全社向けが50〜60万円、管理職向けを追加すると合計100〜120万円程度です。ただ、まず全社向けから始めて効果を見る方が現実的かもしれません。', next: 'budget_discussion', tag: 'good' },
        { text: '御社の予算感に合わせてご提案できます。来期どのくらいの予算を想定されていますか？', next: 'ask_budget', tag: 'good' },
        { text: '資料に価格表がありますのでお送りします。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    budget_discussion: {
      id: 'budget_discussion',
      speaker: 'customer',
      text: 'なるほど…来期の予算にどう入れるか、検討してみます。',
      mood: 'thinking',
      choices: [
        { text: 'いつ頃までに予算申請されますか？必要な資料をお送りできます。', next: 'budget_timing', tag: 'good' },
        { text: '来期計画に入れていただけるよう、御社向けのプランをまとめて改めてご提案させてください。来週あたりいかがですか？', next: 'ending_good', tag: 'good' },
        { text: '見積もりをお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    budget_timing: {
      id: 'budget_timing',
      speaker: 'customer',
      text: '予算申請は1月中ですね。それまでに材料を揃えておきたいです。',
      mood: 'positive',
      choices: [
        { text: 'では年内に御社向けのプランと見積もりをお送りして、年明けに改めてお打ち合わせさせてください。', next: 'ending_great', tag: 'good' },
        { text: '来週あたり、もう一度お時間いただけますか？上司の方にも同席いただけると、予算取りもスムーズかと思います。', next: 'ending_great', tag: 'good' },
        { text: '資料をお送りしますので、ご検討ください。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    ask_budget: {
      id: 'ask_budget',
      speaker: 'customer',
      text: '予算としては…100万円くらいで何かできればいいかなと思ってますが。',
      mood: 'neutral',
      choices: [
        { text: '100万円あれば、全社向けセミナーに加えてフォローアップの施策も入れられます。具体的なプランを作成して、改めてご提案させてください。', next: 'realistic_proposal', tag: 'good' },
        { text: 'であれば、まず全社向けセミナーから始めて、効果を見ながら次を検討するのが現実的ですね。', next: 'realistic_proposal', tag: 'good' },
        { text: '100万円ですと、全社向けと管理職向けの両方は難しいですね…', next: 'budget_constraint', tag: 'neutral' },
      ],
    },
    
    realistic_proposal: {
      id: 'realistic_proposal',
      speaker: 'customer',
      text: 'そうですね、まずは全社向けからというのは現実的ですね。',
      mood: 'positive',
      choices: [
        { text: '承知しました。では来期の早いタイミングで実施できるよう、具体的な日程とプランをご提案させてください。来週あたりいかがですか？', next: 'ending_great', tag: 'good' },
        { text: 'ありがとうございます。年内に資料をお送りしますので、ご検討ください。', next: 'ending_good', tag: 'neutral' },
        { text: 'では見積もりをお送りします。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    budget_constraint: {
      id: 'budget_constraint',
      speaker: 'customer',
      text: 'まあ、まずは全社向けからでもいいかなとは思いますけど。',
      mood: 'neutral',
      choices: [
        { text: 'はい、それで十分効果は出ます。では具体的なプランをご提案させてください。', next: 'ending_good', tag: 'good' },
        { text: '資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
        { text: 'ご検討ください。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    case_study: {
      id: 'case_study',
      speaker: 'customer',
      text: '介護経験者の話を聞くのはいいですね。リアリティがありそう。',
      mood: 'positive',
      choices: [
        { text: 'はい。「こうすれば両立できる」という具体的なイメージを持ってもらえます。受講後に「親と話してみる」という声が多いのはそのためです。', next: 'action_oriented', tag: 'good' },
        { text: '弊社のセミナーでは15万人以上に受講いただき、満足度96.5%です。御社でも効果が期待できます。', next: 'seminar_results', tag: 'good' },
        { text: '詳しくはセミナーでお伝えしています。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    mandatory_approach: {
      id: 'mandatory_approach',
      speaker: 'customer',
      text: 'セミナーって任意参加ですか？うちの社員、任意だと参加率が低くて…',
      mood: 'thinking',
      choices: [
        { text: '必須にする企業様もいらっしゃいます。ただ、「やらされ感」が出ないよう、コンテンツの質が重要です。弊社は満足度96.5%です。', next: 'tailored_approach', tag: 'good' },
        { text: '必須化と任意参加、どちらもメリット・デメリットがあります。御社の文化に合わせてご提案できます。', next: 'tailored_approach', tag: 'good' },
        { text: '強制した方が効果は出ますよ。', next: 'ending_neutral', tag: 'bad' },
      ],
    },
    
    tailored_approach: {
      id: 'tailored_approach',
      speaker: 'customer',
      text: 'なるほど。必須にするか任意にするか、悩みどころですね。',
      mood: 'thinking',
      choices: [
        { text: '御社はアンケートで「困っていない」という回答が多かったということなので、必須にして全員に届ける方が効果的かもしれません。', next: 'recommend_mandatory', tag: 'good' },
        { text: 'まずは管理職を必須、一般社員は任意というパターンも多いです。', next: 'hybrid_approach', tag: 'good' },
        { text: '御社の人事の方とご相談されてはいかがですか。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    recommend_mandatory: {
      id: 'recommend_mandatory',
      speaker: 'customer',
      text: '確かに、「困っていない」って答えた人こそ聞いてほしいですよね。',
      mood: 'positive',
      choices: [
        { text: 'その通りです。では、来期の計画に入れていただく形で、具体的なプランをご提案させてください。', next: 'ending_good', tag: 'good' },
        { text: '40歳以上必須という企業様も多いです。御社もそのパターンはいかがですか？', next: 'age_targeting', tag: 'good' },
        { text: 'まずは資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    hybrid_approach: {
      id: 'hybrid_approach',
      speaker: 'customer',
      text: '管理職必須で一般は任意…それも一つの手ですね。',
      mood: 'positive',
      choices: [
        { text: 'そうですね。では、来期まず管理職向けセミナーから始めるプランをご提案させてください。', next: 'ending_good', tag: 'good' },
        { text: '全社向けと管理職向け、両方やる企業様もいらっしゃいます。予算に応じてご提案できます。', next: 'both_seminars', tag: 'good' },
        { text: '管理職向けの資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    age_targeting: {
      id: 'age_targeting',
      speaker: 'customer',
      text: '40歳以上必須ですか。対象者を絞ると、かえって受け入れられやすいかもしれないですね。',
      mood: 'positive',
      choices: [
        { text: 'はい。では具体的なプランをご提案させてください。来週あたりお時間いただけますか？', next: 'ending_great', tag: 'good' },
        { text: '5〜6月の実施を想定して、1月中に予算申請に必要な資料をお送りできます。', next: 'ending_good', tag: 'good' },
        { text: 'ご検討ください。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    phased_approach: {
      id: 'phased_approach',
      speaker: 'customer',
      text: '段階的にやっていくのがいいですね。まずは来期に一歩踏み出すところから。',
      mood: 'positive',
      choices: [
        { text: 'はい。では来期に全社向けセミナーを実施する方向で、具体的なプランをご提案させてください。', next: 'ending_good', tag: 'good' },
        { text: '来週あたりお時間いただけますか？予算申請に必要な資料も揃えてお持ちします。', next: 'ending_great', tag: 'good' },
        { text: '見積もりをお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    tailored_plan: {
      id: 'tailored_plan',
      speaker: 'customer',
      text: '御社に合わせたプランですか。どういう情報があれば作れますか？',
      mood: 'curious',
      choices: [
        { text: 'はい。では改めてお時間いただいて、御社の状況に合わせたプランをご提案させてください。来週あたりいかがですか？', next: 'ending_great', tag: 'good' },
        { text: 'アンケート結果の概要を教えていただければ、次回より具体的なご提案ができます。', next: 'survey_detail', tag: 'good' },
        { text: 'では資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    consultation_intro: {
      id: 'consultation_intro',
      speaker: 'customer',
      text: '相談窓口もあるんですか？',
      mood: 'curious',
      choices: [
        { text: '専門スタッフが24時間対応するWebサービスと、専門家との30分相談があります。「親の様子がおかしい」という段階から相談できます。', next: 'consultation_detail', tag: 'good' },
        { text: 'セミナーで知識をつけて、相談窓口で個別対応する。このセットが効果的です。', next: 'package_approach', tag: 'good' },
        { text: '詳しくは資料をお送りします。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    consultation_detail: {
      id: 'consultation_detail',
      speaker: 'customer',
      text: '相談窓口はいくらくらいですか？',
      mood: 'curious',
      choices: [
        { text: 'Webサービスは定額で、相談はチケット制で1回15,000円、6枠からお申し込みいただけます。セミナーと組み合わせたパッケージもあります。', next: 'package_approach', tag: 'good' },
        { text: 'ご予算に応じてプランを組めます。まずはセミナーだけでも効果は出ますし、相談窓口を追加することで実効性が上がります。', next: 'flexible_approach', tag: 'good' },
        { text: '見積もりをお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    package_approach: {
      id: 'package_approach',
      speaker: 'customer',
      text: 'セットで導入した方が効果的ということですか？',
      mood: 'curious',
      choices: [
        { text: 'はい。「教育」「相談」「実態把握」の3つを組み合わせるのが理想です。御社はすでに実態把握をされているので、教育と相談を追加すれば完成形になります。', next: 'three_pillars', tag: 'good' },
        { text: 'そうです。セミナーで「相談していい」と伝え、相談窓口で個別対応する。この流れが離職防止に効きます。', next: 'flow_explanation', tag: 'good' },
        { text: 'そうです。詳しくは資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    three_pillars: {
      id: 'three_pillars',
      speaker: 'customer',
      text: '教育・相談・実態把握で3本柱ですか。なるほど、確かにそう言われると分かりやすい。',
      mood: 'positive',
      choices: [
        { text: 'はい。御社はすでに1本目ができているので、残り2本を来期に追加するプランをご提案させてください。', next: 'ending_good', tag: 'good' },
        { text: '来週あたりお時間いただけますか？具体的なプランと予算をまとめてお持ちします。上司の方にも同席いただけると嬉しいです。', next: 'ending_great', tag: 'good' },
        { text: 'では資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    flow_explanation: {
      id: 'flow_explanation',
      speaker: 'customer',
      text: 'セミナーで「相談していい」と伝えて、相談窓口で受け止める…なるほど、その流れは大事ですね。',
      mood: 'positive',
      choices: [
        { text: 'そうなんです。セミナーで「困ったら相談していい」と伝えて、実際に相談できる場を用意しておく。この流れが重要です。', next: 'package_approach', tag: 'good' },
        { text: '御社の場合、まずセミナーから始めて、利用状況を見ながら相談窓口を追加するのも良いですね。', next: 'flexible_approach', tag: 'good' },
        { text: '詳しくは資料でご説明します。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    flexible_approach: {
      id: 'flexible_approach',
      speaker: 'customer',
      text: '段階的に増やしていくこともできるんですね。',
      mood: 'positive',
      choices: [
        { text: 'はい。まずセミナーで意識づけをして、効果を見ながら相談窓口を追加する。段階的なアプローチがおすすめです。', next: 'phased_approach', tag: 'good' },
        { text: 'では来期のセミナー実施に向けて、具体的なプランをご提案させてください。来週あたりいかがですか？', next: 'ending_great', tag: 'good' },
        { text: 'まずはセミナーの見積もりをお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    lcat_positioning: {
      id: 'lcat_positioning',
      speaker: 'customer',
      text: 'LCATはアンケートと何が違うんですか？',
      mood: 'curious',
      choices: [
        { text: 'はい。アンケートで全体像を把握し、LCATで個人ごとの状況を可視化し、セミナーで知識をつけ、相談窓口で個別対応する。この流れが理想です。', next: 'three_pillars', tag: 'good' },
        { text: '御社はアンケートで「困っていない」が多かったとのことですが、LCATで見ると「実は備えができていない」が出てくる可能性があります。', next: 'hidden_care', tag: 'good' },
        { text: 'では詳しく資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    manager_seminar: {
      id: 'manager_seminar',
      speaker: 'customer',
      text: '管理職向けセミナーの内容、もう少し教えてもらえますか？',
      mood: 'curious',
      choices: [
        { text: '管理職向けは「部下から介護の相談を受けた時の対応」がメインです。何をどこまで聞くか、どこに繋ぐか。部下が言い出しやすい環境づくりも含めます。', next: 'manager_detail', tag: 'good' },
        { text: '全社向けが「自分の準備」なら、管理職向けは「組織としての準備」です。両方やる企業様も多いです。', next: 'both_seminars', tag: 'good' },
        { text: '資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    manager_detail: {
      id: 'manager_detail',
      speaker: 'customer',
      text: '「言い出しやすい環境づくり」か…確かにそれが一番大事かもしれないですね。',
      mood: 'positive',
      choices: [
        { text: '「言い出しやすさ」が離職防止のカギです。管理職がそのスキルを持っていれば、早期に対応できます。御社でもぜひ導入いただければと思います。', next: 'ending_good', tag: 'good' },
        { text: 'まず管理職から始めて、全社向けは次のフェーズという段階的アプローチもあります。', next: 'phased_approach', tag: 'good' },
        { text: '管理職向けセミナーの資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    seminar_timing: {
      id: 'seminar_timing',
      speaker: 'customer',
      text: 'セミナーをやるとしたら、いつ頃がいいですかね？',
      mood: 'thinking',
      choices: [
        { text: '来期の早いタイミング、5〜6月がおすすめです。1月中に予算を固めていただければ、十分準備できます。', next: 'budget_timing', tag: 'good' },
        { text: '介護は「突然」始まるので、早いに越したことはありません。来期に入ってすぐ実施できるよう準備しましょう。', next: 'concrete_plan', tag: 'good' },
        { text: 'いつでも大丈夫ですよ。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    recovery_question: {
      id: 'recovery_question',
      speaker: 'customer',
      text: 'うーん…まあ、制度は作ったけど使われていないのが気になっているくらいで。',
      mood: 'neutral',
      choices: [
        { text: '実効性がない、というのは具体的にはどのあたりですか？', next: 'deepdive_current', tag: 'good' },
        { text: '社員の方々の反応はいかがですか？制度を使っている方はいらっしゃいますか？', next: 'ask_awareness', tag: 'good' },
        { text: '弊社ではそういった課題を解決する…', next: 'miss_opportunity', tag: 'bad' },
      ],
    },
    
    explain_seminar: {
      id: 'explain_seminar',
      speaker: 'customer',
      text: 'セミナーってどんな感じですか？一般的な制度説明のセミナーだとあまり興味を持ってもらえないんですよね。',
      mood: 'curious',
      choices: [
        { text: '90分のオンラインセミナーで、制度の説明ではなく「考え方とアクション」にフォーカスしています。15万人以上に受講いただき、満足度96.5%です。', next: 'seminar_results', tag: 'good' },
        { text: '介護保険の基礎から、実際に介護に直面した時の対応まで幅広くカバーします。', next: 'seminar_concept', tag: 'neutral' },
        { text: '詳しくは資料をお送りします。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    seminar_proposal: {
      id: 'seminar_proposal',
      speaker: 'customer',
      text: 'セミナーをお願いしたいと思ってるんですけど。',
      mood: 'positive',
      choices: [
        { text: 'ぜひ。弊社のセミナーは制度説明ではなく「考え方とアクション」にフォーカスしています。受講後の行動変容が違います。', next: 'seminar_results', tag: 'good' },
        { text: '対象者はどのあたりをお考えですか？全社向けか、管理職向けか、それとも両方か。', next: 'target_audience', tag: 'good' },
        { text: '弊社のセミナーは90分で、オンラインでも対面でも実施できます。', next: 'seminar_format', tag: 'neutral' },
      ],
    },
    
    seminar_format: {
      id: 'seminar_format',
      speaker: 'customer',
      text: 'オンラインでも対面でもいいんですね。費用は同じですか？',
      mood: 'curious',
      choices: [
        { text: '全社向けで50〜60万円程度です。参加人数に関わらず定額なので、全社員に届けられます。', next: 'budget_discussion', tag: 'good' },
        { text: '御社の規模やご希望によって変わります。具体的なプランを作成してご提案させてください。', next: 'tailored_plan', tag: 'good' },
        { text: '見積もりをお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    action_oriented: {
      id: 'action_oriented',
      speaker: 'customer',
      text: '「親と話してみる」という行動につなげる…確かに、いざという時の準備としてはそれが大事ですよね。',
      mood: 'positive',
      choices: [
        { text: 'そこが一番のポイントです。いざという時に慌てないためには、今のうちに準備しておくこと。御社でもぜひ導入いただければと思います。', next: 'closing_proposal', tag: 'good' },
        { text: '「突然」がリスクです。今のうちに全社に意識づけしておくことで、離職やパフォーマンス低下を防げます。', next: 'closing_proposal', tag: 'good' },
        { text: 'いかがですか？', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    closing_proposal: {
      id: 'closing_proposal',
      speaker: 'customer',
      text: 'なるほど。前向きに検討したいと思います。',
      mood: 'positive',
      choices: [
        { text: 'ありがとうございます。では、御社向けのプランと見積もりを作成して、来週改めてご提案させてください。上司の方にも同席いただけると嬉しいです。', next: 'ending_great', tag: 'good' },
        { text: '来期の早いタイミングで実施できるよう、年内に資料をお送りしますね。', next: 'ending_good', tag: 'good' },
        { text: 'ご検討のほどよろしくお願いします。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    seminar_concept: {
      id: 'seminar_concept',
      speaker: 'customer',
      text: '考え方を教えるセミナーですか。具体的にはどういうことを伝えるんですか？',
      mood: 'curious',
      choices: [
        { text: '介護保険の仕組みを細かく説明しても、いざという時には覚えていません。大事なのは「まず誰に相談するか」「会社にどう伝えるか」といったアクション。そこにフォーカスしています。', next: 'action_oriented', tag: 'good' },
        { text: '実際に介護と仕事を両立されている方の事例をもとに、「こうすれば両立できる」という具体的なイメージを持ってもらいます。', next: 'case_study', tag: 'good' },
        { text: '詳しくは資料をお送りします。', next: 'ending_bad', tag: 'bad' },
      ],
    },
    
    gap_solution: {
      id: 'gap_solution',
      speaker: 'customer',
      text: '周知と理解のギャップを埋めるには、何が効果的ですか？',
      mood: 'curious',
      choices: [
        { text: 'そこを埋めるには、単なる情報提供ではなく、「自分ごと」として考えてもらう仕掛けが必要です。弊社のセミナーはそこにフォーカスしています。', next: 'seminar_concept', tag: 'good' },
        { text: '弊社のセミナーは制度説明ではなく、「考え方とアクション」にフォーカスしています。受講後の行動変容が違います。', next: 'seminar_results', tag: 'good' },
        { text: 'セミナーの詳細をご説明しましょうか？', next: 'seminar_intro', tag: 'neutral' },
      ],
    },
    
    target_audience: {
      id: 'target_audience',
      speaker: 'customer',
      text: '全社向けと管理職向け、両方やった方がいいんですかね？',
      mood: 'thinking',
      choices: [
        { text: 'おっしゃる通りです。全社向けは「自分の準備」、管理職向けは「部下への対応」と目的が違います。両方やる企業様も多いです。', next: 'both_seminars', tag: 'good' },
        { text: 'まず全社向けで意識づけをして、その後管理職向けという段階的なアプローチもあります。', next: 'phased_approach', tag: 'good' },
        { text: '両方の資料をお送りしますね。', next: 'ending_neutral', tag: 'neutral' },
      ],
    },
    
    budget_fit: {
      id: 'budget_fit',
      speaker: 'customer',
      text: '100万円の予算にちょうど収まるんですね。それなら両方やってみたいです。',
      mood: 'positive',
      choices: [
        { text: 'では、具体的なプランをご提案させてください。来週、上司の方も同席いただけると予算取りもスムーズですね。', next: 'ending_great', tag: 'good' },
        { text: '年内にプランと見積もりをお送りします。来期の早いタイミングで実施できるよう準備しましょう。', next: 'ending_good', tag: 'good' },
        { text: 'ありがとうございます。見積もりを送ります。', next: 'ending_neutral', tag: 'neutral' },
      ],
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
    skeptical: '🤨',
    negative: '😠',
  };
  return moods[mood] || '😐';
};

// メインコンポーネント
const BCSimulation = () => {
  const [gameState, setGameState] = useState('title'); // title, playing, ending
  const [mode, setMode] = useState('practice'); // practice, explanation
  const [currentSceneId, setCurrentSceneId] = useState('opening');
  const [scores, setScores] = useState({ structure: 12, specificity: 12, trust: 12, timing: 12 });
  const [history, setHistory] = useState([]); // 履歴スタック [{sceneId, scores, choiceIndex}]
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // 初期値設定
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentScene = GAME_DATA.scenes[currentSceneId] || GAME_DATA.endings[currentSceneId];
  const isEnding = GAME_DATA.endings[currentSceneId] !== undefined;

  // スコアを0-25の範囲にクランプ
  const clampScore = (value) => Math.max(0, Math.min(25, value));

  // 総合スコアの計算
  const getTotalScore = () => {
    return scores.structure + scores.specificity + scores.trust + scores.timing;
  };

  // ゲーム開始
  const startGame = (selectedMode) => {
    setMode(selectedMode);
    setGameState('playing');
    setCurrentSceneId('opening');
    setScores({ structure: 12, specificity: 12, trust: 12, timing: 12 });
    setHistory([]);
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  // 選択肢を選んだ時
  const handleChoice = (choice, index) => {
    // 履歴に現在の状態を保存
    setHistory(prev => [...prev, { sceneId: currentSceneId, scores: { ...scores }, choiceIndex: index }]);
    
    // スコアを更新
    const choiceScores = getScaledScores(currentSceneId, index);
    setScores(prev => ({
      structure: clampScore(prev.structure + (choiceScores.structure || 0)),
      specificity: clampScore(prev.specificity + (choiceScores.specificity || 0)),
      trust: clampScore(prev.trust + (choiceScores.trust || 0)),
      timing: clampScore(prev.timing + (choiceScores.timing || 0)),
    }));

    // 解説モードの場合はフィードバックを表示
    if (mode === 'explanation') {
      setSelectedChoice({ choice, index });
      setShowFeedback(true);
    } else {
      // 練習モードはすぐに次へ
      proceedToNext(choice);
    }
  };

  // 次のシーンへ進む
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

  // 戻るボタン
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

          {/* 商談イメージ写真 */}
          <div style={{
            marginBottom: '20px',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=280&fit=crop"
              alt="商談イメージ"
              style={{
                width: '100%',
                height: isMobile ? '140px' : '180px',
                objectFit: 'cover',
              }}
            />
          </div>

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
                  transition: 'background-color 0.2s',
                }}
              >
                練習モード
                <div style={{ fontSize: isMobile ? '11px' : '12px', fontWeight: 'normal', marginTop: '4px', opacity: 0.9 }}>
                  スコアバーのみ表示（数値・タグ非表示）
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
                  transition: 'background-color 0.2s',
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
    
    const getEndingColor = () => {
      switch (ending.result) {
        case 'great': return '#10B981';
        case 'good': return '#3B82F6';
        case 'neutral': return '#F59E0B';
        case 'bad': return '#EF4444';
        default: return '#6B7280';
      }
    };

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
            backgroundColor: getEndingColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: isMobile ? '32px' : '40px',
          }}>
            {ending.result === 'great' ? String.fromCodePoint(0x1F3C6) : ending.result === 'good' ? String.fromCodePoint(0x2713) : ending.result === 'neutral' ? String.fromCodePoint(0x2192) : String.fromCodePoint(0x2717)}
          </div>
          
          <h2 style={{ fontSize: isMobile ? '24px' : '32px', color: getEndingColor(), marginBottom: '16px' }}>
            {ending.title}
          </h2>
          
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#374151', marginBottom: '32px', lineHeight: 1.6 }}>
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
                      backgroundColor: getEndingColor(),
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* フィードバック */}
          <div style={{
            backgroundColor: '#F0FDF4',
            borderRadius: '12px',
            padding: isMobile ? '16px' : '20px',
            marginBottom: '24px',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>
              💡 ポイント
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
          
          {/* スコアバー（練習モード: バーのみ、解説モード: バー+数値） */}
          {mode === 'practice' ? (
            // 練習モード: 総合バーのみ
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
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          ) : (
            // 解説モード: 4軸のミニバー+数値
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
                      transition: 'width 0.3s ease',
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
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3B82F6';
                    e.currentTarget.style.backgroundColor = '#F0F9FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.backgroundColor = 'white';
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
            
            {/* スコア変動表示 */}
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

export default BCSimulation;
