"use client";

import React, { useState } from "react";
import { 
  faShirt, 
  faFire, 
  faCrown,
  faHeart,
  faTags
} from "@fortawesome/free-solid-svg-icons";
import { mockProducts } from "@/data/mockProducts";
import SearchFilterBar from "@/components/products/SearchFilterBar";
import CategoriesGrid from "@/components/products/CategoriesGrid";
import CollectionsGrid from "@/components/products/CollectionsGrid";
import ProductsGrid from "@/components/products/ProductsGrid";
import { useProductStock } from "@/hooks/useProductStock";

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { stock, loading: stockLoading } = useProductStock();

  const categories = [
    {
      id: "polos",
      name: "Polos",
      description: "Estilo y comodidad para tu día a día",
      image: "/images/polo.avif",
      icon: faShirt,
      link: "/products/polos",
      count: mockProducts.length,
      badge: "Más Popular"
    },
    {
      id: "hoodies",
      name: "Hoodies",
      description: "Calidez y estilo urbano",
      image: "/images/hoodie.png",
      icon: faFire,
      link: "/products/hoodies",
      count: 12,
      badge: "Tendencia"
    },
    {
      id: "pants",
      name: "Pantalones",
      description: "Comodidad y versatilidad",
      image: "/images/categoria-pantalones.jpg",
      icon: faTags,
      link: "/products/pants",
      count: 8,
      badge: "Nuevo"
    }
  ];

  const collections = [
    {
      name: "SuperStars",
      description: "Diseños inspirados en los íconos del deporte",
      icon: faCrown,
      image: "/images/superstars/messifront.png",
      link: "/products/polos/superstars",
      products: mockProducts.filter(p => p.collection === "SuperStars").length
    },
    {
      name: "Romantic",
      description: "Prendas perfectas para momentos especiales",
      icon: faHeart,
      image: "/images/girlfriend/girlfriendfrontM.png",
      link: "/products/polos/romantic",
      products: mockProducts.filter(p => p.collection === "Romantic").length
    },
    {
      name: "GYM",
      description: "Rendimiento y estilo para tu entrenamiento",
      icon: faFire,
      image: "/images/gym/gym1.png",
      link: "/products/polos/gym",
      products: mockProducts.filter(p => p.collection === "GYM").length
    }
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <main className="bg-white min-h-screen pt-20">
      <SearchFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
        resultsCount={filteredProducts.length}
      />
      
      <CategoriesGrid categories={categories} />
      
      <CollectionsGrid collections={collections} />
      
      <ProductsGrid products={filteredProducts} viewMode={viewMode} stock={stock} stockLoading={stockLoading} />
    </main>
  );
};

export default ProductsPage;
