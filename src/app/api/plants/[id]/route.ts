import { NextRequest, NextResponse } from 'next/server';
import * as trefle from '@/lib/api/trefle';
import * as tropicos from '@/lib/api/tropicos';
import * as gbif from '@/lib/api/gbif';
import * as perenual from '@/lib/api/perenual';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Parse source prefix: "trefle-123" -> source="trefle", actualId="123"
    const dashIndex = id.indexOf('-');
    const source = dashIndex > 0 ? id.substring(0, dashIndex) : 'trefle';
    const actualId = dashIndex > 0 ? id.substring(dashIndex + 1) : id;

    // ── Tropicos detail ──
    if (source === 'tropicos') {
      const nameId = parseInt(actualId, 10);
      if (isNaN(nameId)) {
        return NextResponse.json({ error: 'Invalid Tropicos ID' }, { status: 400 });
      }
      const [detail, images] = await Promise.all([
        tropicos.getNameDetail(nameId),
        tropicos.getNameImages(nameId),
      ]);

      if (!detail) {
        return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
      }

      const photo = images.find((img) => img.ImageKindText === 'Photo (general)');
      const bestImage = photo || images[0];

      const plant = {
        id: `tropicos-${detail.NameId}`,
        slug: detail.ScientificName.toLowerCase().replace(/\s+/g, '-'),
        commonName: null,
        scientificName: detail.ScientificName,
        family: detail.Family || null,
        familyCommonName: null,
        genus: detail.Genus || null,
        imageUrl: bestImage?.DetailJpgUrl || bestImage?.ThumbnailUrl || null,
        year: detail.DisplayDate || null,
        author: detail.Author || null,
        bibliography: detail.DisplayReference || null,
        observations: null,
        vegetable: false,
        edible: false,
        ediblePart: null,
        duration: null,
        status: detail.NomenclatureStatusName || null,
        rank: detail.RankAbbreviation || null,
        source: 'tropicos',
        images: images.length > 0 ? {
          habit: images.filter((i) => i.ShortDescription === 'Habit').map((i) => ({ url: i.DetailJpgUrl })),
          other: images.map((i) => ({ url: i.DetailJpgUrl, caption: i.Caption })),
        } : {},
        flower: {},
        foliage: {},
        fruitOrSeed: {},
        specifications: {},
        growth: {},
        distribution: { native: [], introduced: [] },
        distributions: {},
        commonNames: {},
        synonyms: [],
        sources: [{ name: 'Tropicos', url: `http://www.tropicos.org/Name/${detail.NameId}` }],
      };

      return NextResponse.json({ plant, meta: {} });
    }

    // ── GBIF detail ──
    if (source === 'gbif') {
      const gbifKey = parseInt(actualId, 10);
      if (isNaN(gbifKey)) {
        return NextResponse.json({ error: 'Invalid GBIF key' }, { status: 400 });
      }
      const plantDetail = await gbif.getPhilippinePlantDetail(gbifKey);

      const plant = {
        id: plantDetail.id,
        slug: plantDetail.scientificName.toLowerCase().replace(/\s+/g, '-'),
        commonName: plantDetail.name,
        scientificName: plantDetail.scientificName,
        family: plantDetail.family || null,
        familyCommonName: null,
        genus: plantDetail.genus || null,
        imageUrl: plantDetail.imageUrl || null,
        year: null,
        author: null,
        bibliography: null,
        observations: null,
        vegetable: false,
        edible: false,
        ediblePart: null,
        duration: null,
        status: plantDetail.taxonomicStatus || null,
        rank: plantDetail.rank || null,
        source: 'gbif',
        images: plantDetail.images.length > 0 ? {
          other: plantDetail.images.map((url: string) => ({ url })),
        } : {},
        flower: {},
        foliage: {},
        fruitOrSeed: {},
        specifications: {},
        growth: {},
        distribution: { native: [], introduced: [] },
        distributions: {},
        commonNames: plantDetail.commonNames.length > 0 ? { en: plantDetail.commonNames } : {},
        synonyms: [],
        sources: [{ name: 'GBIF', url: `https://www.gbif.org/species/${gbifKey}` }],
      };

      return NextResponse.json({ plant, meta: {} });
    }

    // ── Perenual detail ──
    if (source === 'perenual') {
      const perenualId = parseInt(actualId, 10);
      if (isNaN(perenualId)) {
        return NextResponse.json({ error: 'Invalid Perenual ID' }, { status: 400 });
      }
      const d = await perenual.getSpeciesDetail(perenualId);

      const plant = {
        id: `perenual-${d.id}`,
        slug: d.scientific_name?.[0]?.toLowerCase().replace(/\s+/g, '-') || String(d.id),
        commonName: d.common_name || null,
        scientificName: d.scientific_name?.[0] || '',
        family: d.family || null,
        familyCommonName: null,
        genus: d.genus || null,
        imageUrl: d.default_image?.medium_url || d.default_image?.thumbnail || null,
        year: null,
        author: null,
        bibliography: null,
        observations: null,
        vegetable: false,
        edible: d.edible || false,
        ediblePart: null,
        duration: d.cycle ? [d.cycle] : null,
        status: null,
        rank: null,
        source: 'perenual',
        images: d.default_image ? {
          other: [{ url: d.default_image.regular_url || d.default_image.medium_url, caption: 'Main image' }],
        } : {},
        flower: d.flowers ? { color: d.flowers.color, conspicuous: d.flowers.conspicuous } : {},
        foliage: d.leaf ? { color: d.leaf.color, texture: d.leaf.texture } : {},
        fruitOrSeed: d.fruit ? { edible: d.fruit.edible } : {},
        specifications: {
          averageHeight: d.dimensions?.max_height != null ? { cm: d.dimensions.max_height * 30.48 } : undefined,
          growth: d.growth_rate || null,
          toxicity: d.poisonous_to_humans ? 'toxic to humans' : d.poisonous_to_pets ? 'toxic to pets' : null,
        },
        growth: {
          light: d.sunlight?.join(', ') || null,
          soil: d.soil?.join(', ') || null,
          watering: d.watering || null,
        },
        distribution: { native: d.origin || [], introduced: [] },
        distributions: {},
        commonNames: {},
        synonyms: [],
        sources: [{ name: 'Perenual', url: `https://perenual.com/plants-database/species/${d.id}` }],
        // Perenual extras
        careLevel: d.care_level || null,
        indoor: d.indoor ?? null,
        maintenance: d.maintenance || null,
        attracts: d.attracts || [],
        hardiness: d.hardiness?.min ? `${d.hardiness.min}–${d.hardiness.max}` : null,
      };

      return NextResponse.json({ plant, meta: {} });
    }

    // ── Trefle detail (default) ──
    let plantData: any;

    try {
      plantData = await trefle.getSpecies(actualId);
    } catch {
      plantData = await trefle.getPlant(actualId);
    }

    const data = plantData.data;

    // Normalize to our PlantDetail shape
    const plant = {
      id: String(data.id),
      slug: data.slug,
      commonName: data.common_name,
      scientificName: data.scientific_name,
      family: data.family || null,
      familyCommonName: data.family_common_name || null,
      genus: data.genus || null,
      imageUrl: data.image_url || null,
      year: data.year,
      author: data.author,
      bibliography: data.bibliography,
      observations: data.observations,
      vegetable: data.vegetable || false,
      edible: data.edible || false,
      ediblePart: data.edible_part,
      duration: data.duration,
      status: data.status,
      rank: data.rank,
      source: source,
      images: data.images || {},
      flower: data.flower || {},
      foliage: data.foliage || {},
      fruitOrSeed: data.fruit_or_seed || {},
      specifications: data.specifications || {},
      growth: data.growth || {},
      distribution: data.distribution || { native: [], introduced: [] },
      distributions: data.distributions || {},
      commonNames: data.common_names || {},
      synonyms: (data.synonyms || []).map((s: any) => s.name || s),
      sources: data.sources || [],
    };

    return NextResponse.json({ plant, meta: plantData.meta });
  } catch (error: any) {
    console.error('Plant detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plant details', message: error.message },
      { status: 500 }
    );
  }
}
