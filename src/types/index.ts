// ── Unified Plant type used across the app ──
export interface Plant {
  id: string;
  slug: string;
  commonName: string | null;
  scientificName: string;
  family: string | null;
  familyCommonName: string | null;
  genus: string | null;
  imageUrl: string | null;
  images: PlantImages;
  year: number | null;
  author: string | null;
  bibliography: string | null;
  observations: string | null;
  vegetable: boolean;
  edible: boolean;
  ediblePart: string[] | null;
  duration: string[] | null;
  status: string | null;
  rank: string | null;
  source: 'trefle' | 'perenual' | 'flora' | 'local';
  sourceId: string | number;
}

export interface PlantImages {
  flower?: ImageEntry[];
  leaf?: ImageEntry[];
  habit?: ImageEntry[];
  fruit?: ImageEntry[];
  bark?: ImageEntry[];
  other?: ImageEntry[];
}

export interface ImageEntry {
  id?: number;
  url: string;
  copyright?: string;
}

export interface PlantDetail extends Plant {
  flower: FlowerInfo;
  foliage: FoliageInfo;
  fruitOrSeed: FruitInfo;
  specifications: SpecificationInfo;
  growth: GrowthInfo;
  distribution: DistributionInfo;
  commonNames: Record<string, string[]>;
  synonyms: string[];
  sources: SourceInfo[];
}

export interface FlowerInfo {
  color: string[] | null;
  conspicuous: boolean | null;
}

export interface FoliageInfo {
  texture: string | null;
  color: string[] | null;
  leafRetention: boolean | null;
}

export interface FruitInfo {
  color: string[] | null;
  conspicuous: boolean | null;
  seedPersistence: boolean | null;
}

export interface SpecificationInfo {
  ligneousType: string | null;
  growthForm: string | null;
  growthHabit: string | null;
  growthRate: string | null;
  averageHeight: MeasurementValue | null;
  maximumHeight: MeasurementValue | null;
  toxicity: string | null;
}

export interface MeasurementValue {
  cm: number | null;
}

export interface GrowthInfo {
  light: number | null;
  atmosphericHumidity: number | null;
  soilNutriments: number | null;
  soilSalinity: number | null;
  soilTexture: number | null;
  soilHumidity: number | null;
  phMinimum: number | null;
  phMaximum: number | null;
  minimumTemperature: MeasurementTemp | null;
  maximumTemperature: MeasurementTemp | null;
  minimumPrecipitation: MeasurementValue | null;
  maximumPrecipitation: MeasurementValue | null;
  bloomMonths: string[] | null;
  growthMonths: string[] | null;
  fruitMonths: string[] | null;
}

export interface MeasurementTemp {
  deg_c: number | null;
}

export interface DistributionInfo {
  native: string[];
  introduced: string[];
}

export interface SourceInfo {
  name: string;
  url: string | null;
  citation: string | null;
  lastUpdate: string | null;
}

// ── API Response Types ──
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    self: string;
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };
  meta: {
    total: number;
  };
}

// ── Trefle specific response types ──
export interface TreflePlantListItem {
  id: number;
  common_name: string | null;
  slug: string;
  scientific_name: string;
  year: number | null;
  bibliography: string | null;
  author: string | null;
  family_common_name: string | null;
  genus_id: number;
  image_url: string | null;
  synonyms: string[];
  genus: string;
  family: string;
  links: { self: string; plant: string; genus: string };
}

// ── Perenual specific types ──
export interface PerenualPlantListItem {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image: {
    license: number;
    license_name: string;
    license_url: string;
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  } | null;
}

// ── News types ──
export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

// ── User types (Supabase) ──
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  plantId: string;
  plantName: string;
  plantImage: string | null;
  plantScientificName: string;
  category: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  plantId: string;
  plantName: string;
  plantImage: string | null;
  plantScientificName: string;
  createdAt: string;
}

// ── Plant facts ──
export interface PlantFact {
  id: string;
  fact: string;
  plantName: string;
  plantImage: string | null;
  source: string | null;
}

// ── Search & Filter ──
export interface SearchFilters {
  query: string;
  family: string | null;
  edible: boolean | null;
  distribution: string | null;
  growthHabit: string | null;
  page: number;
}
