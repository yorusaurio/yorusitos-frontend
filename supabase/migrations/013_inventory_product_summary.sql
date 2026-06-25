-- Resumen corto del producto (texto arriba del precio en tienda).
-- description conserva la informacion completa del producto.
alter table public.admin_inventory_items
  add column if not exists summary text;

notify pgrst, 'reload schema';
