# Pulse Monitor

An English-language, responsive landing page for a Windows system monitoring application. Dark graphite styling, lime accents, an interactive demonstration, FAQs, and configurable download links.

This repository contains the website only. Product names, features, and system readings are illustrative. No installer is included; download controls remain unavailable until a release URL is configured.

## Files

- `index.html`: page content and illustrations
- `styles.css`: desktop and mobile styles
- `app.js`: navigation, accessible metric tabs, and download controls
- `config.js`: product name, description, architecture options, and download URLs
- `favicon.svg`: site icon
- `.nojekyll`: serves the files without Jekyll processing

There is no build step or package installation. Google Fonts is optional; system fonts are used as a fallback.

## Publish with GitHub Pages

After committing these files, open repository Settings → Pages. Set Source to Deploy from a branch, choose the branch containing these files, select /(root), and save. GitHub Pages publishes a public website; availability for private repositories depends on your GitHub plan.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Add a program download

Edit `config.js` and supply the actual product details. For each supported architecture, set `url`, `filename`, `version`, `size`, and `requirements`. Remove unsupported architectures.

Use a direct HTTPS release URL, or a relative path such as `./downloads/YourProgram-Setup-x64.exe`. A path beginning with `/downloads/` refers to the domain root and is not suitable for a project site hosted under a repository subpath.

For larger installers, use a release asset or a dedicated file host. A cross-origin server may need `Content-Disposition: attachment` to force a download.

Before launch, update the feature descriptions, installation instructions, FAQs, and metadata in `index.html` to match the actual product. Only then set `demo: false` in `config.js`. Graphs remain simulated and are labeled accordingly. An optional support email can be set with `supportEmail`.

## Verification

JavaScript syntax and internal references were checked. Browser visual QA was unavailable in the authoring environment. Check the responsive layout, navigation, metric tabs, FAQs, and real release downloads before launch.
