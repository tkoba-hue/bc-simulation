# Kaigo Sales Simulation - Scenario Validation Report

## Overview

| Metric | Value |
|--------|-------|
| Total Scenes | 96 |
| Total Endings | 4 (great, good, neutral, bad) |
| Invalid References | 12 |
| Orphaned Scenes | 0 |
| All Routes Reach Endings | Yes |

---

## 1. Invalid Next References (CRITICAL)

The following 12 scene IDs are referenced by `next` values but **do not exist** as defined scenes:

| Missing Scene ID | Impact |
|------------------|--------|
| `seminar_action` | Referenced from `action_focus` |
| `tool_intro` | Referenced from `career_framing` |
| `package_detail` | Referenced from `package_intro` |
| `budget_first` | Referenced from `package_intro` |
| `timing_discussion` | Referenced from `tailored_proposal` |
| `send_material` | Referenced from `tailored_proposal` |
| `example_company` | Referenced from `seminar_results` |
| `scheduling` | Referenced from `satisfaction_detail` |
| `pricing` | Referenced from `satisfaction_detail` |
| `defer_pricing` | Referenced from `roadmap` |
| `quote_offer` | Referenced from `planning_together` |
| `care_day` | Referenced from `timing_confirmation` |

### Recommendation
These missing scenes will cause the simulation to crash or hang when players select those choices. Either:
1. Create the missing scenes, or
2. Redirect these choices to existing valid scenes

---

## 2. Orphaned Scenes

**Status: OK**

All 96 scenes are reachable from the opening scene. No orphaned (dead) scenes detected.

---

## 3. Route Analysis

**Status: OK**

All four endings are reachable from the opening:
- `ending_great` - Best outcome (next meeting with manager involvement)
- `ending_good` - Good outcome (next meeting scheduled)
- `ending_neutral` - Moderate outcome (materials sent, no commitment)
- `ending_bad` - Poor outcome (conversation ended abruptly)

---

## 4. Loop Detection

### Bidirectional References
There is one direct bidirectional reference:
- `ask_data` <-> `survey_detail`

This is intentional game design allowing players to navigate between related topics.

### Potential Cycles
104 potential cycle paths were detected. These are **not infinite loops** because:
1. Every scene in these cycles has at least one choice that leads toward an ending
2. Players can always choose paths that exit the cycle

Example cycles (all have exit routes):
- `hidden_care -> hidden_care_detail -> economic_impact -> productivity_impact -> lcat_intro -> lcat_positioning -> hidden_care`
- `ask_survey -> hidden_care -> hidden_care_detail -> economic_impact -> service_intro -> recovery_current -> ask_survey`

**Status: OK** - Cycles exist by design to allow exploration, but all routes eventually reach endings.

---

## Summary

### Critical Issues (Must Fix)
- **12 invalid scene references** - These will break the game when selected

### No Issues Found
- All scenes are reachable
- All endings are reachable from start
- No true infinite loops (all cycles have exit paths)
- Game flow is well-designed with appropriate branching

---

## Files Generated

| File | Description |
|------|-------------|
| `/home/dev/bc-simulation/choice-reasons.json` | Japanese explanations for all 96 scenes |
| `/home/dev/bc-simulation/scenario-validation-report.md` | This validation report |
