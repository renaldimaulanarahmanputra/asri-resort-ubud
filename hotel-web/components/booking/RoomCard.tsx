// components/booking/RoomCard.tsx — dipakai di /rooms (W2)
'use client';
import type { AvailabilityItem } from '../../lib/types';
import { formatRupiah } from '../../lib/utils';

export function RoomCard({ item, onPilih }: { item: AvailabilityItem; onPilih: () => void }) {
  const habis = item.sisa_kamar <= 0;
  return (
    <div className="border rounded-xl overflow-hidden bg-white flex flex-col md:flex-row">
      <div className="bg-gray-200 md:w-48 h-32 md:h-auto flex items-center justify-center text-gray-400 text-sm">
        {item.foto}
      </div>
      <div className="p-4 flex-1 grid gap-1">
        <p className="font-semibold">{item.nama} <span className="text-xs font-normal text-gray-500">· max {item.kapasitas} tamu</span></p>
        <p className="text-sm text-gray-600">{formatRupiah(item.harga_per_malam)} x {item.jumlah_malam} malam = {formatRupiah(item.subtotal)}</p>
        <p className="font-semibold">Total + pajak: {formatRupiah(item.total_estimasi)}</p>
        <p className="text-xs text-gray-500">Sisa {item.sisa_kamar} kamar</p>
        <button onClick={onPilih} disabled={habis} className="mt-2 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm disabled:bg-gray-300">
          {habis ? 'Habis' : 'Pilih'}
        </button>
      </div>
    </div>
  );
}
