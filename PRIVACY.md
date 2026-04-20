# Privacy Policy

**BMI Health Calculator**
*Last Updated: April 2026*

## Overview

BMI Health Calculator is a ChatGPT app that runs as an interactive widget
inside ChatGPT's sandboxed iframe. The calculator itself (BMI, ideal body
weight, body fat percentage, and Total Daily Energy Expenditure) runs
entirely in your browser. This policy describes the limited categories of
data the app processes and why.

## What the MCP tool receives

When you ask ChatGPT something the BMI Health Calculator can answer (for
example, "calculate my BMI for 180 cm and 75 kg"), ChatGPT calls our MCP
tool and may include the following in the request:

- **The structured calculator inputs you (or ChatGPT on your behalf)
  provided**: height, weight, age, biological sex, optional waist / hip /
  neck circumferences, and activity level. These are body measurements you
  voluntarily share to receive the calculation.
- **A short freeform "subject" hint** (`_meta["openai/subject"]`): used only
  to extract a numeric height / weight / age that you typed but ChatGPT did
  not pre-parse into a structured argument. We do not read raw chat history
  and we do not attempt to reconstruct your conversation.
- **Coarse client metadata** that ChatGPT may attach to the request (for
  example, locale, coarse user-agent, coarse user location). We use these
  values only in-memory to render the widget appropriately for your client;
  we **do not write them to disk and do not return them to the model**.

The MCP tool does not request, store, or echo back: full names, email
addresses, postal addresses, government IDs, payment / banking data, precise
geolocation (GPS coordinates or street address), or authentication secrets.

## What the MCP tool returns

The tool response includes only:

- The inputs above (so the widget can pre-fill the form), and
- The computed health summary (BMI, BMI category, ideal weight range, body
  fat %, TDEE).

The tool response does **not** include timestamps, request / session / trace
IDs, internal account identifiers, the original `_meta` payload, your
device's user-agent, your location, or any other diagnostic / telemetry
field. This response-minimization is required by the OpenAI Apps SDK
guidelines and is enforced in our server code.

## In-widget actions you can opt into

Two optional in-widget actions, if used, send data to our backend:

1. **"Notify me" subscribe form** — if you choose to enter an email address
   in the optional subscribe form, that email is sent to our backend over
   HTTPS and forwarded to our newsletter provider (Buttondown). Submitting
   this form is the only way we ever receive an email address from you. You
   may unsubscribe at any time from the email itself.
2. **"Send feedback" form** — if you choose to type and submit feedback,
   the text you typed is sent to our backend over HTTPS and stored in an
   anonymous, append-only log line (no email, no IP, no body metrics).

Neither action is required to use the calculator.

## Health information

The body measurements you enter (height, weight, age, sex, waist / hip /
neck, activity level) are processed by the MCP tool to compute the
calculation result and are returned to the widget so it can display the
answer. They are **not** persisted to a database, and they are **not**
written to our analytics logs by the tool handler. They live in the request
/ response cycle and in your own browser's `localStorage` (see "Browser
storage" below).

## Browser storage

For your convenience, the widget caches the form values you typed (height,
weight, etc., and your most recent calculator selection) in your browser's
`localStorage`. Cached entries automatically expire **30 days** after they
are written. You can clear them at any time using the "Reset defaults"
button in the widget or by clearing your browser's site data.

## Server logs

Our backend writes the following to anonymous, append-only log files for
operational monitoring:

- HTTP-level access patterns to the public `/api/track`, `/api/subscribe`,
  and `/mcp` endpoints (without request bodies).
- Errors raised by the subscribe / Buttondown integration, which include
  the email address you submitted (only because Buttondown identifies
  subscribers by email). These error log entries are retained for **30
  days** and then automatically rotated.
- Anonymous widget telemetry events that you explicitly trigger from the
  widget (for example, "subscribe modal opened", "feedback submitted").

We do **not** log: your body measurements, your location, your
user-agent, your locale, the contents of MCP tool calls, or the contents of
MCP tool responses.

## Third parties

- **Cloudflare Turnstile** — challenges the optional subscribe form to
  defend against bot abuse. Only invoked if you submit the subscribe form.
- **Buttondown** — newsletter provider; receives only the email address
  you submitted via the subscribe form, plus a tag identifying which
  newsletter list you opted into.

We do not sell, rent, or share your data with third parties for advertising
or marketing purposes.

## Data retention

- **Browser `localStorage`**: 30 days, then auto-expired by the widget.
- **Server logs (access + telemetry + subscribe errors)**: 30 days, then
  automatically rotated.
- **Buttondown subscriber record**: until you unsubscribe (handled by
  Buttondown directly via the link in any email we send).

## Your rights

You can:

- Use the calculator without providing any personal information.
- Clear `localStorage` at any time via the "Reset defaults" button or your
  browser's site-data settings.
- Unsubscribe from the optional newsletter at any time using the link in
  any email you receive.
- Request deletion of any subscribe / log data we hold by contacting
  **support@layer3labs.io** with the UTC timestamp of your ChatGPT session
  (and, for newsletter records, the email address you used). We will action
  the request within 7 business days.

## Security

- All production communication uses HTTPS. Plain HTTP is used only when
  running the server locally during development.
- The widget runs inside ChatGPT's sandboxed iframe under a strict Content
  Security Policy that allowlists only the app's own origin.

## Children's privacy

This app is not directed at children under 13 and we do not knowingly
collect information from children.

## Changes to this policy

We may update this policy as the app evolves. Material changes will be
reflected in the "Last Updated" date above and noted in the project
repository.

## Contact

For privacy questions, support, or data deletion requests:

- **Email**: support@layer3labs.io

GitHub issues are not monitored for support requests; please contact us via
email.

---

*This privacy policy is intended to comply with the OpenAI Apps SDK App
Submission Guidelines (privacy / data-use sections).*
