# Modern academic interface

A modern, professional re-presentation of Carlos Toxtli's academic homepage.
It keeps the original idea — **the content is authored and edited in a Google
Doc** — but renders it inside a polished, responsive interface instead of the
flat Google Docs HTML.

## How it works

1. On load, `app.js` `fetch()`es the **published** Google Doc
   (`File ▸ Share ▸ Publish to the web`). Google reflects the request origin in
   its CORS headers, so this works directly from the browser.
2. The raw HTML is parsed with `DOMParser`, the Google publish banner is
   removed, and Google's redirect links (`google.com/url?q=…`) are unwrapped.
3. Google's layout CSS is discarded, but **bold / italic / underline** are
   preserved by converting the relevant Google CSS classes into semantic
   `<strong>` / `<em>` / `<u>` tags.
4. The document is split into sections at each `<h1>`. Each becomes a styled
   block with a scroll-spy navigation entry.
5. The **Contact** section is mined for social/academic profiles (shown as
   icons in the sidebar) and contact details (shown in the footer). The
   Google Docs table-of-contents (`Menu`) is dropped in favour of the
   generated navigation.

Because everything is derived live, **editing the Google Doc updates the site** —
no rebuild required.

## Features

- Distinguished navy + gold academic theme (serif headings, clean sans body)
- Fixed identity sidebar: photo/monogram, title, affiliation, lab, profiles
- Auto-generated, scroll-spy section navigation
- Light / dark mode (remembers your choice, respects system preference)
- Fully responsive with a slide-out mobile menu
- Reading-progress bar, back-to-top, reveal-on-scroll, print styles
- SEO meta tags + `Person` JSON-LD structured data
- Accessible: skip link, ARIA labels, reduced-motion support

## Customizing

Open `app.js` and edit the `CONFIG` object at the top:

| Field            | Purpose                                                        |
|------------------|----------------------------------------------------------------|
| `docUrl`         | The published Google Doc URL (the live content source).        |
| `role`           | Title shown under the name in the sidebar.                     |
| `affiliationUni` | University / institution.                                      |
| `lab`            | `{ name, url }` of the research lab.                           |
| `tagline`        | One-line research focus.                                       |
| `photo`          | Optional headshot URL (e.g. `profile.jpg`). Empty → monogram.  |
| `skipSections`   | Section titles to keep out of the main column.                 |
| `navLabels`      | Friendly relabelling for the navigation (e.g. `bio → About`).  |

To add a headshot, drop an image in this folder and set
`photo: 'profile.jpg'`.

## Running locally

The page must be served over HTTP (a `file://` origin can't fetch the Doc):

```bash
# from the repository root
python3 -m http.server 8000
# then open http://localhost:8000/modern/
```

## Making it the main site

This lives in its own directory so the original `/index.html` is untouched.
When you're happy with it, either:

- point visitors here (`/modern/`), or
- copy `index.html`, `styles.css`, `app.js` to the repository root
  (replacing the old `index.html`).
