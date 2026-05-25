import AdminShell from "@/components/admin/AdminShell";

const settingGroups = [
  {
    title: "Operacion",
    items: ["Moneda: PEN", "Zona horaria: America/Lima", "Canal POS habilitado"],
  },
  {
    title: "Checkout",
    items: ["Metodo de envio local", "Pago contra entrega", "Pasarela online pendiente"],
  },
  {
    title: "Seguridad",
    items: ["RLS en roadmap", "Roles admin/manager/cashier", "Auditoria de cambios pendiente"],
  },
];

export default function AdminSettingsPage() {
  return (
    <AdminShell
      title="Configuracion"
      subtitle="Parametros maestros del ecommerce para operar con consistencia y seguridad."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {settingGroups.map((group) => (
          <article key={group.title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">{group.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
