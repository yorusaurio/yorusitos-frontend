alter table public.admin_inventory_items
  add column if not exists category text;

update public.admin_inventory_items
set category = coalesce(category, 'Polo'),
    updated_at = now()
where category is null;

create index if not exists admin_inventory_items_category_idx on public.admin_inventory_items(category);

notify pgrst, 'reload schema';
