"""Validated one-based page-range parser shared by print and preview APIs."""
import re

def parse_page_range(spec: str | None, total_pages: int | None) -> list[int] | None:
    """Return zero-based selected pages in the requested order.

    Blank or "all" means every page (None). Examples: "1", "1,3-5,8".
    Repeated pages are de-duplicated while preserving first occurrence.
    """
    value = (spec or "").strip()
    if not value or value.lower() in {"all", "*"}:
        return None
    if total_pages is None:
        raise ValueError("Page ranges require a PDF or a document convertible to PDF by LibreOffice.")
    if total_pages < 1:
        raise ValueError("The file contains no printable pages.")
    selected: list[int] = []
    seen: set[int] = set()
    for part in value.split(","):
        token = part.strip()
        match = re.fullmatch(r"(\d+)(?:\s*-\s*(\d+))?", token)
        if not match:
            raise ValueError(f"{token!r} is not a valid page or page range.")
        first = int(match.group(1))
        last = int(match.group(2) or first)
        if first < 1 or last < first:
            raise ValueError(f"{token!r} is an invalid page range.")
        if last > total_pages:
            raise ValueError(f"Page {last} exceeds the document's {total_pages} pages.")
        for page in range(first, last + 1):
            index = page - 1
            if index not in seen:
                seen.add(index)
                selected.append(index)
    if not selected:
        raise ValueError("Enter at least one page.")
    if len(selected) > 5000:
        raise ValueError("A maximum of 5,000 selected pages is supported.")
    return selected
