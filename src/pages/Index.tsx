import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import CategorySelector from '@/components/CategorySelector';
import ProductCard from '@/components/ProductCard';
import ProductCustomizer from '@/components/ProductCustomizer';
import CartDrawer from '@/components/CartDrawer';
import MenuSkeleton from '@/components/MenuSkeleton';
import OpeningAnimation from '@/components/OpeningAnimation';
import GoldenGarlands from '@/components/GoldenGarlands';
import { useCart } from '@/store/useCart';
import type { Producto, Variante, MenuResponse } from '@/types/menu';
import { MapPin, Home, Utensils, Loader2, ChevronLeft } from 'lucide-react';

// Image imports
import imgCarpaccio from '@/assets/dish-carpaccio.jpg';
import imgTartar from '@/assets/dish-tartar.jpg';
import imgBurrata from '@/assets/dish-burrata.jpg';
import imgFilete from '@/assets/dish-filete.jpg';
import imgRisotto from '@/assets/dish-risotto.jpg';
import imgSalmon from '@/assets/dish-salmon.jpg';
import imgCreme from '@/assets/dish-creme.jpg';
import imgFondant from '@/assets/dish-fondant.jpg';
import imgEspresso from '@/assets/dish-espresso.jpg';
import imgVino from '@/assets/dish-vino.jpg';

const imageMap: Record<number, string> = {
  1: imgCarpaccio,
  2: imgTartar,
  3: imgBurrata,
  4: imgFilete,
  5: imgRisotto,
  6: imgSalmon,
  7: imgCreme,
  8: imgFondant,
  9: imgEspresso,
  10: imgVino,
};

