<!--
Sync Impact Report
- Version change: unratified template -> 1.0.0
- Added principles: Learning Outcomes First; Linguistic Accuracy and Context;
  Responsible and Transparent AI; Privacy and Security by Default;
  Accessible, Tested, and Simple
- Added sections: Product and Technical Constraints; Development Workflow
- Removed sections: none
- Templates: plan/spec/tasks templates retain compatible mandatory sections
- Follow-up TODOs: none
-->
# Ngan Japanese Support Constitution

## Core Principles

### I. Learning Outcomes First
Every feature MUST serve a defined Japanese-learning outcome. Learning content MUST be
organized so learners can understand its purpose and revisit it. Engagement-only work
MUST NOT displace clear explanations, practice, or actionable feedback.

### II. Linguistic Accuracy and Context
Japanese content MUST preserve kanji, kana, readings, meanings, usage, nuance, and
examples without corruption. Ambiguous or context-dependent language MUST be presented
as such rather than as a universal rule.

### III. Responsible and Transparent AI
AI output MUST be identified as generated guidance and treated as untrusted input.
Structured output MUST be validated. AI features MUST define timeout, refusal, malformed
response, retry, and provider-unavailable behavior and MUST NOT fail silently.

### IV. Privacy and Security by Default
Users MUST only access their own learning data. Credentials and tokens MUST remain
server-side and MUST NOT appear in source control, logs, client bundles, or errors.
Stored personal data MUST have an identified purpose and deletion behavior.

### V. Accessible, Tested, and Simple
Primary journeys MUST work on desktop and mobile, support keyboard use, and expose clear
loading, validation, empty, and error states. Ownership boundaries, persistence, grading,
and external-service boundaries MUST have automated tests. Implementations MUST use the
simplest design that satisfies current requirements.

## Product and Technical Constraints

- Lessons or study sessions MUST define ownership and structured learning content.
- User-provided and generated content MUST be validated at server trust boundaries.
- Features storing user data MUST define authorization and cascading deletion behavior.
- OpenAI access and credentials MUST pass through server-controlled boundaries.
- Cost-affecting AI choices MUST be documented in the relevant implementation plan.
- External provider choices MUST NOT leak into core learning-domain data unnecessarily.

## Development Workflow

Features MUST proceed through specification, planning, task generation, implementation,
and verification. The Constitution Check MUST cover learning value, linguistic integrity,
authorization, privacy, accessibility, tests, and justified complexity. A feature is
complete only when acceptance scenarios and required automated checks pass.

## Governance

This constitution supersedes conflicting project conventions. Amendments MUST document
their reason, migration impact, and synchronized template changes. MAJOR versions remove
or redefine principles, MINOR versions add or materially expand obligations, and PATCH
versions clarify wording without changing obligations. Reviews MUST verify compliance;
exceptions MUST be documented with necessity and a rejected simpler alternative.

**Version**: 1.0.0 | **Ratified**: 2026-09-11 | **Last Amended**: 2026-09-11
