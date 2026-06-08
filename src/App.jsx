import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// CONFIGURACIÓN DE DATOS MAESTROS INICIALES
// ==========================================
const BASE_PLATFORMS = [
  { id: 'net-c', name: 'Netflix Premium 4K', defaultPrice: 45, icon: '🍿' },
  { id: 'dis-e', name: 'Disney+ (7 ESPN)', defaultPrice: 40, icon: '🏰' },
  { id: 'max-p', name: 'Max (HBO Max)', defaultPrice: 35, icon: '🎬' },
  { id: 'prime', name: 'Prime Video', defaultPrice: 35, icon: '💎' },
  { id: 'param', name: 'Paramount+', defaultPrice: 30, icon: '⭐' },
  { id: 'vix', name: 'VIX Premium', defaultPrice: 25, icon: '📺' },
  { id: 'spot', name: 'Spotify Premium', defaultPrice: 35, icon: '🎵' },
  { id: 'yt', name: 'YouTube Premium', defaultPrice: 40, icon: '▶️' },
  { id: 'gpt', name: 'ChatGPT Plus (1 Disp.)', defaultPrice: 35, icon: '🤖' },
  { id: 'crunchy', name: 'Crunchyroll Mega Fan', defaultPrice: 30, icon: '🍥' }
];

const COMBOS_CONFIG = [
  { id: 'c3', name: 'Combo de 3 Pantallas', price: 95, size: 3 },
  { id: 'c4', name: 'Combo de 4 Pantallas', price: 125, size: 4 },
  { id: 'c5', name: 'Combo de 5 Pantallas Super Full', price: 150, size: 5 }
];

