-- The api_v1 schema is the only contract exposed to clients (PostgREST).
-- Tables live in `public` and are never exposed directly.
create schema if not exists api_v1;

grant usage on schema api_v1 to anon, authenticated, service_role;

-- Nothing in `public` is reachable by client roles unless a later migration grants it explicitly.
revoke all on all tables in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
