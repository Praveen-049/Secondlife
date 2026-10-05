alter table public.profiles
  add column if not exists organization_name text,
  add column if not exists organization_type text,
  add column if not exists location text;

alter table public.profiles alter column full_name drop not null;

alter table public.profiles drop constraint if exists profiles_role_check;

update public.profiles
set role = case role
  when 'builder' then 'project_maker'
  when 'donor' then 'seller'
  when 'collector' then 'seller'
  when 'customer' then 'project_maker'
  when 'volunteer' then 'seller'
  else role
end
where role in ('builder', 'donor', 'collector', 'customer', 'volunteer');

update public.profiles
set organization_name = coalesce(nullif(trim(organization_name), ''), full_name),
    organization_type = coalesce(organization_type, 'Other')
where role = 'organization';

alter table public.profiles add constraint profiles_role_check
  check (role in ('project_maker', 'seller', 'organization'));

alter table public.profiles drop constraint if exists profiles_role_identity_check;
alter table public.profiles add constraint profiles_role_identity_check check (
  (role = 'organization' and organization_name is not null and organization_type is not null)
  or (role in ('project_maker', 'seller') and full_name is not null)
);

alter table public.profiles drop constraint if exists profiles_organization_type_check;
alter table public.profiles add constraint profiles_organization_type_check
  check (organization_type is null or organization_type in (
    'College', 'University', 'NGO', 'Company', 'Recycling Organization',
    'Government Organization', 'Other'
  ));

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role then
    raise exception 'Account role cannot be changed after profile creation.' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change
  before update of role on public.profiles
  for each row execute function public.prevent_profile_role_change();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
  new_role text;
  contact_name text := nullif(trim(new.raw_user_meta_data ->> 'full_name'), '');
  org_name text := nullif(trim(new.raw_user_meta_data ->> 'organization_name'), '');
