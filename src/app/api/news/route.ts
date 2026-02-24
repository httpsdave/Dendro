import { NextRequest, NextResponse } from 'next/server';

// ── RSS Feed Sources (real forestry / plant news) ──
const RSS_FEEDS = [
  { url: 'https://forestsnews.cifor.org/feed/', name: 'CIFOR Forests News' },
  { url: 'https://www.ran.org/feed/', name: 'Rainforest Action Network' },
  { url: 'https://www.forest-trends.org/blog/feed/', name: 'Forest Trends' },
  { url: 'https://forests.org/feed/', name: 'Sustainable Forestry Initiative' },
  { url: 'https://blog.globalforestwatch.org/feed', name: 'Global Forest Watch' },
  { url: 'https://www.greenpeace.org.uk/topics/forests/feed/', name: 'Greenpeace Forests' },
];

// GNews as secondary source
const GNEWS_KEY = process.env.GNEWS_API_KEY || '';

// Fallback news data when RSS and API both fail
const FALLBACK_NEWS = [
  {
    title: 'World Record: 350 Million Trees Planted in a Single Day in Ethiopia',
    description:
      "Ethiopia set a new world record by planting an estimated 350 million tree seedlings in 12 hours as part of a campaign to restore the country's depleted forests.",
    url: 'https://forestsnews.cifor.org/',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    publishedAt: '2026-01-15T10:00:00Z',
    source: { name: 'CIFOR Forests News', url: 'https://forestsnews.cifor.org' },
  },
  {
    title: 'Ancient Balete Tree Found in Philippines Estimated to be Over 1,500 Years Old',
    description:
      'A massive balete tree discovered in the forests of Mindanao is estimated to be over 1,500 years old, making it one of the oldest known trees in Southeast Asia.',
    url: 'https://forestsnews.cifor.org/',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    publishedAt: '2025-12-20T08:30:00Z',
    source: { name: 'Forests News', url: 'https://forestsnews.cifor.org' },
  },
  {
    title: 'Scientists Discover New Species of Orchid in Philippine Cloud Forests',
    description:
      "Researchers have identified a new species of orchid in the cloud forests of Mount Pulag, adding to the Philippines' rich biodiversity.",
    url: 'https://www.ran.org/',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800',
    publishedAt: '2025-11-05T14:15:00Z',
    source: { name: 'Rainforest Action Network', url: 'https://www.ran.org' },
  },
  {
    title: 'Global Reforestation Effort: One Trillion Trees by 2030',
    description:
      "The World Economic Forum's 1t.org initiative aims to conserve, restore, and grow one trillion trees by the end of the decade. Over 50 countries have pledged support.",
    url: 'https://forests.org/',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    publishedAt: '2025-10-12T11:00:00Z',
    source: { name: 'Sustainable Forestry Initiative', url: 'https://forests.org' },
  },
  {
    title: 'Mangrove Restoration Projects Protect Philippine Coastlines from Storms',
    description:
      'Community-led mangrove planting initiatives across the Philippines have restored thousands of hectares of coastline, providing natural storm barriers against typhoons.',
    url: 'https://blog.globalforestwatch.org/',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    publishedAt: '2025-09-28T09:45:00Z',
    source: { name: 'Global Forest Watch', url: 'https://blog.globalforestwatch.org' },
  },
  {
    title: 'Bamboo: The Sustainable Building Material of the Future',
    description:
      'Architects and engineers are increasingly turning to bamboo as a sustainable, rapidly renewable building material that could revolutionize construction worldwide.',
    url: 'https://www.forest-trends.org/',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    publishedAt: '2025-08-14T16:30:00Z',
    source: { name: 'Forest Trends', url: 'https://www.forest-trends.org' },
  },
  {
    title: 'Deforestation in Southeast Asia Slows Thanks to Community Conservation Programs',
    description:
      'A new report shows that deforestation rates in Southeast Asia have decreased by 15% over the past decade, largely attributed to community-based forest management programs.',
    url: 'https://www.greenpeace.org.uk/topics/forests/',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
    publishedAt: '2025-07-20T12:00:00Z',
    source: { name: 'Greenpeace Forests', url: 'https://www.greenpeace.org.uk' },
  },
  {
    title: 'The Role of Mycorrhizal Networks in Forest Health',
    description:
      'New research reveals how underground fungal networks connect trees across a forest, allowing them to share nutrients and communicate stress signals.',
    url: 'https://forestsnews.cifor.org/',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    publishedAt: '2025-06-10T08:00:00Z',
    source: { name: 'CIFOR Forests News', url: 'https://forestsnews.cifor.org' },
  },
];

