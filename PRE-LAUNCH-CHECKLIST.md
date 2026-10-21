# PRAVI BUSINESS ADVISORS LLP — Pre-launch checklist

**Status: Not live.** This checklist is for the existing static website package; it does not implement AI or require a rebuild. Complete the items below before public launch.

## A. Confirm before uploading
- [ ] Confirm the purchased domain and hosting provider / hosting panel.
- [ ] Verify the registered office address against the latest MCA master data; the current website notes it was transcribed from an extract dated 10 March 2024.
- [ ] Confirm all client/ecosystem names shown on the site are approved for public identification; remove any unapproved name.
- [ ] Review the privacy notice against the actual host, server logs, backups, analytics and form behaviour.
- [ ] Confirm phone and WhatsApp number `+91 91731 21611` is correct and intended for publication.
- [ ] Confirm all service descriptions and regulated-service caveats are appropriate to the firm's actual eligibility and authorisations.
- [ ] Do not publish an email address, partner bio, credential, testimonial, metric or integration unless verified.

## B. Upload the website
1. Extract the ZIP locally on your computer.
2. Upload the **contents** of the extracted folder—not the ZIP itself and not the enclosing folder—to the host's public web root (commonly `public_html`).
3. Ensure `index.html` is directly in that web root and the entire `assets` folder is uploaded with its subfolders.
4. Keep `404.html`, `robots.txt`, `_headers`, and `.htaccess` where appropriate. Static hosts may ignore `_headers`; Apache/cPanel may use `.htaccess`. Do not assume host-specific configuration was applied.
5. Configure the domain and HTTPS in the hosting panel. Follow the host's DNS instructions; do not change DNS records based on guesses.

## C. After the domain is connected
- [ ] Open the homepage over HTTPS and confirm the certificate is valid.
- [ ] Confirm both apex and `www` versions behave as intended and one canonical version is chosen.
- [ ] Test several pages directly by URL, including a service page, `contact.html`, `tools.html`, `mis-generator.html` and `pdf-tools.html`.
- [ ] Verify CSS and JavaScript requests return HTTP 200 and the CSS response has `Content-Type: text/css`. If the page is unstyled, check the deployed relative paths and whether the `assets` folder was uploaded.
- [ ] Test mobile navigation at narrow widths and on a real phone.
- [ ] Test `tel:` and WhatsApp links on a phone. Submit a **test enquiry** only with non-sensitive dummy details; verify the prepared WhatsApp draft, then cancel it rather than sending unless intended.
- [ ] Verify the form makes it clear that it prepares a WhatsApp message, does not submit/store information on the website, and requires the visitor to press Send in WhatsApp.
- [ ] Test each tool using sample/non-client data; check CSV downloads and print/export behaviour.
- [ ] For PDF tools, verify the required CDN libraries load on the live domain and test with non-confidential sample PDFs. Do not use sensitive client documents during testing.
- [ ] Check that the branded 404 page appears for an invalid URL.

## D. Search indexing and metadata
- [ ] Replace `YOUR-DOMAIN-HERE` in `sitemap.xml.template` with the final HTTPS domain and save as `sitemap.xml`.
- [ ] Add a `Sitemap: https://YOUR-DOMAIN/sitemap.xml` line to `robots.txt`.
- [ ] Review canonical and social-sharing metadata for the final domain.
- [ ] Submit the verified sitemap in Google Search Console after the site is live.
- [ ] Add analytics only if needed and update the privacy notice to disclose the actual implementation.

## E. Important limitations to communicate
- The contact form does not send email or store enquiries; it opens a WhatsApp draft.
- The compliance tracker stores entries in the visitor's browser and is not a shared multi-user database. Users should export and securely manage their own records.
- Compliance due dates and applicability must be independently verified against current official sources.
- Financial tools are workpapers/estimates; outputs require review before professional use.
- PDF processing relies on external CDN libraries; test live behaviour and understand that image-based compression may reduce selectable text quality.
- No AI feature, live backend, CRM, email delivery, or accounting-software integration is included in this package.

## F. CMS and content publishing gate
- [ ] Replace Firebase placeholders only in a project controlled by the firm; never add service-account credentials to the website.
- [ ] Deploy reviewed Firestore rules before enabling the admin interface.
- [ ] Test anonymous visitor, authorised administrator and non-authorised Google account separately.
- [ ] Confirm drafts cannot be read publicly and only published posts appear in Insights.
- [ ] Test article create/edit/publish/unpublish/delete, slug uniqueness, HTML/script injection attempts, mobile layout and browser console errors.
- [ ] For meaningful search visibility, test a published article with URL Inspection and consider generating static article HTML pages during publishing. Client-side metadata alone is not a guaranteed indexing strategy.
- [ ] Keep the dashboard disabled until security tests pass. Do not store client financial/tax documents in the article CMS.

## F. Release decision
Do not treat the site as launched until the domain is connected, factual items are verified, HTTPS and page assets work, contact behaviour is tested, and the privacy notice is reviewed. Keep a copy of the exact ZIP that was deployed.
