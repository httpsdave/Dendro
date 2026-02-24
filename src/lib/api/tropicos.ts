// Tropicos API service (Missouri Botanical Garden)
// Docs: https://services.tropicos.org/help

const TROPICOS_BASE = 'https://services.tropicos.org';
const TROPICOS_KEY = process.env.TROPICOS_API_KEY || '';

// ── Types ──

export interface TropicosName {
  NameId: number;
  ScientificName: string;
  ScientificNameWithAuthors: string;
  Family: string;
  RankAbbreviation: string;
  NomenclatureStatusName: string;
  NomenclatureStatusID?: number;
  Symbol?: string;
  Author: string;
  DisplayReference: string;
  DisplayDate: string;
  TotalRows: number;
}

export interface TropicosNameDetail {
  NameId: number;
  ScientificName: string;
  ScientificNameWithAuthors: string;
  Family: string;
  Genus: string;
  SpecificEpithet?: string;
  RankAbbreviation: string;
  NomenclatureStatusName: string;
  Author: string;
  DisplayReference: string;
  DisplayDate: string;
  Basionym?: string;
  BasionymAuthor?: string;
  Citation?: string;
  Source?: string;
}

export interface TropicosImage {
  ImageId: number;
  NameId: number;
  NameText: string;
  Caption: string;
  ShortDescription?: string;
  LongDescription?: string;
  ImageKindText: string;
  Copyright: string;
  LicenseName: string;
  Photographer?: string;
  ThumbnailUrl: string;
  DetailUrl: string;
  DetailJpgUrl: string;
}

export interface TropicosSynonym {
  SynonymId?: number;
  SynonymName?: {
    NameId: number;
    ScientificName: string;
    ScientificNameWithAuthors: string;
    Family: string;
  };
  AcceptedName?: {
    NameId: number;
    ScientificName: string;
    ScientificNameWithAuthors: string;
    Family: string;
  };
}

// ── Core fetch ──

async function tropicosFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TROPICOS_KEY) {
    throw new Error('Tropicos API key not configured');
  }

  const url = new URL(`${TROPICOS_BASE}${endpoint}`);
  url.searchParams.set('apikey', TROPICOS_KEY);
  url.searchParams.set('format', 'json');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Tropicos API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── API Methods ──

/** Search for plant names (wildcard search) */
export async function searchNames(
  name: string,
  options: { type?: 'wildcard' | 'exact'; startRow?: number; pageSize?: number } = {}
): Promise<TropicosName[]> {
  const params: Record<string, string> = {
    name,
    type: options.type || 'wildcard',
  };
  if (options.startRow) params.startrow = String(options.startRow);
  if (options.pageSize) params.pagesize = String(options.pageSize);

  const result = await tropicosFetch<TropicosName[] | { Error?: string }>('/Name/Search', params);

  // API returns an error object when no results found
  if (!Array.isArray(result)) return [];

  // Filter to only species rank entries for cleaner results
  return result.filter(
    (n) => n.RankAbbreviation === 'sp.' || n.RankAbbreviation === 'var.' || n.RankAbbreviation === 'subsp.'
  );
}

/** Get detailed info for a specific name */
export async function getNameDetail(nameId: number): Promise<TropicosNameDetail | null> {
  try {
    return await tropicosFetch<TropicosNameDetail>(`/Name/${nameId}`);
  } catch {
    return null;
  }
}

/** Get images for a specific name */
export async function getNameImages(nameId: number): Promise<TropicosImage[]> {
  try {
    const result = await tropicosFetch<TropicosImage[] | { Error?: string }>(`/Name/${nameId}/Images`);
    if (!Array.isArray(result)) return [];
    return result;
  } catch {
    return [];
  }
}

/** Get synonyms for a specific name */
export async function getSynonyms(nameId: number): Promise<TropicosSynonym[]> {
  try {
    const result = await tropicosFetch<TropicosSynonym[] | { Error?: string }>(
      `/Name/${nameId}/Synonyms`
    );
    if (!Array.isArray(result)) return [];
    return result;
  } catch {
    return [];
  }
}

