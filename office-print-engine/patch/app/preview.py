"""Print preview: renders pages onto a picture of the sheet using the same
geometry as actual printing (layout.fit_page inside the printer's real
printable area), so what's shown is what comes out of the printer."""

import io
from dataclasses import dataclass
from pathlib import Path

from .i18n import t
from .printing.convert import to_pdf
from .printing.layout import IMAGE_EXTENSIONS, PDFIUM_LOCK, PageLayout, Placement, fit_page, open_image

PREVIEW_WIDTH_PX = 500  # sheet width in the preview image
MAX_PREVIEW_PAGES = 10
MARGIN_COLOR = (230, 230, 230)  # unprintable border, so margins are visible


class PreviewUnavailable(Exception):
    """File type the server can't lay out itself: office documents / text
    without LibreOffice installed are printed by an external program, so
    the printout isn't known in advance."""


@dataclass
class Preview:
    pages: list[bytes]  # PNG per page
    total_pages: int


def render_preview(
    file_path: Path,
    layout: PageLayout,
    mono: bool,
    page_indices: list[int] | None = None,
    pages_per_sheet: int = 1,
) -> Preview:
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        return _render_pdf(file_path, layout, mono, page_indices, pages_per_sheet)
    if suffix in IMAGE_EXTENSIONS:
        if page_indices not in (None, [0]):
            raise ValueError("An image file contains only page 1.")
        return Preview(pages=[_render_image(file_path, layout, mono)], total_pages=1)
    pdf = to_pdf(file_path)
    if pdf is not None:
        return _render_pdf(pdf, layout, mono, page_indices, pages_per_sheet)
    raise PreviewUnavailable(file_path.suffix)


def _render_pdf(
    file_path: Path,
    layout: PageLayout,
    mono: bool,
    page_indices: list[int] | None = None,
    pages_per_sheet: int = 1,
) -> Preview:
    with PDFIUM_LOCK:
        return _render_pdf_locked(file_path, layout, mono, page_indices, pages_per_sheet)


def _render_pdf_locked(
    file_path: Path,
    layout: PageLayout,
    mono: bool,
    page_indices: list[int] | None = None,
    pages_per_sheet: int = 1,
) -> Preview:
    import pypdfium2 as pdfium
    from PIL import Image

    px_per_mm = PREVIEW_WIDTH_PX / layout.paper_w
    px = lambda mm: max(1, round(mm * px_per_mm))
    try:
        pdf = pdfium.PdfDocument(str(file_path))
    except pdfium.PdfiumError as exc:
        raise ValueError(t("err.open_pdf", error=exc)) from exc
    try:
        indices = list(range(len(pdf))) if page_indices is None else list(page_indices)
        if not indices:
            raise ValueError("Select at least one page.")
        if any(index < 0 or index >= len(pdf) for index in indices):
            raise ValueError("The selected page range exceeds the document length.")
        if pages_per_sheet == 1:
            columns, rows = 1, 1
        elif pages_per_sheet == 2:
            columns, rows = 2, 1
        elif pages_per_sheet == 4:
            columns, rows = 2, 2
        else:
            raise ValueError("Pages per sheet must be 1, 2 or 4.")

        cell_w, cell_h = layout.area_w / columns, layout.area_h / rows
        rendered = []
        sheet_count = (len(indices) + pages_per_sheet - 1) // pages_per_sheet
        for group_number in range(min(sheet_count, MAX_PREVIEW_PAGES)):
            group = indices[group_number * pages_per_sheet:(group_number + 1) * pages_per_sheet]
            sheet = Image.new("RGB", (px(layout.paper_w), px(layout.paper_h)), MARGIN_COLOR)
            sheet.paste(
                "white",
                (px(layout.area_x), px(layout.area_y),
                 px(layout.area_x + layout.area_w), px(layout.area_y + layout.area_h)),
            )
            for position, page_index in enumerate(group):
                page = pdf[page_index]
                try:
                    page_w, page_h = page.get_size()
                    placement = fit_page(page_w, page_h, cell_w, cell_h)
                    scale = placement.w * px_per_mm / (page_h if placement.rotate else page_w)
                    image = page.render(
                        scale=scale,
                        rotation=90 if placement.rotate else 0,
                        draw_annots=True,
                        may_draw_forms=True,
                    ).to_pil().convert("RGB")
                    target_size = (px(placement.w), px(placement.h))
                    if image.size != target_size:
                        image = image.resize(target_size, Image.Resampling.LANCZOS)
                    row, column = divmod(position, columns)
                    x = px(layout.area_x + column * cell_w + placement.x)
                    y = px(layout.area_y + row * cell_h + placement.y)
                    sheet.paste(image, (x, y))
                finally:
                    page.close()
            if mono:
                sheet = sheet.convert("L")
            out = io.BytesIO()
            sheet.save(out, format="PNG", optimize=True)
            rendered.append(out.getvalue())
        return Preview(pages=rendered, total_pages=sheet_count)
    finally:
        pdf.close()


def _render_image(file_path: Path, layout: PageLayout, mono: bool) -> bytes:
    from PIL import Image

    image = open_image(file_path)
    p = fit_page(image.width, image.height, layout.area_w, layout.area_h)
    if p.rotate:
        image = image.transpose(Image.Transpose.ROTATE_270)  # 90° clockwise, as when printing
    return _compose(image, p, layout, mono)


def _compose(image, p: Placement, layout: PageLayout, mono: bool) -> bytes:
    """Places an already-oriented page image on the sheet at placement `p`
    (mm, relative to the printable area) and returns the sheet as PNG."""
    from PIL import Image

    px_per_mm = PREVIEW_WIDTH_PX / layout.paper_w
    px = lambda mm: round(mm * px_per_mm)

    sheet = Image.new("RGB", (px(layout.paper_w), px(layout.paper_h)), MARGIN_COLOR)
    sheet.paste("white", (px(layout.area_x), px(layout.area_y),
                          px(layout.area_x + layout.area_w), px(layout.area_y + layout.area_h)))

    size = (max(px(p.w), 1), max(px(p.h), 1))
    if image.size != size:
        image = image.resize(size, Image.Resampling.LANCZOS)
    sheet.paste(image.convert("RGB"), (px(layout.area_x + p.x), px(layout.area_y + p.y)))

    if mono:
        sheet = sheet.convert("L")

    out = io.BytesIO()
    sheet.save(out, format="PNG", optimize=True)
    return out.getvalue()
