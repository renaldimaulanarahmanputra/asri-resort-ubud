// components/ui/StatusChip.tsx — warna status tetap, jangan bikin custom per halaman
import type { ReservationStatus, RoomStatus } from '../../lib/types';

const reservationColor: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  checked_in: 'bg-green-100 text-green-800',
  checked_out: 'bg-gray-200 text-gray-700',
  cancelled: 'bg-gray-100 text-gray-500 line-through',
  no_show: 'bg-black text-white',
};

const roomColor: Record<RoomStatus, string> = {
  vacant_clean: 'bg-emerald-100 text-emerald-800',
  vacant_dirty: 'bg-amber-100 text-amber-800',
  occupied_clean: 'bg-blue-100 text-blue-800',
  occupied_dirty: 'bg-orange-100 text-orange-800',
  out_of_order: 'bg-red-100 text-red-800',
  maintenance: 'bg-purple-100 text-purple-800',
};

export function ReservationChip({ status }: { status: ReservationStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${reservationColor[status]}`}>
      {status}
    </span>
  );
}

export function RoomChip({ status }: { status: RoomStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roomColor[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
