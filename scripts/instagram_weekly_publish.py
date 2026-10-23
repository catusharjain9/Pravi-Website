#!/usr/bin/env python3
"""Generate a branded PRAVI image and publish it as an Instagram feed photo.

Instagram's Graph API requires a publicly fetchable image_url when creating
an image media container. The URL is only the media source; the published
Instagram post contains the image itself, not a link caption.
"""
from __future__ import annotations

import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "img" / "instagram"
API_VERSION = "v21.0"
BRAND_PROMPT = """Create a premium, polished square Instagram marketing graphic for
PRAVI Business Advisors, an Indian business advisory firm. Use refined deep navy,
warm ivory/cream and muted gold, clear high-contrast typography, generous spacing,
editorial corporate design, subtle business/finance imagery, no people, no fake
testimonials, no guaranteed outcomes, no invented contact details. Include the
headline and service information supplied in the prompt. Make all text legible
and spell it correctly. 1024x1024 composition suitable for an Instagram feed."""
TOPICS = [
    ("Startup foundations", "Starting a business is easier when the foundations are clear. PRAVI Business Advisors supports founders with business registration, taxation, GST compliance and accounting—so you can focus on building your business."),
    ("GST compliance, made clearer", "Consistent GST records and timely reconciliations help businesses stay organised. PRAVI Business Advisors supports practical GST compliance and accounting workflows for growing businesses."),
    ("Know your numbers", "Reliable books and regular management reporting help business owners make informed decisions. PRAVI Business Advisors supports accounting, reconciliations and monthly MIS reporting."),
    ("Plan cash flow with confidence", "Cash-flow visibility helps business owners prepare for upcoming commitments and plan growth more thoughtfully. PRAVI Business Advisors supports practical cash-flow planning and business reporting."),
    ("Compliance is a business habit", "A simple compliance calendar, organised records and regular reviews can make obligations easier to manage. PRAVI Business Advisors supports businesses with practical compliance and accounting processes."),
    ("Turn records into insight", "Accounting is more than recording transactions. Clear reconciliations and useful monthly reporting help owners understand performance and plan next steps."),
    ("Build for sustainable growth", "Good business decisions start with clear records, realistic planning and consistent compliance. PRAVI Business Advisors supports businesses through each stage of their growth journey."),
    ("Prepare before deadlines", "Keeping documents, reconciliations and due dates organised reduces last-minute pressure. PRAVI Business Advisors helps businesses build repeatable compliance routines."),
]
HASHTAGS = "#PraviBusinessAdvisors #BusinessAdvisory #StartupIndia #GSTCompliance #BusinessGrowth #Accounting"


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def request_json(url: str, *, method: str = "GET", payload: dict | None = None,
                 token: str | None = None, timeout: int = 60) -> dict:
    data = json.dumps(payload).encode() if payload is not None else None
    headers = {"Accept": "application/json", "User-Agent": "PRAVI-Instagram-Publisher/1.0"}
    if payload is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:2000]
        fail(f"API request failed ({exc.code}) for {urllib.parse.urlsplit(url).netloc}: {detail}")
    except urllib.error.URLError as exc:
        fail(f"Network request failed for {urllib.parse.urlsplit(url).netloc}: {exc}")
    if not isinstance(result, dict):
        fail("Unexpected non-object API response")
    if "error" in result:
        fail(f"API returned an error: {result['error']}")
    return result


def git(*args: str) -> str:
    proc = subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True)
    if proc.returncode:
        fail(f"git {' '.join(args)} failed: {proc.stderr.strip()}")
    return proc.stdout.strip()


