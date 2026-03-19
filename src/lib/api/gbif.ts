// GBIF (Global Biodiversity Information Facility) API service
// Docs: https://www.gbif.org/developer/summary

import { getBestPlantSummary } from '@/lib/api/wikipedia';

const GBIF_BASE = 'https://api.gbif.org/v1';

interface GBIFSpeciesResult {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count: number;
  results: GBIFSpecies[];
}

interface GBIFSpecies {
  key: number;
  nubKey?: number;
  scientificName: string;
  canonicalName?: string;
  vernacularName?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  rank?: string;
  taxonomicStatus?: string;
  descriptions?: string[];
}

interface GBIFOccurrenceResult {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count: number;
  results: GBIFOccurrence[];
}

interface GBIFOccurrence {
  key: number;
  speciesKey?: number;
  taxonKey?: number;
  species?: string;
  scientificName?: string;
  genericName?: string;
  specificEpithet?: string;
  taxonRank?: string;
  decimalLatitude?: number;
  decimalLongitude?: number;
  country?: string;
  media?: Array<{
    type?: string;
    identifier?: string;
    format?: string;
  }>;
  family?: string;
  genus?: string;
  eventDate?: string;
}

async function gbifFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${GBIF_BASE}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GBIF API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Search for species by name
export async function searchSpecies(query: string, limit = 20, offset = 0) {
  return gbifFetch<GBIFSpeciesResult>('/species/search', {
    q: query,
    limit: String(limit),
    offset: String(offset),
    rank: 'SPECIES',
    status: 'ACCEPTED',
  });
}

// Get species details by key
export async function getSpecies(key: number) {
  return gbifFetch<GBIFSpecies>(`/species/${key}`);
}

// Get vernacular names for a species
export async function getVernacularNames(key: number) {
  return gbifFetch<{ results: Array<{ vernacularName: string; language?: string }> }>(
    `/species/${key}/vernacularNames`
  );
}

// Get species media (images)
export async function getSpeciesMedia(key: number) {
  return gbifFetch<{
    results: Array<{ type: string; identifier: string; format?: string; title?: string }>;
  }>(`/species/${key}/media`);
}

// Search occurrences in the Philippines (country code: PH)
export async function searchPhilippineOccurrences(
  query?: string,
  limit = 20,
  offset = 0,
  options: {
    hasCoordinate?: boolean;
    hasGeospatialIssue?: boolean;
    mediaType?: string;
    taxonKey?: number;
    familyKey?: number;
  } = {}
) {
  const params: Record<string, string> = {
    country: 'PH',
    limit: String(limit),
    offset: String(offset),
  };

  if (query) params.q = query;
  if (options.hasCoordinate !== undefined) params.hasCoordinate = String(options.hasCoordinate);
  if (options.hasGeospatialIssue !== undefined)
    params.hasGeospatialIssue = String(options.hasGeospatialIssue);
  if (options.mediaType) params.mediaType = options.mediaType;
  if (options.taxonKey) params.taxonKey = String(options.taxonKey);
  if (options.familyKey) params.familyKey = String(options.familyKey);

  return gbifFetch<GBIFOccurrenceResult>('/occurrence/search', params);
}

// Get distinct species found in the Philippines
export async function listPhilippineSpecies(
  query?: string,
  limit = 20,
  offset = 0
) {
  const params: Record<string, string> = {
    country: 'PH',
    limit: String(limit),
    offset: String(offset),
    status: 'ACCEPTED',
    rank: 'SPECIES',
  };

  if (query) params.q = query;

  // Use species/search with a distribution filter approach
  // GBIF doesn't have a direct "species by country" endpoint, but we can
  // search occurrences and extract unique species, or use checklist datasets
  return gbifFetch<GBIFSpeciesResult>('/species/search', {
    ...params,
    highertaxonKey: '6', // Plantae kingdom key in GBIF
  });
}