/** Get accepted names for a specific name */
export async function getAcceptedNames(nameId: number): Promise<TropicosSynonym[]> {
  try {
    const result = await tropicosFetch<TropicosSynonym[] | { Error?: string }>(
      `/Name/${nameId}/AcceptedNames`
    );
    if (!Array.isArray(result)) return [];
    return result;
  } catch {
    return [];
  }
}

// ── Philippine-focused searches ──

/** Well-known Philippine plant families and genera to search for */
const PH_PLANT_QUERIES = [
  // Trees
  'Pterocarpus indicus', // Narra (national tree)
  'Shorea', // Lauan / Philippine Mahogany 
  'Vitex parviflora', // Molave
  'Intsia bijuga', // Ipil
  'Afzelia rhomboidea', // Tindalo
  'Toona calantas', // Kalantas
  'Diospyros philippinensis', // Kamagong
  'Agathis philippinensis', // Almaciga
  // Flowers
  'Jasminum sambac', // Sampaguita (national flower)
  'Vanda sanderiana', // Waling-Waling
  'Medinilla magnifica', // Philippine orchid
  'Rafflesia', // Rafflesia
  // Grasses & Palms
  'Bambusa', // Bamboo
  'Cocos nucifera', // Coconut
  'Oryza sativa', // Rice
  // Ferns & Mosses
  'Cyathea', // Tree fern
  'Platycerium', // Staghorn fern
  // Vines
  'Strongylodon macrobotrys', // Jade Vine
  // Medicinal
  'Lagerstroemia speciosa', // Banaba
  'Moringa oleifera', // Malunggay
  'Vitex negundo', // Lagundi
];

/** Search for Philippine plants (curated list with images) */
export async function searchPhilippinePlants(
  query?: string,
  page = 1,
  pageSize = 20
): Promise<{ plants: NormalizedPlant[]; total: number }> {
  if (query) {
    // Direct search
    const startRow = (page - 1) * pageSize + 1;
    const names = await searchNames(query, { type: 'wildcard', startRow, pageSize });
    const plants = await enrichWithImages(names.slice(0, pageSize));
    return {
      plants,
      total: names.length > 0 ? names[0].TotalRows || names.length : 0,
    };
  }

  // Browse curated PH plants
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const queries = PH_PLANT_QUERIES.slice(startIdx, endIdx);

  if (queries.length === 0) {
    return { plants: [], total: PH_PLANT_QUERIES.length };
  }

  // Search each query in parallel
  const searchResults = await Promise.allSettled(
    queries.map((q) => searchNames(q, { type: 'wildcard', pageSize: 1 }))
  );

  const topResults: TropicosName[] = [];
  for (const result of searchResults) {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      topResults.push(result.value[0]);
    }
  }

  const plants = await enrichWithImages(topResults);
  return { plants, total: PH_PLANT_QUERIES.length };
}

// ── Helpers ──

export interface NormalizedPlant {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  family: string | null;
  familyCommonName: string | null;
  imageUrl: string | null;
  source: string;
  tropicosId?: number;
}

/** Enrich names with best available image */
async function enrichWithImages(names: TropicosName[]): Promise<NormalizedPlant[]> {
  const imageResults = await Promise.allSettled(names.map((n) => getNameImages(n.NameId)));

  return names.map((name, i) => {
    let imageUrl: string | null = null;
    if (imageResults[i].status === 'fulfilled') {
      const images = (imageResults[i] as PromiseFulfilledResult<TropicosImage[]>).value;
      // Prefer photo over herbarium specimen
      const photo = images.find((img) => img.ImageKindText === 'Photo (general)');
      const bestImage = photo || images[0];
      if (bestImage) {
        imageUrl = bestImage.DetailJpgUrl || bestImage.ThumbnailUrl || null;
      }
    }

    return {
      id: `tropicos-${name.NameId}`,
      slug: name.ScientificName.toLowerCase().replace(/\s+/g, '-'),
      name: name.ScientificName,
      scientificName: name.ScientificNameWithAuthors || name.ScientificName,
      family: name.Family || null,
      familyCommonName: null,
      imageUrl,
      source: 'tropicos',
      tropicosId: name.NameId,
    };
  });
}
