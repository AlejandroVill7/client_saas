import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySelector from '@/components/CategorySelector';
import ProductCard from '@/components/ProductCard';
import ProductCustomizer from '@/components/ProductCustomizer';
import CartDrawer from '@/components/CartDrawer';
import MenuSkeleton from '@/components/MenuSkeleton';
import { useCart } from '@/store/useCart';
import { mockMenu } from '@/data/mockMenu';
import type { Producto, Variante, MenuResponse } from '@/types/menu';

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

const Index = () => {
  const [menu, setMenu] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [customizerProduct, setCustomizerProduct] = useState<Producto | null>(null);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const addItem = useCart((s) => s.addItem);

  // Detect system dark mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMenu(mockMenu);
      setActiveCategory(mockMenu.categorias[0]?.id ?? 0);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="px-6 pt-safe-top">
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
          {menu && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-1 text-xs text-muted-foreground"
            >
              {menu.mesa} · La cocina está lista
            </motion.p>
          )}
        </div>
      </header>

      {loading ? (
        <MenuSkeleton />
      ) : menu ? (
        <>
          <CategorySelector
            categories={menu.categorias}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />

          <main className="px-4 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="grid grid-cols-2 gap-4"
              >
                {currentCategory?.productos.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.4,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAdd={handleAddProduct}
                      image={imageMap[product.id]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      ) : null}

      <CartDrawer />

      <ProductCustomizer
        product={customizerProduct}
        open={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        onConfirm={handleConfirmCustomizer}
      />
    </div>
  );
};

export default Index;
