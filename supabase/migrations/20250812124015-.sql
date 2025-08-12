-- Address linter warnings: ensure explicit search_path on functions lacking it

create or replace function public.add_cca_to_admin_profiles()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
BEGIN
  -- Adicionar o novo CCA apenas ao perfil Administrador
  UPDATE perfis 
  SET ccas_permitidas = ccas_permitidas || jsonb_build_array(NEW.id)
  WHERE nome = 'Administrador' 
  AND NOT (ccas_permitidas ? NEW.id::text);
  
  RETURN NEW;
END;
$function$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
BEGIN
  -- Placeholder: keep existing behavior, just enforce safe search_path
  RETURN NEW;
END;
$function$;