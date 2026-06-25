-- Backfill summary from description for rows that only have the long text.
-- Keeps description intact; summary becomes a short excerpt when missing.
update public.admin_inventory_items
set summary = left(regexp_replace(description, '\s+', ' ', 'g'), 200)
where summary is null
  and description is not null
  and length(description) > 0;

notify pgrst, 'reload schema';
