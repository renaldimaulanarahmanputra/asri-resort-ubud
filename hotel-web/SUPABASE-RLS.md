# Kunci Supabase — copy-paste sekali di Dashboard (SQL Editor)

Jalankan sekali. Tujuannya: tamu tidak bisa ngaku jadi staff walau utak-atik DevTools.
Frontend tetap 1 pintu login, bedakan role diam-diam dari tabel `profiles`.

```sql
-- 1. Tabel role (id = auth.users.id)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  nama text,
  role text not null default 'tamu' check (role in ('tamu','resepsionis','kasir','housekeeping','owner'))
);
alter table profiles enable row level security;

-- 2. User hanya bisa baca profil sendiri (untuk redirect diam-diam via GET /me setara)
create policy "baca sendiri"
  on profiles for select to authenticated
  using (auth.uid() = id);

-- 3. Hanya owner bisa insert/update role (via Service Role di Server Action, bukan anon key)
-- Jangan buat policy insert/update untuk authenticated biasa.
-- Contoh cek owner di Server Action pakai service_role:
-- select role from profiles where id = auth.uid() -> harus 'owner', kalau bukan -> tolak.

-- 4. Publik daftar selalu tamu (trigger, anti ngaku staff dari form):
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'tamu')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();
```

 checklist:
 - [ ] RLS ON di `profiles`
 - [ ] Tidak ada policy insert/update untuk `authenticated` (hanya via service_role di Server Action owner)
 - [ ] Trigger di atas aktif → register Google/Email otomatis `tamu`
 - [ ] Upgrade ke staff hanya dari `/master/users` (owner login) → `upsert profiles set role=...`
 - [ ] `middleware.ts` sudah dipasang → `/master/*` non-owner mental ke `/dashboard?err=no-access`
