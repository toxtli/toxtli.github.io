# Carlos Toxtli Hernández — personal website

Hosted on GitHub Pages at **[www.carlostoxtli.com](https://www.carlostoxtli.com)**.

The content is authored in a **published Google Doc** and rendered live in the
browser, so updating the Doc updates the site — no rebuild required.

## Layout

| Path         | What it is                                                            |
|--------------|-----------------------------------------------------------------------|
| `/`          | **Modern interface** (default) — `index.html` + `styles.css` + `app.js` |
| `/classic/`  | The original flat version (kept for posterity)                        |
| `/modern/`   | Redirects to `/` (the modern site used to live here)                  |
| `/cv/`, `/courses/` | PDFs and course pages                                          |
| `/tools/`    | A Google Apps Script helper to sync new work into the Doc (not deployed) |

## How the modern site works

`app.js` fetches the published Google Doc, parses it with `DOMParser`, strips
Google's layout markup (while preserving bold/italic and unwrapping redirect
links), splits it into sections at each heading, and renders them in a
responsive academic layout with a scroll-spy sidebar, light/dark mode, and SEO
structured data.

Configuration lives in the `CONFIG` object at the top of `app.js`:

- `docUrl` — the published Google Doc that supplies the content
- `role`, `affiliationUni`, `lab`, `tagline`, `photo` — sidebar identity
- `navLabels` — friendly section relabelling
- `sectionOrder` — display order, independent of the Doc

## Updating content

- **Edit the Google Doc** — the site reflects changes within a few minutes.
- **Pull new work from Clemson Academic Analytics** — run
  `tools/update-google-doc.gs` once from [script.google.com](https://script.google.com)
  (it uses Google's `DocumentApp` API; idempotent). It is intentionally not
  committed to the deployed site (`*.gs` is git-ignored).

## Running locally

Must be served over HTTP (a `file://` origin can't fetch the Doc):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Origins

The site began as a flat page that simply AJAX-loaded a published Google Doc —
a very convenient way to keep a CV in sync (that version still lives under
[`/classic/`](https://www.carlostoxtli.com/classic/)). The modern interface
re-presents the same Google Doc content in a polished, professional layout.
