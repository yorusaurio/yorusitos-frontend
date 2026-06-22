drop table if exists public.admin_orders cascade;
drop sequence if exists public.admin_orders_number_seq;

notify pgrst, 'reload schema';
