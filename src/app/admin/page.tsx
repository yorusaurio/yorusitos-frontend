import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";

const kpis = [
  {
    label: "Ventas hoy",
    value: "S/ 2,980",
    delta: "+12.4%",
    note: "vs ayer",
    tone: "success",
  },
  {
    label: "Pedidos activos",
    value: "17",
    delta: "5 urgentes",
    note: "por despachar",
    tone: "warning",
  },
  {
    label: "Ticket promedio",
    value: "S/ 78",
    delta: "+4.1%",
    note: "meta S/ 85",
    tone: "neutral",
  },
  {
    label: "Stock critico",
    value: "9 SKU",
    delta: "3 nuevos",
    note: "necesitan compra",
    tone: "danger",
  },
  {
    label: "Tasa de conversion",
    value: "2.9%",
    delta: "+0.3pp",
    note: "ultima semana",
    tone: "success",
  },
  {
    label: "Abandono checkout",
    value: "41%",
    delta: "-2.0pp",
    note: "mejor que semana pasada",
    tone: "success",
  },
];

const dailyRevenue = [1200, 1580, 1420, 1720, 2290, 1980, 2650, 2420, 2980];
const dailyLabels = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom", "Lun", "Hoy"];

const channelShare = [
  { name: "Online", value: 62, color: "#111827" },
  { name: "POS", value: 28, color: "#ca8a04" },
  { name: "WhatsApp", value: 10, color: "#059669" },
];

const funnelData = [
  { stage: "Visitas", value: 12840, percentage: 100 },
  { stage: "Producto visto", value: 4810, percentage: 37.5 },
  { stage: "Anadido al carrito", value: 1190, percentage: 9.3 },
  { stage: "Checkout", value: 530, percentage: 4.1 },
  { stage: "Compra", value: 372, percentage: 2.9 },
];

const topProducts = [
  { name: "Cristiano v6", units: 44, revenue: 1540 },
  { name: "Messi v7", units: 39, revenue: 1365 },
  { name: "Neymar v2", units: 28, revenue: 980 },
  { name: "Girlfriend v5", units: 25, revenue: 875 },
  { name: "Todo sea por las senoras", units: 23, revenue: 805 },
];

const alerts = [
  {
    title: "Reposicion urgente",
    detail: "POL-GYM-NEG-M con 2 unidades disponibles.",
    actionHref: "/admin/inventory",
    actionLabel: "Ir a inventario",
  },
  {
    title: "Pedidos por vencer SLA",
    detail: "4 pedidos superan 18 horas sin despacho.",
    actionHref: "/admin/orders",
    actionLabel: "Revisar pedidos",
  },
  {
    title: "Checkout con friccion",
    detail: "Metodo de pago online no esta habilitado.",
    actionHref: "/admin/settings",
    actionLabel: "Configurar pagos",
  },
];

const quickActions = [
  { href: "/admin/pos", label: "Nueva venta POS" },
  { href: "/admin/orders", label: "Gestionar pedidos" },
  { href: "/admin/inventory", label: "Actualizar stock" },
  { href: "/admin/store", label: "Editar tienda online" },
  { href: "/admin/contacts", label: "Responder contactos" },
  { href: "/admin/customers", label: "Segmentar clientes" },
];

function getToneClasses(tone: "success" | "warning" | "danger" | "neutral") {
  if (tone === "success") return "text-emerald-700 bg-emerald-50";
  if (tone === "warning") return "text-amber-700 bg-amber-50";
  if (tone === "danger") return "text-red-700 bg-red-50";
  return "text-zinc-700 bg-zinc-100";
}

