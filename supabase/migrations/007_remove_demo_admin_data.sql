delete from public.admin_sales
where id in ('VEN-1051', 'VEN-1052', 'VEN-1053', 'VEN-1054')
   or order_number in ('VEN-1051', 'VEN-1052', 'VEN-1053', 'VEN-1054')
   or customer_id in ('CUS-001', 'CUS-002', 'CUS-003', 'CUS-004');

do $$
begin
  if to_regclass('public.admin_orders') is not null then
    delete from public.admin_orders
    where id in ('ORD-8998', 'ORD-8999', 'ORD-9000', 'ORD-9001');
  end if;
end;
$$;

delete from public.admin_contacts
where id in ('SUP-199', 'SUP-200', 'SUP-201')
   or document in ('74251638', '10478529', '20123456789');

delete from public.admin_inventory_items
where sku in ('INV-001-BLA-M', 'INV-002-NEG-M', 'INV-003-BLA-M')
   or parent_sku in ('INV-001', 'INV-002', 'INV-003');

notify pgrst, 'reload schema';
