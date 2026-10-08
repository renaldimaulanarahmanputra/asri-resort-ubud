// hotel-web/middleware.ts — kunci route admin, 1 pintu login tetap sama untuk user
// Copy ke root proyek Next.js kamu (sejajar app/). Butuh: npm i @supabase/ssr
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const OWNER_ONLY = ['/master', '/settings'];
const STAFF_ONLY = ['/dashboard', '/reservations', '/front-office', '/folio', '/housekeeping', '/reports'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => req.cookies.get(k)?.value, set: (k, v, o) => res.cookies.set(k, v, o), remove: (k, o) => res.cookies.set(k, '', o) } }
  );

  const path = req.nextUrl.pathname;
  const needGuard = [...OWNER_ONLY, ...STAFF_ONLY].some((p) => path.startsWith(p));
  if (!needGuard) return res;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login?next=' + path, req.url));

  // Silent role: ambil dari tabel profiles, bukan dari input user
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const role = (profile?.role ?? 'tamu') as string;

  if (OWNER_ONLY.some((p) => path.startsWith(p)) && role !== 'owner') {
    return NextResponse.redirect(new URL('/dashboard?err=no-access', req.url));
  }
  if (STAFF_ONLY.some((p) => path.startsWith(p)) && role === 'tamu') {
    return NextResponse.redirect(new URL('/?err=staff-only', req.url));
  }
  return res;
}

export const config = { matcher: ['/dashboard/:path*', '/reservations/:path*', '/front-office/:path*', '/folio/:path*', '/housekeeping/:path*', '/reports/:path*', '/master/:path*', '/settings/:path*'] };
