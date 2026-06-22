"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockProducts } from "@/data/mockProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHeart,
  faShare,
  faTimes,
  faExpand,
  faStar,
  faShieldAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { findVariantStock } from "@/lib/product-stock";
import { useProductStock } from "@/hooks/useProductStock";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { stock, loading: stockLoading } = useProductStock();
  const productStock = product ? stock[product.id] : undefined;
  const selectedVariantStock = findVariantStock(productStock, selectedColor, selectedSize);
  const availableUnits = selectedVariantStock?.available ?? productStock?.available ?? 0;
  const stockKnown = Boolean(productStock);
  const canBuy = Boolean(selectedColor && selectedSize && !stockLoading && stockKnown && availableUnits > 0);

  const filteredProducts = product
    ? mockProducts.filter(
        (relatedProduct) =>
          relatedProduct.collection === product.collection &&
          relatedProduct.id !== product.id
      )
    : [];

  useEffect(() => {
    const productId = Number(params.id);
    const foundProduct = mockProducts.find((p) => p.id === productId);

    setProduct(foundProduct);

    if (foundProduct) {
      setSelectedColor(foundProduct.colors?.[0] || null);
      setSelectedSize(foundProduct.sizes?.[0] || null);
      setCurrentImage(foundProduct.images?.[0] || null);
    }
  }, [params]);

  const handleOpenModal = (image: string) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleCloseModal();
    }
  };

  const colorMap: { [key: string]: string } = {
    rojo: "#EF4444",
    blanco: "#FFFFFF",
    negro: "#1F2937",
    azul: "#3B82F6",
    amarillo: "#EAB308",
    verde: "#10B981",
    naranja: "#F97316",
    morado: "#A855F7",
    rosa: "#EC4899",
    marrón: "#A3782A",
    gris: "#6B7280",
    celeste: "#0EA5E9",
    dorado: "#F59E0B",
    plateado: "#9CA3AF",
    violeta: "#8B5CF6",
    aqua: "#06B6D4",
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  const goToCheckout = () => {
    if (!canBuy) return;

    const checkoutParams = new URLSearchParams({
      productId: String(product.id),
      color: selectedColor || "",
      size: selectedSize || "",
      quantity: String(quantity),
    });

    router.push(`/checkout?${checkoutParams.toString()}`);
  };

  useEffect(() => {
    if (stockKnown && availableUnits > 0 && quantity > availableUnits) {
      setQuantity(availableUnits);
    }
  }, [availableUnits, quantity, stockKnown]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Producto no encontrado
          </h1>
          <p className="text-gray-600 mb-8">
            El producto que buscas no existe o ha sido movido.
          </p>
          <button
            className="bg-black text-white px-8 py-4 font-semibold hover:bg-gray-800 transition-all duration-300"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header con botón de volver */}
      <div className="sticky top-16 z-50 bg-white border-b-2 border-black shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors font-bold"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 border-2 border-black transition-all duration-300 ${
                isFavorite
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faHeart} className="text-lg" />
            </button>
            <button
              onClick={shareProduct}
              className="p-3 border-2 border-black bg-white text-black hover:bg-gray-100 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faShare} className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Galería de imágenes */}
          <div className="space-y-6">
            <div className="relative group">
              <div
                className="relative overflow-hidden border-2 border-black cursor-pointer bg-white"
                style={{ aspectRatio: "1/1" }}
                onClick={() => handleOpenModal(currentImage || product.images[0])}
              >
                <img
                  src={currentImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <button className="absolute top-4 right-4 bg-black text-white p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800">
                  <FontAwesomeIcon
                    icon={faExpand}
                    className="text-lg"
                  />
                </button>
              </div>

              {/* Indicador de nuevo */}
              <div className="absolute top-4 left-4 bg-black text-white px-4 py-2 text-sm font-bold">
                {stockLoading ? "VALIDANDO STOCK" : stockKnown && availableUnits <= 0 ? "SIN STOCK" : "NUEVO"}
              </div>
            </div>

            {/* Miniaturas */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: string, index: number) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                    currentImage === img
                      ? "border-black"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  onClick={() => setCurrentImage(img)}
                >
                  <img
                    src={img}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="space-y-8">
            {/* Info básica */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="text-sm text-black" />
                ))}
                <span className="text-gray-600 text-sm ml-2">(125 reseñas)</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-black leading-tight">
                {product.name}
              </h1>

              <p className="text-lg text-gray-700 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-black">
                  S/ {product.price.toFixed(2)}
                </span>
                {stockKnown ? (
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${availableUnits > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {availableUnits > 0 ? `${availableUnits} disponibles` : "Sin stock"}
                  </span>
                ) : stockLoading ? (
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-zinc-600">Validando stock</span>
                ) : null}
              </div>
            </div>

            {/* Selección de colores */}
            <div className="space-y-4 pb-6 border-b-2 border-gray-200">
              <h3 className="text-lg font-bold text-black uppercase tracking-wider">
                Color:{" "}
                <span className="font-black">{selectedColor}</span>
              </h3>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color: string) => {
                  const cssColor = colorMap[color.toLowerCase()] || color.toLowerCase();
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      className={`relative w-14 h-14 border-2 transition-all duration-300 ${
                        isSelected
                          ? "border-black scale-105"
                          : "border-gray-400 hover:border-gray-600"
                      }`}
                      style={{ backgroundColor: cssColor }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {cssColor === "#FFFFFF" && (
                        <div className="absolute inset-1 border border-gray-300" />
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className={`text-xl ${
                              cssColor === "#FFFFFF" ? "text-black" : "text-white"
                            }`}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selección de tallas */}
            <div className="space-y-4 pb-6 border-b-2 border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-black uppercase tracking-wider">
                  Talla:{" "}
                  <span className="font-black">{selectedSize}</span>
                </h3>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-sm font-bold underline hover:no-underline transition-all"
                >
                  Guía de tallas
                </button>
              </div>
              
              {showSizeGuide && (
                <div className="bg-gray-50 border-2 border-black p-6 space-y-4">
                  <h4 className="font-bold text-lg mb-4">Tabla de Medidas (cm)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-black">
                          <th className="py-2 px-4 text-left font-bold">Talla</th>
                          <th className="py-2 px-4 text-left font-bold">Pecho</th>
                          <th className="py-2 px-4 text-left font-bold">Largo</th>
                          <th className="py-2 px-4 text-left font-bold">Ancho</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-300">
                          <td className="py-2 px-4 font-semibold">XS</td>
                          <td className="py-2 px-4">88-92</td>
                          <td className="py-2 px-4">68-70</td>
                          <td className="py-2 px-4">44-46</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-2 px-4 font-semibold">S</td>
                          <td className="py-2 px-4">92-96</td>
                          <td className="py-2 px-4">70-72</td>
                          <td className="py-2 px-4">46-48</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-2 px-4 font-semibold">M</td>
                          <td className="py-2 px-4">96-100</td>
                          <td className="py-2 px-4">72-74</td>
                          <td className="py-2 px-4">48-50</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-2 px-4 font-semibold">L</td>
                          <td className="py-2 px-4">100-104</td>
                          <td className="py-2 px-4">74-76</td>
                          <td className="py-2 px-4">50-52</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-2 px-4 font-semibold">XL</td>
                          <td className="py-2 px-4">104-108</td>
                          <td className="py-2 px-4">76-78</td>
                          <td className="py-2 px-4">52-54</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-semibold">2XL</td>
                          <td className="py-2 px-4">108-112</td>
                          <td className="py-2 px-4">78-80</td>
                          <td className="py-2 px-4">54-56</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-600 mt-4">
                    * Las medidas pueden variar ligeramente según el diseño. Para mayor precisión, contáctanos por WhatsApp.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    disabled={stockKnown && (findVariantStock(productStock, selectedColor, size)?.available ?? 0) <= 0}
                    className={`py-3 px-4 border-2 font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div className="space-y-4 pb-6 border-b-2 border-gray-200">
              <h3 className="text-lg font-bold text-black uppercase tracking-wider">Cantidad</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-black">
                  <button
                    className="px-6 py-3 font-bold hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
                    disabled={quantity <= 1}
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-6 py-3 min-w-[60px] text-center font-bold border-x-2 border-black">
                    {quantity}
                  </span>
                  <button
                    className="px-6 py-3 font-bold hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
                    disabled={stockKnown && quantity >= availableUnits}
                    onClick={() => setQuantity((current) => (stockKnown ? Math.min(availableUnits, current + 1) : current + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Beneficios */}
            <div className="flex items-center gap-3 p-4 border-2 border-black">
              <FontAwesomeIcon icon={faCheckCircle} className="text-black text-2xl" />
              <div>
                <p className="font-bold text-black">Calidad Premium</p>
                <p className="text-sm text-gray-600">Materiales certificados de primera</p>
              </div>
            </div>

            {/* Botón de WhatsApp */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={goToCheckout}
                disabled={!canBuy}
                className={`w-full py-5 px-6 text-lg font-bold transition-all duration-300 ${
                  canBuy
                    ? "bg-zinc-950 text-white hover:bg-zinc-800"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                {stockLoading ? "VALIDANDO STOCK..." : stockKnown && availableUnits <= 0 ? "SIN STOCK" : "CONTINUAR AL CHECKOUT"}
              </button>

              <a
                href={`https://wa.me/51975885868?text=${encodeURIComponent(
                  `¡Hola! Estoy interesado en el producto: ${product.name}\nColor: ${selectedColor || "No seleccionado"}\nTalla: ${selectedSize || "No seleccionada"}\nCantidad: ${quantity} unidad${
                    quantity > 1 ? "es" : ""
                  }`
                )}`}
                className={`w-full flex items-center justify-center gap-3 py-5 px-6 text-lg font-bold transition-all duration-300 ${
                  canBuy
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  pointerEvents: canBuy ? "auto" : "none",
                }}
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
                COMPRAR POR WHATSAPP
              </a>

              {stockKnown && availableUnits <= 0 ? (
                <p className="text-center text-sm font-semibold text-red-600">
                  Esta variante esta sin stock. Prueba otro color o talla.
                </p>
              ) : (!selectedColor || !selectedSize) && (
                <p className="text-center text-sm text-gray-600 font-semibold">
                  Selecciona color y talla para continuar
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal de imagen */}
        {isModalOpen && modalImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={handleBackdropClick}
          >
            <div className="relative w-11/12 max-w-4xl">
              <button
                className="absolute -top-12 right-0 text-white text-2xl font-bold bg-white/20 hover:bg-white/30 w-12 h-12 flex items-center justify-center transition-all duration-300"
                onClick={handleCloseModal}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <img
                src={modalImage}
                alt="Imagen ampliada"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Descripción detallada */}
        <div className="bg-white border-2 border-black p-8 mb-16">
          <h3 className="text-2xl font-black text-black mb-6 uppercase tracking-wider">
            Descripción del Producto
          </h3>
          <div className="prose prose-lg max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
              {product.detailedDescription}
            </pre>
          </div>
        </div>

        {/* Productos relacionados */}
        {filteredProducts.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-black text-center uppercase tracking-wider">
              También te puede interesar
            </h3>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop
              className="!pb-12"
            >
              {filteredProducts.map((relatedProduct) => (
                <SwiperSlide key={relatedProduct.id}>
                  <div
                    className="bg-white border-2 border-black overflow-hidden cursor-pointer transition-all duration-300 hover:border-gray-600 group"
                    onClick={() => router.push(`/products/${relatedProduct.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-black line-clamp-2">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-black font-black text-lg">
                        S/ {relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}