function TrendLineChart() {
  const maxValue = Math.max(...dailyRevenue);
  const width = 700;
  const height = 240;
  const points = dailyRevenue
    .map((value, index) => {
      const x = (index / (dailyRevenue.length - 1)) * (width - 40) + 20;
      const y = height - (value / maxValue) * (height - 40) - 20;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Tendencia de ventas (9 dias)</h3>
          <p className="text-sm text-zinc-600">Monitorea crecimiento diario para decidir campanas y reposicion.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">+19.6% acumulado</span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[240px] w-full min-w-[680px]" role="img" aria-label="Grafica de tendencia de ventas">
          <defs>
            <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#111827" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#111827" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((step) => {
            const y = 20 + (step * (height - 40)) / 3;
            return <line key={step} x1="20" y1={y} x2={width - 20} y2={y} stroke="#e4e4e7" strokeDasharray="4 4" />;
          })}
          <polyline fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />
          <polygon points={`${points} ${width - 20},${height - 20} 20,${height - 20}`} fill="url(#lineFill)" />
          {dailyRevenue.map((value, index) => {
            const x = (index / (dailyRevenue.length - 1)) * (width - 40) + 20;
            const y = height - (value / maxValue) * (height - 40) - 20;
            return (
              <g key={dailyLabels[index]}>
                <circle cx={x} cy={y} r="5" fill="#111827" />
                <text x={x} y={height - 4} textAnchor="middle" className="fill-zinc-500 text-[11px]">
                  {dailyLabels[index]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function ChannelChart() {
  const gradient = `conic-gradient(${channelShare
    .map((item, index) => {
      const start = channelShare.slice(0, index).reduce((acc, current) => acc + current.value, 0);
      const end = start + item.value;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ")})`;

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold">Mix de canales</h3>
      <p className="text-sm text-zinc-600">Distribucion de ingresos por canal en los ultimos 30 dias.</p>

      <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative h-40 w-40 rounded-full" style={{ background: gradient }}>
          <div className="absolute inset-5 rounded-full bg-white" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Total</p>
              <p className="text-xl font-black">100%</p>
            </div>
          </div>
        </div>

        <ul className="w-full space-y-2 text-sm">
          {channelShare.map((item) => (
            <li key={item.name} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-bold">{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminShell
      title="Dashboard"
      subtitle="Centro de control del ecommerce con ventas, conversion, operaciones y alertas en una sola vista."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{kpi.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight">{kpi.value}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-2 py-1 text-xs font-bold ${getToneClasses(kpi.tone as "success" | "warning" | "danger" | "neutral")}`}>
                {kpi.delta}
              </span>
              <span className="text-sm text-zinc-600">{kpi.note}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <TrendLineChart />

        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">Acciones rapidas</h3>
          <p className="text-sm text-zinc-600">Atajos para tareas criticas del dia.</p>
          <div className="mt-4 grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-100"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">Embudo de conversion</h3>
          <p className="text-sm text-zinc-600">Detecta rapidamente en que etapa se pierden ventas.</p>
          <ul className="mt-4 space-y-2">
            {funnelData.map((step) => (
              <li key={step.stage} className="rounded-xl bg-zinc-50 p-3">
                <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                  <span>{step.stage}</span>
                  <span>{step.value.toLocaleString("es-PE")}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div className="h-full rounded-full bg-zinc-900" style={{ width: `${step.percentage}%` }} />
                </div>
                <p className="mt-1 text-xs text-zinc-500">{step.percentage}% del trafico inicial</p>
              </li>
            ))}
          </ul>
        </article>

        <ChannelChart />

        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">Alertas operativas</h3>
          <p className="text-sm text-zinc-600">Pendientes que impactan venta o experiencia de cliente.</p>
          <ul className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <li key={alert.title} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-bold text-amber-900">{alert.title}</p>
                <p className="mt-1 text-xs text-amber-900/80">{alert.detail}</p>
                <Link href={alert.actionHref} className="mt-2 inline-block text-xs font-bold underline">
                  {alert.actionLabel}
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Top productos por ingresos</h3>
            <Link href="/admin/sales" className="text-sm font-semibold underline">Ver ventas</Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="py-2">Producto</th>
                  <th className="py-2">Unidades</th>
                  <th className="py-2">Ingresos</th>
                  <th className="py-2">Peso</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => {
                  const maxRevenue = topProducts[0].revenue;
                  const ratio = Math.round((product.revenue / maxRevenue) * 100);
                  return (
                    <tr key={product.name} className="border-t border-zinc-100">
                      <td className="py-2 font-semibold">{product.name}</td>
                      <td className="py-2">{product.units}</td>
                      <td className="py-2">S/ {product.revenue.toFixed(2)}</td>
                      <td className="py-2">
                        <div className="h-2 rounded-full bg-zinc-200">
                          <div className="h-2 rounded-full bg-zinc-900" style={{ width: `${ratio}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold">Salud del MVP</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl bg-zinc-50 p-3">
              <p className="font-semibold">Catalogo</p>
              <p className="text-zinc-600">44 productos cargados y visibles en tienda.</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <p className="font-semibold">Canales</p>
              <p className="text-zinc-600">Online + POS activos; marketplace en setup.</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <p className="font-semibold">Pagos</p>
              <p className="text-zinc-600">Falta habilitar pasarela para checkout web.</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <p className="font-semibold">Operacion</p>
              <p className="text-zinc-600">4 cuellos detectados con prioridad alta.</p>
            </div>
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