begin
  new_role := case
    when requested_role in ('project_maker', 'seller', 'organization') then requested_role
    else 'project_maker'
  end;

  if new_role = 'organization' then
    contact_name := coalesce(contact_name, org_name);
  end if;

  insert into public.profiles as existing_profile (
    id, email, role, full_name, organization_name, organization_type,
    location, avatar_url, onboarding_completed
  ) values (
    new.id,
    new.email,
    new_role,
    contact_name,
    case when new_role = 'organization' then org_name else null end,
    case when new_role = 'organization' then new.raw_user_meta_data ->> 'organization_type' else null end,
    new.raw_user_meta_data ->> 'location',
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    (new_role = 'organization' and org_name is not null)
      or (new_role <> 'organization' and contact_name is not null)
  )
  on conflict (id) do update set
    email = excluded.email,
    avatar_url = coalesce(existing_profile.avatar_url, excluded.avatar_url);

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create table if not exists public.inventories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  component_name text not null,
  category text not null,
  owned_quantity integer not null check (owned_quantity >= 0),
  condition text not null check (condition in ('Excellent', 'Good', 'Fair', 'For parts')),
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  location text,
  budget numeric(12,2) not null default 0 check (budget >= 0),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_requirements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  component_name text not null,
  required_quantity integer not null check (required_quantity > 0),
  created_at timestamptz not null default now(),
  unique (project_id, component_name)
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid not null references public.inventories(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  owner_type text not null check (owner_type in ('seller', 'organization')),
  owner_display_name text not null,
  component_name text not null,
  category text not null,
  condition text not null check (condition in ('Excellent', 'Good', 'Fair', 'For parts')),
  description text,
  image_urls text[] not null default '{}',
  location text,
  listing_type text not null check (listing_type in ('DONATE', 'SELL')),
  price_per_unit numeric(12,2) not null default 0 check (price_per_unit >= 0),
  total_quantity integer not null check (total_quantity > 0),
  available_quantity integer not null check (available_quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  transferred_quantity integer not null default 0 check (transferred_quantity >= 0),
  cancelled_quantity integer not null default 0 check (cancelled_quantity >= 0),
  status text not null default 'AVAILABLE' check (status in ('AVAILABLE', 'RESERVED', 'SOLD', 'TRANSFERRED', 'CANCELLED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_quantity_ledger_check check (
    total_quantity = available_quantity + reserved_quantity + transferred_quantity + cancelled_quantity
  ),
  constraint donation_price_check check (listing_type <> 'DONATE' or price_per_unit = 0)
);

create table if not exists public.marketplace_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  project_id uuid not null references public.projects(id) on delete restrict,
  maker_id uuid not null references auth.users(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  status text not null default 'REQUESTED' check (status in ('REQUESTED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'TRANSFERRED')),
  delivery_status text not null default 'REQUESTED' check (delivery_status in ('REQUESTED', 'ACCEPTED', 'REJECTED', 'PACKED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.marketplace_requests(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('project_maker', 'seller', 'organization')),
  condition_rating smallint check (condition_rating between 1 and 5),
  listing_accuracy_rating smallint check (listing_accuracy_rating between 1 and 5),
  communication_rating smallint check (communication_rating between 1 and 5),
  overall_rating smallint not null check (overall_rating between 1 and 5),
  comments text,
  created_at timestamptz not null default now(),
  unique (request_id, author_id)
);

create or replace view public.profile_feedback_summary
with (security_invoker = true)
as
select target_id,
       count(*)::integer as rating_count,
       round(avg(overall_rating)::numeric, 2) as average_rating
from public.feedback
group by target_id;

create index if not exists inventories_owner_idx on public.inventories(owner_id);
create index if not exists listings_component_available_idx on public.listings(component_name, available_quantity) where status = 'AVAILABLE';
create index if not exists listings_owner_idx on public.listings(owner_id);
create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists requests_maker_idx on public.marketplace_requests(maker_id, status);
create index if not exists requests_listing_idx on public.marketplace_requests(listing_id, status);

alter table public.inventories enable row level security;
alter table public.projects enable row level security;
alter table public.project_requirements enable row level security;
alter table public.listings enable row level security;
alter table public.marketplace_requests enable row level security;
alter table public.feedback enable row level security;

grant select, insert, update, delete on public.inventories, public.projects,
  public.project_requirements, public.marketplace_requests, public.feedback to authenticated;
grant select, insert, delete on public.listings to authenticated;
grant update (description, image_urls, location, listing_type, price_per_unit)
  on public.listings to authenticated;

drop policy if exists "Owners manage their inventory" on public.inventories;
create policy "Owners manage their inventory" on public.inventories
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (
    owner_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('seller', 'organization'))
  );

drop policy if exists "Makers and organizations read project requirements" on public.projects;
create policy "Makers and organizations read project requirements" on public.projects
  for select to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'organization')
  );
drop policy if exists "Makers manage their projects" on public.projects;
create policy "Makers manage their projects" on public.projects
  for all to authenticated
  using (owner_id = (select auth.uid()) and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'project_maker'))
  with check (owner_id = (select auth.uid()) and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'project_maker'));

drop policy if exists "Read requirements for accessible projects" on public.project_requirements;
create policy "Read requirements for accessible projects" on public.project_requirements
  for select to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id));
drop policy if exists "Makers manage requirements for their projects" on public.project_requirements;
create policy "Makers manage requirements for their projects" on public.project_requirements
  for all to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = (select auth.uid())));

drop policy if exists "Read available listings or own listings" on public.listings;
create policy "Read available listings or own listings" on public.listings
  for select to authenticated
  using ((status = 'AVAILABLE' and available_quantity > 0) or owner_id = (select auth.uid()));
drop policy if exists "Sellers and organizations create listings" on public.listings;
create policy "Sellers and organizations create listings" on public.listings
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = owner_type)
  );
drop policy if exists "Owners update their listings" on public.listings;
create policy "Owners update their listings" on public.listings
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
drop policy if exists "Owners delete unreserved listings" on public.listings;
create policy "Owners delete unreserved listings" on public.listings
  for delete to authenticated
  using (owner_id = (select auth.uid()) and reserved_quantity = 0);

