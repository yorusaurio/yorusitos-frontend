-- Subcolección: agrupa diseños dentro de una colección (ej. Cristiano Ronaldo dentro de SuperStars).
alter table public.admin_inventory_items
  add column if not exists subcollection text;

create index if not exists admin_inventory_items_subcollection_idx
  on public.admin_inventory_items(subcollection);

-- SuperStars: jugadores
update public.admin_inventory_items
set subcollection = 'Cristiano Ronaldo',
    updated_at = now()
where product ilike 'Cristiano%'
  and coalesce(collection, '') = 'SuperStars';

update public.admin_inventory_items
set subcollection = 'Lionel Messi',
    updated_at = now()
where product ilike 'Messi%'
  and coalesce(collection, '') = 'SuperStars';

update public.admin_inventory_items
set subcollection = 'Neymar',
    updated_at = now()
where product ilike 'Neymar%'
  and coalesce(collection, '') = 'SuperStars';

update public.admin_inventory_items
set subcollection = 'Ronaldinho',
    updated_at = now()
where product ilike 'Ronaldinho%'
  and coalesce(collection, '') = 'SuperStars';

-- Romantic
update public.admin_inventory_items
set subcollection = 'Girlfriend',
    updated_at = now()
where product ilike 'Girlfriend%'
  and coalesce(collection, '') = 'Romantic';

-- GYM: frases humor / gym
update public.admin_inventory_items
set subcollection = 'Gym Humor',
    updated_at = now()
where coalesce(collection, '') = 'GYM'
  and subcollection is null;

-- Respaldo por colección
update public.admin_inventory_items
set subcollection = coalesce(collection, category, 'General'),
    updated_at = now()
where subcollection is null;

notify pgrst, 'reload schema';
