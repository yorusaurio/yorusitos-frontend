create table if not exists public.admin_sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id text not null references public.admin_sales(id) on delete cascade,
  product_id integer,
  parent_sku text,
  variant_sku text not null references public.admin_inventory_items(sku),
  product text not null,
  description text,
  color text,
  size text,
  quantity integer not null check (quantity > 0),
  stock_available integer,
  unit_price numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_sale_items_sale_id_idx on public.admin_sale_items(sale_id);
create index if not exists admin_sale_items_variant_sku_idx on public.admin_sale_items(variant_sku);

drop trigger if exists set_admin_sale_items_updated_at on public.admin_sale_items;
create trigger set_admin_sale_items_updated_at
before update on public.admin_sale_items
for each row execute function public.set_updated_at();

alter table public.admin_sale_items enable row level security;

grant select, insert, update, delete on public.admin_sale_items to authenticated;
grant all on public.admin_sale_items to service_role;

drop policy if exists "Sellers and admins manage sale items" on public.admin_sale_items;
create policy "Sellers and admins manage sale items"
on public.admin_sale_items
for all
to authenticated
using (public.user_has_any_role(array['vendedor', 'admin']))
with check (public.user_has_any_role(array['vendedor', 'admin']));

notify pgrst, 'reload schema';
