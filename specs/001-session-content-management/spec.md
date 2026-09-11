# Feature Specification: Session Content Management

**Feature Branch**: `main`
**Created**: 2026-09-11
**Status**: Approved
**Input**: Build session management for Japanese lessons with vocabulary, kanji, and grammar content using SQLite.

## Clarifications
### Session 2026-09-11
- Q: How should Vocabulary, Kanji, and Grammar be arranged on the screen? → A: Single page with master-detail (list on left, detail on right)
- Q: How should error, empty, and loading states be presented to the user? → A: Inline display for all states (validation errors, empty placeholders, loading indicators within the same area)
- Q: How should the master list combine the three content types? → A: Combined list with type badge/tag on each entry

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Study Sessions (Priority: P1)
An authenticated learner creates, views, updates, and deletes lesson-like study sessions
containing a title, notes, and automatic timestamps.

**Why this priority**: Sessions provide the required ownership and organization boundary.

**Independent Test**: Create a session, edit it, reopen it, then delete it after confirmation.

**Acceptance Scenarios**:
1. **Given** a learner, **When** they create a valid session, **Then** it appears with timestamps.
2. **Given** an owned session, **When** it is edited, **Then** changes persist and updated time changes.
3. **Given** an owned session, **When** deletion is confirmed, **Then** it and its content are removed.

### User Story 2 - Manage Vocabulary (Priority: P2)
A learner manages vocabulary with term, reading, meaning, nuance, and ordered examples.

**Why this priority**: Vocabulary is a primary component of each lesson.

**Independent Test**: Add, edit, reopen, and delete a vocabulary entry in an owned session.

**Acceptance Scenarios**:
1. **Given** an owned session, **When** valid vocabulary is added, **Then** all fields persist.
2. **Given** an entry, **When** it is changed or deleted, **Then** only that entry is affected.

### User Story 3 - Manage Kanji (Priority: P3)
A learner manages kanji with readings, meaning, free-text related vocabulary, and examples.

**Why this priority**: Kanji study builds on the session foundation.

**Independent Test**: Add, edit, reopen, and delete a kanji entry with list fields.

**Acceptance Scenarios**:
1. **Given** an owned session, **When** valid kanji is added, **Then** ordered list fields persist.
2. **Given** a kanji entry, **When** it is updated or deleted, **Then** the operation is isolated.

### User Story 4 - Manage Grammar (Priority: P4)
A learner manages grammar patterns with usage, meaning, nuance, and ordered examples.

**Why this priority**: Grammar completes the required lesson content types.

**Independent Test**: Add, edit, reopen, and delete a grammar entry.

**Acceptance Scenarios**:
1. **Given** an owned session, **When** valid grammar is added, **Then** all fields persist.
2. **Given** a grammar entry, **When** it is updated or deleted, **Then** other content is unchanged.

### Edge Cases
- Empty or whitespace-only required fields produce field-specific feedback.
- Missing and unowned identifiers reveal no private content.
- Empty list items are discarded while order is retained.
- Unicode Japanese text is stored and displayed unchanged.
- Deleting a session cascades to all three content types.

### Screen Hierarchy
- The application will use a single page with a master-detail layout for managing and viewing Vocabulary, Kanji, and Grammar content within a session. The list of entries (master) will be on the left, and the detail/edit form (detail) will be on the right.
- The master list will combine all three content types into a single list, with each entry showing a type badge (Vocabulary, Kanji, or Grammar).

### Error Handling
- Validation errors for required fields will be displayed inline, directly below each respective field, with clear, actionable messages.
- Empty states (no entries for a content type) will show a helpful placeholder prompting the user to add the first entry.
- Loading states for asynchronous operations (e.g., saving, deleting) will be indicated by subtle inline spinners or disabled buttons to prevent duplicate submissions.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The system MUST let a learner list, create, view, update, and delete owned sessions.
- **FR-002**: A session MUST contain a title, optional notes, and automatic timestamps.
- **FR-003**: The system MUST restrict every session and content operation to its owner.
- **FR-004**: The system MUST manage vocabulary fields: vocabulary, reading, meaning, nuance, examples.
- **FR-005**: The system MUST manage kanji fields: kanji, onyomi, kunyomi, meaning, related vocabulary, examples.
- **FR-006**: The system MUST manage grammar fields: grammar, usage, meaning, nuance, examples.
- **FR-007**: Examples, readings, and related vocabulary MUST retain user-defined order.
- **FR-008**: Required fields MUST reject blank values without discarding valid submitted data.
- **FR-009**: Session deletion MUST require confirmation and delete contained content atomically.
- **FR-010**: The feature MUST persist content across application restarts.

### Key Entities
- **User**: The owner identity for private study data.
- **Study Session**: A lesson container with title, notes, timestamps, and owned content.
- **Vocabulary**: A session-owned word entry with reading and contextual details.
- **Kanji**: A session-owned character entry with reading and vocabulary lists.
- **Grammar**: A session-owned grammar entry with usage and contextual details.

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: A learner can create a session and first entry within two minutes.
- **SC-002**: Saved content is reproduced exactly after reopening the application.
- **SC-003**: All tested attempts to access another learner's data are rejected.
- **SC-004**: Normal session and content operations visibly complete within two seconds.
- **SC-005**: At least 95% of test participants complete each CRUD journey without assistance.

## Assumptions
- Session and lesson refer to the same lesson container in this feature.
- Authentication will initially provide an explicitly temporary local development user.
- Nuance and examples are optional; core identity and meaning fields are required.
- Duplicate entries are allowed because context and meaning may differ.
- Quiz generation, grading, AI content generation, and progress tracking are out of scope.
