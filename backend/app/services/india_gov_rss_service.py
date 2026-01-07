import feedparser
from datetime import datetime

RSS_FEEDS = [
    "https://www.indiajoblive.com/feed/",
    "https://www.indiajoblive.com/category/govt-jobs/feed/",
    "https://www.indiajoblive.com/category/central-govt-jobs/feed/",
    "https://www.indiajoblive.com/category/state-govt-jobs/feed/",
    "https://www.indiajoblive.com/category/ssc-recruitment/feed/",
]

def fetch_rss_jobs():
    jobs = []
    seen_links = set()

    for feed_url in RSS_FEEDS:
        feed = feedparser.parse(feed_url)

        for entry in feed.entries:
            link = entry.get("link")
            if not link or link in seen_links:
                continue

            seen_links.add(link)

            jobs.append({
                "title": entry.get("title"),
                "authority": extract_authority(entry.get("title", "")),
                "level": detect_level(entry),
                "source": "indiajoblive.com",
                "official_link": link,
                "published": entry.get("published", ""),
                "is_active": 1
            })

    return jobs


def detect_level(entry):
    tags = " ".join(t.term.lower() for t in entry.get("tags", []))

    if "central" in tags:
        return "central"
    if "state" in tags:
        return "state"
    if "ssc" in tags:
        return "central"

    return "unknown"


def extract_authority(title: str):
    keywords = [
        "SSC", "UPPSC", "UPPRPB", "BSF", "CBSE", "ITI",
        "JSSC", "TANUVAS", "UPSC", "RRB"
    ]

    for k in keywords:
        if k.lower() in title.lower():
            return k

    return "Unknown"
