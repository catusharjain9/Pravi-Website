# PRAVI React migration — staged branch
React + Vite + React Router + Motion for React. This is a migration branch, not a production-ready replacement.

The homepage is implemented in React with a bespoke animated financial-contour visual system, responsive layouts and reduced-motion handling. Existing static pages and all original tool code remain untouched while migration proceeds.

## Local
npm install
npm run dev
npm run build

## Production gates
- Port every remaining page and retain its public URL.
- Port all nine tools with calculations, imports, exports, validation and persistence intact.
- Replace every logo placement with the exact approved Library artwork; the binary artwork must be added before branding sign-off.
- Test keyboard navigation, mobile layouts, reduced motion, CSP, SEO metadata, sitemap, GitHub Pages path handling and all workflows.
- Do not deploy this branch until the gates pass.
