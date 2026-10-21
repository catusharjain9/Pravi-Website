# PRAVI Insights CMS — setup and security

This adds a private article-management dashboard to the existing static PRAVI website. The public Insights page retains its three existing static articles and automatically appends CMS articles only when they are published. New CMS articles are displayed at `article.html?slug=article-slug`.

## Current status

- Dashboard UI and Firebase client integration are included.
- The authorised initial administrator is `catusharjain9@gmail.com`.
- Firebase configuration contains placeholders, not a connected project.
- Google sign-in, Firestore, domain, rules deployment and live publishing have **not** been configured or tested. The dashboard is not yet operational or secure until the setup below is completed.
- The second administrator has not been added. When supplied, add the exact verified email to both `assets/js/admin-cms.js` (`ADMIN_EMAILS`) and `firestore.rules` (`isAdmin()`), then deploy rules.

## Setup steps

1. Create a Firebase project in https://console.firebase.google.com/.
2. Register a Web app in Project settings. Copy its `apiKey`, `authDomain`, `projectId`, and `appId` to `firebase-config.js`. Firebase web configuration is client-visible; never put service-account keys or private credentials here.
3. In Authentication > Sign-in method, enable Google. Configure the project's support email and authorised domains. For local development, use a local HTTP server rather than opening HTML files directly.
4. Create a Cloud Firestore database.
5. Deploy `firestore.rules` before testing. These rules restrict writes to verified `catusharjain9@gmail.com` and allow public reads only of documents with `status == 'published'`. Do not weaken these rules to make the UI work.
6. Install Node.js and Firebase CLI, then from this folder run `npm install -g firebase-tools`, `firebase login`, `firebase use --add` (choose your project), and `firebase deploy --only firestore:rules,hosting`.
7. Test the dashboard at `/admin.html` using the authorised account. Verify a draft cannot be read while signed out, a published article appears on `insights.html`, and a non-authorised Google account cannot list, edit or publish articles.
8. Test a published article at `/article.html?slug=your-slug`, mobile layout, browser console, and HTTPS after connecting the domain.

## Hosting and data notes

- The dashboard is reachable by URL but private content is intended to be protected by Google sign-in plus Firestore rules. A hidden URL is not the security boundary. Before real use, test rules with the Firebase Emulator or a non-production project, including unauthenticated reads, non-admin reads/writes, admin CRUD, and published-only public reads.
- This is a lightweight CMS: body content uses plain text with blank lines between paragraphs; lines starting with `## ` or `### ` become headings. It intentionally does not accept arbitrary HTML.
- Published CMS article pages use `article.html?slug=...`. The page now stays `noindex` until it successfully loads a published document, then sets its title, description, canonical URL and robots metadata from the published record. Search engines may need to render JavaScript to see this metadata, and query-string URLs are less robust than generated static pages. For reliable indexing, add a tested publishing/build step that emits a dedicated HTML file for each article before enabling indexing at scale.
- Existing static articles remain unchanged and do not yet appear in the CMS admin list. The dashboard manages new CMS articles only.
- Configure Firestore billing/usage alerts, restrict Firebase authorised domains, enable account security, and review privacy disclosures before inviting real users. Do not upload confidential client records to this article CMS.
- Google Workspace alone does not provide website hosting. Firebase Hosting and Firestore are separate services; review Firebase pricing/quotas for your usage.

## First administrator

`catusharjain9@gmail.com`

Second administrator: not yet supplied.
