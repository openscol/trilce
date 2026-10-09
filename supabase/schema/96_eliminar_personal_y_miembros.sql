-- ============================================================================
-- 96. Eliminar personal y quitar miembros
-- Borrar la fila de `memberships` a secas deja huérfano el auth.users (su
-- correo y username quedan ocupados y no se puede volver a crear el acceso).
-- Por eso ambas operaciones pasan por funciones SECURITY DEFINER, igual que
-- create_membership_login (35): la autorización la hace la función misma.
-- ============================================================================

-- Regla 5: el dueño es intocable. Los ON DELETE CASCADE (p. ej. al borrar su
-- staff_members) no pasan por RLS, así que se protege con un trigger.
create or replace function protect_owner_membership()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.is_owner then
    raise exception 'El dueño del colegio no se puede eliminar — transfiere la titularidad primero';
  end if;
  return old;
end;
$$;

create trigger trg_protect_owner_membership
  before delete on memberships
  for each row execute function protect_owner_membership();

-- Borra el auth.users si ya no le queda ningún acceso (ni membership en otro
-- colegio ni platform_staff). Si el usuario dejó rastro con valor legal
-- (p. ej. payment_documents.created_by), la FK lo impide y la cuenta se
-- conserva: sin memberships igual no puede entrar a ningún colegio.
create or replace function drop_orphan_auth_user(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from memberships where user_id = p_user_id)
     or exists (select 1 from platform_staff where user_id = p_user_id) then
    return;
  end if;

  begin
    delete from auth.users where id = p_user_id;
  exception when foreign_key_violation then
    null;
  end;
end;
$$;

revoke execute on function drop_orphan_auth_user(uuid) from public, anon, authenticated;

create or replace function remove_membership(p_membership_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_membership memberships%rowtype;
begin
  select * into v_membership from memberships where id = p_membership_id;
  if not found then
    raise exception 'Miembro no encontrado';
  end if;

  if not (is_platform_staff() or has_school_role(v_membership.school_id, array['admin'])) then
    raise exception 'No autorizado para quitar miembros en este colegio';
  end if;
  if v_membership.is_owner then
    raise exception 'El dueño del colegio no se puede quitar — transfiere la titularidad primero';
  end if;
  if v_membership.user_id = auth.uid() then
    raise exception 'No puedes quitarte a ti mismo';
  end if;

  delete from memberships where id = p_membership_id;
  perform drop_orphan_auth_user(v_membership.user_id);
end;
$$;

revoke execute on function remove_membership(uuid) from public, anon;
grant execute on function remove_membership(uuid) to authenticated;

create or replace function delete_staff_member(p_staff_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_school_id uuid;
  v_user_ids uuid[];
  v_user_id uuid;
begin
  select school_id into v_school_id from staff_members where id = p_staff_id;
  if not found then
    raise exception 'Personal no encontrado';
  end if;

  if not (is_platform_staff() or has_school_role(v_school_id, array['admin','administrativo'])) then
    raise exception 'No autorizado para eliminar personal en este colegio';
  end if;

  select array_agg(user_id) into v_user_ids from memberships where staff_id = p_staff_id;

  if v_user_ids is not null then
    -- Quitar un acceso es potestad del admin (memberships_write), no del
    -- administrativo.
    if not (is_platform_staff() or has_school_role(v_school_id, array['admin'])) then
      raise exception 'Esta persona tiene acceso al sistema — solo un admin puede eliminarla';
    end if;
    if exists (select 1 from memberships where staff_id = p_staff_id and is_owner) then
      raise exception 'El dueño del colegio no se puede eliminar — transfiere la titularidad primero';
    end if;
    if auth.uid() = any (v_user_ids) then
      raise exception 'No puedes eliminarte a ti mismo';
    end if;
  end if;

  -- Arrastra por cascada: memberships, staff_assigned_sections,
  -- course_offerings (y su horario) y quizzes.
  delete from staff_members where id = p_staff_id;

  if v_user_ids is not null then
    foreach v_user_id in array v_user_ids loop
      perform drop_orphan_auth_user(v_user_id);
    end loop;
  end if;
end;
$$;

revoke execute on function delete_staff_member(uuid) from public, anon;
grant execute on function delete_staff_member(uuid) to authenticated;
