import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from 'vaul';
import type { Producto, Variante } from '@/types/menu';
import { Check, Circle, CheckCircle2 } from 'lucide-react';

interface ProductCustomizerProps {
  product: Producto | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Producto, variantes: Variante[], notas: string) => void;
}

const ProductCustomizer = ({ product, open, onClose, onConfirm }: ProductCustomizerProps) => {
  const [selectedVariantes, setSelectedVariantes] = useState<Variante[]>([]);
  const [notas, setNotas] = useState('');

  const toggleVariante = (v: Variante) => {
    if (product?.variantes_exclusivas) {
      setSelectedVariantes([v]);
    } else {
      setSelectedVariantes((prev) =>
        prev.find((s) => s.id === v.id) ? prev.filter((s) => s.id !== v.id) : [...prev, v]
      );
    }
  };

  const handleConfirm = () => {
    if (!product) return;
    onConfirm(product, selectedVariantes, notas);
    setSelectedVariantes([]);
    setNotas('');
    onClose();
  };

  const extras = selectedVariantes.reduce((s, v) => s + v.precio_extra, 0);

  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex flex-col rounded-t-[2rem] bg-background p-6 outline-none">
          <div className="mx-auto mb-6 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
          <AnimatePresence mode="wait">
            {product && (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="font-display text-2xl font-semibold">{product.nombre}</h2>
                  <p className="mt-1 text-sm text-muted-foreground italic">{product.descripcion}</p>
                </div>

                {product.variantes.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      {product.variantes_exclusivas ? 'Elige una opción (Requerido)' : 'Personalizar'}
                    </span>
                    <div className="flex flex-col gap-2">
                      {product.variantes.map((v) => {
                        const isSelected = selectedVariantes.find((s) => s.id === v.id);
                        return (
                          <button
                            key={v.id}
                            onClick={() => toggleVariante(v)}
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-border'
                            }`}
                          >
                            <span className="text-sm font-medium">{v.nombre}</span>
                            <div className="flex items-center gap-2">
                              {v.precio_extra > 0 && (
                                <span className="text-xs text-muted-foreground tabular-nums">
                                  +${v.precio_extra}
                                </span>
                              )}
                              {product.variantes_exclusivas ? (
                                isSelected ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground/30" />
                              ) : (
                                isSelected && <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    Notas especiales
                  </span>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Sin cebolla, extra salsa..."
                    className="min-h-[80px] resize-none rounded-xl border border-border bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={product.variantes_exclusivas && selectedVariantes.length === 0}
                  className="w-full rounded-2xl bg-primary py-4 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  Añadir — ${product.precio + extras}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default ProductCustomizer;
