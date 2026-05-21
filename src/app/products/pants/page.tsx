import PantsHero from "@/components/products/pants/PantsHero";
import PantsFeatures from "@/components/products/pants/PantsFeatures";
import PantsStyles from "@/components/products/pants/PantsStyles";

export default function PantsPage() {
  return (
    <div className="bg-white min-h-screen">
      <PantsHero />
      <PantsFeatures />
      <PantsStyles />
    </div>
  );
}
