alter table public.admin_inventory_items
  add column if not exists parent_sku text,
  add column if not exists product_id integer,
  add column if not exists description text,
  add column if not exists category text,
  add column if not exists collection text,
  add column if not exists color text,
  add column if not exists size text,
  add column if not exists options jsonb not null default '{}'::jsonb,
  add column if not exists price numeric(12,2),
  add column if not exists image text,
  add column if not exists sold integer not null default 0,
  add column if not exists low_stock_threshold integer not null default 3,
  add column if not exists status text not null default 'active';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'admin_inventory_items_status_check'
      and conrelid = 'public.admin_inventory_items'::regclass
  ) then
    alter table public.admin_inventory_items
      add constraint admin_inventory_items_status_check check (status in ('active', 'draft', 'archived'));
  end if;
end;
$$;

create index if not exists admin_inventory_items_product_id_idx on public.admin_inventory_items(product_id);
create index if not exists admin_inventory_items_parent_sku_idx on public.admin_inventory_items(parent_sku);
create index if not exists admin_inventory_items_collection_idx on public.admin_inventory_items(collection);
create index if not exists admin_inventory_items_status_idx on public.admin_inventory_items(status);

with catalog_products (product_id, product, collection, price, image, available) as (
  values
    (1, 'Cristiano v1', 'SuperStars', 35.00, '/images/superstars/cristiano1.png', true),
    (2, 'Cristiano v2', 'SuperStars', 35.00, '/images/superstars/cristiano2.png', true),
    (3, 'Cristiano v3', 'SuperStars', 35.00, '/images/superstars/cristiano3.png', true),
    (4, 'Cristiano v4', 'SuperStars', 35.00, '/images/superstars/cristiano4.png', true),
    (5, 'Messi v1', 'SuperStars', 35.00, '/images/superstars/messi1.png', true),
    (6, 'Ronaldinho v1', 'SuperStars', 35.00, '/images/superstars/ronaldinho1.png', true),
    (7, 'Neymar v1', 'SuperStars', 35.00, '/images/superstars/neymar1.png', true),
    (8, 'Neymar v2', 'SuperStars', 35.00, '/images/superstars/neymar2.png', true),
    (9, 'Neymar v3', 'SuperStars', 35.00, '/images/superstars/neymar3.png', true),
    (10, 'Girlfriend v1', 'Romantic', 35.00, '/images/girlfriend/girlfriend1.png', true),
    (11, 'Girlfriend v2', 'Romantic', 35.00, '/images/girlfriend/girlfriend2.png', true),
    (12, 'Girlfriend v3', 'Romantic', 35.00, '/images/girlfriend/girlfriend3.png', true),
    (13, 'Girlfriend v4', 'Romantic', 35.00, '/images/girlfriend/girlfriend4.png', true),
    (14, 'Girlfriend v5', 'Romantic', 35.00, '/images/girlfriend/girlfriend5.png', true),
    (16, 'LEVANTO FIERROS PORQUE CULOS NI UNO', 'GYM', 35.00, '/images/gym/gym1.png', true),
    (17, 'ADICTO A LAS ROSADITAS', 'GYM', 35.00, '/images/gym/gym2.png', true),
    (18, 'ABANDONARIA MIS HIJOS PERO JAMAS A LAS CUARENTONAS', 'GYM', 35.00, '/images/gym/gym3.png', true),
    (19, 'NO ENTREN AL BANO LO TAPE', 'GYM', 35.00, '/images/gym/gym4.png', true),
    (20, 'CAMIONERO A HERENCIA CABRON POR EXPERIENCIA', 'GYM', 35.00, '/images/gym/gym5.png', true),
    (21, 'YO NO PUBLICO MIS LOGROS PORQUE NO TENGO', 'GYM', 35.00, '/images/gym/gym6.png', true),
    (22, 'SE LIMPIAN VERGAS CON LA BOCA', 'GYM', 35.00, '/images/gym/gym7.png', true),
    (23, 'LA CERVEZA FRIA LAS MUJERES CALIENTES', 'GYM', 35.00, '/images/gym/gym8.png', true),
    (24, 'DIGA MI NOMBRE CORRECTAMENTE BELLACO', 'GYM', 35.00, '/images/gym/gym9.png', true),
    (25, 'A MI JEFA DEBO LA VIDA Y A ELECKTRA LA MOTO', 'GYM', 35.00, '/images/gym/gym10.png', true),
    (26, 'Messi v2', 'SuperStars', 35.00, '/images/superstars/messi2.png', true),
    (27, 'Messi v3', 'SuperStars', 35.00, '/images/superstars/messi3.png', true),
    (28, 'Messi v4', 'SuperStars', 35.00, '/images/superstars/messi4.png', true),
    (29, 'Messi v5', 'SuperStars', 35.00, '/images/superstars/messi5.png', true),
    (30, 'EMPECE DESDE ABAJO Y AHI ME QUEDE', 'GYM', 35.00, '/images/gym/gym11.png', true),
    (31, 'TODO SEA POR LAS SENORAS', 'GYM', 35.00, '/images/gym/gym12.png', true),
    (32, 'MI PASION PRESS BANCA MI DEBILIDAD LA DE RECEPCION', 'GYM', 35.00, '/images/gym/gym13.png', true),
    (33, 'MAESTRA CALLESE A LA VERGA', 'GYM', 35.00, '/images/gym/gym14.png', true),
    (34, 'TU MAMA ES MI CARDIO', 'GYM', 35.00, '/images/gym/gym15.png', true),
    (35, 'POR FAVOR SAQUENME DE LATAM', 'GYM', 35.00, '/images/gym/gym17.png', true),
    (36, 'A LA VERGA QUE HORA ES', 'GYM', 35.00, '/images/gym/gym18.png', true),
    (37, 'QUITENSE ME VOY CAGANDO', 'GYM', 35.00, '/images/gym/gym19.png', true),
    (38, 'PARA LOS ENVIDIOSOS QUE DIJERON QUE NO PODRIA LOGRARLO TENIAN RAZON', 'GYM', 35.00, '/images/gym/gym20.png', true),
    (39, 'MI PASION DIA DE PIERNA MI DEBILIDAD LOS TREINTONES', 'GYM', 35.00, '/images/gym/gym21.png', true),
    (40, 'YA ESTUVO SUAVE A LA VERGA TODO', 'GYM', 35.00, '/images/gym/gym22.png', true),
    (41, 'Messi v6', 'SuperStars', 35.00, '/images/superstars/messi6.png', true),
    (42, 'Messi v7', 'SuperStars', 35.00, '/images/superstars/messi7.png', true),
    (43, 'Cristiano v5', 'SuperStars', 35.00, '/images/superstars/cristiano5.png', true),
    (44, 'Cristiano v6', 'SuperStars', 35.00, '/images/superstars/cristiano6.png', true)
),
colors (color) as (
  values ('Blanco'), ('Negro')
),
sizes (size) as (
  values ('S'), ('M'), ('L')
),
expanded_variants as (
  select
    upper(rpad(left(regexp_replace(cp.collection, '[^a-zA-Z0-9]+', '', 'g'), 3), 3, 'X'))
      || '-' || lpad(cp.product_id::text, 3, '0')
      || '-' || upper(rpad(left(regexp_replace(c.color, '[^a-zA-Z0-9]+', '', 'g'), 3), 3, 'X'))
      || '-' || upper(rpad(left(regexp_replace(s.size, '[^a-zA-Z0-9]+', '', 'g'), 3), 3, 'X')) as sku,
    upper(rpad(left(regexp_replace(cp.collection, '[^a-zA-Z0-9]+', '', 'g'), 3), 3, 'X'))
      || '-' || lpad(cp.product_id::text, 3, '0') as parent_sku,
    cp.product_id,
    cp.product,
    'Polo' as category,
    cp.collection,
    c.color,
    s.size,
    jsonb_build_object('color', c.color, 'size', s.size) as options,
    cp.price,
    cp.image,
    case when cp.available then 'active' else 'draft' end as status
  from catalog_products cp
  cross join colors c
  cross join sizes s
)
insert into public.admin_inventory_items (
  sku,
  parent_sku,
  product_id,
  product,
  category,
  collection,
  color,
  size,
  options,
  price,
  image,
  on_hand,
  reserved,
  sold,
  low_stock_threshold,
  status,
  warehouse
)
select
  sku,
  parent_sku,
  product_id,
  product,
  category,
  collection,
  color,
  size,
  options,
  price,
  image,
  10,
  0,
  0,
  3,
  status,
  'Principal'
from expanded_variants
on conflict (sku) do update set
  parent_sku = excluded.parent_sku,
  product_id = excluded.product_id,
  product = excluded.product,
  category = excluded.category,
  collection = excluded.collection,
  color = excluded.color,
  size = excluded.size,
  options = excluded.options,
  price = excluded.price,
  image = excluded.image,
  updated_at = now();

notify pgrst, 'reload schema';
