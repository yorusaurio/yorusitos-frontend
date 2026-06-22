update public.admin_inventory_items
set on_hand = 10,
    reserved = 0,
    status = 'active',
    updated_at = now();

notify pgrst, 'reload schema';