def main() -> None:
    openai_key = os.environ.get("OPENAI_API_KEY")
    ig_token = os.environ.get("INSTAGRAM_ACCESS_TOKEN")
    ig_user = os.environ.get("INSTAGRAM_USER_ID")
    repo = os.environ.get("GITHUB_REPOSITORY")
    if not all((openai_key, ig_token, ig_user, repo)):
        fail("Configure OPENAI_API_KEY, INSTAGRAM_ACCESS_TOKEN, and INSTAGRAM_USER_ID in GitHub Actions secrets.")

    now = datetime.now(timezone.utc)
    date_key = now.strftime("%Y-%m-%d")
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    image_path = ASSET_DIR / f"pravi-instagram-{date_key}.png"
    ledger_path = ROOT / "assets" / "img" / "instagram" / "published-posts.json"
    ledger = json.loads(ledger_path.read_text()) if ledger_path.exists() else {"published_dates": []}
    if date_key in ledger.get("published_dates", []):
        print(f"Skipped: a post is already recorded for {date_key}; duplicate prevention is active.")
        return

    # Deterministic weekly topic selection prevents same-day retries changing topics.
    week_number = int(now.strftime("%U"))
    title, body = TOPICS[week_number % len(TOPICS)]
    image_prompt = (
        f"{BRAND_PROMPT}\nHeadline: {title}.\nSupporting copy: {body}\n"
        "Include a concise footer: Compliance | Clarity | Confidence | Growth. "
        "Use PRAVI Business Advisors as the brand name. Do not add a website URL, "
        "phone number, QR code, fake credentials or additional claims."
    )
    image_result = request_json(
        "https://api.openai.com/v1/images/generations",
        method="POST",
        payload={"model": "gpt-image-1", "prompt": image_prompt,
                 "size": "1024x1024", "quality": "high", "output_format": "png"},
        token=openai_key, timeout=180,
    )
    image_items = image_result.get("data") or []
    if not image_items or not image_items[0].get("b64_json"):
        fail("Image generation returned no image bytes.")
    image_path.write_bytes(base64.b64decode(image_items[0]["b64_json"]))

    # Publish the generated image file to the repository so Meta can fetch the
    # actual media bytes. The post itself is published as an image, not a link.
    git("config", "user.name", "github-actions[bot]")
    git("config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com")
    git("add", str(image_path.relative_to(ROOT)))
    git("commit", "-m", f"chore(instagram): generated PRAVI post {date_key}")
    git("push", "origin", "HEAD:main")

    image_url = f"https://raw.githubusercontent.com/{repo}/main/{image_path.relative_to(ROOT).as_posix()}"
    # Wait for GitHub's raw content edge to expose the committed file.
    for attempt in range(10):
        try:
            req = urllib.request.Request(image_url, method="HEAD",
                                         headers={"User-Agent": "PRAVI-Instagram-Publisher/1.0"})
            with urllib.request.urlopen(req, timeout=20) as response:
                if response.status == 200:
                    break
        except Exception:
            pass
        time.sleep(3)
    else:
        fail("Generated image was committed, but the public media endpoint did not become reachable.")

    caption = f"{body}\n\nStart your business journey with clarity and confidence.\n\n{HASHTAGS}"
    container = request_json(
        f"https://graph.facebook.com/{API_VERSION}/{ig_user}/media",
        method="POST",
        payload={"image_url": image_url, "caption": caption},
        token=ig_token, timeout=60,
    )
    creation_id = container.get("id")
    if not creation_id:
        fail("Instagram did not return a media container ID.")

    publish_result = request_json(
        f"https://graph.facebook.com/{API_VERSION}/{ig_user}/media_publish",
        method="POST",
        payload={"creation_id": creation_id},
        token=ig_token, timeout=90,
    )
    media_id = publish_result.get("id")
    if not media_id:
        fail("Instagram did not return a published media ID; post success is unconfirmed.")

    ledger.setdefault("published_dates", []).append(date_key)
    ledger.setdefault("posts", []).append({
        "date_utc": date_key, "title": title, "media_id": media_id,
        "image_path": image_path.relative_to(ROOT).as_posix(),
    })
    ledger_path.write_text(json.dumps(ledger, indent=2) + "\n")
    git("add", str(ledger_path.relative_to(ROOT)))
    git("commit", "-m", f"chore(instagram): record published post {date_key}")
    git("push", "origin", "HEAD:main")
    print(json.dumps({
        "status": "published",
        "instagram_user_id": ig_user,
        "media_id": media_id,
        "topic": title,
        "image_path": image_path.relative_to(ROOT).as_posix(),
        "note": "Instagram confirmed a published media ID."
    }, indent=2))


if __name__ == "__main__":
    main()
