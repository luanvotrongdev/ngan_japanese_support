# Form Action Contracts

All actions require `locals.user`, parse form data with the shared schema, and redirect
with HTTP 303 after success. Validation failures return HTTP 400 with `message`, `fields`,
and submitted values. Missing and unowned resources both return HTTP 404. Content actions
run inline on the session detail page so the master-detail UI stays in context. Validation
and confirmation messages are localized through the shared `lib/i18n` dictionary using the
`lang` cookie locale (`vi` default, `en` override), with English fallback.

| Route | Action | Inputs | Success |
|---|---|---|---|
| `/sessions` | default | `title`, `notes` | Redirect to session detail |
| `/sessions/{id}` | update | `title`, `notes` | Redirect to session detail |
| `/sessions/{id}` | delete | `confirmation` | Redirect to session list |
| `/sessions/{id}` | vocabulary/create | vocabulary fields | Return to session detail |
| `/sessions/{id}` | vocabulary/update | `entryId`, vocabulary fields | Return to session detail |
| `/sessions/{id}` | vocabulary/delete | `entryId`, `confirmation` | Return to session detail |
| `/sessions/{id}` | kanji/create | kanji fields | Return to session detail |
| `/sessions/{id}` | kanji/update | `entryId`, kanji fields | Return to session detail |
| `/sessions/{id}` | kanji/delete | `entryId`, `confirmation` | Return to session detail |
| `/sessions/{id}` | grammar/create | grammar fields | Return to session detail |
| `/sessions/{id}` | grammar/update | `entryId`, grammar fields | Return to session detail |
| `/sessions/{id}` | grammar/delete | `entryId`, `confirmation` | Return to session detail |
| `/set-language` | default | `lang` (`vi`\|`en`), `from` | Set `lang` cookie; redirect to `from` |

The `set-language` action lives on a dedicated `/set-language` route because SvelteKit
disallows form actions in layout server files; the header toggle posts there from any page.
It only sets a cookie and redirects, never touching study data.

Content actions stay on the session detail page; the master list re-reads all three
content types and preserves selected entry focus unless that entry is deleted. List inputs
use newline-separated browser fields and are normalized into ordered, trimmed, non-empty
arrays at the server boundary.
