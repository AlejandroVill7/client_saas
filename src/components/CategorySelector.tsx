import { motion } from 'framer-motion';

interface CategorySelectorProps {
  categories: { id: number; nombre: string }[];
  activeId: number;
  onSelect: (id: number) => void;
}

const CategorySelector = ({ categories, activeId, onSelect }: CategorySelectorProps) => (
  <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
    <div className="flex overflow-x-auto no-scrollbar gap-8 px-6 py-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="relative whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300"
        >
          <span className={activeId === cat.id ? "text-primary" : "text-muted-foreground"}>
            {cat.nombre}
          </span>
          {activeId === cat.id && (
            <motion.div
              layoutId="category-underline"
              className="absolute -bottom-4 left-0 h-[2px] w-full bg-primary"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
        </button>
      ))}
    </div>
  </nav>
);

export default CategorySelector;
