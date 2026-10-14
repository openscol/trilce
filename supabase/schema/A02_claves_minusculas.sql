-- ============================================================================
-- A02. Contraseñas iniciales de los alumnos: solo minúsculas y dígitos
-- ============================================================================
-- Las contraseñas temporales de 38_student_auto_login mezclaban mayúsculas y
-- minúsculas, y a los alumnos les costaba escribirlas. Desde ahora:
--   1. las nuevas se generan solo con letras minúsculas y dígitos (dqk2e4sm);
--   2. las que ya existen y siguen vigentes se pasan a minúsculas
--      (dqk2e4sM → dqk2e4sm), tanto en la lista imprimible como en el login.
--
-- Solo se tocan las cuentas cuya contraseña actual sigue siendo la temporal
-- anotada en `initial_credentials`: quien ya la cambió no aparece ahí.
-- ============================================================================

create or replace function provision_student_login(p_student_id uuid)
returns table (email text, username text, temp_password text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student   students%rowtype;
  v_domain    text;
  v_base      text;
  v_username  text;
  v_email     text;
  v_password  text;
  v_user_id   uuid;
  v_suffix    int := 1;
  -- Solo minúsculas y dígitos, sin caracteres ambiguos al imprimir (0/o, 1/l/i).
  v_alphabet  constant text := 'abcdefghjkmnpqrstuvwxyz23456789';
  v_bytes     bytea;
  i           int;
begin
  select * into v_student from students where id = p_student_id;
  if not found then
    raise exception 'Alumno no encontrado';
  end if;

  if not (is_platform_staff() or has_school_role(v_student.school_id, array['admin','administrativo'])) then
    raise exception 'No autorizado para crear accesos en este colegio';
  end if;

  if exists (select 1 from memberships m where m.student_id = p_student_id) then
    raise exception 'El alumno ya tiene una cuenta de acceso';
  end if;

  select s.email_domain into v_domain from schools s where s.id = v_student.school_id;
  if v_domain is null or btrim(v_domain) = '' then
    raise exception 'El colegio no tiene configurado un dominio de correo';
  end if;
  v_domain := lower(btrim(v_domain));

  v_base := left(slug_letters(split_part(btrim(v_student.first_names), ' ', 1)), 1)
         || slug_letters(v_student.paternal_surname)
         || left(slug_letters(v_student.maternal_surname), 1);
  if v_base = '' then
    raise exception 'No se pudo generar el correo: faltan nombres o apellidos';
  end if;

  loop
    v_username := v_base || case when v_suffix = 1 then '' else v_suffix::text end;
    v_email := v_username || '@' || v_domain;
    exit when not exists (select 1 from auth.users u where lower(u.email) = v_email)
          and not exists (select 1 from user_profiles up where lower(up.username) = v_username);
    v_suffix := v_suffix + 1;
  end loop;

  -- Contraseña de 8 caracteres con al menos una letra y un dígito.
  loop
    v_bytes := extensions.gen_random_bytes(8);
    v_password := '';
    for i in 0..7 loop
      v_password := v_password || substr(v_alphabet, (get_byte(v_bytes, i) % length(v_alphabet)) + 1, 1);
    end loop;
    exit when v_password ~ '[0-9]' and v_password ~ '[a-z]';
  end loop;

  v_user_id := create_membership_login(
    v_student.school_id,
    'alumno',
    p_student_id,
    v_email,
    v_username,
    v_password,
    btrim(v_student.first_names || ' ' || v_student.paternal_surname || ' ' || coalesce(v_student.maternal_surname, ''))
  );

  insert into initial_credentials (user_id, school_id, temp_password)
  values (v_user_id, v_student.school_id, v_password);

  update students set institutional_email = v_email where id = p_student_id;

  return query select v_email, v_username, v_password;
end;
$$;

revoke execute on function provision_student_login(uuid) from public;
grant execute on function provision_student_login(uuid) to authenticated;

-- Contraseñas vigentes → minúsculas. Primero el login (necesita la temporal
-- original para comprobar que sigue en uso) y luego la lista imprimible.
update auth.users u
   set encrypted_password = extensions.crypt(lower(ic.temp_password), extensions.gen_salt('bf')),
       updated_at = now()
  from initial_credentials ic
 where ic.user_id = u.id
   and ic.temp_password <> lower(ic.temp_password)
   and u.encrypted_password = extensions.crypt(ic.temp_password, u.encrypted_password);

update initial_credentials ic
   set temp_password = lower(ic.temp_password)
  from auth.users u
 where u.id = ic.user_id
   and ic.temp_password <> lower(ic.temp_password)
   and u.encrypted_password = extensions.crypt(lower(ic.temp_password), u.encrypted_password);
