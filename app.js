/* ==========================================================================
   Carlos Toxtli — Modern academic interface
   Fetches the live Google Docs publication and renders it as a modern,
   professional academic website. Content stays editable in Google Docs;
   this layer only re-presents it.
   ========================================================================== */

'use strict';

/* ----------------------------- Configuration -----------------------------
   The site CHROME (name, role, photo) lives here; the site CONTENT (bio,
   publications, talks, …) is always pulled live from the Google Doc below.
   Edit these few fields if your title or affiliation change.
-------------------------------------------------------------------------- */
const CONFIG = {
    // Published Google Doc (File ▸ Share ▸ Publish to the web ▸ link).
    docUrl: 'https://docs.google.com/document/d/e/2PACX-1vRHNwLVVLO8rNZVzNOos8r1bav8k2CDDkv1wXrz7hS5XTvrShOpoq3R1axgGUR7MShB0M90t3OKczKD/pub',

    role: 'Assistant Professor of Human-Centered Computing',
    affiliationUni: 'Clemson University',
    lab: { name: 'Human-AI Empowerment Lab', url: 'https://haielab.org' },
    tagline: 'Human-Centered AI for fair and frictionless interactions in the future of work.',

    // Optional headshot. Drop a URL (or a local file like 'profile.jpg') here;
    // an elegant monogram is shown when empty.
    photo: 'https://www.clemson.edu/cecas/departments/computing/images/people/faculty/carlos-toxtli-hernandez.jpg',

    // Sections that should NOT appear as main scrolling blocks. Their data is
    // surfaced elsewhere (Menu = removed; Contact = sidebar + footer).
    skipSections: ['menu', 'contact'],

    // Friendly relabelling for the navigation.
    navLabels: { 'bio': 'About', 'artificial intelligence portfolio': 'AI Portfolio',
                 'academic and professional projects': 'Projects' },

    // Display order, independent of the Google Doc. Sections listed here are
    // placed first, in this order (matched by section title or nav label,
    // case-insensitive); any section not listed keeps its original doc order.
    sectionOrder: ['About', 'Publications', 'Grants & Funding', 'Education'],
};

