import httpx
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (SamadhanAI)"
}

async def fetch_html(url: str) -> BeautifulSoup:
    async with httpx.AsyncClient(headers=HEADERS, timeout=30) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "lxml")
