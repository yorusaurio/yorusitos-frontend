grant select, insert, update, delete on public.admin_sale_items to authenticated;
grant all on public.admin_sale_items to service_role;

notify pgrst, 'reload schema';
