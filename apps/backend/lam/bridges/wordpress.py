from typing import Optional, Any, List
from pydantic import BaseModel, Field

class WPArticle(BaseModel):
    title: str = Field(..., description="The title of the WordPress post")
    content: str = Field(..., description="The full HTML or Markdown content")
    status: str = Field(default="draft", description="Status: draft, pending, private, publish")
    categories: List[str] = Field(default_factory=list, description="Categories for the post")
    tags: List[str] = Field(default_factory=list, description="Tags for the post")
    seo_score: Optional[int] = Field(default=None, description="Yoast or RankMath SEO Score")

async def draft_wordpress_post(page: Any, url: str, title: str, content: str) -> str:
    """
    Safely navigates to the WordPress post editor and drafts a new article.
    Strictly drafts the post, avoiding the publish button to enforce HITL (Human-in-the-Loop).
    Returns a serialized WPArticle confirming the draft state.
    """
    try:
        # Navigate to Add New Post page (wp-admin/post-new.py)
        response = await page.goto(url, wait_until="networkidle", timeout=15000)
        if not response or not response.ok:
            return f"FAIL: Failed to load WordPress admin at {url}"

        # Visually verify the editor is present (Gutenberg or Classic)
        try:
            # Wait for classic title input or Gutenberg block
            await page.wait_for_selector(".wp-block-post-title, #title", timeout=10000)
        except Exception:
            return f"FAIL: WordPress editor visual verification failed at {url}"

        # Fill in the title
        title_input = await page.query_selector(".wp-block-post-title")
        if not title_input:
            title_input = await page.query_selector("#title")
        if title_input:
            await title_input.fill(title)

        # Fill in the content (simplified approach for either editor)
        content_area = await page.query_selector(".wp-block-paragraph")
        if not content_area:
            content_area = await page.query_selector("#content")
        if content_area:
            # Note: actual typing delays should be handled by the executor,
            # but we simulate filling here.
            await content_area.fill(content)

        # Explicitly click "Save Draft" (never "Publish")
        # Ensure we only target save-draft buttons
        save_btn = await page.query_selector(".editor-post-save-draft, #save-post")
        if save_btn:
            await save_btn.click()
            await page.wait_for_timeout(3000) # wait for save to complete
        else:
            return "FAIL: Could not locate 'Save Draft' button. Aborting to prevent accidental publish."

        article = WPArticle(title=title, content=content, status="draft")
        return article.model_dump_json()

    except Exception as e:
        return f"FAIL: WordPress drafting exception: {str(e)}"