drop policy if exists "Request parties read requests" on public.marketplace_requests;
create policy "Request parties read requests" on public.marketplace_requests
  for select to authenticated
  using (
    maker_id = (select auth.uid())
    or exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = (select auth.uid()))
  );
drop policy if exists "Makers create their own requests" on public.marketplace_requests;
create policy "Makers create their own requests" on public.marketplace_requests
  for insert to authenticated
  with check (
    maker_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'project_maker')
    and exists (select 1 from public.projects p where p.id = project_id and p.owner_id = (select auth.uid()))
  );
drop policy if exists "Request parties update requests" on public.marketplace_requests;
create policy "Request parties update requests" on public.marketplace_requests
  for update to authenticated
  using (
    maker_id = (select auth.uid())
    or exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = (select auth.uid()))
  )
  with check (
    maker_id = (select auth.uid())
    or exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = (select auth.uid()))
  );

drop policy if exists "Request parties read feedback" on public.feedback;
create policy "Request parties read feedback" on public.feedback
  for select to authenticated
  using (author_id = (select auth.uid()) or target_id = (select auth.uid()));
drop policy if exists "Parties leave feedback after transfer" on public.feedback;
create policy "Parties leave feedback after transfer" on public.feedback
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.marketplace_requests r
      join public.listings l on l.id = r.listing_id
      where r.id = request_id and r.status = 'TRANSFERRED'
        and ((r.maker_id = (select auth.uid()) and l.owner_id = target_id)
          or (l.owner_id = (select auth.uid()) and r.maker_id = target_id))
    )
  );

create or replace function public.enforce_listing_inventory_capacity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  stock_owner uuid;
  stock_quantity integer;
  already_listed integer;
begin
  select owner_id, owned_quantity into stock_owner, stock_quantity
  from public.inventories where id = new.inventory_id for update;
  if stock_owner is null or stock_owner <> new.owner_id then
    raise exception 'Listing owner must own the referenced inventory.' using errcode = '23514';
  end if;

  select coalesce(sum(available_quantity + reserved_quantity), 0) into already_listed
  from public.listings
  where inventory_id = new.inventory_id and (tg_op = 'INSERT' or id <> new.id);

  if already_listed + new.available_quantity + new.reserved_quantity > stock_quantity then
    raise exception 'Listing quantity exceeds unlisted owned inventory.' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists listings_enforce_inventory_capacity on public.listings;
create trigger listings_enforce_inventory_capacity
  before insert or update of inventory_id, owner_id, available_quantity, reserved_quantity
  on public.listings for each row execute function public.enforce_listing_inventory_capacity();

create or replace function public.enforce_inventory_owned_quantity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  committed_quantity integer;
begin
  if new.owned_quantity < 0 then
    raise exception 'Owned inventory cannot be negative.' using errcode = '23514';
  end if;
  select coalesce(sum(available_quantity + reserved_quantity), 0) into committed_quantity
  from public.listings where inventory_id = new.id;
  if new.owned_quantity < committed_quantity then
    raise exception 'Owned inventory cannot be less than listed and reserved quantities.' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists inventories_enforce_owned_quantity on public.inventories;
create trigger inventories_enforce_owned_quantity
  before update of owned_quantity on public.inventories
  for each row execute function public.enforce_inventory_owned_quantity();

create or replace function public.apply_marketplace_request_transition()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_listing public.listings%rowtype;
  stock_owner uuid;
  inventory_uuid uuid;
  listing_owner uuid;
  expected_delivery text;
