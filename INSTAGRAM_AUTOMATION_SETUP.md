# PRAVI Instagram image publishing automation

The workflow at `.github/workflows/instagram-weekly.yml` runs each Monday at 09:00 India Standard Time and can also be started manually from GitHub Actions.

## Required repository Actions secrets

Add these in **GitHub → catusharjain9/Pravi-Website → Settings → Secrets and variables → Actions → New repository secret**:

- `OPENAI_API_KEY`: an API key with image-generation access and available billing.
- `INSTAGRAM_ACCESS_TOKEN`: a valid Meta Graph API access token for the connected Instagram Business account, with Instagram content publishing permission.
- `INSTAGRAM_USER_ID`: the numeric Instagram Business Account ID (not the username or a Composio connection ID).

Do not put access tokens or API keys in source files, workflow YAML, or commit messages. Use a suitably long-lived token and rotate it if exposed.

## How it works

1. Generate a new square branded image using the OpenAI Images API.
2. Save the generated image as a date-stamped asset in `assets/img/instagram/`.
3. Commit the actual image bytes to the repository so Meta can fetch the file.
4. Create an Instagram image media container, publish it, and require a returned media ID before reporting success.
5. Record the successful publication date and media ID to avoid duplicate posts on retries.

The Instagram Graph API requires a publicly fetchable media source URL when creating a photo container. This is an internal transport mechanism: the Instagram post is an image post, not a caption containing a link.

## Operational notes

- The repository must remain public for the raw image asset to be fetchable by Meta.
- Generated images are committed to the repository; review repository visibility and retention implications before enabling the workflow.
- The workflow uses `contents: write` to commit generated images and the publication ledger.
- A failed publish may leave the generated image committed but will not be recorded as published; review the failed run before retrying.
- GitHub Actions cron schedules can be delayed by GitHub during high load. Use `workflow_dispatch` for a manual test.
- The script never logs secret values. Errors include the API's returned error body for troubleshooting.
- The connected ChatGPT/Composio Instagram connection is separate from GitHub Actions. This workflow uses the Meta access token stored as a GitHub secret.
