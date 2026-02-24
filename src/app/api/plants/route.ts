import { NextRequest, NextResponse } from 'next/server';
import * as trefle from '@/lib/api/trefle';
import * as gbif from '@/lib/api/gbif';
import * as tropicos from '@/lib/api/tropicos';
import * as perenual from '@/lib/api/perenual';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const family = searchParams.get('family') || '';
  const edible = searchParams.get('edible');
  const distribution = searchParams.get('distribution') || '';
  const source = searchParams.get('source') || '';

  try {
    // ── Tropicos source ──
    if (source === 'tropicos') {
      const result = await tropicos.searchPhilippinePlants(
        query || undefined,
        page,
        20
      );

      return NextResponse.json({
        plants: result.plants,
        meta: { total: result.total },
        links: {},
        source: 'tropicos',
      });
    }

    // ── Perenual source ──
    if (source === 'perenual') {
      const result = await perenual.listSpecies(page, query || undefined);
      const plants = (result.data || []).map((item: any) => ({
        id: `perenual-${item.id}`,
        slug: item.scientific_name?.[0]?.toLowerCase().replace(/\s+/g, '-') || String(item.id),
        name: item.common_name || item.scientific_name?.[0] || 'Unknown',
        scientificName: item.scientific_name?.[0] || '',
        family: null,
        familyCommonName: null,
        imageUrl: item.default_image?.thumbnail || item.default_image?.medium_url || null,
        source: 'perenual',
      }));

      return NextResponse.json({
        plants,
        meta: { total: result.total || plants.length },
        links: {},
        source: 'perenual',
      });
    }

    // ── GBIF source for Philippine plants ──
    if (source === 'gbif' || (distribution === 'PHI' && source !== 'trefle')) {
      try {
        const limit = 20;
        const offset = (page - 1) * limit;
        const gbifResult = await gbif.listPhilippineSpecies(query || undefined, limit, offset);

        const plants = gbif.normalizeGBIFPlants(gbifResult.results);

        return NextResponse.json({
          plants,
          meta: { total: gbifResult.count || 0 },
          links: {},
          source: 'gbif',
        });
      } catch (gbifError) {
        console.warn('GBIF failed, falling back to Trefle:', gbifError);
        // Fall through to Trefle
      }
    }

    // ── Trefle source (default) ──
    let result;

    if (distribution) {
      result = await trefle.listPhilippinePlants(page);
    } else if (query) {
      result = await trefle.searchPlants(query, page);
    } else {
      const filters: Record<string, string> = {};
      if (family) filters.family_name = family;
      if (edible === 'true') filters.edible = 'true';
      result = await trefle.listPlants(page, Object.keys(filters).length ? filters : undefined);
    }

    const plants = (result.data || []).map((plant: any) => ({
      id: String(plant.id),
      slug: plant.slug,
      name: plant.common_name || plant.scientific_name,
      scientificName: plant.scientific_name,
      family: plant.family || plant.family_common_name || null,
      familyCommonName: plant.family_common_name || null,
      imageUrl: plant.image_url || null,
      source: 'trefle',
    }));

    return NextResponse.json({
      plants,
      meta: result.meta || { total: 0 },
      links: result.links || {},
      source: 'trefle',
    });
  } catch (error: any) {
    console.error('Plants API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plants', message: error.message },
      { status: 500 }
    );
  }
}