// ── Simple RSS XML parser ──
function parseRSSItems(xml: string, sourceName: string): any[] {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const description = stripHtml(extractTag(itemXml, 'description'));
    const pubDate = extractTag(itemXml, 'pubDate');
    const contentEncoded = extractTag(itemXml, 'content:encoded');

    // Try to extract image from various sources
    let image = '';
    // Check media:content
    const mediaMatch = itemXml.match(/<media:content[^>]*url="([^"]+)"/);
    if (mediaMatch) image = mediaMatch[1];
    // Check enclosure
    if (!image) {
      const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/);
      if (enclosureMatch) image = enclosureMatch[1];
    }
    // Check media:thumbnail
    if (!image) {
      const thumbMatch = itemXml.match(/<media:thumbnail[^>]*url="([^"]+)"/);
      if (thumbMatch) image = thumbMatch[1];
    }
    // Check for img tag in content:encoded or description
    if (!image) {
      const imgMatch = (contentEncoded || itemXml).match(/<img[^>]*src="([^"]+)"/);
      if (imgMatch) image = imgMatch[1];
    }

    if (title) {
      items.push({
        title: stripHtml(title),
        description: description ? description.slice(0, 300) : '',
        url: link || '',
        image: image || null,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        source: { name: sourceName, url: link || '' },
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA
  const cdataRegex = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
    'i'
  );
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    // Decode numeric HTML entities (&#160; &#8217; etc.)
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    // Decode hex HTML entities (&#x00A0; etc.)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&hellip;/g, "\u2026")
    // Collapse multiple spaces into one
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Fetch a single RSS feed ──
async function fetchRSSFeed(feedUrl: string, feedName: string): Promise<any[]> {
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Dendro/1.0 (Forestry News Aggregator)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSSItems(xml, feedName);
  } catch {
    console.warn(`RSS fetch failed for ${feedName}: ${feedUrl}`);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 12;

  try {
    let allArticles: any[] = [];

    // 1. Try RSS feeds in parallel
    const rssResults = await Promise.allSettled(
      RSS_FEEDS.map((feed) => fetchRSSFeed(feed.url, feed.name))
    );

    for (const result of rssResults) {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allArticles.push(...result.value);
      }
    }

    // 2. If RSS produced enough articles, use them
    if (allArticles.length >= 3) {
      // Sort by date, newest first
      allArticles.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      // Deduplicate by title
      const seen = new Set<string>();
      allArticles = allArticles.filter((a) => {
        const key = a.title.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const paginated = allArticles.slice((page - 1) * perPage, page * perPage);
      return NextResponse.json({
        articles: paginated,
        totalArticles: allArticles.length,
        source: 'rss',
      });
    }

    // 3. Try GNews API as fallback
    if (GNEWS_KEY && GNEWS_KEY !== 'your_gnews_api_key_here') {
      const url = new URL('https://gnews.io/api/v4/search');
      url.searchParams.set('apikey', GNEWS_KEY);
      url.searchParams.set('q', 'trees OR reforestation OR plants OR forestry OR botanical');
      url.searchParams.set('lang', 'en');
      url.searchParams.set('max', '10');
      url.searchParams.set('page', String(page));

      const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

      if (res.ok) {
        const data = await res.json();
        const articles = (data.articles || []).map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.image,
          publishedAt: article.publishedAt,
          source: article.source,
        }));

        return NextResponse.json({
          articles,
          totalArticles: data.totalArticles || 0,
          source: 'gnews',
        });
      }
    }

    // 4. Final fallback: static data
    return NextResponse.json({
      articles: FALLBACK_NEWS,
      totalArticles: FALLBACK_NEWS.length,
      source: 'fallback',
    });
  } catch (error: any) {
    console.error('News API error:', error);
    return NextResponse.json({
      articles: FALLBACK_NEWS,
      totalArticles: FALLBACK_NEWS.length,
      source: 'fallback',
    });
  }
}
