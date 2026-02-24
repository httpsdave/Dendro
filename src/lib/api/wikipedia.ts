// Wikipedia-based plant data scraper
// Uses the free MediaWiki API to get summaries and images for plants
// No API key required - respects rate limits

const WIKI_API = 'https://en.wikipedia.org/api/rest_v1';
const WIKI_ACTION_API = 'https://en.wikipedia.org/w/api.php';

export interface WikiPlantData {
  title: string;
  description: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  extract: string;
  url: string;
}

/**
 * Get a plant summary from Wikipedia by scientific or common name
 */
export async function getPlantSummary(plantName: string): Promise<WikiPlantData | null> {
  try {
    // Try the REST API summary endpoint first
    const encoded = encodeURIComponent(plantName.replace(/\s+/g, '_'));
    const res = await fetch(`${WIKI_API}/page/summary/${encoded}`, {
      headers: {
        'User-Agent': 'Dendro/1.0 (Forestry App; contact@dendro.app)',
        Accept: 'application/json',
      },
      next: { revalidate: 86400 }, // Cache for 24h
    });

    if (res.ok) {
      const data = await res.json();
      if (data.type === 'standard' || data.type === 'disambiguation') {
        return {
          title: data.title || plantName,
          description: data.description || '',
          imageUrl: data.originalimage?.source || null,
          thumbnailUrl: data.thumbnail?.source || null,
          extract: cleanExtract(data.extract || ''),
          url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encoded}`,
        };
      }
    }

    // Fallback: search Wikipedia
    return searchWikipediaPlant(plantName);
  } catch (error) {
    console.warn(`Wikipedia fetch failed for "${plantName}":`, error);
    return null;
  }
}

/**
 * Search Wikipedia for a plant and return the best match
 */
async function searchWikipediaPlant(query: string): Promise<WikiPlantData | null> {
  try {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: query,
      gsrlimit: '3',
      prop: 'pageimages|extracts|info',
      piprop: 'thumbnail|original',
      pithumbsize: '400',
      exintro: '1',
      explaintext: '1',
      exlimit: '3',
      inprop: 'url',
      origin: '*',
    });

    const res = await fetch(`${WIKI_ACTION_API}?${params.toString()}`, {
      headers: {
        'User-Agent': 'Dendro/1.0 (Forestry App)',
        Accept: 'application/json',
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    // Pick the best page (first result is usually most relevant)
    const pageIds = Object.keys(pages).sort(
      (a, b) => (pages[a].index || 0) - (pages[b].index || 0)
    );

    for (const pageId of pageIds) {
      const page = pages[pageId];
      if (!page || page.missing !== undefined) continue;

      return {
        title: page.title || query,
        description: '',
        imageUrl: page.original?.source || null,
        thumbnailUrl: page.thumbnail?.source || null,
        extract: cleanExtract(page.extract || ''),
        url: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Batch-fetch Wikipedia data for multiple plant names
 * More efficient than individual calls
 */
export async function batchGetPlantData(
  plantNames: string[]
): Promise<Map<string, WikiPlantData>> {
  const results = new Map<string, WikiPlantData>();

  // Process in batches of 5 to respect rate limits
  const batchSize = 5;
  for (let i = 0; i < plantNames.length; i += batchSize) {
    const batch = plantNames.slice(i, i + batchSize);
    const promises = batch.map(async (name) => {
      const data = await getPlantSummary(name);
      if (data) results.set(name, data);
    });
    await Promise.allSettled(promises);
  }

  return results;
}

/**
 * Get a clean image URL from Wikipedia for a plant
 * Returns the highest quality available image
 */
export async function getPlantImage(plantName: string): Promise<string | null> {
  const summary = await getPlantSummary(plantName);
  return summary?.imageUrl || summary?.thumbnailUrl || null;
}

// ── Featured Philippine plants with Wikipedia data ──

export const PHILIPPINE_PLANTS_LIST = [
  // Trees
  { name: 'Narra', scientific: 'Pterocarpus indicus', category: 'tree' },
  { name: 'Molave', scientific: 'Vitex parviflora', category: 'tree' },
  { name: 'Ipil', scientific: 'Intsia bijuga', category: 'tree' },
  { name: 'Tindalo', scientific: 'Afzelia rhomboidea', category: 'tree' },
  { name: 'Kalantas', scientific: 'Toona calantas', category: 'tree' },
  { name: 'Kamagong', scientific: 'Diospyros philippinensis', category: 'tree' },
  { name: 'Philippine Mahogany', scientific: 'Shorea contorta', category: 'tree' },
  { name: 'Almaciga', scientific: 'Agathis philippinensis', category: 'tree' },
  { name: 'Dao', scientific: 'Dracontomelon dao', category: 'tree' },
  { name: 'Yakal', scientific: 'Shorea astylosa', category: 'tree' },
  // Flowers
  { name: 'Sampaguita', scientific: 'Jasminum sambac', category: 'flower' },
  { name: 'Waling-Waling', scientific: 'Vanda sanderiana', category: 'flower' },
  { name: 'Medinilla', scientific: 'Medinilla magnifica', category: 'flower' },
  { name: 'Rafflesia', scientific: 'Rafflesia schadenbergiana', category: 'flower' },
  { name: 'Jade Vine', scientific: 'Strongylodon macrobotrys', category: 'flower' },
  { name: 'Cadena de Amor', scientific: 'Antigonon leptopus', category: 'flower' },
  { name: 'Ylang-Ylang', scientific: 'Cananga odorata', category: 'flower' },
  { name: 'Champaca', scientific: 'Magnolia champaca', category: 'flower' },
  // Grasses & Palms
  { name: 'Kawayan', scientific: 'Bambusa vulgaris', category: 'grass' },
  { name: 'Giant Bamboo', scientific: 'Dendrocalamus asper', category: 'grass' },
  { name: 'Coconut Palm', scientific: 'Cocos nucifera', category: 'grass' },
  { name: 'Nipa Palm', scientific: 'Nypa fruticans', category: 'grass' },
  { name: 'Anahaw', scientific: 'Saribus rotundifolius', category: 'grass' },
  { name: 'Carabao Grass', scientific: 'Paspalum conjugatum', category: 'grass' },
  // Ferns & Mosses
  { name: 'Giant Tree Fern', scientific: 'Cyathea contaminans', category: 'fern' },
  { name: 'Staghorn Fern', scientific: 'Platycerium grande', category: 'fern' },
  { name: 'Birds Nest Fern', scientific: 'Asplenium nidus', category: 'fern' },
  { name: 'Selaginella', scientific: 'Selaginella', category: 'moss' },
  { name: 'Sphagnum', scientific: 'Sphagnum', category: 'moss' },
  // Medicinal & Fruit
  { name: 'Banaba', scientific: 'Lagerstroemia speciosa', category: 'tree' },
  { name: 'Malunggay', scientific: 'Moringa oleifera', category: 'tree' },
  { name: 'Lagundi', scientific: 'Vitex negundo', category: 'tree' },
  { name: 'Calamansi', scientific: 'Citrus × microcarpa', category: 'tree' },
  { name: 'Durian', scientific: 'Durio zibethinus', category: 'tree' },
  { name: 'Mangosteen', scientific: 'Garcinia mangostana', category: 'tree' },
  { name: 'Rambutan', scientific: 'Nephelium lappaceum', category: 'tree' },
  { name: 'Pili Nut', scientific: 'Canarium ovatum', category: 'tree' },
  // Aquatic
  { name: 'Mangrove', scientific: 'Rhizophora mucronata', category: 'tree' },
  { name: 'Water Lily', scientific: 'Nymphaea', category: 'flower' },
  { name: 'Water Hyacinth', scientific: 'Eichhornia crassipes', category: 'flower' },
];

/**
 * Get enriched Philippine plant data with Wikipedia images and descriptions.
 * Supports filtering by category and pagination.
 */
export async function getPhilippinePlantsEnriched(options: {
  page?: number;
  pageSize?: number;
  category?: string;
  query?: string;
} = {}): Promise<{ plants: EnrichedPhilippinePlant[]; total: number }> {
  const { page = 1, pageSize = 12, category, query } = options;

  let filteredPlants = [...PHILIPPINE_PLANTS_LIST];

  if (category) {
    filteredPlants = filteredPlants.filter((p) => p.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    filteredPlants = filteredPlants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.scientific.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  const total = filteredPlants.length;
  const startIdx = (page - 1) * pageSize;
  const paged = filteredPlants.slice(startIdx, startIdx + pageSize);

  // Fetch Wikipedia data for each plant in parallel (batched)
  const wikiData = await batchGetPlantData(paged.map((p) => p.scientific));

  const plants: EnrichedPhilippinePlant[] = paged.map((plant) => {
    const wiki = wikiData.get(plant.scientific);
    return {
      id: `wiki-${plant.scientific.toLowerCase().replace(/\s+/g, '-')}`,
      slug: plant.scientific.toLowerCase().replace(/\s+/g, '-'),
      name: plant.name,
      scientificName: plant.scientific,
      family: null,
      familyCommonName: null,
      category: plant.category,
      imageUrl: wiki?.thumbnailUrl || wiki?.imageUrl || null,
      fullImageUrl: wiki?.imageUrl || null,
      description: wiki?.extract || '',
      wikiUrl: wiki?.url || null,
      source: 'wikipedia',
    };
  });

  return { plants, total };
}

export interface EnrichedPhilippinePlant {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  family: string | null;
  familyCommonName: string | null;
  category: string;
  imageUrl: string | null;
  fullImageUrl: string | null;
  description: string;
  wikiUrl: string | null;
  source: string;
}

// ── Utility ──

function cleanExtract(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\(\s*\)/g, '')
    .trim()
    .slice(0, 500);
}
