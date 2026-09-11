# Form Action Contracts

All actions require `locals.user`, parse form data with the shared schema, and redirect
with HTTP 303 after success. Validation failures return HTTP 400 with `message`, `fields`,
and submitted values. Missing and unowned resources both return HTTP 404.

| Route | Action | Inputs | Success |
|---|---|---|---|
| `/sessions` | default | `title`, `notes` | Redirect to session detail |
| `/sessions/{id}` | update | `title`, `notes` | Redirect to session detail |
| `/sessions/{id}` | delete | `confirmation` | Redirect to session list |
| `/sessions/{id}/vocabulary/new` | default | vocabulary fields | Redirect to session detail |
| `/sessions/{id}/vocabulary/{entry}/edit` | update/delete | vocabulary fields or confirmation | Redirect to session detail |
| `/sessions/{id}/kanji/new` | default | kanji fields | Redirect to session detail |
| `/sessions/{id}/kanji/{entry}/edit` | update/delete | kanji fields or confirmation | Redirect to session detail |
| `/sessions/{id}/grammar/new` | default | grammar fields | Redirect to session detail |
| `/sessions/{id}/grammar/{entry}/edit` | update/delete | grammar fields or confirmation | Redirect to session detail |

List inputs use newline-separated browser fields and are normalized into ordered,
trimmed, non-empty arrays at the server boundary.
