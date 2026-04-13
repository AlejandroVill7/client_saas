import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, Bike, Home, ArrowLeft } from 'lucide-react';
import GoldenGarlands from '@/components/GoldenGarlands';

type OrderStatus = 'recibido' | 'preparacion' | 'en_camino' | 'entregado';

interface StatusStep {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
  description: string;
}

const steps: StatusStep[] = [
  { status: 'recibido', label: 'Recibido', icon: Clock, description: 'Hemos recibido tu pedido correctamente.' },
  { status: 'preparacion', label: 'En Cocina', icon: ChefHat, description: 'Nuestros chefs están preparando tu comida.' },
  { status: 'en_camino', label: 'En Camino', icon: Bike, description: 'El repartidor va de camino a tu ubicación.' },
  { status: 'entregado', label: 'Entregado', icon: Home, description: '¡Buen provecho! Tu pedido ha llegado.' },
];

const OrderStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('recibido');
  const [loading, setLoading] = useState(true);

  // Simulación de actualización de estado (en un caso real vendría de la API/WebSocket)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Simulamos avance de estados para propósitos de demostración
    const statusSequence: OrderStatus[] = ['recibido', 'preparacion', 'en_camino', 'entregado'];
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < statusSequence.length - 1) {
        index++;
        setCurrentStatus(statusSequence[index]);
      } else {
        clearInterval(interval);
      }
    }, 10000); // Cambia cada 10 segundos para la demo

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const currentStepIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="relative min-h-screen bg-background pb-12 overflow-x-hidden">
      <GoldenGarlands />
      
      <header className="relative z-10 px-6 pt-12 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold">Estado del Pedido</h1>
          <p className="text-sm text-muted-foreground">Pedido #{id}</p>
        </div>
      </header>

      <main className="relative z-10 px-6 pt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Cargando detalles...</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-12">
            {/* Visual Progress Bar */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />
              <motion.div 
                className="absolute left-6 top-0 w-0.5 bg-primary origin-top"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: currentStepIndex / (steps.length - 1) }}
                transition={{ duration: 0.5 }}
              />

              <div className="space-y-12">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isActive = index === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="relative flex items-start gap-8">
                      <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                        isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'
                      } ${isActive ? 'ring-4 ring-primary/20' : ''}`}>
                        {isCompleted && index < currentStepIndex ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>

                      <div className="pt-1">
                        <h3 className={`font-display text-lg font-bold transition-colors duration-500 ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </h3>
                        <p className={`text-sm transition-colors duration-500 ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-card border border-border p-6 shadow-xl"
            >
              <h4 className="font-display font-bold mb-2">Estimación de entrega</h4>
              <p className="text-3xl font-bold text-primary mb-1">15 - 25 min</p>
              <p className="text-xs text-muted-foreground">Tu pedido está siendo procesado con prioridad.</p>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderStatusPage;