/* ------------------------------- Icon set -------------------------------- */
const ICONS = (() => {
    const s = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
    const f = (p) => `<svg viewBox="0 0 24 24" fill="currentColor">${p}</svg>`;
    return {
        // section icons (stroked)
        about:    s('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
        portfolio:s('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/>'),
        education:s('<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/>'),
        experience:s('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
        skills:   s('<path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6L5.7 21 8 13.8 2 9.4h7.6z"/>'),
        awards:   s('<circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/>'),
        publications:s('<path d="M4 5a2 2 0 0 1 2-2h7v18H6a2 2 0 0 1-2-2z"/><path d="M13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>'),
        demos:    s('<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M10 9l4 2.5L10 14z" fill="currentColor"/><path d="M8 21h8"/>'),
        talks:    s('<path d="M3 11l18-7-7 18-2.5-7.5z"/>'),
        press:    s('<path d="M4 4h13v16H6a2 2 0 0 1-2-2z"/><path d="M17 8h3v10a2 2 0 0 1-2 2"/><path d="M7 8h6M7 12h6M7 16h4"/>'),
        projects: s('<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>'),
        service:  s('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>'),
        hobbies:  s('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5s1.5 2 3.5 2 3.5-2 3.5-2M9 9h.01M15 9h.01"/>'),
        funding:  s('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M14.5 9.3c-.5-.8-1.5-1.3-2.6-1.3-1.4 0-2.4.8-2.4 1.9 0 2.5 5 1.2 5 3.8 0 1.1-1.1 1.9-2.6 1.9-1.1 0-2.1-.5-2.6-1.3"/>'),
        patents:  s('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><circle cx="12" cy="13" r="2.2"/><path d="M12 15.2V19l-1.6-1-1.6 1"/>'),
        default:  s('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/>'),
        // socials (filled / branded)
        mail:     s('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>'),
        linkedin: f('<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.3 18.3v-7H6v7zM7.1 10.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6zM18 18.3v-3.9c0-2-.4-3.6-2.8-3.6-1.1 0-1.9.6-2.2 1.2h-.03v-1H10.8v7h2.3v-3.5c0-.9.18-1.8 1.3-1.8s1.2 1 1.2 1.9v3.4z"/>'),
        github:   f('<path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0 0 22 12.2C22 6.6 17.5 2 12 2z"/>'),
        twitter:  f('<path d="M18.2 2H21l-6.4 7.3L22 22h-6.2l-4.8-6.3L5.5 22H2.7l6.8-7.8L2 2h6.3l4.3 5.7zM17 20.3h1.5L7 3.6H5.4z"/>'),
        youtube:  f('<path d="M23 12s0-3.3-.4-4.8a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.4A2.5 2.5 0 0 0 1.4 7.2C1 8.7 1 12 1 12s0 3.3.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.5.4 8.8.4 8.8.4s7.3 0 8.8-.4a2.5 2.5 0 0 0 1.8-1.8C23 15.3 23 12 23 12zm-13 3.2V8.8l5.4 3.2z"/>'),
        facebook: f('<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5H15.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.43 2.9h-2.3v7A10 10 0 0 0 22 12z"/>'),
        medium:   f('<path d="M4.4 7.5a.8.8 0 0 0-.27-.7L2.3 4.6V4.3h5.6L12.2 14l3.8-9.6H21v.3l-1.56 1.5a.46.46 0 0 0-.17.44v11a.46.46 0 0 0 .17.44L21 19.6v.3h-7.6v-.3l1.6-1.56c.16-.16.16-.2.16-.44V8.7l-4.5 11.2h-.6L5.4 8.7v7.5c-.04.32.07.64.3.87l2.1 2.5v.3H2v-.3l2.1-2.5a1 1 0 0 0 .28-.87z"/>'),
        slideshare:f('<path d="M3 4h18v9.5a3.5 3.5 0 0 1-3.5 3.5H14v2.2c0 .6-.5 1.1-1.1 1.1h-1.8c-.6 0-1.1-.5-1.1-1.1V17H6.5A3.5 3.5 0 0 1 3 13.5zm5.5 4.2a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zm7 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"/>'),
        scholar:  f('<path d="M12 2 1 8l11 6 9-4.9V16h2V8zM4 13.4V17c0 1.7 3.6 3.5 8 3.5s8-1.8 8-3.5v-3.6l-8 4.4z"/>'),
        orcid:    f('<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.1 7.4a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9zM7.2 10.4H9v6.2H7.2zm3.3 0h3.4c2.4 0 3.6 1.6 3.6 3.1 0 1.6-1.3 3.1-3.6 3.1h-3.4zm1.8 1.6v3h1.4c1.4 0 2-.8 2-1.5s-.6-1.5-2-1.5z"/>'),
        link:     s('<path d="M9 15l6-6"/><path d="M11 6l1-1a4 4 0 0 1 6 6l-1 1"/><path d="M13 18l-1 1a4 4 0 0 1-6-6l1-1"/>'),
    };
})();

const SECTION_ICON = {
    'about': 'about', 'bio': 'about',
    'artificial intelligence portfolio': 'portfolio',
    'education': 'education',
    'professional experience': 'experience',
    'skills': 'skills', 'awards': 'awards', 'award s': 'awards',
    'publications': 'publications', 'demos': 'demos', 'talks': 'talks',
    'press': 'press', 'academic and professional projects': 'projects',
    'service': 'service', 'hobbies': 'hobbies',
    'grants': 'funding', 'funding': 'funding', 'grants & funding': 'funding',
    'grants and funding': 'funding', 'research funding': 'funding', 'patents': 'patents',
};

const SOCIAL_ICON = [
    [/linkedin/i, 'linkedin'], [/github/i, 'github'], [/twitter|^x$/i, 'twitter'],
    [/youtube/i, 'youtube'], [/facebook/i, 'facebook'], [/medium/i, 'medium'],
    [/slideshare/i, 'slideshare'], [/scholar/i, 'scholar'], [/orcid/i, 'orcid'],
    [/research\s*gate/i, 'link'], [/semantic/i, 'scholar'], [/dblp/i, 'scholar'],
    [/acl|acm/i, 'scholar'], [/clemson/i, 'link'], [/mail|email/i, 'mail'],
];

/* ------------------------------- Utilities ------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Unwrap Google's redirect links: https://www.google.com/url?q=REAL&sa=… */
function unwrapGoogleUrl(href) {
    if (!href) return href;
    const m = href.match(/^https?:\/\/www\.google\.com\/url\?q=([^&]+)/);
    if (!m) return href;
    try { return decodeURIComponent(m[1]); } catch { return m[1]; }
}

/** Keep only emphasis (bold/italic/underline/super-sub) from Google's CSS so
 *  our own design controls all layout, fonts, colours and spacing. */
function buildEmphasisMap(styleText) {
    const map = {}; // className -> {bold, italic, underline, strike, sup, sub}
    if (!styleText) return map;
    const re = /\.(c\d+)\s*\{([^}]*)\}/g; let m;
    while ((m = re.exec(styleText))) {
        const cls = m[1], body = m[2], e = {};
        if (/font-weight:\s*(700|bold)/.test(body)) e.bold = true;
        if (/font-style:\s*italic/.test(body)) e.italic = true;
        if (/text-decoration:[^;]*underline/.test(body)) e.underline = true;
        if (/text-decoration:[^;]*line-through/.test(body)) e.strike = true;
        if (/vertical-align:\s*super/.test(body)) e.sup = true;
        if (/vertical-align:\s*sub/.test(body)) e.sub = true;
        if (Object.keys(e).length) map[cls] = e;
    }
    return map;
}

/** Wrap an element's children in nested semantic tags WITHOUT touching
 *  innerHTML — moving nodes preserves descendant links/images (and the work
 *  already done on them) instead of reparsing and detaching them. */
function wrapContents(el, tagNames) {
    const frag = document.createDocumentFragment();
    while (el.firstChild) frag.appendChild(el.firstChild);
    let outer = null, inner = null;
    tagNames.forEach((name) => {
        const w = document.createElement(name);
        if (!outer) outer = w; else inner.appendChild(w);
        inner = w;
    });
    inner.appendChild(frag);
    el.appendChild(outer);
}

/** Clean a content node tree in place: fix links & images, convert Google's
 *  emphasis classes into semantic tags, then drop classes/styles/ids.
 *  Ordering matters — links are unwrapped BEFORE emphasis wrapping so they
 *  are never reparsed away, and classes are read BEFORE they are stripped. */
function cleanNode(node, emphasis) {
    const els = Array.from(node.querySelectorAll('*'));

    // Pass 1 — links and images.
    els.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'a') {
            const href = unwrapGoogleUrl(el.getAttribute('href') || '');
            el.setAttribute('href', href);
            if (/^https?:/i.test(href)) { el.target = '_blank'; el.rel = 'noopener'; }
        } else if (tag === 'img') {
            el.removeAttribute('width'); el.removeAttribute('height');
            el.loading = 'lazy'; el.decoding = 'async';
        }
    });

    // Pass 2 — emphasis (reads classes, which still exist at this point).
    els.forEach((el) => {
        if (el.tagName.toLowerCase() !== 'span' || !el.childNodes.length) return;
        const classes = (el.getAttribute('class') || '').split(/\s+/);
        const e = classes.reduce((acc, c) => Object.assign(acc, emphasis[c] || {}), {});
        const tags = [];
        if (e.bold) tags.push('strong');
        if (e.italic) tags.push('em');
        if (e.underline && !el.closest('a')) tags.push('u'); // links are already styled
        if (e.strike) tags.push('s');
        if (e.sup) tags.push('sup');
        if (e.sub) tags.push('sub');
        if (tags.length) wrapContents(el, tags);
    });

    // Pass 3 — strip Google's styling hooks.
    els.forEach((el) => { el.removeAttribute('class'); el.removeAttribute('style'); el.removeAttribute('id'); });
    return node;
}

