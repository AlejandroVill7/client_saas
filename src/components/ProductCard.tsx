import { motion } from 'framer-motion';
import type { Producto } from '@/types/menu';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Producto;
  onAdd: (product: Producto) => void;
  image?: string;
}

const ProductCard = ({ product, onAdd, image }: ProductCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    className="group relative flex flex-col gap-3"
  >
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
      {image ? (
        <img
          src={image}
          alt={product.nombre}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-4xl text-muted-foreground/30 italic">
            {product.nombre.charAt(0)}
          </span>
        </div>
      )}
      <div className="absolute right-3 top-3 rounded-full bg-background/80 px-3 py-1 backdrop-blur-md">
        <span className="font-sans text-sm font-semibold tabular-nums">${product.precio}</span>
      </div>
    </div>
    <div className="flex flex-col gap-1 px-1">
      <h3 className="font-display text-lg font-semibold leading-tight" style={{ textWrap: 'balance' } as React.CSSProperties}>
        {product.nombre}
      </h3>
      <p className="line-clamp-2 text-xs text-muted-foreground italic leading-relaxed">
        {product.descripcion}
      </p>
    </div>
    <button
      onClick={() => onAdd(product)}
      className="absolute bottom-[4.5rem] right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-150 active:scale-90"
      aria-label={`Añadir ${product.nombre}`}
    >
      <Plus className="h-5 w-5" />
    </button>
  </motion.div>
);

export default ProductCard;
