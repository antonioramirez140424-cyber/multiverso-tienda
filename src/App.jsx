import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-sans p-4">
      {/* Encabezado Estilo Portal */}
      <header className="border-b-4 border-green-500 pb-6 mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase italic shadow-[0_0_20px_#22c55e]">
          Multiverso 🌀
        </h1>
        <h2 className="text-xl md:text-2xl text-green-500 font-mono mt-2">Streaming Resale Service</h2>
      </header>

      {/* Grid de Productos */}
      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Combo 3 */}
        <div className="bg-black border-2 border-green-500 p-6 rounded-3xl hover:border-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <h3 className="text-2xl font-bold text-white mb-2">Combo 3 Pantallas</h3>
          <p className="text-gray-400 mb-4 text-sm">Perfiles privados independientes, ideal para el hogar.</p>
          <div className="text-4xl font-black text-green-400 mb-6">Q65.00</div>
          <button className="w-full bg-green-500 text-black font-black py-3 rounded-full hover:bg-white transition-colors uppercase tracking-widest">
            Comprar ahora
          </button>
        </div>

        {/* Combo 4 */}
        <div className="bg-black border-2 border-green-500 p-6 rounded-3xl hover:border-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <h3 className="text-2xl font-bold text-white mb-2">Combo 4 Pantallas</h3>
          <p className="text-gray-400 mb-4 text-sm">Máxima estabilidad, ideal para revendedores.</p>
          <div className="text-4xl font-black text-green-400 mb-6">Q125.00</div>
          <button className="w-full bg-green-500 text-black font-black py-3 rounded-full hover:bg-white transition-colors uppercase tracking-widest">
            Comprar ahora
          </button>
        </div>
      </main>

      {/* Botón de WhatsApp Flotante */}
      <div className="fixed bottom-6 right-6">
        <a 
          href="https://wa.me/502YOURNUMBERHERE" 
          className="bg-green-500 text-black p-4 rounded-full shadow-[0_0_20px_#22c55e] font-black flex items-center gap-2"
        >
          <span>🌀</span> CONSULTAR
        </a>
      </div>
    </div>
  );
};

export default App;
