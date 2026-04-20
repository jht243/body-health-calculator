# Golden Prompt Set - BMI Health Calculator

This document contains test prompts to validate the BMI Health Calculator connector's metadata and behavior.

## Purpose
Use these prompts to test:
- **Precision**: Does the right tool get called?
- **Recall**: Does the tool get called when it should?
- **Accuracy**: Are the right parameters passed?

---

## Direct Prompts (Should ALWAYS trigger the connector)

### 1. Explicit Tool Name
**Prompt**: "Calculate my BMI"
**Expected**: ✅ Calls `bmi-health-calculator` with default values
**Status**: [ ] Pass / [ ] Fail

### 2. Specific Metrics
**Prompt**: "Calculate BMI for someone 180cm and 75kg"
**Expected**: ✅ Calls `bmi-health-calculator` with height=180, weight=75
**Status**: [ ] Pass / [ ] Fail

### 3. Ideal Weight Query
**Prompt**: "What is my ideal weight if I'm 5'10"?"
**Expected**: ✅ Calls `bmi-health-calculator` with height=5'10" (parsed)
**Status**: [ ] Pass / [ ] Fail

### 4. Detailed Parameters
**Prompt**: "Calculate body fat for male, 30 years old, 180cm, 80kg, waist 85cm"
**Expected**: ✅ Calls `bmi-health-calculator` with all parameters
**Status**: [ ] Pass / [ ] Fail

### 5. Health Assessment
**Prompt**: "Am I overweight at 90kg and 5 foot 8 inches?"
**Expected**: ✅ Calls `bmi-health-calculator` to analyze BMI
**Status**: [ ] Pass / [ ] Fail

---

## Indirect Prompts (Should trigger the connector)

### 6. Weight Loss Question
**Prompt**: "How much weight should I lose?"
**Expected**: ✅ Calls `bmi-health-calculator` to check ideal weight
**Status**: [ ] Pass / [ ] Fail

### 7. Fitness Progress
**Prompt**: "Check my body composition"
**Expected**: ✅ Calls `bmi-health-calculator`
**Status**: [ ] Pass / [ ] Fail

### 8. Comparison
**Prompt**: "Is my weight healthy for my height?"
**Expected**: ✅ Calls `bmi-health-calculator`
**Status**: [ ] Pass / [ ] Fail

---

## Negative Prompts (Should NOT trigger the connector)

### 9. Medical Diagnosis
**Prompt**: "Why does my stomach hurt?"
**Expected**: ❌ Does NOT call `bmi-health-calculator` (medical advice)
**Status**: [ ] Pass / [ ] Fail

### 10. Diet Plan
**Prompt**: "Give me a keto diet plan"
**Expected**: ❌ Does NOT call `bmi-health-calculator` (general advice)
**Status**: [ ] Pass / [ ] Fail

### 11. Exercise Routine
**Prompt**: "Best exercises for abs"
**Expected**: ❌ Does NOT call `bmi-health-calculator` (general advice)
**Status**: [ ] Pass / [ ] Fail

---

## Edge Cases

### 12. Ambiguous Units
**Prompt**: "I weigh 160 lbs and I'm 5'10\""
**Expected**: ✅ Calls `bmi-health-calculator` with `weight_kg ≈ 72.6` and `height_cm ≈ 178`. The widget renders with those values prefilled and `summary.bmi ≈ 22.9` (Normal weight).
**Status**: [ ] Pass / [ ] Fail

### 13. Mixed Units
**Prompt**: "Height 1.8m weight 160lbs"
**Expected**: ✅ Calls `bmi-health-calculator` with `height_cm = 180` and `weight_kg ≈ 72.6`. The widget renders with `summary.bmi ≈ 22.4` (Normal weight).
**Status**: [ ] Pass / [ ] Fail

---

## Testing Instructions

### How to Test
1. Open ChatGPT in **Developer Mode** on **both web and mobile**.
2. Link your BMI Health Calculator connector (use the production HTTPS
   `/mcp` URL, not localhost).
3. For each prompt above:
   - Enter the exact prompt verbatim.
   - Observe which tool gets called (should always be
     `bmi-health-calculator` for prompts 1–8 and 12–13).
   - Check the parameters passed in the tool call.
   - Verify the widget renders without UI errors (no blank screen, no
     missing images, no console exceptions).
   - Verify the `structuredContent` returned to the model contains only
     the documented fields (`height_cm`, `weight_kg`, `age_years`,
     `gender`, `activity_level`, `summary`) and **no** extraneous PII,
     timestamps, internal IDs, or telemetry.
   - Mark Pass/Fail in the Status column.

## MCP tool annotation justification (paste into the submission form)

The single registered MCP tool, `bmi-health-calculator`, has these
annotations:

- `readOnlyHint: true` — The tool is a pure compute. Given height, weight,
  age, sex, optional circumferences, and activity level, it computes BMI,
  ideal weight range, body-fat %, and TDEE and returns them. It does not
  create, update, or delete any record on our backend, does not send any
  email / message / notification, does not enqueue a job, and does not
  write logs containing any user input. (The optional in-widget "subscribe"
  and "feedback" forms are user-initiated HTTP POSTs to non-MCP endpoints,
  not actions the model can invoke via the tool.)
- `destructiveHint: false` — The tool has no irreversible side effects of
  any kind: no deletions, no overwrites, no money movement, no message
  sending, no access revocation, no admin operations.
- `openWorldHint: false` — The tool does not write to or change any
  publicly visible internet state. It does not post to any third-party
  service, does not publish content, and does not submit any form.