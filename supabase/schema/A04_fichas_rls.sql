-- ============================================================================
-- A04. RLS de las fichas: igual que los cuestionarios (71). Cada docente ve y
-- edita las suyas; admin y administrativo, todas las del colegio.
-- ============================================================================

alter table worksheets enable row level security;

create policy "worksheets_select" on worksheets for select
  using (
    is_platform_staff()
    or has_school_role(school_id, array['admin','administrativo'])
    or created_by = current_staff_id(school_id)
  );
create policy "worksheets_write" on worksheets for all
  using (
    is_platform_staff()
    or has_school_role(school_id, array['admin','administrativo'])
    or created_by = current_staff_id(school_id)
  )
  with check (
    is_platform_staff()
    or has_school_role(school_id, array['admin','administrativo'])
    or created_by = current_staff_id(school_id)
  );
