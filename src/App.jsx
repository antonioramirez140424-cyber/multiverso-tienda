import React from 'react';

const CATALOGO = [
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

const COMBOS = [
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
      
      <h2 className="text-lg font-bold mb-4 border-b border-purple-900 pb-2">CUENTAS INDIVIDUALES</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {CATALOGO.map((item, i) => (
          <button key={i} onClick={() => enviarWhatsApp(item)} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-left hover:border-purple-500">
            <span className="text-xl">{item.icon}</span>
            <p className="text-xs font-bold">{item.name}</p>
            <p className="text-green-400 font-black">Q{item.price}.00</p>
          </button>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-4 border-b border-purple-900 pb-2">COMBOS DISPONIBLES</h2>
      <div className="space-y-2">
        {COMBOS.map((combo, i) => (
          <button key={i} onClick={() => enviarWhatsApp(combo)} className="w-full flex justify-between bg-purple-900/20 p-4 rounded-xl border border-purple-700">
            <span className="font-bold">{combo.name}</span>
            <span className="text-green-400 font-black">Q{combo.price}.00</span>
          </button>
        ))}
      </div>
    </div>
