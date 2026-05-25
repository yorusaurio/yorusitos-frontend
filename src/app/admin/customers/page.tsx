import AdminShell from "@/components/admin/AdminShell";

const segments = [
  { name: "Nuevos (30 dias)", total: 42 },
  { name: "Recurrentes", total: 18 },
  { name: "Alto valor", total: 7 },
];

export default function AdminCustomersPage() {
  return (
    <AdminShell
      title="Clientes"
      subtitle="Segmentacion, recurrencia y valor para crecer el MVP con CRM basico."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {segments.map((segment) => (
          <article key={segment.name} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">{segment.name}</p>
            <p className="mt-2 text-3xl font-black">{segment.total}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold">Clientes destacados</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="py-2">Cliente</th>
                <th className="py-2">Ordenes</th>
                <th className="py-2">LTV</th>
                <th className="py-2">Ultima compra</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-zinc-100"><td className="py-2">Lucia R.</td><td className="py-2">8</td><td className="py-2">S/ 620</td><td className="py-2">Hace 3 dias</td></tr>
              <tr className="border-t border-zinc-100"><td className="py-2">Mario S.</td><td className="py-2">5</td><td className="py-2">S/ 410</td><td className="py-2">Hace 5 dias</td></tr>
              <tr className="border-t border-zinc-100"><td className="py-2">Elena V.</td><td className="py-2">4</td><td className="py-2">S/ 355</td><td className="py-2">Hace 1 semana</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
