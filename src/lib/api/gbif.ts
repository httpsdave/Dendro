// GBIF (Global Biodiversity Information Facility) API service
// Docs: https://www.gbif.org/developer/summary

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

  const images = mediaRes.results
    .filter((m) => m.type === 'StillImage' && m.identifier)
    .map((m) => m.identifier);

  const commonNames = namesRes.results
    .filter((n) => n.language === 'eng' || !n.language)
    .map((n) => n.vernacularName);

  return {
    id: `gbif-${species.key}`,
    gbifKey: species.key,
    name: commonNames[0] || species.canonicalName || species.scientificName,
    scientificName: species.scientificName,
    canonicalName: species.canonicalName,
    family: species.family || null,
    genus: species.genus || null,
    kingdom: species.kingdom,
    imageUrl: images[0] || null,
    images,
    commonNames,
    rank: species.rank,
    taxonomicStatus: species.taxonomicStatus,
    source: 'gbif' as const,
  };
}

// Normalize GBIF species results to match our Plant interface
export function normalizeGBIFPlants(
  results: GBIFSpecies[]
): Array<{
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  family: string | null;
  familyCommonName: string | null;
  imageUrl: string | null;
  source: string;
}> {
  return results
    .filter((sp) => sp.canonicalName || sp.scientificName)
    .map((sp) => ({
      id: `gbif-${sp.key}`,
      slug: (sp.canonicalName || sp.scientificName).toLowerCase().replace(/\s+/g, '-'),
      name: sp.vernacularName || sp.canonicalName || sp.scientificName,
      scientificName: sp.scientificName,
      family: sp.family || null,
      familyCommonName: null,
      imageUrl: null, // GBIF species search doesn't include media; needs separate call
      source: 'gbif',
    }));
}
