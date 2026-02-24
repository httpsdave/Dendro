// Trefle.io API service — server-side only (token stays secret)
const TREFLE_BASE = 'https://trefle.io/api/v1';
const TREFLE_TOKEN = process.env.TREFLE_API_TOKEN!;

interface TrefleRequestOptions {
  page?: number;
  filters?: Record<string, string>;
  sort?: string;
  q?: string;
}

async function trefleFetch<T>(endpoint: string, opts: TrefleRequestOptions = {}): Promise<T> {
  const url = new URL(`${TREFLE_BASE}${endpoint}`);
  url.searchParams.set('token', TREFLE_TOKEN);

  if (opts.page) url.searchParams.set('page', String(opts.page));
  if (opts.q) url.searchParams.set('q', opts.q);
  if (opts.sort) url.searchParams.set('order[' + opts.sort + ']', 'asc');
  if (opts.filters) {
    for (const [key, value] of Object.entries(opts.filters)) {
      url.searchParams.set(`filter[${key}]`, value);
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`Trefle API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function listPlants(page = 1, filters?: Record<string, string>) {
  return trefleFetch<any>('/plants', { page, filters });
}

export async function searchPlants(query: string, page = 1) {
  return trefleFetch<any>('/plants/search', { q: query, page });
}

export async function getPlant(idOrSlug: string | number) {
  return trefleFetch<any>(`/plants/${idOrSlug}`);
}

export async function getSpecies(idOrSlug: string | number) {
  return trefleFetch<any>(`/species/${idOrSlug}`);
}

export async function searchSpecies(query: string, page = 1) {
  return trefleFetch<any>('/species/search', { q: query, page });
}

export async function listSpecies(page = 1, filters?: Record<string, string>) {
  return trefleFetch<any>('/species', { page, filters });
}

export async function listDistributions(page = 1) {
  return trefleFetch<any>('/distributions', { page });
}

export async function getDistributionZone(zoneId: string) {
  return trefleFetch<any>(`/distributions/${zoneId}`);
}

// Philippines TDWG code is "PHI"
export async function listPhilippinePlants(page = 1) {
  return trefleFetch<any>(`/distributions/PHI/plants`, { page });
}

export async function listFamilies(page = 1) {
  return trefleFetch<any>('/families', { page });
}

export async function getFamily(idOrSlug: string | number) {
  return trefleFetch<any>(`/families/${idOrSlug}`);
}

export async function listGenus(page = 1) {
  return trefleFetch<any>('/genus', { page });
}

export async function getGenus(idOrSlug: string | number) {
  return trefleFetch<any>(`/genus/${idOrSlug}`);
}
