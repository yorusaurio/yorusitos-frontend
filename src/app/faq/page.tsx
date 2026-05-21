"use client";

import { useState } from "react";
import FAQHero from "@/components/faq/FAQHero";
import FAQSearch from "@/components/faq/FAQSearch";
import FAQList from "@/components/faq/FAQList";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-white min-h-screen">
      <FAQHero />
      <FAQSearch onSearch={setSearchQuery} />
      <FAQList searchQuery={searchQuery} />
    </div>
  );
}
