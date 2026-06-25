-- Establece precio público S/ 29.90 en todos los polos del inventario.
update public.admin_inventory_items
set price = 29.90,
    updated_at = now()
where coalesce(category, 'Polo') = 'Polo';

notify pgrst, 'reload schema';