// Get details + media for a Philippine species - returns a normalized plant object
export async function getPhilippinePlantDetail(speciesKey: number) {
  const [species, mediaRes, namesRes] = await Promise.all([
    getSpecies(speciesKey),
    getSpeciesMedia(speciesKey).catch(() => ({ results: [] })),
    getVernacularNames(speciesKey).catch(() => ({ results: [] })),
  ]);

  const gbifImages = mediaRes.results
    .filter((m) => m.type === 'StillImage' && m.identifier)
    .map((m) => m.identifier);

  const commonNames = namesRes.results
    .filter((n) => n.language === 'eng' || !n.language)
    .map((n) => n.vernacularName);

  const wiki = await getBestPlantSummary([
    species.canonicalName,
    species.scientificName,
    species.species,
    ...commonNames,
  ]);

  const wikiImage = wiki?.imageUrl || wiki?.thumbnailUrl || null;
  const images = Array.from(new Set([...gbifImages, ...(wikiImage ? [wikiImage] : [])]));

  const wikiCommonName = wiki?.title && !isLikelyScientificName(wiki.title) ? wiki.title : null;
  const mergedCommonNames = Array.from(
    new Set([...commonNames, ...(wikiCommonName ? [wikiCommonName] : [])])
  );
  const displayName =
    mergedCommonNames[0] || species.canonicalName || species.scientificName || 'Unknown Plant';

  return {
    id: `gbif-${species.key}`,
    gbifKey: species.key,
    name: displayName,
    commonName: displayName,
    scientificName: species.scientificName || species.canonicalName || displayName,
    canonicalName: species.canonicalName,
    family: species.family || null,
    genus: species.genus || null,
    kingdom: species.kingdom,
    imageUrl: images[0] || null,
    images,
    commonNames: mergedCommonNames,
    observations: wiki?.extract || null,
    wikiUrl: wiki?.url || null,
    sources: [
      { name: 'GBIF', url: `https://www.gbif.org/species/${species.key}` },
      ...(wiki ? [{ name: 'Wikipedia', url: wiki.url }] : []),
    ],
    rank: species.rank,
    taxonomicStatus: species.taxonomicStatus,
    source: 'gbif' as const,
  };
}

// Normalize GBIF species results to match our Plant interface
export async function normalizeGBIFPlants(
  results: GBIFSpecies[]
): Promise<Array<{
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  family: string | null;
  familyCommonName: string | null;
  imageUrl: string | null;
  source: string;
  description?: string | null;
  wikiUrl?: string | null;
}>> {
  const validResults = results
    .filter((sp) => sp.canonicalName || sp.scientificName)
    .map((sp) => ({
      ...sp,
      scientificName: sp.scientificName || sp.canonicalName || '',
    }));

  const enriched = await Promise.all(
    validResults.map(async (sp) => {
      const [mediaRes, wiki] = await Promise.all([
        getSpeciesMedia(sp.key).catch(() => ({ results: [] })),
        getBestPlantSummary([
          sp.vernacularName,
          sp.canonicalName,
          sp.scientificName,
          sp.species,
        ]),
      ]);

      const gbifImage = mediaRes.results.find((m) => m.type === 'StillImage' && m.identifier)?.identifier || null;
      const wikiImage = wiki?.thumbnailUrl || wiki?.imageUrl || null;
      const imageUrl = gbifImage || wikiImage;
      const wikiCommonName = wiki?.title && !isLikelyScientificName(wiki.title) ? wiki.title : null;

      return {
        id: `gbif-${sp.key}`,
        slug: (sp.canonicalName || sp.scientificName).toLowerCase().replace(/\s+/g, '-'),
        name: sp.vernacularName || wikiCommonName || sp.canonicalName || sp.scientificName,
        scientificName: sp.scientificName,
        family: sp.family || null,
        familyCommonName: null,
        imageUrl,
        source: 'gbif',
        description: wiki?.extract || null,
        wikiUrl: wiki?.url || null,
      };
    })
  );

  return enriched;
}

function isLikelyScientificName(value: string): boolean {
  const cleaned = value.trim();
  return /^[A-Z][a-z-]+(?:\s[a-z-]+){1,2}(?:\s[a-z.-]+)?$/.test(cleaned);
}
