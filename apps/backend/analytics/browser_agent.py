import asyncio
import random
import time
from typing import List, Dict, Any, Optional
from playwright.async_api import async_playwright, Page, Browser
try:
    from playwright_stealth import stealth_async
except ImportError:
    # Fallback if stealth is not available
    async def stealth_async(page):
        pass
import os

class BrowserAgentService:
    def __init__(self) -> None:
        self.whitelist: List[str] = ["hipnolawrence.com", "google.com", "doctoralia.com.br", "wordpress.com", "localhost"]
        self.sessions_log: List[Dict[str, Any]] = []

    def _is_allowed(self, url: str) -> bool:
        return any(domain in url for domain in self.whitelist)

    async def _bezier_move(self, page: Page, x: int, y: int, steps: int = 20) -> None:
        """Simulates human-like mouse movement using Bezier curves."""
        # For simplicity, we use Playwright's built-in steps which approximates smoothing
        # A more complex implementation would calculate points [P0, P1, P2]
        await page.mouse.move(x, y, steps=steps)

    async def _human_type(self, page: Page, selector: str, text: str) -> None:
        """Types text with randomized delays between characters."""
        await page.focus(selector)
        for char in text:
            char_delay = random.randint(50, 200)
            await page.type(selector, char, delay=char_delay)
            if random.random() > 0.95:
                await asyncio.sleep(random.uniform(0.5, 1.2))

    async def run_visual_audit(self, url: str, device: str = "desktop") -> Dict[str, Any]:
        """
        Implementation of 'Olhos' Section 2.3: Visual SEO Audit.
        Captures screenshot, DOM, and performs heuristic analysis.
        """
        if not self._is_allowed(url):
            return {"error": f"Domio {url} no est na lista de permisses."}

        # Initialize episode logs as actual lists
        episode: Dict[str, Any] = {
            "task": f"Visual Audit on {url} ({device})",
            "thoughts": ["Iniciando auditoria visual para verificar usabilidade e SEO On-Page."],
            "actions": [],
            "observations": []
        }

        async with async_playwright() as p:
            try:
                browser: Browser = await p.chromium.launch(headless=True)

                # Context setup with Stealth
                context_args = {}
                if device == "mobile":
                    context_args.update(p.devices['iPhone 13'])

                context = await browser.new_context(**context_args)
                page: Page = await context.new_page()
                await stealth_async(page)

                # Thought: Navigate to URL
                episode["thoughts"].append(f"Navegando para {url} e aguardando rede ficar ociosa.")
                await page.goto(url, wait_until="networkidle", timeout=60000)

                # Observation: Page loaded
                title = await page.title()
                episode["observations"].append(f"Página carregada com sucesso. Título: {title}")

                # Action: Capture Screenshot
                screenshot_path = f"tmp/audit_{int(time.time())}.png"
                os.makedirs("tmp", exist_ok=True)
                await page.screenshot(path=screenshot_path)
                episode["actions"].append(f"Screenshot capturada em {screenshot_path}")

                # Analysis: Heuristic checks (Section 2.1)
                h1_count = int(await page.evaluate("() => document.querySelectorAll('h1').length"))
                images_no_alt = int(await page.evaluate("() => document.querySelectorAll('img:not([alt])').length"))

                # Typing analysis to avoid further Pyre issues
                health: int = 100 - (images_no_alt * 5) - (0 if h1_count == 1 else 10)
                issue_list: List[Dict[str, str]] = []

                if h1_count != 1:
                    issue_list.append({
                        "severity": "critical",
                        "msg": f"Encontrados {h1_count} tags H1. O ideal  exatamente 1."
                    })

                if images_no_alt > 0:
                    issue_list.append({
                        "severity": "warning",
                        "msg": f"{images_no_alt} imagens esto sem o atributo ALT."
                    })

                analysis: Dict[str, Any] = {
                    "health_score": health,
                    "issues": issue_list
                }

                episode["thoughts"].append("Análise de heurstica concluda.")
                self.sessions_log.append(episode)

                await browser.close()
                return {
                    "status": "success",
                    "device": device,
                    "url": url,
                    "title": title,
                    "analysis": analysis,
                    "screenshot_local": screenshot_path,
                    "react_episode": episode
                }

            except Exception as e:
                # Coverage for return in error condition
                error_msg = str(e)
                if "episode" in locals():
                    episode["observations"].append(f"ERRO: {error_msg}")
                    self.sessions_log.append(episode)
                return {"error": error_msg}

# Singleton
browser_agent = BrowserAgentService()