const Index = ({ isDomicilio = false }: { isDomicilio?: boolean }) => {
  const [menu, setMenu] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [customizerProduct, setCustomizerProduct] = useState<Producto | null>(null);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [revealDone, setRevealDone] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [localTable, setLocalTable] = useState('');

  const addItem = useCart((s) => s.addItem);
  const orderType = useCart((s) => s.orderType);
  const tableNumber = useCart((s) => s.tableNumber);
  const setOrderInfo = useCart((s) => s.setOrderInfo);
  const clearCart = useCart((s) => s.clearCart);
  const gridRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (revealDone && !orderType && !isDomicilio) {
      // Solo abrimos el modal si no es domicilio y no hay mesa en URL
      const params = new URLSearchParams(window.location.search);
      if (!params.get('mesa')) {
        setIsLocationModalOpen(true);
      }
    }
  }, [revealDone, orderType, isDomicilio]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subdominio = params.get('subdominio') || 'pizzeria-roma';
    const mesaParam = params.get('mesa');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const fetchMenu = async () => {
      try {
        const url = mesaParam 
          ? `${apiUrl}/menu/${subdominio}/mesa/${mesaParam}`
          : `${apiUrl}/menu/${subdominio}/mesa/1`; // Default for fetching categories/products

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar el menú');
        const data = await response.json();
        setMenu(data);
        setActiveCategory(data.categorias[0]?.id ?? 0);

        // Auto-determinar orderType
        if (isDomicilio) {
          setOrderInfo('domicilio', null, data.sucursal_id, null);
        } else if (mesaParam) {
          setOrderInfo('sucursal', mesaParam, data.sucursal_id, data.mesa_id || Number(mesaParam));
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [isDomicilio]);

  useEffect(() => {
    if (!gridRef.current || loading || !orderType) return;
    const cards = gridRef.current.querySelectorAll('[data-product-card]');
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, rotation: -2, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        clearProps: 'all',
      }
    );
  }, [activeCategory, loading, orderType]);

  const handleAddProduct = (product: Producto) => {
    if (product.variantes.length > 0) {
      setCustomizerProduct(product);
      setCustomizerOpen(true);
    } else {
      addItem(product, [], '');
    }
  };

  const handleConfirmCustomizer = (product: Producto, variantes: Variante[], notas: string) => {
    addItem(product, variantes, notas);
  };

  const handleRevealComplete = useCallback(() => {
    setRevealDone(true);
  }, []);

  const handleReturnToChoice = () => {
    // Si hay items en el carrito, confirmar primero
    if (useCart.getState().items.length > 0) {
      if (confirm('Al cambiar el tipo de pedido se vaciará tu carrito. ¿Deseas continuar?')) {
        clearCart();
        setOrderInfo(null as any, null, null as any, null as any);
        setIsLocationModalOpen(true);
      }
    } else {
      setOrderInfo(null as any, null, null as any, null as any);
      setIsLocationModalOpen(true);
    }
  };

  const currentCategory = menu?.categorias.find((c) => c.id === activeCategory);

  return (
    <>
      <OpeningAnimation onComplete={handleRevealComplete} />

      <div className="relative min-h-screen bg-background pb-28 overflow-x-hidden">
        <GoldenGarlands />

        {/* Floating Return Button */}
        {revealDone && orderType && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleReturnToChoice}
            className="fixed left-4 top-4 z-[60] flex items-center gap-2 rounded-full bg-background/20 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 hover:bg-background/40 transition-all active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
            Cambiar Pedido
          </motion.button>
        )}

        {/* Header */}
        <header className="relative z-10 px-6 pt-safe-top">
          <div className="flex flex-col items-center gap-1 py-8">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : -10 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
            >
              {menu?.sucursal ?? 'Cargando...'}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 10 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="font-display text-4xl font-semibold tracking-tight"
            >
              {menu?.franquicia.nombre ?? ''}
            </motion.h1>
            {menu && orderType === 'sucursal' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: revealDone ? 1 : 0 }}
                transition={{ delay: 0.5 }}
                className="mt-1 text-xs text-muted-foreground"
              >
                Mesa {tableNumber || menu.mesa} · La cocina está lista
              </motion.p>
            )}
            {menu && orderType === 'domicilio' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: revealDone ? 1 : 0 }}
                transition={{ delay: 0.5 }}
                className="mt-1 text-xs text-muted-foreground"
              >
                Pedido a Domicilio · Preparando para envío
              </motion.p>
            )}
          </div>
        </header>

        {loading ? (
          <MenuSkeleton />
        ) : menu && orderType ? (
          <>
            <CategorySelector
              categories={menu.categorias}
              activeId={activeCategory}
              onSelect={setActiveCategory}
            />

            <main className="relative z-10 px-4 pt-6">
              <div
                ref={gridRef}
                key={activeCategory}
                className="grid grid-cols-2 gap-4"
              >
                {currentCategory?.productos.map((product) => (
                  <div key={product.id} data-product-card style={{ opacity: 0 }}>
                    <ProductCard
                      product={product}
                      onAdd={handleAddProduct}
                      image={product.imagen || imageMap[product.id]}
                    />
                  </div>
                ))}
              </div>
            </main>
          </>
        ) : !orderType && revealDone ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-display text-lg">Selecciona cómo deseas pedir</p>
          </div>
        ) : null}

        <CartDrawer />

        <ProductCustomizer
          product={customizerProduct}
          open={customizerOpen}
          onClose={() => setCustomizerOpen(false)}
          onConfirm={handleConfirmCustomizer}
        />

        {/* Location Modal Overlay (Submenú inicial) */}
        <AnimatePresence>
          {isLocationModalOpen && !orderType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-6 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl border flex flex-col items-center text-center"
              >
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">¿Cómo deseas pedir?</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Para brindarte el mejor servicio, indícanos tu preferencia
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const tableNum = parseInt(localTable);
                        if (isNaN(tableNum) || tableNum <= 0 || tableNum > 50) {
                          alert('Por favor, ingresa un número de mesa válido');
                          return;
                        }
                        setOrderInfo('sucursal', localTable, menu?.sucursal_id || 1, 1);
                        setIsLocationModalOpen(false);
                      }}
                      className="flex items-center gap-3 w-full rounded-2xl bg-primary py-4 px-4 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform active:scale-[0.98]"
                    >
                      <Utensils className="h-4 w-4" />
                      En Sucursal
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="99"
                      placeholder="Número de Mesa (1-99)"
                      value={localTable}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setLocalTable(val);
                      }}
                      className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-center text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="my-2 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">o</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <button
                    onClick={() => {
                      setOrderInfo('domicilio', null, menu?.sucursal_id || 1, null);
                      setIsLocationModalOpen(false);
                    }}
                    className="flex items-center gap-3 w-full rounded-2xl border border-border py-4 px-4 font-sans text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-muted transition-colors active:scale-[0.98]"
                  >
                    <Home className="h-4 w-4" />
                    Para Domicilio
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Index;