/** Remove the trailing "‹ MENU" back-links Google Docs leaves in each section,
 *  plus the empty paragraphs that surround them. */
function stripMenuLinks(node) {
    const isMenuMarker = (s) => /^[‹<«]?\s*menu\s*$/i.test(s.trim());
    node.querySelectorAll('a').forEach((a) => {
        if (isMenuMarker(a.textContent) || /^#h\./.test(a.getAttribute('href') || '')) {
            const p = a.closest('p, li');
            (p || a).remove();
        }
    });
    // Drop plain-text "‹ MENU" back-links (not hyperlinked) and empty paragraphs.
    node.querySelectorAll('p, li').forEach((el) => {
        const t = el.textContent.trim();
        if (isMenuMarker(t) || (!t && !el.querySelector('img'))) el.remove();
    });
}

/* ------------------------------ Core render ------------------------------ */
async function load() {
    showState('loading');
    try {
        const res = await fetch(CONFIG.docUrl, { credentials: 'omit' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const html = await res.text();
        render(html);
        showState('ready');
    } catch (err) {
        console.error('Failed to load Google Doc:', err);
        showState('error');
    }
}

/** Reorder sections per CONFIG.sectionOrder. Listed sections come first in the
 *  given order; the rest keep their original document order (stable sort). */
function orderSections(sections) {
    const order = (CONFIG.sectionOrder || []).map((s) => s.toLowerCase());
    if (!order.length) return sections;
    const rankOf = (sec) => {
        const key = sec.title.toLowerCase();
        const label = (CONFIG.navLabels[key] || sec.title).toLowerCase();
        const r = order.indexOf(key) !== -1 ? order.indexOf(key) : order.indexOf(label);
        return r === -1 ? Infinity : r;
    };
    return sections
        .map((sec, i) => ({ sec, i }))
        .sort((a, b) => (rankOf(a.sec) - rankOf(b.sec)) || (a.i - b.i))
        .map((x) => x.sec);
}

function render(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // Google Docs ships its rules across multiple <style> blocks — concatenate
    // them all so emphasis classes (bold/italic/underline) are detected.
    const styleText = Array.from(doc.querySelectorAll('style')).map((s) => s.textContent).join('\n');
    const emphasis = buildEmphasisMap(styleText);

    const source = doc.querySelector('.doc-content') || doc.body;

    // Display name from the document title block, fall back to the <title>.
    const titleEl = source.querySelector('.title') || doc.querySelector('p.title');
    const name = (titleEl ? titleEl.textContent : (doc.title || 'Carlos Toxtli')).trim().replace(/\s+homepage/i, '');

    // Google Docs wraps the whole body in a single table cell, so the <h1>
    // section headers are siblings inside that cell — not direct children of
    // .doc-content. Split the flat sibling stream of the h1s' shared parent.
    const headings = Array.from(source.querySelectorAll('h1'));
    const container = headings.length ? headings[0].parentElement : source;
    const sections = [];
    let current = null;
    Array.from(container.children).forEach((el) => {
        if (el.tagName === 'H1') {
            current = { title: el.textContent.replace(/\s+/g, ' ').trim(), nodes: [] };
            sections.push(current);
        } else if (current) {
            current.nodes.push(el);
        }
    });

    // Build an id map (original Google heading id -> our slug) for anchor rewrites.
    const idMap = {};

    // Pull contact links out before rendering main sections.
    const contact = sections.find((s) => /^contact$/i.test(s.title));
    const profileLinks = contact ? extractContactLinks(contact) : { socials: [], details: [] };

    // Render identity & navigation.
    renderIdentity(name, profileLinks.socials);
    const contentEl = $('#content');
    contentEl.innerHTML = '';
    const navItems = [];

    orderSections(sections).forEach((sec, i) => {
        const key = sec.title.toLowerCase();
        if (CONFIG.skipSections.includes(key)) return;
        if (!sec.nodes.length) return;

        const slug = 'section-' + (key === 'bio' ? 'about' : slugify(sec.title) || 'sec-' + i);
        const label = CONFIG.navLabels[key] || sec.title;
        const iconKey = SECTION_ICON[key] || 'default';

        // Assemble & clean the section body.
        const body = document.createElement('div');
        body.className = 'section-body';
        sec.nodes.forEach((n) => body.appendChild(n.cloneNode(true)));
        cleanNode(body, emphasis);
        stripMenuLinks(body);
        if (!body.textContent.trim() && !body.querySelector('img')) return;

        const article = document.createElement('section');
        article.className = 'section';
        article.id = slug;
        article.innerHTML = `
            <div class="section-head">
                <span class="section-index">${String(navItems.length + 1).padStart(2, '0')}</span>
                <h2 class="section-title">${escapeHtml(label)}</h2>
            </div>`;
        article.appendChild(body);
        contentEl.appendChild(article);

        navItems.push({ slug, label, iconKey });
    });

    renderNav(navItems);
    renderFooter(profileLinks.details, name);
    rewriteInternalAnchors(idMap);
    initInteractions();
}

/** Extract social profiles + contact details from the Contact section. */
function extractContactLinks(section) {
    const socials = [], details = [], seen = new Set();
    section.nodes.forEach((node) => {
        node.querySelectorAll && node.querySelectorAll('a').forEach((a) => {
            const label = a.textContent.replace(/\s+/g, ' ').trim();
            const href = unwrapGoogleUrl(a.getAttribute('href') || '');
            if (!label || /menu/i.test(label) || /dynamic version/i.test(label)) return;

            if (/^mailto:/i.test(href)) {
                details.push({ label: 'Email', value: href.replace(/^mailto:/i, ''), href });
                if (!seen.has('mail')) { socials.push({ label: 'Email', href, icon: 'mail' }); seen.add('mail'); }
                return;
            }
            if (href === '#' || !/^https?:/i.test(href)) {
                // phone number or placeholder — keep as a detail only.
                if (/\d{5,}/.test(label)) details.push({ label: 'Phone', value: label, href: 'tel:' + label.replace(/[^\d+]/g, '') });
                return;
            }
            // The research lab is already featured in the identity block, so it
            // becomes a contact detail rather than another social icon.
            if (/haielab/i.test(href) || /haielab/i.test(label)) {
                details.push({ label: 'Research Lab', value: href.replace(/^https?:\/\//, ''), href });
                return;
            }
            const iconMatch = SOCIAL_ICON.find(([re]) => re.test(label) || re.test(href));
            const icon = iconMatch ? iconMatch[1] : 'link';
            const k = href.toLowerCase();
            if (!seen.has(k)) { socials.push({ label, href, icon }); seen.add(k); }
        });
    });
    return { socials, details };
}

/* ------------------------------ DOM builders ----------------------------- */
function renderIdentity(name, socials) {
    $('#profile-name').textContent = name;
    $('.mobile-name').textContent = name;
    $('#profile-role').textContent = CONFIG.role;
    $('.affil-uni').textContent = CONFIG.affiliationUni;
    const lab = $('#lab-link'); lab.textContent = CONFIG.lab.name; lab.href = CONFIG.lab.url;
    $('#profile-tagline').textContent = CONFIG.tagline;

    // Avatar: photo or monogram.
    const avatar = $('#avatar');
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    avatar.textContent = initials || 'CT';
    if (CONFIG.photo) {
        avatar.classList.add('has-photo');
        avatar.style.backgroundImage = `url("${CONFIG.photo}")`;
    }

    // Source links.
    const pub = CONFIG.docUrl;
    $('#source-link').href = pub;
    $('#footer-source').href = pub;

    // Social icons.
    const socialNav = $('#social');
    socialNav.innerHTML = '';
    socials.forEach((s) => {
        const a = document.createElement('a');
        a.href = s.href; a.title = s.label; a.setAttribute('aria-label', s.label);
        if (/^https?:/i.test(s.href)) { a.target = '_blank'; a.rel = 'noopener'; }
        a.innerHTML = ICONS[s.icon] || ICONS.link;
        socialNav.appendChild(a);
    });
}

function renderNav(items) {
    const nav = $('#primary-nav');
    nav.innerHTML = '';
    items.forEach((it) => {
        const a = document.createElement('a');
        a.href = '#' + it.slug;
        a.dataset.target = it.slug;
        a.innerHTML = `<span class="nav-icon">${ICONS[it.iconKey] || ICONS.default}</span><span>${escapeHtml(it.label)}</span>`;
        nav.appendChild(a);
    });
}

function renderFooter(details, name) {
    const wrap = $('#footer-contact');
    wrap.innerHTML = '';
    details.forEach((d) => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        const val = d.href
            ? `<a href="${d.href}"${/^https?:/i.test(d.href) ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(d.value)}</a>`
            : `<span>${escapeHtml(d.value)}</span>`;
        card.innerHTML = `<div class="label">${escapeHtml(d.label)}</div>${val}`;
        wrap.appendChild(card);
    });
    $('#year').textContent = new Date().getFullYear();
    $('#site-footer').hidden = false;
}

function rewriteInternalAnchors() {
    // After rendering, point any leftover in-content "#h.xxx" links to the top
    // (their Google targets no longer exist). External links are untouched.
    document.querySelectorAll('#content a[href^="#h."]').forEach((a) => {
        a.setAttribute('href', '#');
        a.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    });
}

/* -------------------------------- States --------------------------------- */
function showState(state) {
    $('#loader').hidden = state !== 'loading';
    $('#error').hidden = state !== 'error';
    $('#content').hidden = state !== 'ready';
    $('#site-footer').hidden = state !== 'ready';
}

/* ----------------------------- Interactions ------------------------------ */
function initInteractions() {
    // Scroll-spy via IntersectionObserver.
    const navLinks = Array.from(document.querySelectorAll('#primary-nav a'));
    const linkFor = (id) => navLinks.find((a) => a.dataset.target === id);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((l) => l.classList.remove('active'));
                const link = linkFor(entry.target.id);
                if (link) link.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    document.querySelectorAll('.section').forEach((s) => observer.observe(s));

    // Reveal-on-scroll animation.
    const reveal = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.section').forEach((s) => reveal.observe(s));

    // Smooth nav + close mobile menu on click.
    navLinks.forEach((a) => a.addEventListener('click', () => closeMenu()));
}

let interactionsBound = false;
function bindGlobalUI() {
    if (interactionsBound) return; interactionsBound = true;

    // Theme.
    const saved = localStorage.getItem('toxtli-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));
    $('#theme-toggle').addEventListener('click', () => {
        setTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
    });

    // Mobile menu.
    $('#nav-toggle').addEventListener('click', () => {
        $('#sidebar').classList.contains('open') ? closeMenu() : openMenu();
    });
    $('#nav-backdrop').addEventListener('click', closeMenu);

    // Reading progress + back-to-top.
    const progress = $('#progress-bar'), toTop = $('#to-top');
    const onScroll = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
        progress.style.width = (scrolled * 100).toFixed(2) + '%';
        toTop.classList.toggle('visible', h.scrollTop > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Retry.
    $('#retry').addEventListener('click', load);
}

function setTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem('toxtli-theme', theme);
    const label = $('.theme-label');
    if (label) label.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0e131b' : '#16314f');
}

function openMenu() {
    $('#sidebar').classList.add('open');
    $('#nav-toggle').setAttribute('aria-expanded', 'true');
    const b = $('#nav-backdrop'); b.hidden = false; requestAnimationFrame(() => b.classList.add('show'));
}
function closeMenu() {
    $('#sidebar').classList.remove('open');
    $('#nav-toggle').setAttribute('aria-expanded', 'false');
    const b = $('#nav-backdrop'); b.classList.remove('show'); setTimeout(() => { b.hidden = true; }, 220);
}

/* -------------------------------- Helpers -------------------------------- */
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* --------------------------------- Boot ---------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    bindGlobalUI();
    load();
});
