# ORO — Menú Digital y Sistema de Pedidos SaaS

Bienvenido al repositorio del cliente frontend para **ORO**, una plataforma SaaS para restaurantes de alta cocina que ofrece una experiencia moderna, rápida y dinámica de menú digital.

## Características Principales
- **Experiencia de Menú Premium**: Diseño responsivo y fluido enfocado en usabilidad y estética.
- **Carrito y Pedidos Integrados**: Selección de pedido en sucursal (con número de mesa) o pedidos a domicilio.
- **Variantes y Personalización**: Soporte avanzado para notas en platillos y modificadores/variantes dinámicos para enviar a la API.
- **Integración de Pagos**: Flujo de caja listo y Checkout de PayPal nativo integrado.

## Tecnologías Utilizadas
- **React.js + Vite** (Entorno de desarrollo rápido)
- **TypeScript** (Tipado seguro y robusto)
- **Zustand** (Manejo de estados globales y carrito de compras)
- **Framer Motion & GSAP** (Animaciones fluidas y experiencias de UI dinámicas)
- **Tailwind CSS + shadcn/ui** (Sistema de diseño moderno e interfaces reutilizables)
- **@paypal/react-paypal-js** (Integración de pasarela de pago nativa)

## Estructura del Proyecto

- `/src/components`: Componentes desacoplados de la interfaz (Tarjetas de productos, Drawer de estado del Carrito, animaciones, Modal de opciones, etc).
- `/src/pages`: Vistas completas de la aplicación (ej. el menú interactivo principal).
- `/src/store`: Contiene las lógicas del Zustand (gestor del estado para la orden).
- `/src/types`: Definiciones estrictas de las interfaces de datos compartidas con la API.
- `/src/data`: Información en formato *mock* para simulación en desarrollo sin el entorno backend.

## Ejecución Local

1. Asegúrate de tener Node.js instalado (v18 recomendada).
2. Clona el repositorio e instala las dependencias:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Navega a `http://localhost:5173` o en el puerto indicado en consola.

## Compilación para Producción

Para compilar el proyecto enfocado a su rendimiento óptimo para despliegue:
```bash
npm run build
```
Los archivos minificados y listos para producción se encontrarán en el directorio `dist/`.
