import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getPlantImageFallback(): string {
  return '/images/plant-placeholder.svg';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Plant facts database
export const PLANT_FACTS: { fact: string; plantName: string }[] = [
  { fact: "Bamboo can grow up to 91 cm (35 inches) in a single day, making it the fastest-growing plant on Earth.", plantName: "Bamboo" },
  { fact: "The oldest known tree is a bristlecone pine named Methuselah, estimated to be over 4,850 years old.", plantName: "Bristlecone Pine" },
  { fact: "The Rafflesia arnoldii produces the world's largest flower, measuring up to 1 meter in diameter and weighing up to 11 kg.", plantName: "Rafflesia" },
  { fact: "Sunflowers track the sun across the sky, a behavior called heliotropism.", plantName: "Sunflower" },
  { fact: "The baobab tree can store up to 120,000 liters of water in its trunk.", plantName: "Baobab" },
  { fact: "There are over 300,000 identified plant species on Earth, and new ones are still being discovered.", plantName: "Various" },
  { fact: "The titan arum, also known as the corpse flower, can reach heights of 3 meters and smells like rotting meat.", plantName: "Titan Arum" },
  { fact: "An average tree produces about 260 pounds of oxygen per year — enough for two people.", plantName: "Various Trees" },
  { fact: "The Wollemi Pine was thought to be extinct for 2 million years until it was discovered alive in Australia in 1994.", plantName: "Wollemi Pine" },
  { fact: "The Philippines has over 13,500 plant species, of which about one-third are endemic.", plantName: "Philippine Flora" },
  { fact: "Narra (Pterocarpus dalbergioides) is the national tree of the Philippines, known for its beautiful red hardwood.", plantName: "Narra" },
  { fact: "Mangrove forests act as natural barriers, protecting coastlines from storms and erosion.", plantName: "Mangrove" },
  { fact: "A single mature oak tree can produce 70,000 acorns in one year.", plantName: "Oak" },
  { fact: "The Venus flytrap can snap shut in about 100 milliseconds — one of the fastest movements in the plant kingdom.", plantName: "Venus Flytrap" },
  { fact: "The Amazon Rainforest produces 20% of the world's oxygen.", plantName: "Amazon Flora" },
  { fact: "Sampaguita (Jasminum sambac) is the national flower of the Philippines, celebrated for its sweet fragrance.", plantName: "Sampaguita" },
  { fact: "Trees communicate with each other through underground fungal networks, often called the 'Wood Wide Web.'", plantName: "Forest Trees" },
  { fact: "Coconut palms are called the 'Tree of Life' in the Philippines because every part of the tree is useful.", plantName: "Coconut Palm" },
  { fact: "The world's tallest tree is Hyperion, a coast redwood in California standing at 115.92 meters.", plantName: "Coast Redwood" },
  { fact: "Moss has no roots — it absorbs water and nutrients through its leaves.", plantName: "Moss" },
];

export function getDailyFact(): { fact: string; plantName: string } {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return PLANT_FACTS[dayOfYear % PLANT_FACTS.length];
}

export function getMonthlyPlant(): { name: string; description: string; image: string } {
  const monthlyPlants = [
    { name: "Snowdrop", description: "One of the first flowers to bloom in late winter, symbolizing hope and renewal.", image: "/images/months/january.jpg" },
    { name: "Sampaguita", description: "The national flower of the Philippines, a jasmine known for its intoxicating fragrance.", image: "/images/months/february.jpg" },
    { name: "Cherry Blossom", description: "Symbol of spring's arrival, these delicate pink flowers transform landscapes worldwide.", image: "/images/months/march.jpg" },
    { name: "Narra Tree", description: "The Philippine national tree, prized for its durable red hardwood and nitrogen-fixing roots.", image: "/images/months/april.jpg" },
    { name: "Waling-Waling Orchid", description: "Known as the 'Queen of Philippine Orchids,' found in the forests of Mindanao.", image: "/images/months/may.jpg" },
    { name: "Rafflesia", description: "The world's largest flower, found in Southeast Asian rainforests including the Philippines.", image: "/images/months/june.jpg" },
    { name: "Bamboo", description: "The fastest-growing plant, integral to Asian culture and sustainable construction.", image: "/images/months/july.jpg" },
    { name: "Sunflower", description: "These heliotropic giants can grow up to 3 meters and provide seeds, oil, and beauty.", image: "/images/months/august.jpg" },
    { name: "Coconut Palm", description: "Called the 'Tree of Life' in the Philippines, providing food, shelter, and income.", image: "/images/months/september.jpg" },
    { name: "Banyan Tree", description: "Sacred to many cultures, these massive figs can spread over acres with aerial roots.", image: "/images/months/october.jpg" },
    { name: "Jade Vine", description: "An endangered Philippine endemic with stunning turquoise claw-shaped flowers.", image: "/images/months/november.jpg" },
    { name: "Poinsettia", description: "Native to Central America, these vibrant red plants have become symbols of Christmas.", image: "/images/months/december.jpg" },
  ];
  const month = new Date().getMonth();
  return monthlyPlants[month];
}
