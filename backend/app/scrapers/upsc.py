from urllib.parse import urljoin
from app.scrapers.base import fetch_html

UPSC_URL = "https://upsc.gov.in/examinations/active-exams"


async def scrape_upsc():
    soup = await fetch_html(UPSC_URL)
    jobs = []

    rows = soup.select("div.views-row")

    for row in rows:
        a = row.select_one("a[href]")
        li = row.select_one("ul.arrows li")

        if not a or not li:
            continue

        title = li.get_text(strip=True)
        href = a.get("href")

        jobs.append({
            "title": title,
            "organization": "UPSC",
            "job_type": "central",
            "source": "upsc",
            "official_url": urljoin(UPSC_URL, href),
            "state": None,
        })

    return jobs
