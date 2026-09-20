# Deploying MahaSetu (static hosting)

The build output is a standard Vite SPA in `dist/`. Deep links (e.g. `/citizen/documents`,
`/admin/audit`) need the host to serve `index.html` for unknown paths — the SPA fallback
is already configured for the common hosts. The app's own 404 page, global search
(`?q=`), and services filters all rely on this.

## Vercel

`vercel.json` is committed — zero extra config:

```bash
npm i -g vercel && vercel
```

It rewrites all non-file paths to `/index.html`; real files (JS/CSS, images under
`/images/…`) are always served first. `/__verify/*` is excluded so the verification
gallery behaves as plain static files.

## Netlify

`public/_redirects` ships inside the build (Vite copies `public/` into `dist/`).
Deploy via `netlify deploy --prod` or drag-and-drop `dist/` — no extra settings.
Specific portal prefixes are listed explicitly, then a global `/*` fallback catches
the rest.

## GitHub Pages

GitHub Pages has no rewrite support, but it serves `404.html` at the requested URL.
Shipping a copy of `index.html` as `404.html` makes the SPA boot at the original path:

```bash
npm run build
cp dist/index.html dist/404.html
npx gh-pages -d dist   # or push dist/ to the gh-pages branch
```

Or automate the copy in `package.json`:

```json
"postbuild": "cp dist/index.html dist/404.html"
```

## Any static host (nginx, S3+CloudFront, Caddy…)

Serve `dist/` and fall back to `index.html` for unknown paths. nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Local production check

```bash
npm run build
node scripts/verify-spa.mjs
```

Simulates a Vercel/Netlify-style host on `dist/` and verifies: root serves the app,
deep links land on the right page, protected routes hand off to the app's RBAC
redirect, unknown URLs show the branded 404 (with search + audit logging intact),
assets win over the rewrite, and `/__verify/*` stays plain static (missing files
give a real host 404).

## Notes

- Never point the global rewrite at anything but `/index.html`; asset hashes change
  per build.
- If you later remove the dev-only verification gallery (`public/__verify/`), drop its
  exclusions from `vercel.json` / `_redirects` too.
