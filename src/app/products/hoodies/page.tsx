import HoodiesHero from "@/components/products/hoodies/HoodiesHero";
import HoodiesFeatures from "@/components/products/hoodies/HoodiesFeatures";
import HoodiesCollections from "@/components/products/hoodies/HoodiesCollections";

export default function HoodiesPage() {
  return (
    <div className="bg-white min-h-screen">
      <HoodiesHero />
      <HoodiesFeatures />
      <HoodiesCollections />
    </div>
  );
}
