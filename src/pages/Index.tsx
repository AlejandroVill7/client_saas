import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import CategorySelector from '@/components/CategorySelector';
import ProductCard from '@/components/ProductCard';
import ProductCustomizer from '@/components/ProductCustomizer';
import CartDrawer from '@/components/CartDrawer';
import MenuSkeleton from '@/components/MenuSkeleton';
import { useCart } from '@/store/useCart';
import type { Producto, Variante, MenuResponse } from '@/types/menu';
import { Loader2 } from 'lucide-react';

// Restaurando las imágenes locales como placeholders temporales
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

const Index = () => {
  const { mesa_id } = useParams();
  const [menu, setMenu] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [customizerProduct, setCustomizerProduct] = useState<Producto | null>(null);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const addItem = useCart((s) => s.addItem);
  const orderType = useCart((s) => s.orderType);
  const tableNumber = useCart((s) => s.tableNumber);
  const setOrderInfo = useCart((s) => s.setOrderInfo);
  const clearCart = useCart((s) => s.clearCart);
  const gridRef = useRef<HTMLDivElement>(null);


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
    const mesaParam = mesa_id || params.get('mesa') || '1';
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const fetchMenu = async () => {
      try {
        const url = `${apiUrl}/menu/mesa/${mesaParam}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar el menú');
        const data = await response.json();
        setMenu(data);
        setActiveCategory(data.categorias[0]?.id ?? 0);

        if (data.franquicia?.nombre) {
          document.title = `${data.franquicia.nombre} — Menú Digital`;
        }

        // Auto-determinar orderType
        setOrderInfo('sucursal', mesaParam, data.sucursal_id, data.mesa_id || Number(mesaParam));
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [mesa_id, setOrderInfo]);


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

  const currentCategory = menu?.categorias.find((c) => c.id === activeCategory);

  return (
    <>
      <div className="relative min-h-screen bg-background pb-28 overflow-x-hidden">

        {/* Header */}
        <header className="relative z-10 px-6 pt-safe-top">
          <div className="flex flex-col items-center gap-1 py-8">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
            >
              {menu?.sucursal ?? 'Cargando...'}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="font-display text-4xl font-semibold tracking-tight"
            >
              {menu?.franquicia.nombre ?? ''}
            </motion.h1>
            {menu && orderType === 'sucursal' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-1 text-xs text-muted-foreground"
              >
                Mesa {tableNumber || menu.mesa} · La cocina está lista
              </motion.p>
            )}
          </div>
        </header>

        {loading ? (
          <MenuSkeleton />
        ) : menu && (
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
                      image={product.imagen || imageMap[product.id] || imgCarpaccio}
                    />
                  </div>
                ))}
              </div>
            </main>
          </>
        )}

        <CartDrawer />

        <ProductCustomizer
          product={customizerProduct}
          open={customizerOpen}
          onClose={() => setCustomizerOpen(false)}
          onConfirm={handleConfirmCustomizer}
        />
      </div>
    </>
  );
};

export default Index;
