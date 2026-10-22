# Astro port status

## Ported

- Home, blog listing and local search, About, Projects, tag index and tag pages.
- All five source posts with their content, images, author data, table of contents, syntax highlighting, article metadata, and previous-article navigation.
- Global RSS, per-tag RSS, post-only sitemap, and the legacy `/posts/:slug` redirect rule.
- Theme toggle, mobile navigation, and lazy-loaded Giscus comments.
- Astro renders pages statically. No React or Preact runtime is included; keep the alias question as a later implementation decision.

## Verification

- `pnpm build` passes and emits 21 HTML pages, `/feed.xml`, 11 tag feeds, and `/sitemap.xml`.
- Compared the local site with `https://mureithi.me`: home, blog search, About, Projects, tags, and an article. At the matched desktop width used in the prior visual pass, key page geometry aligned with the source.
- Rechecked the article at 1280×720 after upgrading Tailwind. Heading size, content width, font stack, and sampled text, link, and code colors match the live anchor.
- Confirmed the blog search returns two Rust posts, zero unmatched posts, and restores all five after clearing the query.
- Confirmed the article table of contents, previous-post link, canonical URL, Giscus load flow, and existing discussion render.
- Confirmed mobile navigation opens and locks body scrolling, the theme toggle works, and the footer X icon renders.

## Scope and release notes

- Newsletter/Revue migration is out of scope by owner decision. The live source still shows its form; the port omits it.
- Countly was not copied. The source analytics initialization appeared broken during the audit.
- Static output uses `.html` files while public links use clean URLs. The deploy host is unknown, so confirm clean-URL mapping, redirect support, and security headers before release.
- The public feed and sitemap preserve the order and URLs observed on the source site.
