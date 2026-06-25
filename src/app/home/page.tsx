"use client";

import React from "react";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage;
