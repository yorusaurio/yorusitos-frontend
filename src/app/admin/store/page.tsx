import AdminShell from "@/components/admin/AdminShell";

export default function AdminStorePage() {
  return (
    <AdminShell
      title="Tienda online"
      subtitle="Configuracion comercial visible al cliente: banners, catalogo y conversion."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">Estado de publicacion</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            <li>Home: publicada</li>
            <li>Colecciones: publicadas</li>
            <li>Checkout: en implementacion de pasarela</li>
            <li>Politicas legales: pendiente de aprobacion</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">SEO y performance MVP</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            <li>Meta titulos base definidos.</li>
            <li>Falta sitemap dinamico.</li>
            <li>Falta schema.org para producto.</li>
            <li>Imagenes listas para migrar a CDN.</li>
          </ul>
        </article>
      </section>
    </AdminShell>
  );
}
