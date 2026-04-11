import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from 'vaul';
import { useCart } from '@/store/useCart';
import { Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';


const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, updateQuantity, clearCart, orderType, tableNumber, sucursalId, mesaId } = useCart();
  const count = itemCount();
  const cartTotal = total();

  const handleSuccessfulPayment = async (details?: any) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    const orderPayload = {
      sucursal_id: sucursalId || 1,
      mesa_id: mesaId || 1,
      orderType: orderType,
      items: items.map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        notas: item.notas,
        variantes: item.variantes_seleccionadas.map(v => ({ 
          variante_id: v.id,
          precio_extra_cobrado: v.precio_extra
        })),
        modificadores: [] // Compatible con la API pero vacío por ahora
      }))
    };

    try {
      const response = await fetch(`${apiUrl}/pedido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();
      console.log("==> Pedido creado:", result);
      clearCart();
      
      if (orderType === 'domicilio') {
        navigate(`/order-status/${result.pedido_id || result.id || 'nuevo'}`);
      } else {
        alert('¡Pedido enviado a la cocina! Tu mesero te atenderá pronto.');
      }
    } catch (error: any) {
      console.error("Error al enviar pedido:", error);
      // Para fines de TEST, si falla la API (backend apagado), igual navegamos en domicilio
      if (orderType === 'domicilio') {
        clearCart();
        navigate(`/order-status/test-123`);
      } else {
        alert(`Error al conectar con el servidor: ${error.message}`);
      }
    }
  };

  const handleCashPayment = () => {
    handleSuccessfulPayment({ id: 'PAGO_EN_EFECTIVO' });
  };

  if (count === 0) return null;

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-brand-obsidian px-8 py-4 shadow-2xl dark:bg-card"
        >
          <ShoppingBag className="h-5 w-5 text-primary" />
          <span className="font-sans text-sm font-bold uppercase tracking-tight text-brand-eggshell">
            Ver Pedido ({count})
          </span>
          <div className="h-4 w-[1px] bg-brand-eggshell/20" />
          <span className="font-sans text-sm font-semibold tabular-nums text-primary">
            ${cartTotal.toFixed(2)}
          </span>
        </motion.button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85vh] flex-col rounded-t-[2rem] bg-background p-6 outline-none">
          <div className="mx-auto mb-6 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl font-semibold">
              {orderType === 'sucursal' ? 'Tu Mesa' : 'Tu Pedido'}
            </h2>
            <button onClick={clearCart} className="text-xs text-muted-foreground uppercase tracking-wider hover:text-destructive transition-colors">
              Vaciar
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const extras = item.variantes_seleccionadas.reduce((s, v) => s + v.precio_extra, 0);
                const lineTotal = (item.producto.precio + extras) * item.cantidad;
                return (
                  <motion.div
                    key={item.lineId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base font-semibold truncate">{item.producto.nombre}</p>
                      {item.variantes_seleccionadas.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variantes_seleccionadas.map(v => v.nombre).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.lineId, item.cantidad - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center font-sans text-sm font-semibold tabular-nums">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.lineId, item.cantidad + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-sans text-sm font-semibold tabular-nums whitespace-nowrap">
                      ${lineTotal.toFixed(2)}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between items-center mb-4">
              <span className="font-display text-lg">Total</span>
              <span className="font-sans text-xl font-bold tabular-nums">${cartTotal.toFixed(2)}</span>
            </div>
            
            {orderType === 'domicilio' ? (
              <>
                <div className="relative z-0 min-h-[150px]">
                  <PayPalScriptProvider options={{ clientId: "test", currency: "MXN" }}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "rect", color: "black" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            amount: { value: cartTotal.toFixed(2), currency_code: "MXN" }
                          }]
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (!actions.order) return;
                        const details = await actions.order.capture();
                        handleSuccessfulPayment(details);
                      }}
                    />
                  </PayPalScriptProvider>
                </div>

                <button
                  onClick={handleCashPayment}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform active:scale-[0.98]">
                  <CreditCard className="h-4 w-4" />
                  Confirmar Pedido y Ver Estado
                </button>

                <button
                  onClick={handleCashPayment}
                  className="w-full rounded-2xl border border-border py-4 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted active:scale-[0.98]">
                  Pago en Efectivo al Recibir
                </button>
              </>
            ) : (
              <button
                onClick={handleCashPayment}
                className="w-full rounded-2xl bg-primary py-4 font-sans text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform active:scale-[0.98]">
                Enviar Pedido a Cocina
              </button>
            )}
          </div>

        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default CartDrawer;
