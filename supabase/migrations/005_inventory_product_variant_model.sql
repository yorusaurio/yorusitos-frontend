alter table public.admin_inventory_items
  add column if not exists parent_sku text,
  add column if not exists description text,
  add column if not exists options jsonb not null default '{}'::jsonb,
  add column if not exists sold integer not null default 0;

update public.admin_inventory_items
set parent_sku = coalesce(
      parent_sku,
      case
        when product_id is not null and collection is not null then
          upper(rpad(left(regexp_replace(collection, '[^a-zA-Z0-9]+', '', 'g'), 3), 3, 'X'))
          || '-' || lpad(product_id::text, 3, '0')
        else regexp_replace(sku, '-[^-]+-[^-]+$', '')
      end
    ),
    options = case
      when options = '{}'::jsonb then jsonb_strip_nulls(jsonb_build_object('color', color, 'size', size))
      else options
    end,
    sold = coalesce(sold, 0),
    on_hand = case when on_hand = 0 then 10 else on_hand end,
    reserved = coalesce(reserved, 0),
    status = coalesce(status, 'active'),
    updated_at = now();

create index if not exists admin_inventory_items_parent_sku_idx on public.admin_inventory_items(parent_sku);
create index if not exists admin_inventory_items_options_gin_idx on public.admin_inventory_items using gin(options);

notify pgrst, 'reload schema';
