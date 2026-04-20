# ChatGPT Widget Blank Screen Issue - Problem & Solution

## Problem Description

When building a ChatGPT MCP (Model Context Protocol) widget that uses React, the widget would load but display a **blank white screen** in the ChatGPT interface, even though:
- The server was returning proper `structuredContent` with default data
- The React app worked perfectly when served locally via HTTP
- All hydration logic was in place to read `window.openai` globals
- The MCP server schema was correctly configured with optional inputs
- CSP (Content Security Policy) was properly configured

## Root Cause

The issue was with **how the external React JavaScript bundle was being loaded** in the HTML template that gets served inline to ChatGPT.

### What Didn't Work

1. **Relative Script Paths**
   ```html
   <script type="module" src="/assets/bmi-health-calculator.js"></script>
   ```
   - Failed because ChatGPT inlines the HTML without a base URL context
   - Relative paths don't resolve correctly

2. **Absolute Script URLs with Regular src Attribute**
   ```html
   <script type="module" src="https://body-health-calculator.onrender.com/assets/bmi-health-calculator.js"></script>
   ```
   - Failed even with proper CSP `resource_domains` configured
   - ChatGPT's HTML inlining process may interfere with external script loading via `src` attribute

3. **Inline Script Bundle**
   - Attempted to inline the entire React bundle directly into the HTML
   - Failed due to HTML parsing conflicts (React bundle contains characters that break HTML parsing, e.g., `</script>` strings, `<select>` tags within JSX)

## Solution

Use **dynamic `import()` within an inline `<script>` tag** to load the external React bundle:

```html
<div id="bmi-health-calculator-root"></div>
<!-- 
  Load script via import() to avoid HTML parser issues with inline code
-->
<script type="module">
  import('https://body-health-calculator.onrender.com/assets/bmi-health-calculator.js')
    .catch(err => {
      console.error('[BMI Calculator] Failed to load script:', err);
      document.getElementById('bmi-health-calculator-root').innerHTML = 
        '<div style="padding:20px;text-align:center;font-family:sans-serif;color:#DC2626"><h3>Failed to load calculator</h3><p>Please refresh the page or try again later.</p></div>';
    });
</script>
```

### Why This Works

1. **Dynamic import()** is executed at runtime, after the HTML is fully parsed
2. The inline `<script type="module">` is minimal and doesn't contain any problematic characters
3. Error handling provides user feedback if the external script fails to load
4. Works within ChatGPT's inline HTML context without relying on `src` attribute resolution

## Required Server Configuration

Ensure your MCP server's CSP uses the documented Apps SDK field names and
allowlists only the exact origins the widget actually fetches from / loads
scripts from. The Apps SDK accepts the snake_case keys
`connect_domains`, `resource_domains`, and (only when strictly required)
`frame_domains`. The `openai/widgetDomain` value must be the iframe
origin ChatGPT actually serves the widget from — for the production Apps
SDK that is `https://web-sandbox.oaiusercontent.com`, not the app's own
Render URL:

```typescript
"openai/widgetCSP": {
  connect_domains: [
    "https://your-app.onrender.com"
  ],
  resource_domains: [
    "https://your-app.onrender.com"
  ]
},
"openai/widgetDomain": "https://web-sandbox.oaiusercontent.com"
```

Notes:
- Do **not** include `http://localhost`, wildcard origins, or domains the
  widget does not actually contact (e.g. third-party APIs only used
  server-side). Reviewers reject CSPs that allow more than the widget needs.
- Do **not** point `openai/widgetDomain` at your own app origin — that
  value identifies the trusted iframe parent and must match the sandbox
  origin ChatGPT renders into.
- If you previously used camelCase keys (`connectDomains` /
  `resourceDomains`), ChatGPT silently drops the CSP and falls back to a
  default that blocks `blob:` script execution, which prevents inlined
  bundles from loading and produces a blank widget.
- Only add `frame_domains` if your widget genuinely needs to embed a
  third-party iframe; apps that declare it receive extra scrutiny.

## Alternative Approach (Vanilla JS)

If you examine OpenAI's reference MCP widget projects (mortgage calculator, rental calculator, auto calculator), you'll notice they use **vanilla JavaScript inlined directly in the HTML**, not external React bundles. This is the most reliable approach for ChatGPT widgets:

- All logic is self-contained in one HTML file
- No external script loading concerns
- Guaranteed to work in ChatGPT's inline HTML context

However, if you prefer React for development experience and component reusability, the `import()` solution above is a viable workaround.

## Testing Checklist

When debugging blank screen issues with ChatGPT MCP widgets:

1. ✅ Verify the widget works locally via direct HTTP access
2. ✅ Check browser console for script loading errors
3. ✅ Ensure `structuredContent` includes default/fallback values
4. ✅ Verify `toolInputSchema` has `$schema` property and no `required` fields if inputs are optional
5. ✅ Confirm hydration logic reads `window.openai.toolOutput` / `window.openai.structuredContent`
6. ✅ Test script loading method (dynamic `import()` is most reliable)
7. ✅ Validate CSP `connect_domains` and `resource_domains` (snake_case, as accepted by ChatGPT in production) include your deployment URL, and that `openai/widgetDomain` is set to `https://web-sandbox.oaiusercontent.com`
8. ✅ Check that absolute URLs use HTTPS (not HTTP)

## Key Takeaway

**For ChatGPT MCP widgets, prefer vanilla JavaScript inline in HTML, or use dynamic `import()` for external React bundles.** Traditional `<script src="...">` tags may not work reliably in ChatGPT's inline HTML context.