export default function MultiversoApp() {
  // ==========================================
  // ESTADOS DEL SISTEMA (PERSISTENCIA LOCAL)
  // ==========================================
  const [view, setView] = useState('store'); // 'store' o 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados del Armador de Combos
  const [activeCombo, setActiveCombo] = useState(null);
  const [selectedAppsForCombo, setSelectedAppsForCombo] = useState([]);

  // Estados del Formulario del Cliente
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', note: '' });

  // Base de datos local (Cuentas Madre & Pedidos)
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('mv_inventory');
    return saved ? JSON.parse(saved) : [
      {
        id: 'acc-1',
        platformId: 'net-c',
        email: 'proveedor.netflix1@multiverso.com',
        pass: 'RickAndMorty2026',
        cost: 45.00,
        renewalDate: '2026-07-10',
        profiles: [
          { id: 'p1', label: 'Perfil 1', userAssigned: 'Carlos Gómez', pin: '1010', status: 'Ocupado', expires: '2026-07-08' },
          { id: 'p2', label: 'Perfil 2', userAssigned: '', pin: '2020', status: 'Disponible', expires: '' },
          { id: 'p3', label: 'Perfil 3', userAssigned: '', pin: '3030', status: 'Disponible', expires: '' },
          { id: 'p4', label: 'Perfil 4', userAssigned: '', pin: '4040', status: 'Disponible', expires: '' },
          { id: 'p5', label: 'Perfil 5', userAssigned: '', pin: '5050', status: 'Disponible', expires: '' }
        ]
      },
      {
        id: 'acc-2',
        platformId: 'dis-e',
        email: 'disney.fam@multiverso.com',
        pass: 'PortalGun99*',
        cost: 35.00,
        renewalDate: '2026-06-28',
        profiles: [
          { id: 'p6', label: 'Perfil 1', userAssigned: 'María López', pin: '', status: 'Ocupado', expires: '2026-07-01' },
          { id: 'p7', label: 'Perfil 2', userAssigned: '', pin: '', status: 'Disponible', expires: '' },
          { id: 'p8', label: 'Perfil 3', userAssigned: '', pin: '', status: 'Disponible', expires: '' },
          { id: 'p9', label: 'Perfil 4', userAssigned: '', pin: '', status: 'Disponible', expires: '' }
        ]
      }
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('mv_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord-101',
        customerName: 'Juan Pérez',
        customerPhone: '50243695469',
        items: [
          { name: 'Netflix Premium 4K', price: 45, qty: 1, isCombo: false }
        ],
        total: 45,
        note: 'Entregar por la tarde',
        status: 'Pendiente',
        date: '2026-06-08'
      }
    ];
  });

  // Estado para añadir nueva cuenta madre en admin
  const [newAccount, setNewAccount] = useState({
    platformId: 'net-c', email: '', pass: '', cost: '', renewalDate: '', profileCount: 5
  });

  // Guardado en LocalStorage automáticamente al cambiar estados
  useEffect(() => {
    localStorage.setItem('mv_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('mv_orders', JSON.stringify(orders));
  }, [orders]);

  // ==========================================
  // CÁLCULOS DINÁMICOS DE STOCK & MÉTRICAS
  // ==========================================
  const appStockMap = useMemo(() => {
    const stock = {};
    BASE_PLATFORMS.forEach(p => { stock[p.id] = 0; });
    inventory.forEach(acc => {
      const available = acc.profiles.filter(prof => prof.status === 'Disponible').length;
      if (stock[acc.platformId] !== undefined) {
        stock[acc.platformId] += available;
      }
    });
    return stock;
  }, [inventory]);

  const metrics = useMemo(() => {
    const totalInverted = inventory.reduce((sum, acc) => sum + parseFloat(acc.cost || 0), 0);
    // Ganancias estimadas basándonos en perfiles ocupados actualmente
    let activeSales = 0;
    inventory.forEach(acc => {
      const activeProfilesCount = acc.profiles.filter(p => p.status === 'Ocupado').length;
      const baseApp = BASE_PLATFORMS.find(b => b.id === acc.platformId);
      const profilePrice = baseApp ? baseApp.defaultPrice : 35;
      activeSales += (activeProfilesCount * profilePrice);
    });
    return {
      inverted: totalInverted,
      sales: activeSales,
      profit: activeSales - totalInverted
    };
  }, [inventory]);

  // ==========================================
  // LÓGICA DE FLUJOS: TIENDA PÚBLICA
  // ==========================================
  const filteredApps = BASE_PLATFORMS.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCartIndividual = (app) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === app.id && !item.isCombo);
      if (existing) {
        return prev.map(item => item.id === app.id && !item.isCombo ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: app.id, name: app.name, price: app.defaultPrice, qty: 1, isCombo: false, icon: app.icon }];
    });
    setIsCartOpen(true);
  };

  const handleOpenComboModal = (combo) => {
    setActiveCombo(combo);
    setSelectedAppsForCombo([]);
  };

  const handleToggleAppInCombo = (appName) => {
    setSelectedAppsForCombo(prev => {
      if (prev.includes(appName)) {
        return prev.filter(a => a !== appName);
      }
      if (prev.length < activeCombo.size) {
        return [...prev, appName];
      }
      return prev;
    });
  };

  const handleConfirmCombo = () => {
    if (selectedAppsForCombo.length !== activeCombo.size) return;
    const comboCartId = `combo-${Date.now()}`;
    setCart(prev => [
      ...prev,
      {
        id: comboCartId,
        name: activeCombo.name,
        price: activeCombo.price,
        qty: 1,
        isCombo: true,
        details: selectedAppsForCombo.join(', '),
        icon: '🔮'
      }
    ]);
    setActiveCombo(null);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const targetQty = item.qty + delta;
        return targetQty > 0 ? { ...item, qty: targetQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.name.trim()) return alert('Por favor, ingresa tu nombre');

    // Registrar pedido internamente en el panel de control
    const newOrderObj = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      customerName: checkoutForm.name,
      customerPhone: checkoutForm.phone || 'No especificado',
      items: [...cart],
      total: cartTotal,
      note: checkoutForm.note,
      status: 'Pendiente',
      date: new Date().toISOString().split('T')[0]
    };

    setOrders(prev => [newOrderObj, ...prev]);

    // Crear el mensaje formateado estético para WhatsApp
    let itemLines = '';
    cart.forEach(item => {
      if (item.isCombo) {
        itemLines += `• 1x *${item.name}* (_${item.details}_) - Q${item.price}\n`;
      } else {
        itemLines += `• ${item.qty}x *${item.name}* - Q${item.price * item.qty}\n`;
      }
    });

    const waMessage = `✨ *NUEVO PEDIDO - MULTIVERSO STREAMING* ✨\n\n👤 *Cliente:* ${checkoutForm.name}\n📞 *Teléfono:* ${checkoutForm.phone || 'N/A'}\n\n📦 *Detalle del Pedido:*\n${itemLines}\n💰 *Total Neto:* Q${cartTotal}.00\n📝 *Nota:* ${checkoutForm.note || 'Ninguna'}\n\n🚀 _¡Espero mi combo del multiverso cuanto antes!_`;
    
    // Dirección por defecto del negocio
    window.open(`https://wa.me/50243695469?text=${encodeURIComponent(waMessage)}`, '_blank');
    
    // Limpieza de estados del carrito
    setCart([]);
    setIsCartOpen(false);
    setCheckoutForm({ name: '', phone: '', note: '' });
    alert('¡Tu pedido ha sido procesado y enviado a la cola del Administrador!');
  };

  // ==========================================
  // LÓGICA DE FLUJOS: PANEL ADMINISTRADOR
  // ==========================================
  const handleAddMotherAccount = (e) => {
    e.preventDefault();
    if (!newAccount.email || !newAccount.pass) return alert('Completa los accesos de la cuenta');

    const generatedProfiles = Array.from({ length: parseInt(newAccount.profileCount || 5) }, (_, i) => ({
      id: `prof-${Date.now()}-${i}`,
      label: `Perfil ${i + 1}`,
      userAssigned: '',
      pin: '',
      status: 'Disponible',
      expires: ''
    }));

    const newAccObj = {
      id: `acc-${Date.now()}`,
      platformId: newAccount.platformId,
      email: newAccount.email,
      pass: newAccount.pass,
      cost: parseFloat(newAccount.cost || 0),
      renewalDate: newAccount.renewalDate || new Date().toISOString().split('T')[0],
      profiles: generatedProfiles
    };

    setInventory(prev => [...prev, newAccObj]);
    setNewAccount({ platformId: 'net-c', email: '', pass: '', cost: '', renewalDate: '', profileCount: 5 });
  };

  const handleUpdateProfileField = (accId, profId, field, value) => {
    setInventory(prev => prev.map(acc => {
      if (acc.id === accId) {
        const updatedProfiles = acc.profiles.map(p => {
          if (p.id === profId) {
            let nextStatus = p.status;
            if (field === 'userAssigned') {
              nextStatus = value.trim() !== '' ? 'Ocupado' : 'Disponible';
            }
            return { ...p, [field]: value, status: nextStatus };
          }
          return p;
        });
        return { ...acc, profiles: updatedProfiles };
      }
      return acc;
    }));
  };

  // Despachar Credenciales con cálculo automático de 30 días calendario
  const handleDispatchCredentials = (order) => {
    // Calcular automáticamente sumando 30 días a la fecha de hoy
    const calculatedExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    // Intentamos buscar perfiles ocupados asignados al nombre del cliente en el inventario para extraer sus datos
    let accountsFound = [];
    inventory.forEach(acc => {
      const matchPlat = BASE_PLATFORMS.find(b => b.id === acc.platformId);
      acc.profiles.forEach(p => {
        if (p.userAssigned.toLowerCase().includes(order.customerName.toLowerCase())) {
          accountsFound.push({
            platform: matchPlat ? matchPlat.name : 'Streaming App',
            email: acc.email,
            pass: acc.pass,
            profile: p.label,
            pin: p.pin || 'Sin PIN'
          });
        }
      });
    });

    let accessBlocks = '';
    if (accountsFound.length > 0) {
      accountsFound.forEach(acc => {
        accessBlocks += `📺 *${acc.platform}*\n📧 *Correo:* \`\`\`${acc.email}\`\`\`\n🔑 *Contraseña:* \`\`\`${acc.pass}\`\`\`\n👤 *Tu Perfil:* ${acc.profile}\n📌 *PIN:* \`\`\`${acc.pin}\`\`\`\n\n`;
      });
    } else {
      // Formato fallback estructurado si aún no se mapearon los nombres exactos en inventario
      accessBlocks += `📺 *Netflix Premium 4K* (Ejemplo)\n📧 *Correo:* \`\`\`ejemplo@multiverso.com\`\`\`\n🔑 *Contraseña:* \`\`\`Pass1234\`\`\`\n👤 *Tu Perfil:* Perfil Asignado\n📌 *PIN:* \`\`\`1122\`\`\`\n\n`;
    }

    const deliveryMessage = `🔮 *¡TUS ACCESOS DE MULTIVERSO STREAMING ESTÁN LISTOS!* 🚀\n\nHola *${order.customerName}*, aquí tienes las credenciales de tu servicio listas para disfrutar:\n\n${accessBlocks}📅 *Fecha de vencimiento:* ${calculatedExpiry} (30 días de Cobertura Total)\n\n⚠️ *REGLAS DE ORO DEL MULTIVERSO:*\n1. No cambies datos de la cuenta madre (correo/contraseña).\n2. Usa únicamente tu perfil asignado.\n3. Respeta el límite de pantallas por dispositivo.\n\n¡Gracias por tu confianza! Escríbenos ante cualquier duda. 🎬`;

    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(deliveryMessage)}`, '_blank');

    // Cambiar estado del pedido a completado
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Completado' } : o));
  };

  return (
    <div className="min-h-screen bg-[#07040d] text-zinc-100 font-sans antialiased selection:bg-purple-600 selection:text-white">
      
      {/* HEADER / NAVBAR PRINCIPAL COHESIVO */}
      <nav className="sticky top-0 bg-[#07040d]/90 backdrop-blur-md border-b border-purple-950/40 z-40 px-4 py-3 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('store')}>
          <span className="text-2xl animate-pulse">🔮</span>
          <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400">
            MULTIVERSO
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {view === 'store' ? (
            <>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-purple-950/30 border border-purple-900/30 rounded-xl hover:bg-purple-900/40 transition text-zinc-200"
              >
                🛒 Carrito
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setView('admin')}
                className="text-xs font-bold text-purple-400 border border-purple-900/60 bg-purple-950/20 px-3 py-2 rounded-xl hover:bg-purple-900/30 transition"
              >
                ⚙️ Panel Admin
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('store')}
              className="text-xs font-bold text-pink-400 border border-pink-900/60 bg-pink-950/20 px-4 py-2 rounded-xl hover:bg-pink-900/30 transition"
            >
              🌐 Ver Tienda Pública
            </button>
          )}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* VISTA A: STOREFRONT PÚBLICO (CATÁLOGO + CONSTRUCTOR COMBOS)               */}
      {/* ========================================================================= */}
      {view === 'store' && (
        <div className="max-w-6xl mx-auto px-4 pb-24">
          {/* Hero Contextual */}
          <header className="max-w-2xl mx-auto text-center pt-12 pb-8">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>¡El mejor streaming de todo el multiverso al mejor precio!</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Combos de Entretenimiento <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400">
                Garantizados en Quetzales
              </span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Selecciona tus pantallas individuales o arma paquetes premium validados con entrega rápida directa a tu WhatsApp.
            </p>
          </header>

          {/* Buscador de Streaming */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar plataforma activa (Netflix, Max, Disney...)" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-purple-950/40 rounded-2xl p-3.5 pl-10 text-sm text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              />
              <span className="absolute left-3.5 top-4 text-zinc-500 text-sm">🔍</span>
            </div>
          </div>

          {/* SECCIÓN 1: COMBOS ESPECIALES INTERACTIVOS */}
          <section className="mb-14">
            <div className="mb-6">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">Ahorro Masivo</span>
              <h2 className="text-2xl font-black text-white">Combos Multi-Pantallas Autogestionables</h2>
              <p className="text-xs text-zinc-500">Elige las plataformas que quieras dentro del tamaño del combo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {COMBOS_CONFIG.map(combo => (
                <div key={combo.id} className="bg-gradient-to-b from-zinc-900/70 to-purple-950/20 border border-purple-900/30 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-700/40 transition shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-pink-600/10 text-pink-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-pink-900/20 uppercase tracking-wider">
                    Elige {combo.size} apps
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white mb-2">{combo.name}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                      Paquete premium con perfiles privados independientes, ideal para el hogar o revendedores autorizados.
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-purple-950/40">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Precio Único</p>
                      <p className="text-2xl font-black text-amber-400 font-mono">Q{combo.price}.00</p>
                    </div>
                    <button 
                      onClick={() => handleOpenComboModal(combo)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-md shadow-purple-950/50 transform active:scale-95"
                    >
                      🛠️ Configurar Combo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 2: GRID CUENTAS INDIVIDUALES */}
          <section>
            <div className="mb-6">
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest block mb-1">Plataformas Unitarias</span>
              <h2 className="text-2xl font-black text-white">Catálogo Individual en Vivo</h2>
              <p className="text-xs text-zinc-500">Precios por pantalla al mes con renovación continua.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {filteredApps.map(app => {
                const stockAvailable = appStockMap[app.id] || 0;
                return (
                  <div key={app.id} className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-950/60 transition relative">
                    <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400">
                      Stock: {stockAvailable}
                    </span>
                    <div>
                      <span className="text-3xl mb-3 block">{app.icon}</span>
                      <h3 className="font-bold text-sm text-zinc-200 line-clamp-1 mb-1">{app.name}</h3>
                      <p className="text-xs text-zinc-500 font-medium">1 Mes Completo</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-zinc-900">
                      <p className="text-base font-black text-amber-400 font-mono mb-2">Q{app.defaultPrice}.00</p>
                      <button 
                        onClick={() => addToCartIndividual(app)}
                        disabled={stockAvailable === 0}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                          stockAvailable > 0 
                            ? 'bg-zinc-800 text-zinc-200 hover:bg-pink-600 hover:text-white' 
                            : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {stockAvailable > 0 ? '➕ Agregar' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA B: PANEL DE ADMINISTRACIÓN / INVENTARIO / PEDIDOS                    */}
      {/* ========================================================================= */}
      {view === 'admin' && (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
          {/* Header del Admin */}
          <div className="flex flex-wrap justify-between items-center border-b border-purple-950/40 pb-5 mb-8">
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-wide">
                ⚙️ CONTROL DE INVENTARIO CENTRALIZADO
              </h1>
              <p className="text-xs text-zinc-400">Gestión de Stock, Costos de Proveedor y Despacho Automatizado (+30 Días)</p>
            </div>
          </div>

          {/* BLOQUE DE MÉTRICAS AUTOMÁTICAS EN QUETZALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Inversión Total Proveedores</p>
              <p className="text-3xl font-black text-red-400 font-mono">Q{metrics.inverted.toFixed(2)}</p>
              <p className="text-[10px] text-zinc-600 mt-2">Suma de costos fijos de cuentas madre añadidas.</p>
            </div>
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Ventas Activas Proyectadas</p>
              <p className="text-3xl font-black text-emerald-400 font-mono">Q{metrics.sales.toFixed(2)}</p>
              <p className="text-[10px] text-zinc-600 mt-2">Basado en el número de perfiles marcados como "Ocupado".</p>
            </div>
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Margen de Ganancia Neta</p>
              <p className="text-3xl font-black text-amber-400 font-mono">Q{metrics.profit.toFixed(2)}</p>
              <p className="text-[10px] text-zinc-600 mt-2">Diferencia neta real de tu operación en el multiverso.</p>
            </div>
          </div>

          {/* SECCIÓN TRABAJO: COLA DE PEDIDOS ENTRANTES */}
          <section className="mb-12">
            <h2 className="text-lg font-black text-zinc-200 mb-4 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
              <span>📥 Cola de Pedidos de la Tienda</span>
            </h2>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
              {orders.length === 0 ? (
                <p className="text-zinc-500 text-sm p-6 text-center">No hay pedidos entrantes en la cola actual.</p>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {orders.map(order => (
                    <div key={order.id} className="p-5 flex flex-wrap justify-between items-start gap-4 hover:bg-zinc-900/20 transition">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded-md font-mono">{order.id}</span>
                          <h4 className="font-bold text-sm text-zinc-200">{order.customerName}</h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            order.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>{order.status}</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono">WhatsApp: {order.customerPhone} | Fecha: {order.date}</p>
                        <div className="pt-2 text-xs text-zinc-400">
                          <span className="font-bold text-zinc-500">Items: </span>
                          {order.items.map((it, idx) => (
                            <span key={idx} className="bg-zinc-950 px-2 py-1 rounded border border-zinc-800 mr-1 text-[11px]">
                              {it.qty}x {it.name} {it.details ? `(${it.details})` : ''}
                            </span>
                          ))}
                        </div>
                        {order.note && <p className="text-[11px] text-pink-400 italic mt-1">Nota cliente: "{order.note}"</p>}
                      </div>

                      <div className="text-right flex flex-col justify-between h-full min-w-[140px]">
                        <p className="text-lg font-black text-amber-400 font-mono mb-3">Q{order.total}.00</p>
                        <button 
                          onClick={() => handleDispatchCredentials(order)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition shadow-md flex items-center justify-center space-x-1"
                        >
                          <span>💬 Entregar Accesos</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* SECCIÓN TRABAJO: INVENTARIO DE CUENTAS MADRE */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lado Izquierdo: Cargar Nueva Cuenta Madre */}
            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl h-fit">
              <h3 className="font-extrabold text-sm text-zinc-200 mb-4 uppercase tracking-wider border-b border-zinc-800 pb-2">
                ➕ Añadir Cuenta Madre
              </h3>
              <form onSubmit={handleAddMotherAccount} className="space-y-4">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Plataforma Asociada</label>
                  <select 
                    value={newAccount.platformId}
                    onChange={e => setNewAccount({...newAccount, platformId: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 outline-none"
                  >
                    {BASE_PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Correo de la Cuenta Madre</label>
                  <input 
                    type="email" required placeholder="correo@proveedor.com"
                    value={newAccount.email}
                    onChange={e => setNewAccount({...newAccount, email: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Contraseña Cuenta Madre</label>
                  <input 
                    type="text" required placeholder="PasswordSegura123"
                    value={newAccount.pass}
                    onChange={e => setNewAccount({...newAccount, pass: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Costo Proveedor (Q)</label>
                    <input 
                      type="number" placeholder="45.00" step="any"
                      value={newAccount.cost}
                      onChange={e => setNewAccount({...newAccount, cost: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Nº de Perfiles (Stock)</label>
                    <input 
                      type="number" placeholder="5" min="1" max="10"
                      value={newAccount.profileCount}
                      onChange={e => setNewAccount({...newAccount, profileCount: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Fecha de Renovación Cuenta</label>
                  <input 
                    type="date"
                    value={newAccount.renewalDate}
                    onChange={e => setNewAccount({...newAccount, renewalDate: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs outline-none text-zinc-300"
                  />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-2.5 rounded-xl text-xs font-bold text-white transition">
                  Inyectar al Inventario
                </button>
              </form>
            </div>

            {/* Lado Derecho: Gestión y Mapeo en Vivo de Perfiles */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-extrabold text-sm text-zinc-200 uppercase tracking-wider">📦 Desglose de Cuentas Madre e Inventario Real</h3>
              
              {inventory.length === 0 ? (
                <p className="text-zinc-600 text-xs py-6">No hay inventario cargado. Añade una cuenta en el formulario izquierdo.</p>
              ) : (
                inventory.map(acc => {
                  const matchingPlat = BASE_PLATFORMS.find(b => b.id === acc.platformId);
                  const dispCount = acc.profiles.filter(p => p.status === 'Disponible').length;

                  return (
                    <div key={acc.id} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 shadow-sm">
                      {/* Fila de Título */}
                      <div className="flex flex-wrap justify-between items-center gap-2 pb-3 mb-4 border-b border-zinc-800">
                        <div>
                          <span className="bg-purple-950 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase">
                            {matchingPlat ? matchingPlat.name : 'Streaming'}
                          </span>
                          <span className="text-xs font-mono text-zinc-300 font-bold">{acc.email}</span>
                          <span className="text-[11px] text-zinc-500 ml-2">({acc.pass})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-zinc-400 block font-bold">Disponible: <span className="text-emerald-400">{dispCount} / {acc.profiles.length}</span></span>
                        </div>
                      </div>

                      {/* Sub-tabla de Perfiles para Mapear */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="text-zinc-500 border-b border-zinc-800/40">
                              <th className="pb-2 text-[10px] uppercase font-bold">Nº Perfil</th>
                              <th className="pb-2 text-[10px] uppercase font-bold">Asignar Cliente (Nombre)</th>
                              <th className="pb-2 text-[10px] uppercase font-bold">PIN</th>
                              <th className="pb-2 text-[10px] uppercase font-bold">Estado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/30">
                            {acc.profiles.map(prof => (
                              <tr key={prof.id} className="hover:bg-zinc-900/30">
                                <td className="py-2.5 font-bold text-zinc-400">{prof.label}</td>
                                <td className="py-2.5 pr-2">
                                  <input 
                                    type="text" placeholder="Disponible / Nombre..."
                                    value={prof.userAssigned}
                                    onChange={(e) => handleUpdateProfileField(acc.id, prof.id, 'userAssigned', e.target.value)}
                                    className="bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200 w-full outline-none focus:border-purple-900"
                                  />
                                </td>
                                <td className="py-2.5 pr-2">
                                  <input 
                                    type="text" placeholder="----"
                                    value={prof.pin}
                                    onChange={(e) => handleUpdateProfileField(acc.id, prof.id, 'pin', e.target.value)}
                                    className="bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-300 w-20 text-center font-mono outline-none"
                                  />
                                </td>
                                <td className="py-2.5">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    prof.status === 'Ocupado' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                                  }`}>{prof.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN COMPONENTE MODAL: CONSTRUCTOR DE COMBOS VALIDADO                */}
      {/* ========================================================================= */}
      {activeCombo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-purple-900/40 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-zinc-800/80 flex justify-between items-center bg-zinc-900">
              <div>
                <h3 className="font-extrabold text-lg text-white">{activeCombo.name}</h3>
                <p className="text-xs text-zinc-400">Seleccionadas: <span className="text-pink-400 font-bold">{selectedAppsForCombo.length}</span> de <span className="text-white font-bold">{activeCombo.size}</span> requeridas</p>
              </div>
              <button onClick={() => setActiveCombo(null)} className="text-zinc-500 hover:text-white font-black text-xl">✕</button>
            </div>

            {/* Grid de Apps Elegibles */}
            <div className="p-4 overflow-y-auto grid grid-cols-2 gap-2 bg-[#0d0a14]">
              {BASE_PLATFORMS.map(app => {
                const isSelected = selectedAppsForCombo.includes(app.name);
                const isLimitReached = selectedAppsForCombo.length >= activeCombo.size && !isSelected;
                return (
                  <button
                    key={app.id}
                    disabled={isLimitReached}
                    onClick={() => handleToggleAppInCombo(app.name)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition ${
                      isSelected 
                        ? 'bg-purple-600/20 border-purple-500 text-white font-bold shadow-lg shadow-purple-950/40' 
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    } ${isLimitReached ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className="text-xs font-semibold line-clamp-1">{app.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer de Confirmación Validado */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xl font-black text-amber-400 font-mono">Q{activeCombo.price}.00</span>
              <button
                disabled={selectedAppsForCombo.length !== activeCombo.size}
                onClick={handleConfirmCombo}
                className={`py-2.5 px-6 rounded-xl font-extrabold text-xs transition uppercase ${
                  selectedAppsForCombo.length === activeCombo.size
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
              >
                {selectedAppsForCombo.length === activeCombo.size ? '✅ Añadir Combo' : `Elige ${activeCombo.size - selectedAppsForCombo.length} más`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN COMPONENTE MODAL / SIDEBAR: INTERFAZ CARRITO DE COMPRAS           */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-zinc-950 w-full max-w-md h-full shadow-2xl flex flex-col p-6 border-l border-purple-950/40">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-900">
              <h3 className="font-black text-lg flex items-center space-x-2 text-white">
                <span>🛒 Tu Pedido Actual</span>
                <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-0.5 rounded-full font-mono">{cart.length}</span>
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white font-bold text-xl">✕</button>
            </div>

            {/* Listado del Carrito */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-zinc-600">
                  <span className="text-4xl block mb-3">📥</span>
                  <p className="text-sm font-medium">El carrito está vacío en este multiverso.</p>
                  <p className="text-xs text-zinc-700 mt-1">Configura un combo o añade pantallas sueltas.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-zinc-900/40 border border-zinc-900 p-3.5 rounded-2xl flex justify-between items-center gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{item.icon}</span>
                        <h4 className="font-extrabold text-xs text-zinc-200">{item.name}</h4>
                      </div>
                      {item.isCombo && <p className="text-[10px] text-pink-400 mt-1 font-semibold leading-tight">{item.details}</p>}
                      <p className="text-xs text-amber-500 font-mono font-bold mt-1.5">Q{item.price * item.qty}.00</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-xl">
                      <button onClick={() => handleUpdateCartQty(item.id, -1)} className="text-xs px-1 text-zinc-500 hover:text-white font-bold">-</button>
                      <span className="text-xs font-mono font-bold text-zinc-200">{item.qty}</span>
                      <button onClick={() => handleUpdateCartQty(item.id, 1)} className="text-xs px-1 text-zinc-500 hover:text-white font-bold">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Formulario de Registro / Envío a WhatsApp */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckoutSubmit} className="border-t border-zinc-900 pt-4 space-y-3 bg-zinc-950">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block mb-1">Tu Nombre Completo *</label>
                  <input 
                    type="text" required placeholder="Ej. Carlos V." 
                    value={checkoutForm.name}
                    onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block mb-1">Teléfono de WhatsApp (Guatemala)</label>
                  <input 
                    type="tel" placeholder="Ej. 502XXXXX" 
                    value={checkoutForm.phone}
                    onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block mb-1">Notas Especiales / Comentario</label>
                  <textarea 
                    placeholder="Instrucciones de entrega..." rows={2}
                    value={checkoutForm.note}
                    onChange={e => setCheckoutForm({...checkoutForm, note: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none resize-none focus:border-pink-500"
                  />
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-900 flex justify-between items-center my-3">
                  <span className="text-xs font-bold text-zinc-400">Total a Pagar:</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 font-mono">Q{cartTotal}.00</span>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-950/40 uppercase tracking-wider"
                >
                  <span>💬 Confirmar y Enviar por WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
