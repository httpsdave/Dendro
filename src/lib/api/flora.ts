// Flora API service (flora.kindwise.com / previously plant.id)
const FLORA_BASE = 'https://plant.id/api/v3';
const FLORA_API_KEY = process.env.FLORA_API_KEY || '';

async function floraFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${FLORA_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': FLORA_API_KEY,
      ...options.headers,
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Flora API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function identifyPlant(imageBase64: string) {
  return floraFetch<any>('/identification', {
    method: 'POST',
    body: JSON.stringify({
      images: [imageBase64],
      similar_images: true,
    }),
  });
}

export async function getPlantDetail(accessToken: string) {
  return floraFetch<any>(`/identification/${accessToken}`);
}

export async function searchByName(query: string) {
  return floraFetch<any>(`/kb/plants/name_search?q=${encodeURIComponent(query)}`);
}
