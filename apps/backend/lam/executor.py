import asyncio
import random
from typing import List, Dict, Any
from playwright.async_api import Page
try:
    from .bridges.doctoralia import scrape_doctoralia_profile
    from .bridges.google_ads import read_ads_campaigns
    from .bridges.wordpress import draft_wordpress_post
except ImportError:
    from lam.bridges.doctoralia import scrape_doctoralia_profile
    from lam.bridges.google_ads import read_ads_campaigns
    from lam.bridges.wordpress import draft_wordpress_post

# Playwright execution engine mapping DSL to real browser actions


class Executor:
    def __init__(self, headless: bool = False):
        self.headless = headless
        # Use type hinting for structural tracking even if we don't import browser-use to avoid import issues
        self.browser = None
        self.context = None
        self.page: Page | None = None

    async def initialize(self):
        """Initializes the browser session."""
        from playwright.async_api import async_playwright
        import os

        self.playwright = await async_playwright().start()
        
        # Setup persistent profile directory so logins (Google Ads, IG) are saved securely
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        user_data_dir = os.path.join(base_dir, "browser_profile")
        
        # Launch Chromium with persistent context to retain cookies and states
        self.context = await self.playwright.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=self.headless, 
            slow_mo=50,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        # Persistent contexts create a default page automatically
        if len(self.context.pages) > 0:
            self.page = self.context.pages[0]
        else:
            self.page = await self.context.new_page()

        # We assign it to self.browser for structural tracking
        self.browser = getattr(self.context, "browser", self.context)

        print(f"Browser initialized with saved profile at {user_data_dir}")

    async def _stealth_delay(self, min_ms: int = 500, max_ms: int = 1500):
        """Adds organic latency to mimic human behavior."""
        delay = random.uniform(min_ms, max_ms) / 1000.0
        await asyncio.sleep(delay)

    async def execute_plan(self, plan: Dict[str, Any]) -> List[str]:
        """Executes a sequence of actions derived from the planner."""
        results = []
        if not self.browser or not self.page:
            await self.initialize()

        actions = plan.get("actions", [])
        for action_block in actions:
            action_type = action_block.get("action")
            params = action_block.get("params", {})
            desc = action_block.get("description", "")

            print(f"Executing: {action_type} - {desc}")
            await self._stealth_delay()

            try:
                res = await self._execute_action(action_type, params)
                if res:
                    results.append(f"Success: {action_type} - {res}")
                else:
                    results.append(f"Success: {action_type}")
            except Exception as e:
                print(f"Error executing {action_type}: {e}")
                results.append(f"Error: {action_type} - {str(e)}")
                # Depending on resilience strategy, we could break or continue

        return results

    async def _execute_action(self, action_type: str, params: Dict[str, Any]) -> str:
        """Translates DSL action into Playwright call using the page instance."""
        if not self.page:
            raise RuntimeError("Page is not initialized.")

        if action_type == "GO_TO":
            url = params.get("url")
            if url:
                await self.page.goto(url, wait_until="networkidle")
                return f"Navigated to {url}"
            return "No URL provided"

        elif action_type == "CLICK":
            selector = params.get("selector")
            if selector:
                await self.page.click(selector)
                return f"Clicked {selector}"
            return "No selector provided"

        elif action_type == "FILL":
            selector = params.get("selector")
            text = params.get("text")
            if selector and text:
                # Organic typing simulation
                await self.page.fill(selector, "")
                await self._stealth_delay(1500, 4000) # Pre-fill wait
                await self.page.type(selector, text, delay=random.randint(100, 300))
                return f"Filled {selector} with text"
            return "Missing selector or text"

        elif action_type == "WAIT":
            duration = params.get("duration", 2000)
            await self.page.wait_for_timeout(duration)
            return f"Waited for {duration}ms"

        elif action_type == "EXTRACT":
            selector = params.get("selector", "body")
            content = await self.page.inner_text(selector)
            # Truncate for safety
            return content[:500] + "..." if len(content) > 500 else content

        elif action_type == "DOCTORALIA_SCRAPE":
            url = params.get("url")
            if url:
                await self._stealth_delay(1500, 4000)
                return await scrape_doctoralia_profile(self.page, url)
            return "FAIL: Missing Doctoralia URL"

        elif action_type == "ADS_READ_CAMPAIGNS":
            url = params.get("url")
            if url:
                await self._stealth_delay(1500, 4000)
                return await read_ads_campaigns(self.page, url)
            return "FAIL: Missing Ads URL"

        elif action_type == "WP_DRAFT_POST":
            url = params.get("url")
            title = params.get("title")
            content_text = params.get("content")
            if url and title and content_text:
                await self._stealth_delay(1500, 4000)
                return await draft_wordpress_post(self.page, url, title, content_text)
            return "FAIL: Missing WordPress draft parameters (url, title, content)"

        elif action_type == "SUMMARIZE":
            text = params.get("text", "")
            # This would typically call an LLM, but for the executor it might just pass it along
            return f"Summarization requested for {len(text)} chars"

        else:
            return f"Unknown action: {action_type}"

    async def close(self):
        """Cleans up browser resources and resets state for reuse."""
        if self.page:
            await self.page.close()
            self.page = None
        if self.context:
            await self.context.close()
            self.context = None
        if self.browser:
            await self.browser.close()
            self.browser = None
        if hasattr(self, "playwright") and self.playwright:
            await self.playwright.stop()
            self.playwright = None

        print("Browser closed.")


if __name__ == "__main__":

    async def test():
        executor = Executor(headless=True)
        await executor.initialize()
        await executor.close()

    asyncio.run(test())
