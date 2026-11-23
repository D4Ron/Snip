-- Guard for rule 1 (tenant isolation): every table in `public` must have RLS enabled.
begin;
select plan(2);

select has_schema('api_v1', 'api_v1 schema exists');

select is(
  (select array_agg(c.relname::text order by c.relname)
     from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity),
  null,
  'every table in public has RLS enabled'
);

select * from finish();
rollback;