begin
  if tg_op = 'INSERT' then
    if new.status <> 'REQUESTED' or new.delivery_status <> 'REQUESTED' then
      raise exception 'New requests must start in REQUESTED state.' using errcode = '23514';
    end if;
    if not exists (
      select 1 from public.projects p
      join public.profiles maker on maker.id = p.owner_id
      where p.id = new.project_id and p.owner_id = new.maker_id and maker.role = 'project_maker'
    ) then
      raise exception 'Only a Project Maker may request components for their own project.' using errcode = '42501';
    end if;
    select * into current_listing from public.listings where id = new.listing_id for update;
    if current_listing.status <> 'AVAILABLE' or current_listing.available_quantity < new.quantity then
      raise exception 'Requested quantity is not available.' using errcode = '23514';
    end if;
    return new;
  end if;

  if new.listing_id is distinct from old.listing_id
    or new.project_id is distinct from old.project_id
    or new.maker_id is distinct from old.maker_id
    or new.quantity is distinct from old.quantity then
    raise exception 'Request identity, project, and quantity cannot be changed.' using errcode = '42501';
  end if;

  if new.status is distinct from old.status then
    if old.status = 'REQUESTED' and new.status in ('ACCEPTED', 'REJECTED', 'CANCELLED') then
      null;
    elsif old.status = 'ACCEPTED' and new.status in ('CANCELLED', 'TRANSFERRED') then
      null;
    else
      raise exception 'Invalid marketplace request status transition.' using errcode = '23514';
    end if;
  end if;

  if new.status = 'REJECTED' and new.delivery_status <> 'REJECTED' then
    raise exception 'Rejected requests must use REJECTED delivery state.' using errcode = '23514';
  end if;
  if new.status = 'CANCELLED' and new.delivery_status <> 'CANCELLED' then
    raise exception 'Cancelled requests must use CANCELLED delivery state.' using errcode = '23514';
  end if;
  if new.delivery_status = 'CANCELLED' and new.status <> 'CANCELLED' then
    raise exception 'Cancelled delivery must cancel the request.' using errcode = '23514';
  end if;

  if new.status = 'CANCELLED' and old.status = 'REQUESTED' then
    select owner_id into listing_owner from public.listings where id = new.listing_id;
    if auth.uid() not in (listing_owner, new.maker_id) then
      raise exception 'Only a request party may cancel a request.' using errcode = '42501';
    end if;
  end if;

  if old.status = 'REQUESTED' and new.status = 'ACCEPTED' then
    select owner_id into listing_owner from public.listings where id = new.listing_id;
    if listing_owner <> auth.uid() then
      raise exception 'Only the listing owner may accept a request.' using errcode = '42501';
    end if;
    update public.listings
    set available_quantity = available_quantity - new.quantity,
        reserved_quantity = reserved_quantity + new.quantity,
        status = case when available_quantity - new.quantity > 0 then 'AVAILABLE' else 'RESERVED' end,
        updated_at = now()
    where id = new.listing_id and available_quantity >= new.quantity;
    if not found then
      raise exception 'Requested quantity is no longer available.' using errcode = '23514';
    end if;
  elsif new.status = 'REJECTED' then
    select owner_id into listing_owner from public.listings where id = new.listing_id;
    if listing_owner <> auth.uid() then
      raise exception 'Only the listing owner may reject a request.' using errcode = '42501';
    end if;
  elsif old.status = 'ACCEPTED' and new.status = 'CANCELLED' then
    select owner_id into listing_owner from public.listings where id = new.listing_id;
    if new.status = 'CANCELLED' and auth.uid() not in (listing_owner, new.maker_id) then
      raise exception 'Only a request party may cancel a request.' using errcode = '42501';
    end if;
    update public.listings
    set available_quantity = available_quantity + old.quantity,
        reserved_quantity = reserved_quantity - old.quantity,
        status = 'AVAILABLE',
        updated_at = now()
    where id = old.listing_id and reserved_quantity >= old.quantity;
  end if;

  if new.delivery_status is distinct from old.delivery_status
    and new.delivery_status not in ('CANCELLED', 'REJECTED') then
    expected_delivery := case old.delivery_status
      when 'REQUESTED' then 'ACCEPTED'
      when 'ACCEPTED' then 'PACKED'
      when 'PACKED' then 'PICKED_UP'
      when 'PICKED_UP' then 'IN_TRANSIT'
      when 'IN_TRANSIT' then 'DELIVERED'
      else null
    end;
    if new.delivery_status <> expected_delivery then
      raise exception 'Delivery status must advance one step at a time.' using errcode = '23514';
    end if;
    select owner_id into listing_owner from public.listings where id = new.listing_id;
    if listing_owner <> auth.uid() then
      raise exception 'Only the listing owner may advance delivery.' using errcode = '42501';
    end if;
  end if;

  if new.status = 'TRANSFERRED' and new.delivery_status <> 'DELIVERED' then
    raise exception 'A request can be transferred only after delivery.' using errcode = '23514';
  end if;

  if new.delivery_status = 'DELIVERED' and old.delivery_status <> 'DELIVERED' then
    if old.status <> 'ACCEPTED' then
      raise exception 'Only accepted requests can be delivered.' using errcode = '23514';
    end if;
    select owner_id into listing_owner from public.listings where id = new.listing_id;
    if listing_owner <> auth.uid() then
      raise exception 'Only the listing owner may complete delivery.' using errcode = '42501';
    end if;
    update public.listings
    set reserved_quantity = reserved_quantity - new.quantity,
        transferred_quantity = transferred_quantity + new.quantity,
        status = case
          when available_quantity > 0 then 'AVAILABLE'
          when reserved_quantity - new.quantity > 0 then 'RESERVED'
          else 'TRANSFERRED'
        end,
        updated_at = now()
    where id = new.listing_id and reserved_quantity >= new.quantity
    returning inventory_id, owner_id into inventory_uuid, stock_owner;
    if not found then
      raise exception 'Reserved listing quantity is inconsistent.' using errcode = '23514';
    end if;
    update public.inventories
    set owned_quantity = owned_quantity - new.quantity,
        updated_at = now()
    where id = inventory_uuid and owner_id = stock_owner and owned_quantity >= new.quantity;
    if not found then
      raise exception 'Transfer exceeds currently owned inventory.' using errcode = '23514';
    end if;
    new.status := 'TRANSFERRED';
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_listing_inventory_capacity() from public, anon, authenticated;
revoke all on function public.apply_marketplace_request_transition() from public, anon, authenticated;

