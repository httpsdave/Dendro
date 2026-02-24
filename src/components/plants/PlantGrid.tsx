'use client';

import PlantCard from './PlantCard';

interface PlantGridProps {
  plants: {
    id: string;
    name?: string;
    commonName?: string | null;
    scientificName: string;
    imageUrl: string | null;
    family: string | null;
    source?: string;
  }[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-forest-100">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="h-3 skeleton rounded w-1/4 mt-3" />
      </div>
    </div>
  );
}

export default function PlantGrid({ plants, loading }: PlantGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-forest-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="font-display text-lg text-forest-700 mb-2">No plants found</h3>
        <p className="text-sm text-forest-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {plants.map((plant, index) => (
        <PlantCard
          key={`${plant.source}-${plant.id}`}
          id={plant.id}
          name={plant.name || plant.commonName || plant.scientificName}
          scientificName={plant.scientificName}
          imageUrl={plant.imageUrl}
          family={plant.family}
          source={plant.source}
          index={index}
        />
      ))}
    </div>
  );
}
