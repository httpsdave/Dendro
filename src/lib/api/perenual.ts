// Perenual API service
const PERENUAL_BASE = 'https://perenual.com/api';
const PERENUAL_KEY = process.env.PERENUAL_API_KEY || '';

async function perenualFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${PERENUAL_BASE}${endpoint}`);
  url.searchParams.set('key', PERENUAL_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Perenual API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function listSpecies(page = 1, query?: string) {
  const params: Record<string, string> = { page: String(page) };
  if (query) params.q = query;
  return perenualFetch<any>('/v2/species-list', params);
}

export async function getSpeciesDetail(id: number) {
  return perenualFetch<any>(`/v2/species/details/${id}`);
}

export async function listDiseases(page = 1, query?: string) {
  const params: Record<string, string> = { page: String(page) };
  if (query) params.q = query;
  return perenualFetch<any>('/pest-disease-list', params);
}

export async function listCareGuides(page = 1, speciesId?: number) {
  const params: Record<string, string> = { page: String(page) };
  if (speciesId) params.species_id = String(speciesId);
  return perenualFetch<any>('/species-care-guide-list', params);
}