drop trigger if exists marketplace_requests_apply_transition on public.marketplace_requests;
create trigger marketplace_requests_apply_transition
  before insert or update of status, delivery_status
  on public.marketplace_requests for each row execute function public.apply_marketplace_request_transition();

create table if not exists public.marketplace_request_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.marketplace_requests(id) on delete cascade,
  status text not null check (status in ('REQUESTED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'TRANSFERRED')),
  delivery_status text not null check (delivery_status in ('REQUESTED', 'ACCEPTED', 'REJECTED', 'PACKED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists marketplace_request_events_timeline_idx
  on public.marketplace_request_events(request_id, created_at);
alter table public.marketplace_request_events enable row level security;
grant select on public.marketplace_request_events to authenticated;
revoke insert, update, delete on public.marketplace_request_events from anon, authenticated;
grant select on public.profile_feedback_summary to authenticated;

drop policy if exists "Request parties read event history" on public.marketplace_request_events;
create policy "Request parties read event history" on public.marketplace_request_events
  for select to authenticated
  using (exists (select 1 from public.marketplace_requests r where r.id = request_id));

create or replace function public.record_marketplace_request_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT'
    or new.status is distinct from old.status
    or new.delivery_status is distinct from old.delivery_status then
    insert into public.marketplace_request_events(request_id, status, delivery_status, actor_id)
    values (new.id, new.status, new.delivery_status, auth.uid());
  end if;
  return new;
end;
$$;

revoke all on function public.record_marketplace_request_event() from public, anon, authenticated;
drop trigger if exists marketplace_requests_record_event on public.marketplace_requests;
create trigger marketplace_requests_record_event
  after insert or update of status, delivery_status
  on public.marketplace_requests for each row execute function public.record_marketplace_request_event();

create or replace function public.set_marketplace_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  target_table text;
begin
  foreach target_table in array array['inventories', 'projects', 'listings', 'marketplace_requests'] loop
    execute format('drop trigger if exists %I on public.%I', target_table || '_set_updated_at', target_table);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_marketplace_updated_at()', target_table || '_set_updated_at', target_table);
  end loop;
end;
$$;