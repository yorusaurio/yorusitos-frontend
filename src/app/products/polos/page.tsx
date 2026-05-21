import PolosHero from "@/components/products/polos/PolosHero";
import PolosCollections from "@/components/products/polos/PolosCollections";
import PolosBenefits from "@/components/products/polos/PolosBenefits";

export default function PolosPage() {
  return (
    <div className="bg-white min-h-screen">
      <PolosHero />
      <PolosCollections />
      <PolosBenefits />
    </div>
  );
}
