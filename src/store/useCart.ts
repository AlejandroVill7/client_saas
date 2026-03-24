import { create } from 'zustand';
import type { CartItem, Producto, Variante } from '@/types/menu';

interface CartStore {
  items: CartItem[];
  orderType: 'sucursal' | 'domicilio' | null;
  tableNumber: string | null;
  sucursalId: number | null;
  mesaId: number | null;
  setOrderInfo: (type: 'sucursal' | 'domicilio', table: string | null, sucursalId?: number, mesaId?: number) => void;
  addItem: (producto: Producto, variantes: Variante[], notas: string) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, cantidad: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  orderType: null,
  tableNumber: null,
  sucursalId: null,
  mesaId: null,

  setOrderInfo: (orderType, tableNumber, sucursalId, mesaId) => 
    set({ orderType, tableNumber, sucursalId: sucursalId || null, mesaId: mesaId || null }),

  addItem: (producto, variantes, notas) => {
    const lineId = `${producto.id}-${variantes.map(v => v.id).sort().join(',')}-${Date.now()}`;
    set((state) => ({
      items: [...state.items, { producto, cantidad: 1, variantes_seleccionadas: variantes, notas, lineId }],
    }));
  },

  removeItem: (lineId) => {
    set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) }));
  },

  updateQuantity: (lineId, cantidad) => {
    if (cantidad <= 0) {
      get().removeItem(lineId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.lineId === lineId ? { ...i, cantidad } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  total: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      const extras = item.variantes_seleccionadas.reduce((s, v) => s + v.precio_extra, 0);
      return sum + (item.producto.precio + extras) * item.cantidad;
    }, 0);
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.cantidad, 0),
}));
