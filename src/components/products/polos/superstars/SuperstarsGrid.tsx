"use client";

import Link from "next/link";
import React from "react";

interface SuperstarsProduct {
	id: number;
	name: string;
	description: string;
	price: number;
	images: string[];
	collection: string;
	available: boolean;
}

interface SuperstarsGridProps {
	products: SuperstarsProduct[];
}

const SuperstarsGrid: React.FC<SuperstarsGridProps> = ({ products }) => {
	if (products.length === 0) {
		return (
			<section className="py-20 bg-white">
				<div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
					<h3 className="text-2xl font-bold text-black">No se encontraron productos</h3>
					<p className="mt-2 text-gray-600">Prueba ajustando los filtros del catálogo.</p>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{products.map((product) => (
						<Link key={product.id} href={`/products/${product.id}`}>
							<article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
								<div className="aspect-[3/4] overflow-hidden bg-zinc-100">
									<img
										src={product.images[0]}
										alt={product.name}
										className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								</div>
								<div className="space-y-2 p-4">
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{product.collection}</p>
									<h3 className="text-lg font-bold text-zinc-900">{product.name}</h3>
									<p className="line-clamp-2 text-sm text-zinc-600">{product.description}</p>
									<div className="flex items-center justify-between pt-2">
										<span className="text-xl font-bold text-zinc-900">S/ {product.price.toFixed(2)}</span>
										<span className={[
											"rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
											product.available ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
										].join(" ")}>
											{product.available ? "Disponible" : "Agotado"}
										</span>
									</div>
								</div>
							</article>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

export default SuperstarsGrid;
