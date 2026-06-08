import React from 'react';

const CATALOGO_INDIVIDUAL = [
  { name: 'Netflix con códigos', price: 45, icon: '🍿' },
  { name: 'Netflix Miembro Extra 4K', price: 55, icon: '🔥' },
  { name: 'HBO Max', price: 35, icon: '🎥' },
  { name: 'Prime Video', price: 35, icon: '🎬' },
  { name: 'Paramount+', price: 30, icon: '⭐' },
  { name: 'ViX Premium', price: 25, icon: '📺' },
  { name: 'Spotify Premium', price: 35, icon: '🎵' },
  { name: 'YouTube Premium', price: 40, icon: '▶️' },
  { name: 'Disney+ (7 ESPN)', price: 40, icon: '🏰' },
  { name: 'Disney+ (Sin ESPN)', price: 35, icon: '✨' },
  { name: 'ChatGPT Plus', price: 35, icon: '🤖' },
  { name: 'Max Player', price: 35, icon: '📡' },
  { name: 'Crunchyroll', price: 30, icon: '🍥' }
];

const COMBOS_DUOS = [
  { name: 'Netflix (sin cód) + Disney+ (7 ESPN)', price: 80 },
  { name: 'Netflix + Max', price: 65 },
  { name: 'Netflix + Prime Video', price: 65 },
  { name: 'Netflix + Paramount+', price: 60 },
  { name: 'Netflix + ViX Premium', price: 60 },
  { name: 'Netflix + Max Player', price: 65 },
  { name: 'Netflix + Spotify', price: 65 },
  { name: 'Netflix + YouTube Premium', price: 70 },
  { name: 'Max + Prime Video', price: 60 },
  { name: 'Max + ViX Premium', price: 55 },
  { name: 'Max + Spotify', price: 60 },
  { name: 'Max + Disney+', price: 65 },
  { name: 'Max + YouTube Premium', price: 65 },
  { name: 'Max + Paramount+', price: 55 },
  { name: 'Prime Video + ViX Premium', price: 55 },
  { name: 'Prime Video + Spotify', price: 60 },
  { name: 'Prime Video + YouTube Premium', price: 65 },
  { name: 'Prime Video + Paramount+', price: 55 },
  { name: 'Paramount+ + ViX Premium', price: 50 },
  { name: 'Paramount+ + YouTube Premium', price: 60 },
  { name: 'Paramount+ + Disney+', price: 60 },
  { name: 'Paramount+ + Spotify', price: 55 },
  { name: 'ViX Premium + YouTube Premium', price: 50 },
  { name: 'ViX Premium + Disney+', price: 55 },
  { name: 'ViX Premium + Spotify', price: 50 }
];

const COMBOS_ESPECIALES = [
  { name: 'Combo 3 Apps', price: 95 },
  { name: 'Combo 4 Apps', price: 125 },
  { name: 'Combo 5 Apps', price: 150 },
  { name: 'Combo Full (Ent + Música)', price: 170 },
  { name: 'Combo Full Personal', price: 100 }
];

export default function MultiversoApp() {
  const enviarWhatsApp = (item) => {
    const mensaje = `¡Hola! Me interesa: ${item.name} por Q${item.price}.00`;
    window.open(`https://wa.me/50243695469?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07040d] text-zinc-100 p-4">
      <h1 className="text-2xl font-black text-center text-purple-400 mb-6">MULTIVERSO STREAMING</h1>
      
      {/* INDIVIDUALES */}
      <h2 className="text-lg font-bold mb-4 border-b border-purple-900 pb-2">CUENTAS INDIVIDUALES</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {CATALOGO_INDIVIDUAL.map((item, i) => (
          <button key={i} onClick={() => enviarWhatsApp(item)} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 hover:border-purple-500">
            <span className="text-xl">{item.icon}</span>
            <p className="text-xs font-bold">{item.name}</p>
            <p className="text-green-400 font-black">Q{item.price}.00</p>
          </button>
        ))}
      </div>

      {/* DUOS */}
      <h2 className="text-lg font-bold mb-4 border-b border-purple-900 pb-2">COMBOS DÚOS</h2>
      <div className="space-y-2 mb-8">
        {COMBOS_DUOS.map((combo, i) => (
          <button key={i} onClick={() => enviarWhatsApp(combo)} className="w-full flex justify-between bg-zinc-900 p-3 rounded-lg border border-zinc-800">
            <span className="text-sm font-medium">{combo.name}</span>
            <span className="text-green-400 font-bold">Q{combo.price}.00</span>
          </button>
        ))}
      </div>

      {/* ESPECIALES */}
      <h2 className="text-lg font-bold mb-4 border-b border-purple-900 pb-2">COMBOS ESPECIALES</h2>
      <div className="space-y-2">
        {COMBOS_ESPECIALES.map((combo, i) => (
          <button key={i} onClick={() => enviarWhatsApp(combo)} className="w-full flex justify-between bg-purple-900/20 p-4 rounded-xl border border-purple-700">
            <span className="font-bold">{combo.name}</span>
            <span className="text-green-400 font-black">Q{combo.price}.00</span>
          </button>
        ))}
      </div>
    </div>
  );
}
